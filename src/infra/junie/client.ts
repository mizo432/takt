import { spawn } from 'node:child_process';
import { USAGE_MISSING_REASONS } from '../../core/logging/contracts.js';
import type { AgentResponse, ProviderUsageSnapshot } from '../../core/models/index.js';
import {
  type AgentFailureCategory,
} from '../../shared/types/agent-failure.js';
import { getErrorMessage } from '../../shared/utils/index.js';
import { containsRateLimitError } from '../rate-limit/detection.js';
import type { JunieCallOptions } from './types.js';

export type { JunieCallOptions } from './types.js';

const JUNIE_ABORTED_MESSAGE = 'Junie execution aborted';
const JUNIE_ERROR_DETAIL_MAX_LENGTH = 400;

function trimDetail(value: string | undefined): string {
  const normalized = (value ?? '').trim();
  if (!normalized) {
    return '';
  }
  return normalized.length > JUNIE_ERROR_DETAIL_MAX_LENGTH
    ? `...${normalized.slice(-JUNIE_ERROR_DETAIL_MAX_LENGTH)}`
    : normalized;
}

function usageMissingSnapshot(): ProviderUsageSnapshot {
  return { usageMissing: true, reason: USAGE_MISSING_REASONS.NOT_AVAILABLE };
}

function emitInit(options: JunieCallOptions, model: string | undefined, sessionId: string): void {
  options.onStream?.({
    type: 'init',
    data: {
      model: model ?? '',
      sessionId,
    },
  });
}

function emitResult(
  options: JunieCallOptions,
  result: string,
  success: boolean,
  error: string | undefined,
  sessionId: string | undefined,
  failureCategory?: AgentFailureCategory,
): void {
  options.onStream?.({
    type: 'result',
    data: {
      result,
      success,
      error,
      sessionId: sessionId ?? '',
      failureCategory,
    },
  });
}

function emitText(options: JunieCallOptions, text: string): void {
  options.onStream?.({
    type: 'text',
    data: { text },
  });
}

interface JunieExecError extends Error {
  code?: string | number;
  stderr?: string;
  sessionId?: string;
  errorKind?: string;
}

function createExecError(message: string, extra?: Partial<JunieExecError>): JunieExecError {
  const err = new Error(message) as JunieExecError;
  if (extra) Object.assign(err, extra);
  return err;
}

// Junie JSON-stream output format
interface JunieResultEvent {
  type: 'result';
  status?: 'success' | 'failed';
  errors?: string[];
}

interface JunieErrorEvent {
  type: 'error';
  message: string;
}

type JunieJsonEvent = JunieResultEvent | JunieErrorEvent;

function isAuthenticationError(error: JunieExecError): boolean {
  const text = `${error.message}\n${error.stderr ?? ''}`;
  return /cannot find authorization/i.test(text) || /authenticate/i.test(text);
}

function classifyExecutionError(error: JunieExecError, options: JunieCallOptions): string {
  if (options.abortSignal?.aborted || error.name === 'AbortError') {
    return JUNIE_ABORTED_MESSAGE;
  }

  if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
    return 'Junie CLI output exceeded buffer limit';
  }

  if (error.code === 'ENOENT') {
    return 'junie binary not found. Install Junie CLI and ensure `junie` is in PATH, or set TAKT_JUNIE_CLI_PATH/junie_cli_path.';
  }

  if (isAuthenticationError(error)) {
    return 'Junie CLI authentication failed. Authenticate Junie before running.';
  }

  if (typeof error.code === 'number') {
    const detail = trimDetail(error.stderr);
    return detail
      ? `Junie CLI exited with code ${error.code}: ${detail}`
      : `Junie CLI exited with code ${error.code}`;
  }

  return getErrorMessage(error);
}

export class JunieClient {
  async call(agentType: string, prompt: string, options: JunieCallOptions): Promise<AgentResponse> {
    const cliPath = options.junieCliPath ?? 'junie';
    const fullPrompt = options.systemPrompt
      ? `${options.systemPrompt}\n\n${prompt}`
      : prompt;

    const args: string[] = [];
    if (options.model) {
      args.push('--model', options.model);
    }
    if (options.sessionId) {
      args.push('--session-id', options.sessionId);
    }
    args.push('--output-format', 'json-stream');
    args.push(fullPrompt);

    options.onActivity?.({ kind: 'attempt_started' });

    return new Promise((resolve) => {
      const child = spawn(cliPath, args, {
        cwd: options.cwd,
        env: { ...process.env, ...(options.childProcessEnv ?? {}) },
        stdio: ['ignore', 'pipe', 'pipe'],
        signal: options.abortSignal,
      });

      let stdout = '';
      let stderr = '';
      const sessionId = options.sessionId;
      let resultContent = '';
      let success = true;
      let errorMessage = '';

      child.stdout.on('data', (data: Buffer) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const event: JunieJsonEvent = JSON.parse(trimmed);

            if (event.type === 'result') {
              const resultEvent = event as JunieResultEvent;
              if (resultEvent.status === 'success') {
                // Success result
              } else if (resultEvent.status === 'failed') {
                success = false;
                errorMessage = resultEvent.errors?.join('\n') ?? 'Junie execution failed';
              }
            } else if (event.type === 'error') {
              const errorEvent = event as JunieErrorEvent;
              success = false;
              errorMessage = errorEvent.message ?? 'Unknown error';
            }
          } catch {
            // Non-JSON line; treat as text output
            if (trimmed) {
              emitText(options, trimmed);
              resultContent += trimmed + '\n';
            }
          }
        }
        stdout += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      child.on('exit', (code, signal) => {
        if (signal === 'SIGTERM' || signal === 'SIGINT') {
          const err = createExecError(JUNIE_ABORTED_MESSAGE, { name: 'AbortError', sessionId });
          const message = classifyExecutionError(err, options);
          emitResult(options, '', false, message, sessionId);
          resolve({
            persona: agentType,
            status: 'error',
            content: message,
            error: message,
            timestamp: new Date(),
            sessionId,
            providerUsage: usageMissingSnapshot(),
          });
          return;
        }

        if (code === 0 && success) {
          const content = resultContent.trim() || stdout.trim();
          emitInit(options, options.model, sessionId ?? '');
          emitResult(options, content, true, undefined, sessionId);
          resolve({
            persona: agentType,
            status: 'done',
            content: content || '',
            timestamp: new Date(),
            sessionId,
            providerUsage: usageMissingSnapshot(),
          });
        } else {
          const combined = `${stderr}\n${errorMessage}`;
          if (!options.abortSignal?.aborted && containsRateLimitError(combined)) {
            emitResult(options, '', false, trimDetail(combined), sessionId);
            resolve({
              persona: agentType,
              status: 'error',
              content: trimDetail(combined),
              error: trimDetail(combined),
              timestamp: new Date(),
              sessionId,
              providerUsage: usageMissingSnapshot(),
            });
          } else {
            const err = createExecError(
              errorMessage || `Junie CLI exited with code ${code}`,
              { code: code ?? undefined, stderr, sessionId },
            );
            const message = classifyExecutionError(err, options);
            emitResult(options, '', false, message, sessionId);
            resolve({
              persona: agentType,
              status: 'error',
              content: message,
              error: message,
              timestamp: new Date(),
              sessionId,
              providerUsage: usageMissingSnapshot(),
            });
          }
        }
      });

      child.on('error', (err: Error) => {
        const execError = err as JunieExecError;
        if (execError.name === 'AbortError') {
          emitResult(options, '', false, JUNIE_ABORTED_MESSAGE, sessionId);
          resolve({
            persona: agentType,
            status: 'error',
            content: JUNIE_ABORTED_MESSAGE,
            error: JUNIE_ABORTED_MESSAGE,
            timestamp: new Date(),
            sessionId,
            providerUsage: usageMissingSnapshot(),
          });
        } else {
          const message = classifyExecutionError({ ...execError, message: getErrorMessage(err) }, options);
          emitResult(options, '', false, message, sessionId);
          resolve({
            persona: agentType,
            status: 'error',
            content: message,
            error: message,
            timestamp: new Date(),
            sessionId,
            providerUsage: usageMissingSnapshot(),
          });
        }
      });
    });
  }
}

const defaultClient = new JunieClient();

export async function callJunie(
  agentType: string,
  prompt: string,
  options: JunieCallOptions,
): Promise<AgentResponse> {
  return defaultClient.call(agentType, prompt, options);
}
