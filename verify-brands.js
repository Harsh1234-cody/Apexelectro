const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const dataContent = fs.readFileSync('js/data.js', 'utf8');
const catalogContent = fs.readFileSync('js/modules/catalog.js', 'utf8');

console.log('HTML has brandsDirectoryGrid:', html.includes('id="brandsDirectoryGrid"'));
console.log('Catalog has brandsDirectoryGrid target:', catalogContent.includes('brandsDirectoryGrid'));

global.window = {};
eval(dataContent);
const brands = global.window.INITIAL_DATA.brands;
const products = global.window.INITIAL_DATA.products;

console.log('Total Brands in data.js:', brands.length);
console.log('Total Products in data.js:', products.length);

brands.forEach(b => {
  const matching = products.filter(p => p.brandId === b.id);
  console.log(`- ${b.name.padEnd(28)} [${b.origin.padEnd(15)}] : ${matching.length} products`);
});
