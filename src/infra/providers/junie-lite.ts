import { callJunie, type JunieCallOptions } from '../junie/index.js';
import { resolveJunieCliPath } from '../config/index.js';
import { createLogger, getErrorMessage } from '../../shared/utils/index.js';
import type { AgentResponse } from '../../core/models/index.js';
import type { AgentSetup, Provider, ProviderAgent, ProviderCallOptions } from './types.js';

const log = createLogger('junie-lite-provider');

function toJunieOptions(options: ProviderCallOptions, systemPrompt?: string): JunieCallOptions {
  if (options.allowedTools && options.allowedTools.length > 0) {
    log.info('Junie lite provider does not support allowedTools; ignoring');
  }
  if (options.maxTurns !== undefined) {
    log.info('Junie lite provider does not support maxTurns; ignoring');
  }
  if (options.outputSchema) {
    log.info('Junie lite provider does not support outputSchema; ignoring');
  }
  if (options.imageAttachments && options.imageAttachments.length > 0) {
    log.info('Junie lite provider does not support imageAttachments; ignoring');
  }

  return {
    cwd: options.cwd,
    abortSignal: options.abortSignal,
    sessionId: options.sessionId,
    model: options.model,
    systemPrompt,
    permissionMode: options.permissionMode,
    internalAgentIsolation: options.internalAgentIsolation,
    onStream: options.onStream,
    onActivity: options.onActivity,
    junieCliPath: resolveJunieCliPath(),
    childProcessEnv: options.childProcessEnv,
  };
}

export class JunieLiteProvider implements Provider {
  readonly supportsStructuredOutput = false;
  readonly supportsNativeImageInput = false;
  readonly supportedMcpTransports: ReadonlySet<'stdio' | 'sse' | 'http'> = new Set();

  getRuntimeInstructions(_allowedTools?: string[]): string | null {
    return null;
  }

  keepsAllowedToolWithoutEdit(_tool: string): boolean {
    return true;
  }

  setup(config: AgentSetup): ProviderAgent {
    const { name, systemPrompt } = config;

    return {
      call: async (prompt: string, options: ProviderCallOptions): Promise<AgentResponse> => {
        try {
          return await callJunie(name, prompt, toJunieOptions(options, systemPrompt));
        } catch (error) {
          const message = `Junie lite provider call failed: ${getErrorMessage(error)}`;
          return {
            persona: name,
            status: 'error',
            content: message,
            error: message,
            timestamp: new Date(),
          };
        }
      },
    };
  }

}
