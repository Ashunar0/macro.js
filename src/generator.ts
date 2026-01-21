import { join } from 'node:path';
import type { ProjectConfig } from './types.js';
import { writeFile, ensureDir } from './utils/fs.js';
import { registerCleanup, unregisterCleanup } from './utils/cleanup.js';
import { generatePackageJson } from './templates/packageJson.js';
import { generateTsconfig } from './templates/tsconfig.js';
import { generateAppsscript } from './templates/appsscript.js';
import { generateGitignore } from './templates/gitignore.js';
import { generateClaspJson } from './templates/clasp.js';
import { generateMain, getMainFileName } from './templates/main.js';

export interface GeneratorContext {
  projectName: string;
  projectPath: string;
  config: ProjectConfig;
}

export async function generateProject(
  config: ProjectConfig,
  basePath: string = process.cwd()
): Promise<string> {
  const projectPath = join(basePath, config.projectName);

  // Register for cleanup in case of error
  registerCleanup(projectPath);

  try {
    // Create project directory
    await ensureDir(projectPath);

    // Create src directory
    const srcPath = join(projectPath, 'src');
    await ensureDir(srcPath);

    // Generate and write files
    await writeTemplateFiles({
      projectName: config.projectName,
      projectPath,
      config,
    });

    // Unregister cleanup on success
    unregisterCleanup();

    return projectPath;
  } catch (error) {
    // Keep cleanup registered so it can be called
    throw error;
  }
}

async function writeTemplateFiles(ctx: GeneratorContext): Promise<void> {
  const { projectPath, config } = ctx;
  const srcPath = join(projectPath, 'src');

  // package.json
  await writeFile(
    join(projectPath, 'package.json'),
    generatePackageJson({
      projectName: config.projectName,
      language: config.language,
    })
  );

  // tsconfig.json (TypeScript only)
  if (config.language === 'typescript') {
    await writeFile(join(projectPath, 'tsconfig.json'), generateTsconfig());
  }

  // src/appsscript.json
  await writeFile(join(srcPath, 'appsscript.json'), generateAppsscript());

  // src/main.ts or src/main.js
  const mainFileName = getMainFileName(config.language);
  await writeFile(
    join(srcPath, mainFileName),
    generateMain({
      language: config.language,
      projectType: config.projectType,
    })
  );

  // .gitignore
  await writeFile(join(projectPath, '.gitignore'), generateGitignore());
}

export async function writeClaspJson(
  projectPath: string,
  scriptId: string = ''
): Promise<void> {
  await writeFile(join(projectPath, '.clasp.json'), generateClaspJson({ scriptId }));
}
