const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);

lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (
    trimmed.startsWith('<!-- ===') ||
    trimmed.startsWith('<!-- 1.') ||
    trimmed.startsWith('<!-- 2.') ||
    trimmed.startsWith('<!-- 3.') ||
    trimmed.startsWith('<!-- 4.') ||
    trimmed.startsWith('<!-- 5.') ||
    trimmed.startsWith('<!-- 6.') ||
    trimmed.startsWith('<!-- 7.') ||
    trimmed.startsWith('<!-- 8.') ||
    trimmed.startsWith('<!-- TAB') ||
    trimmed.startsWith('<dialog') ||
    trimmed.startsWith('<header') ||
    trimmed.startsWith('<footer') ||
    trimmed.startsWith('<aside') ||
    trimmed.includes('id="public') ||
    trimmed.includes('id="admin')
  ) {
    if (trimmed.length < 120) {
      console.log(`Line ${idx + 1}: ${trimmed}`);
    }
  }
});
