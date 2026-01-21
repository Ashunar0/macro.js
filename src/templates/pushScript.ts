export function generatePushScript(): string {
  return `const { spawn } = require('child_process');

const proc = spawn('clasp', ['push'], { stdio: 'inherit', shell: true });

proc.on('close', (code) => {
  if (code !== 0) {
    console.log('');
    console.log('\\x1b[33m%s\\x1b[0m', 'Hint: If you are not logged in, run:');
    console.log('\\x1b[36m%s\\x1b[0m', '  npm run login');
    console.log('');
    process.exit(code);
  }
});
`;
}
