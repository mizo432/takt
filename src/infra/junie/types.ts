import type { PermissionMode } from '../../core/models/index.js';
import type { ProviderImageAttachment } from '../providers/types.js';
import type { InternalAgentIsolation, ProviderActivityCallback, StreamCallback } from '../../shared/types/provider.js';

/** Options for one Junie CLI session. */
export interface JunieCallOptions {
  cwd: string;
  abortSignal?: AbortSignal;
  sessionId?: string;
  model?: string;
  systemPrompt?: string;
  permissionMode?: PermissionMode;
  internalAgentIsolation?: InternalAgentIsolation;
  allowedTools?: string[];
  imageAttachments?: ProviderImageAttachment[];
  onStream?: StreamCallback;
  onActivity?: ProviderActivityCallback;
  junieCliPath?: string;
  childProcessEnv?: Readonly<Record<string, string>>;
}
