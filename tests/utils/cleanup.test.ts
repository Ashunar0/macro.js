import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  registerCleanup,
  unregisterCleanup,
  cleanup,
  getCleanupPath,
  disableCleanup,
  enableCleanup,
} from '../../src/utils/cleanup.js';
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('cleanup utilities', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `create-macro-cleanup-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    unregisterCleanup();
    enableCleanup();
  });

  afterEach(async () => {
    unregisterCleanup();
    enableCleanup();
    await rm(testDir, { recursive: true, force: true }).catch(() => {});
  });

  describe('registerCleanup', () => {
    it('should register a path for cleanup', () => {
      registerCleanup('/some/path');
      expect(getCleanupPath()).toBe('/some/path');
    });
  });

  describe('unregisterCleanup', () => {
    it('should clear the cleanup path', () => {
      registerCleanup('/some/path');
      unregisterCleanup();
      expect(getCleanupPath()).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should remove registered directory', async () => {
      const dirToClean = join(testDir, 'to-clean');
      await mkdir(dirToClean);

      registerCleanup(dirToClean);
      await cleanup();

      expect(existsSync(dirToClean)).toBe(false);
      expect(getCleanupPath()).toBeNull();
    });

    it('should do nothing if no path is registered', async () => {
      unregisterCleanup();
      await expect(cleanup()).resolves.not.toThrow();
    });

    it('should not throw if directory does not exist', async () => {
      registerCleanup(join(testDir, 'non-existent'));
      await expect(cleanup()).resolves.not.toThrow();
    });

    it('should not remove directory when cleanup is disabled', async () => {
      const dirToClean = join(testDir, 'should-remain');
      await mkdir(dirToClean);

      registerCleanup(dirToClean);
      disableCleanup();
      await cleanup();

      expect(existsSync(dirToClean)).toBe(true);
    });

    it('should remove directory when cleanup is re-enabled', async () => {
      const dirToClean = join(testDir, 'to-clean-later');
      await mkdir(dirToClean);

      registerCleanup(dirToClean);
      disableCleanup();
      enableCleanup();
      await cleanup();

      expect(existsSync(dirToClean)).toBe(false);
    });
  });

  describe('disableCleanup / enableCleanup', () => {
    it('should toggle cleanup behavior', async () => {
      const dirToClean = join(testDir, 'toggle-test');
      await mkdir(dirToClean);

      registerCleanup(dirToClean);
      disableCleanup();
      await cleanup();
      expect(existsSync(dirToClean)).toBe(true);

      registerCleanup(dirToClean);
      enableCleanup();
      await cleanup();
      expect(existsSync(dirToClean)).toBe(false);
    });
  });
});
