import { removeDir } from './fs.js';

let cleanupPath: string | null = null;
let cleanupEnabled = true;

export function registerCleanup(projectPath: string): void {
  cleanupPath = projectPath;
}

export function unregisterCleanup(): void {
  cleanupPath = null;
}

export function disableCleanup(): void {
  cleanupEnabled = false;
}

export function enableCleanup(): void {
  cleanupEnabled = true;
}

export async function cleanup(): Promise<void> {
  if (cleanupPath && cleanupEnabled) {
    try {
      await removeDir(cleanupPath);
    } catch {
      // Ignore cleanup errors
    }
    cleanupPath = null;
  }
}

export function setupSignalHandlers(): void {
  const handleSignal = async () => {
    await cleanup();
    process.exit(130);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
}

export function getCleanupPath(): string | null {
  return cleanupPath;
}
