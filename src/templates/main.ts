import type { Language, ProjectType } from '../types.js';

export interface MainOptions {
  language: Language;
  projectType: ProjectType;
}

const standaloneTs = `function myFunction(): void {
  console.log('Hello from Macro.js!');
}
`;

const standaloneJs = `function myFunction() {
  console.log('Hello from Macro.js!');
}
`;

const sheetsTs = `function myFunction(): void {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Hello from Macro.js!');
}
`;

const sheetsJs = `function myFunction() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Hello from Macro.js!');
}
`;

const webappTs = `function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutput('<h1>Hello from Macro.js!</h1>');
}

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

const webappJs = `function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>Hello from Macro.js!</h1>');
}

function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export function generateMain(options: MainOptions): string {
  const { language, projectType } = options;
  const isTs = language === 'typescript';

  switch (projectType) {
    case 'sheets':
      return isTs ? sheetsTs : sheetsJs;
    case 'webapp':
      return isTs ? webappTs : webappJs;
    case 'standalone':
    case 'docs':
    case 'forms':
    case 'slides':
    default:
      return isTs ? standaloneTs : standaloneJs;
  }
}

export function getMainFileName(language: Language): string {
  return language === 'typescript' ? 'main.ts' : 'main.js';
}
