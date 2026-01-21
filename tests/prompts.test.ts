import { describe, it, expect } from 'vitest';
import {
  getDefaultConfig,
  DEFAULT_PROJECT_NAME,
  DEFAULT_LANGUAGE,
  DEFAULT_CREATE_GAS,
  DEFAULT_PROJECT_TYPE,
} from '../src/prompts.js';

describe('prompts', () => {
  describe('constants', () => {
    it('should have correct default project name', () => {
      expect(DEFAULT_PROJECT_NAME).toBe('my-gas-project');
    });

    it('should have typescript as default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('typescript');
    });

    it('should have true as default create GAS project', () => {
      expect(DEFAULT_CREATE_GAS).toBe(true);
    });

    it('should have standalone as default project type', () => {
      expect(DEFAULT_PROJECT_TYPE).toBe('standalone');
    });
  });

  describe('getDefaultConfig', () => {
    it('should return config with default values', () => {
      const config = getDefaultConfig();

      expect(config.projectName).toBe(DEFAULT_PROJECT_NAME);
      expect(config.language).toBe(DEFAULT_LANGUAGE);
      expect(config.createGasProject).toBe(DEFAULT_CREATE_GAS);
      expect(config.projectType).toBe(DEFAULT_PROJECT_TYPE);
    });

    it('should use provided project name', () => {
      const config = getDefaultConfig('custom-project');

      expect(config.projectName).toBe('custom-project');
      expect(config.language).toBe(DEFAULT_LANGUAGE);
      expect(config.createGasProject).toBe(DEFAULT_CREATE_GAS);
      expect(config.projectType).toBe(DEFAULT_PROJECT_TYPE);
    });
  });
});
