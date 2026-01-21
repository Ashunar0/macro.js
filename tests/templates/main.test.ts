import { describe, it, expect } from 'vitest';
import { generateMain, getMainFileName } from '../../src/templates/main.js';

describe('generateMain', () => {
  describe('standalone type', () => {
    it('should generate TypeScript standalone template', () => {
      const content = generateMain({ language: 'typescript', projectType: 'standalone' });
      expect(content).toContain('function myFunction(): void');
      expect(content).toContain("console.log('Hello from Macro.js!')");
    });

    it('should generate JavaScript standalone template', () => {
      const content = generateMain({ language: 'javascript', projectType: 'standalone' });
      expect(content).toContain('function myFunction()');
      expect(content).not.toContain(': void');
    });
  });

  describe('sheets type', () => {
    it('should generate TypeScript sheets template', () => {
      const content = generateMain({ language: 'typescript', projectType: 'sheets' });
      expect(content).toContain('function myFunction(): void');
      expect(content).toContain('SpreadsheetApp.getActiveSpreadsheet()');
      expect(content).toContain("sheet.getRange('A1').setValue");
    });

    it('should generate JavaScript sheets template', () => {
      const content = generateMain({ language: 'javascript', projectType: 'sheets' });
      expect(content).toContain('function myFunction()');
      expect(content).toContain('SpreadsheetApp.getActiveSpreadsheet()');
      expect(content).not.toContain(': void');
    });
  });

  describe('webapp type', () => {
    it('should generate TypeScript webapp template', () => {
      const content = generateMain({ language: 'typescript', projectType: 'webapp' });
      expect(content).toContain('function doGet(e: GoogleAppsScript.Events.DoGet)');
      expect(content).toContain('function doPost(e: GoogleAppsScript.Events.DoPost)');
      expect(content).toContain('HtmlService.createHtmlOutput');
      expect(content).toContain('ContentService.createTextOutput');
    });

    it('should generate JavaScript webapp template', () => {
      const content = generateMain({ language: 'javascript', projectType: 'webapp' });
      expect(content).toContain('function doGet(e)');
      expect(content).toContain('function doPost(e)');
      expect(content).not.toContain('GoogleAppsScript.Events');
    });
  });

  describe('docs type', () => {
    it('should use standalone template for docs', () => {
      const content = generateMain({ language: 'typescript', projectType: 'docs' });
      expect(content).toContain('function myFunction(): void');
      expect(content).toContain("console.log('Hello from Macro.js!')");
    });
  });

  describe('forms type', () => {
    it('should use standalone template for forms', () => {
      const content = generateMain({ language: 'typescript', projectType: 'forms' });
      expect(content).toContain('function myFunction(): void');
      expect(content).toContain("console.log('Hello from Macro.js!')");
    });
  });

  describe('slides type', () => {
    it('should use standalone template for slides', () => {
      const content = generateMain({ language: 'typescript', projectType: 'slides' });
      expect(content).toContain('function myFunction(): void');
      expect(content).toContain("console.log('Hello from Macro.js!')");
    });
  });
});

describe('getMainFileName', () => {
  it('should return main.ts for TypeScript', () => {
    expect(getMainFileName('typescript')).toBe('main.ts');
  });

  it('should return main.js for JavaScript', () => {
    expect(getMainFileName('javascript')).toBe('main.js');
  });
});
