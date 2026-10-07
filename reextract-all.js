const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const originalIndex = execSync('git show a42a414:index.html', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

function slice(startMarker, endMarker) {
  const s = originalIndex.indexOf(startMarker);
  if (s === -1) throw new Error('Start not found: ' + startMarker);
  const e = originalIndex.indexOf(endMarker, s);
  if (e === -1) throw new Error('End not found: ' + endMarker);
  return originalIndex.substring(s, e).trim();
}

console.log('Re-extracting components accurately from master git commit...');

// Storefront components
const homeView = slice('<section id="publicHomeView">', '<section id="publicCatalogView"');
fs.writeFileSync('components/storefront/home-view.html', homeView + '\n');
console.log('Home view length:', homeView.length);

const catalogView = slice('<section id="publicCatalogView"', '<section id="publicBrandsView"');
fs.writeFileSync('components/storefront/catalog-view.html', catalogView + '\n');
console.log('Catalog view length:', catalogView.length);

const brandsView = slice('<section id="publicBrandsView"', '<section id="publicAboutView"');
fs.writeFileSync('components/storefront/brands-view.html', brandsView + '\n');
console.log('Brands view length:', brandsView.length);

const aboutView = slice('<section id="publicAboutView"', '<section id="publicContactView"');
fs.writeFileSync('components/storefront/about-view.html', aboutView + '\n');
console.log('About view length:', aboutView.length);

const contactView = slice('<section id="publicContactView"', '<footer style="background: #f4eee5;');
fs.writeFileSync('components/storefront/contact-view.html', contactView + '\n');
console.log('Contact view length:', contactView.length);

console.log('Done!');
