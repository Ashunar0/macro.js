import { spawn } from 'node:child_process';
import type { ProjectType, ClaspCreateResult, ClaspErrorType } from './types.js';
import { updateJsonFile } from './utils/fs.js';

interface ClaspJson {
  scriptId: string;
  rootDir?: string;
}

function runCommand(command: string, args: string[], cwd?: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 1 });
    });

    proc.on('error', () => {
      resolve({ stdout, stderr, code: 1 });
    });
  });
}

export async function checkLoginStatus(): Promise<boolean> {
  const result = await runCommand('npx', ['clasp', 'login', '--status']);
  // clasp login --status returns 0 if logged in
  return result.code === 0 && !result.stdout.includes('not logged in');
}

export async function login(): Promise<boolean> {
  // Use inherit for stdio so user can see the URL and complete browser auth
  return new Promise((resolve) => {
    const proc = spawn('npx', ['clasp', 'login'], {
      shell: true,
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      resolve(code === 0);
    });

    proc.on('error', () => {
      resolve(false);
    });
  });
}

export function mapProjectTypeToClasp(type: ProjectType): string {
  // webapp uses standalone type in clasp
  if (type === 'webapp') {
    return 'standalone';
  }
  return type;
}

export async function createProject(
  type: ProjectType,
  title: string,
  cwd: string
): Promise<ClaspCreateResult> {
  const claspType = mapProjectTypeToClasp(type);

  return new Promise((resolve) => {
    let output = '';

    const proc = spawn('npx', ['clasp', 'create', '--type', claspType, '--title', title], {
      cwd,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    proc.stdout?.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    proc.stderr?.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true });
        return;
      }

      // Check for specific errors
      if (output.includes('not logged in') || output.includes('Login required')) {
        resolve({ success: false, error: 'not_logged_in' });
        return;
      }

      if (output.includes('API') && output.includes('not enabled')) {
        resolve({ success: false, error: 'api_not_enabled' });
        return;
      }

      resolve({ success: false, error: 'unknown' });
    });

    proc.on('error', () => {
      resolve({ success: false, error: 'unknown' });
    });
  });
}

export async function updateClaspJsonRootDir(projectPath: string): Promise<void> {
  const claspJsonPath = `${projectPath}/.clasp.json`;
  await updateJsonFile<ClaspJson>(claspJsonPath, (data) => ({
    ...data,
    rootDir: './dist',
  }));
}

export async function getScriptIdFromClaspJson(projectPath: string): Promise<string | undefined> {
  try {
    const { readJsonFile } = await import('./utils/fs.js');
    const data = await readJsonFile<ClaspJson>(`${projectPath}/.clasp.json`);
    return data.scriptId;
  } catch {
    return undefined;
  }
}

export function getApiEnableUrl(): string {
  return 'https://script.google.com/home/usersettings';
}
