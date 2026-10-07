// Script to verify clean state and no mock data
const fs = require('fs');
const path = require('path');

// 1. Verify data.js
global.window = {};
require('../js/data.js');
const data = global.INITIAL_DATA || window.INITIAL_DATA;

console.log('--- DATA.JS VERIFICATION ---');
console.log('Inquiries count:', data.inquiries.length);
console.log('Quotations count:', data.quotations.length);
console.log('Stock adjustments count:', data.stockAdjustments.length);
console.log('Contact messages count:', data.contactMessages.length);
console.log('Brands count:', data.brands.length);
console.log('Products count:', data.products.length);

if (data.inquiries.length !== 0 || data.quotations.length !== 0 || data.stockAdjustments.length !== 0 || data.contactMessages.length !== 0) {
  console.error('FAIL: data.js contains mock inquiries, quotes, adjustments, or messages!');
  process.exit(1);
} else {
  console.log('PASS: data.js is 100% clean of fake data!');
}

// 2. Verify index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
console.log('\n--- INDEX.HTML VERIFICATION ---');
const forbiddenStrings = ['Vikram Rathore', 'Demo RFQ', 'Role: Public Customer View', 'Sunil Deshmukh', 'Shapoorji EPC'];
let failed = false;
forbiddenStrings.forEach(s => {
  if (indexHtml.includes(s)) {
    console.error(`FAIL: index.html contains forbidden string "${s}"`);
    failed = true;
  } else {
    console.log(`PASS: index.html does not contain "${s}"`);
  }
});

// 3. Verify seed.sql
const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8');
console.log('\n--- SUPABASE/SEED.SQL VERIFICATION ---');
if (seedSql.includes('Vikram Rathore') || seedSql.includes('INQ-2026-00001') || seedSql.includes('QUO-2026-00001')) {
  console.error('FAIL: seed.sql contains mock inquiries or quotations!');
  failed = true;
} else {
  console.log('PASS: seed.sql contains 0 fake inquiries or quotations!');
}

if (failed) {
  process.exit(1);
}
console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
