const http = require('http');

const files = [
  'css/styles.css', 'css/variables.css', 'css/base.css', 'css/header.css', 'css/public.css', 'css/drawer.css', 'css/modals.css', 'css/admin.css',
  'js/data.js', 'js/utils/formatters.js', 'js/utils/dom.js', 'js/state.js',
  'js/modules/auth.js', 'js/modules/catalog.js', 'js/modules/productDetail.js',
  'js/modules/inquiryCart.js', 'js/modules/inquirySubmit.js', 'js/modules/quotation.js',
  'js/modules/adminProducts.js', 'js/modules/adminInventory.js', 'js/modules/adminInquiries.js',
  'js/modules/contact.js', 'js/modules/cloudServices.js', 'js/app.js'
];

async function check() {
  let allOk = true;
  for (const f of files) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000/${f}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ 200 OK: ${f}`);
        } else {
          console.error(`❌ ${res.statusCode}: ${f}`);
          allOk = false;
        }
        resolve();
      }).on('error', (err) => {
        console.error(`❌ ERR: ${f} -> ${err.message}`);
        allOk = false;
        resolve();
      });
    });
  }
  if (allOk) {
    console.log('\n🌟 All 24 modular asset endpoints loaded with status 200 OK!');
  } else {
    process.exit(1);
  }
}

check();
