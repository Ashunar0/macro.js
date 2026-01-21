export type Language = 'typescript' | 'javascript';

export type ProjectType =
  | 'standalone'
  | 'sheets'
  | 'docs'
  | 'forms'
  | 'slides'
  | 'webapp';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface ProjectConfig {
  projectName: string;
  language: Language;
  createGasProject: boolean;
  projectType: ProjectType;
}

export interface CLIOptions {
  yes: boolean;
}

export interface CLIResult {
  projectName?: string;
  options: CLIOptions;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ClaspCreateResult {
  success: boolean;
  scriptId?: string;
  error?: ClaspErrorType;
}

export type ClaspErrorType =
  | 'not_logged_in'
  | 'api_not_enabled'
  | 'unknown';

export type ErrorCode =
  | 'INVALID_PROJECT_NAME'
  | 'DIRECTORY_EXISTS'
  | 'CLASP_NOT_LOGGED_IN'
  | 'CLASP_API_NOT_ENABLED'
  | 'CLASP_CREATE_FAILED'
  | 'FILE_WRITE_ERROR'
  | 'NPM_INSTALL_FAILED'
  | 'USER_CANCELLED';

export class CreateMacroError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = 'CreateMacroError';
  }
}
