import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateProject, writeClaspJson } from '../src/generator.js';
import { existsSync } from 'node:fs';
import { readFile, rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { ProjectConfig } from '../src/types.js';

describe('generateProject', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-generator-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('TypeScript project', () => {
    const config: ProjectConfig = {
      projectName: 'test-ts-project',
      language: 'typescript',
      createGasProject: false,
      projectType: 'standalone',
    };

    it('should create project directory', async () => {
      const projectPath = await generateProject(config, testDir);
      expect(existsSync(projectPath)).toBe(true);
    });

    it('should create package.json', async () => {
      const projectPath = await generateProject(config, testDir);
      const packageJsonPath = join(projectPath, 'package.json');
      expect(existsSync(packageJsonPath)).toBe(true);

      const content = await readFile(packageJsonPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('test-ts-project');
      expect(parsed.devDependencies.typescript).toBeDefined();
    });

    it('should create tsconfig.json', async () => {
      const projectPath = await generateProject(config, testDir);
      const tsconfigPath = join(projectPath, 'tsconfig.json');
      expect(existsSync(tsconfigPath)).toBe(true);
    });

    it('should create src/appsscript.json', async () => {
      const projectPath = await generateProject(config, testDir);
      const appsscriptPath = join(projectPath, 'src', 'appsscript.json');
      expect(existsSync(appsscriptPath)).toBe(true);
    });

    it('should create src/main.ts', async () => {
      const projectPath = await generateProject(config, testDir);
      const mainPath = join(projectPath, 'src', 'main.ts');
      expect(existsSync(mainPath)).toBe(true);
    });

    it('should create .gitignore', async () => {
      const projectPath = await generateProject(config, testDir);
      const gitignorePath = join(projectPath, '.gitignore');
      expect(existsSync(gitignorePath)).toBe(true);
    });
  });

  describe('JavaScript project', () => {
    const config: ProjectConfig = {
      projectName: 'test-js-project',
      language: 'javascript',
      createGasProject: false,
      projectType: 'standalone',
    };

    it('should NOT create tsconfig.json', async () => {
      const projectPath = await generateProject(config, testDir);
      const tsconfigPath = join(projectPath, 'tsconfig.json');
      expect(existsSync(tsconfigPath)).toBe(false);
    });

    it('should create src/main.js', async () => {
      const projectPath = await generateProject(config, testDir);
      const mainPath = join(projectPath, 'src', 'main.js');
      expect(existsSync(mainPath)).toBe(true);
    });

    it('should NOT include typescript in package.json', async () => {
      const projectPath = await generateProject(config, testDir);
      const packageJsonPath = join(projectPath, 'package.json');
      const content = await readFile(packageJsonPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.devDependencies.typescript).toBeUndefined();
    });
  });

  describe('sheets project', () => {
    const config: ProjectConfig = {
      projectName: 'test-sheets-project',
      language: 'typescript',
      createGasProject: false,
      projectType: 'sheets',
    };

    it('should create main.ts with SpreadsheetApp', async () => {
      const projectPath = await generateProject(config, testDir);
      const mainPath = join(projectPath, 'src', 'main.ts');
      const content = await readFile(mainPath, 'utf-8');
      expect(content).toContain('SpreadsheetApp');
    });
  });

  describe('webapp project', () => {
    const config: ProjectConfig = {
      projectName: 'test-webapp-project',
      language: 'typescript',
      createGasProject: false,
      projectType: 'webapp',
    };

    it('should create main.ts with doGet/doPost', async () => {
      const projectPath = await generateProject(config, testDir);
      const mainPath = join(projectPath, 'src', 'main.ts');
      const content = await readFile(mainPath, 'utf-8');
      expect(content).toContain('doGet');
      expect(content).toContain('doPost');
    });
  });
});

describe('writeClaspJson', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-clasp-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should write .clasp.json with empty scriptId', async () => {
    await writeClaspJson(testDir);
    const claspPath = join(testDir, '.clasp.json');
    expect(existsSync(claspPath)).toBe(true);

    const content = await readFile(claspPath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.scriptId).toBe('');
    expect(parsed.rootDir).toBe('./dist');
  });

  it('should write .clasp.json with provided scriptId', async () => {
    await writeClaspJson(testDir, 'abc123xyz');
    const claspPath = join(testDir, '.clasp.json');
    const content = await readFile(claspPath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.scriptId).toBe('abc123xyz');
  });
});
