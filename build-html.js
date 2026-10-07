const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const templatePath = path.join(rootDir, 'index.template.html');
const outputPath = path.join(rootDir, 'index.html');

console.log('Compiling HTML components into index.html...');

let template = fs.readFileSync(templatePath, 'utf8');

const includeRegex = /\{\{include:([^}]+)\}\}/g;
let match;
let missingFiles = [];

const result = template.replace(includeRegex, (fullMatch, relativePath) => {
  const filePath = path.join(rootDir, relativePath.trim());
  if (!fs.existsSync(filePath)) {
    missingFiles.push(relativePath.trim());
    console.error(`Error: File not found: ${filePath}`);
    return `<!-- MISSING COMPONENT: ${relativePath.trim()} -->`;
  }
  return fs.readFileSync(filePath, 'utf8').trimEnd();
});

if (missingFiles.length > 0) {
  console.error(`Build failed with ${missingFiles.length} missing components!`);
  process.exit(1);
}

fs.writeFileSync(outputPath, result, 'utf8');
console.log(`Successfully compiled index.html (${result.length} bytes, ${result.split('\n').length} lines) from modular components!`);
