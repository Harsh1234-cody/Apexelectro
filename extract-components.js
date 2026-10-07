const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Ensure directories exist
const dirs = [
  'components/layout',
  'components/storefront',
  'components/drawer',
  'components/admin',
  'components/modals'
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

// Helper to extract by start and end delimiters
function extractBetween(src, startMarker, endMarker, includeMarkers = true) {
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error(`Start marker not found: ${startMarker}`);
  }
  const endIdx = src.indexOf(endMarker, startIdx + (includeMarkers ? 0 : startMarker.length));
  if (endIdx === -1) {
    throw new Error(`End marker not found: ${endMarker}`);
  }
  const actualEnd = endIdx + (includeMarkers ? endMarker.length : 0);
  return src.substring(startIdx, actualEnd).trim();
}

console.log('Extracting modular HTML components...');

// 1. Layout
const switcherBar = extractBetween(indexHtml, '<aside class="global-switcher-bar"', '</aside>');
fs.writeFileSync('components/layout/switcher-bar.html', switcherBar + '\n');

const publicHeader = extractBetween(indexHtml, '<header class="public-header">', '</header>');
fs.writeFileSync('components/layout/header.html', publicHeader + '\n');

const publicFooter = extractBetween(indexHtml, '<footer style="background: #f4eee5;', '</footer>');
fs.writeFileSync('components/layout/footer.html', publicFooter + '\n');

// 2. Storefront views
const homeView = extractBetween(indexHtml, '<section id="publicHomeView">', '</section>');
fs.writeFileSync('components/storefront/home-view.html', homeView + '\n');

const catalogView = extractBetween(indexHtml, '<section id="publicCatalogView"', '</section>');
fs.writeFileSync('components/storefront/catalog-view.html', catalogView + '\n');

const brandsView = extractBetween(indexHtml, '<section id="publicBrandsView"', '</section>');
fs.writeFileSync('components/storefront/brands-view.html', brandsView + '\n');

const aboutView = extractBetween(indexHtml, '<section id="publicAboutView"', '</section>');
fs.writeFileSync('components/storefront/about-view.html', aboutView + '\n');

const contactView = extractBetween(indexHtml, '<section id="publicContactView"', '</section>');
fs.writeFileSync('components/storefront/contact-view.html', contactView + '\n');

// 3. Drawer
const inquiryDrawer = extractBetween(indexHtml, '<div class="inquiry-drawer-overlay"', '</div>\n  </div>\n\n  <!-- ===================================================================\n       4. MODALS');
// remove the trailing comment if captured
const cleanDrawer = inquiryDrawer.replace(/<!-- ===[\s\S]*$/, '').trim();
fs.writeFileSync('components/drawer/inquiry-drawer.html', cleanDrawer + '\n');

// 4. Modals
const adminLoginModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="adminLoginModal"', '</dialog>');
fs.writeFileSync('components/modals/modal-admin-login.html', adminLoginModal + '\n');

const productDetailModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="productDetailModal">', '</dialog>');
fs.writeFileSync('components/modals/modal-product-detail.html', productDetailModal + '\n');

const inquirySubmitModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="inquirySubmitModal">', '</dialog>');
fs.writeFileSync('components/modals/modal-inquiry-submit.html', inquirySubmitModal + '\n');

const inquirySuccessModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="inquirySuccessModal">', '</dialog>');
fs.writeFileSync('components/modals/modal-inquiry-success.html', inquirySuccessModal + '\n');

const quotationModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="quotationModal"', '</dialog>');
fs.writeFileSync('components/modals/modal-quotation-view.html', quotationModal + '\n');

// 5. Admin Layout & Tabs
const adminSidebar = extractBetween(indexHtml, '<aside class="admin-sidebar">', '</aside>');
fs.writeFileSync('components/admin/admin-sidebar.html', adminSidebar + '\n');

const adminTopbar = extractBetween(indexHtml, '<header class="admin-topbar">', '</header>');
fs.writeFileSync('components/admin/admin-topbar.html', adminTopbar + '\n');

const tabDashboard = extractBetween(indexHtml, '<!-- TAB 1: ADMIN DASHBOARD', '<!-- TAB 2: INQUIRIES MANAGEMENT');
fs.writeFileSync('components/admin/tab-dashboard.html', tabDashboard.trim() + '\n');

const tabInquiries = extractBetween(indexHtml, '<!-- TAB 2: INQUIRIES MANAGEMENT', '<!-- TAB 3: PRODUCT MANAGEMENT');
fs.writeFileSync('components/admin/tab-inquiries.html', tabInquiries.trim() + '\n');

const tabProducts = extractBetween(indexHtml, '<!-- TAB 3: PRODUCT MANAGEMENT', '<!-- TAB 4: INVENTORY MANAGEMENT');
fs.writeFileSync('components/admin/tab-products.html', tabProducts.trim() + '\n');

const tabInventory = extractBetween(indexHtml, '<!-- TAB 4: INVENTORY MANAGEMENT', '<!-- TAB 5: QUOTATIONS MANAGER');
fs.writeFileSync('components/admin/tab-inventory.html', tabInventory.trim() + '\n');

const tabQuotations = extractBetween(indexHtml, '<!-- TAB 5: QUOTATIONS MANAGER', '<!-- TAB 6: CATEGORIES & SUBCATEGORIES');
fs.writeFileSync('components/admin/tab-quotations.html', tabQuotations.trim() + '\n');

const tabCategories = extractBetween(indexHtml, '<!-- TAB 6: CATEGORIES & SUBCATEGORIES', '<!-- TAB 7: BRANDS');
fs.writeFileSync('components/admin/tab-categories.html', tabCategories.trim() + '\n');

const tabBrands = extractBetween(indexHtml, '<!-- TAB 7: BRANDS', '<!-- TAB 8: CONTACT SUBMISSIONS');
fs.writeFileSync('components/admin/tab-brands.html', tabBrands.trim() + '\n');

const tabContacts = extractBetween(indexHtml, '<!-- TAB 8: CONTACT SUBMISSIONS', '<!-- TAB 9: BUSINESS PROFILE & CMS SETTINGS');
fs.writeFileSync('components/admin/tab-contacts.html', tabContacts.trim() + '\n');

const tabProfile = extractBetween(indexHtml, '<!-- TAB 9: BUSINESS PROFILE & CMS SETTINGS', '</div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Modal: Admin Stock Adjustment Modal');
const cleanTabProfile = tabProfile.replace(/<!-- Modal: Admin Stock Adjustment Modal[\s\S]*$/, '').trim();
fs.writeFileSync('components/admin/tab-profile.html', cleanTabProfile + '\n');

// 6. Admin Modals
const adminStockModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="adminStockModal">', '</dialog>');
fs.writeFileSync('components/modals/modal-admin-stock.html', adminStockModal + '\n');

const adminProductModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="adminProductModal"', '</dialog>');
fs.writeFileSync('components/modals/modal-admin-product.html', adminProductModal + '\n');

const adminInquiryDetailModal = extractBetween(indexHtml, '<dialog class="custom-modal" id="adminInquiryDetailModal"', '</dialog>');
fs.writeFileSync('components/modals/modal-admin-inquiry-detail.html', adminInquiryDetailModal + '\n');

console.log('Successfully extracted all HTML components into dedicated folders!');
