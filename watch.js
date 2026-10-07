const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');
const templateFile = path.join(rootDir, 'index.template.html');

console.log('👀 Watching components/ and index.template.html for edits...');

let timeout = null;
function rebuild() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    try {
      console.log('Detected edit, rebuilding index.html...');
      require('./build-html.js');
    } catch (err) {
      console.error('Rebuild failed:', err.message);
    }
  }, 100);
}

// Watch template
fs.watch(templateFile, rebuild);

// Watch components recursively
if (fs.existsSync(componentsDir)) {
  fs.watch(componentsDir, { recursive: true }, rebuild);
}

console.log('Live compiler active. Press Ctrl+C to stop.');
