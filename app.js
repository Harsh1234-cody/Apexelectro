// ===================================================================
// APEX ELECTRO SUPPLIES & SWITCHGEAR - MAIN APP CONTROLLER
// Modular Architecture Version 2.0
// ===================================================================

class AppController {
  constructor() {
    this.init();
  }

  init() {
    AppState.load();
    AuthModule.updateAuthUI();
    InquiryCartModule.renderHeaderCount();
    CatalogModule.renderHome();
    CatalogModule.renderCatalog();
    CatalogModule.renderBrands();
    ContactModule.renderBusinessDetails();
    this.renderAdminAll();
    DOMUtils.refreshIcons();

    // Close live search dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const searchBox = document.querySelector('.header-search');
      if (searchBox && !searchBox.contains(e.target)) {
        const dd = document.getElementById('quickSearchDropdown');
        if (dd) dd.classList.remove('open');
      }
    });
  }

  // State proxy for backward compatibility
  get state() {
    return AppState.data;
  }

  // =================================================================
  // NAVIGATION & VIEW SWITCHING
  // =================================================================

  switchView(role) {
    if (role === 'admin' && !AppState.data.isAdminLoggedIn) {
      DOMUtils.showToast('Access Denied: Password login required for Vendor Admin Portal.', 'warning');
      AuthModule.openAdminLoginModal();
      return;
    }

    AppState.data.currentRole = role;
    const publicContainer = document.getElementById('publicViewContainer');
    const adminContainer = document.getElementById('adminViewContainer');
    const btnPublic = document.getElementById('btnSwitchPublic');
    const btnAdmin = document.getElementById('btnSwitchAdmin');

    if (role === 'admin') {
      publicContainer.style.display = 'none';
      adminContainer.style.display = 'block';
      if (btnPublic) btnPublic.classList.remove('active');
      if (btnAdmin) btnAdmin.classList.add('active');
      this.renderAdminAll();
      this.switchAdminTab(AppState.data.currentAdminTab || 'dashboard');
    } else {
      adminContainer.style.display = 'none';
      publicContainer.style.display = 'block';
      if (btnAdmin) btnAdmin.classList.remove('active');
      if (btnPublic) btnPublic.classList.add('active');
      CatalogModule.renderHome();
      CatalogModule.renderCatalog();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    DOMUtils.refreshIcons();
  }

  navigatePublic(page) {
    AppState.data.currentPublicPage = page;

    // View elements
    const homeView = document.getElementById('publicHomeView');
    const catalogView = document.getElementById('publicCatalogView');
    const brandsView = document.getElementById('publicBrandsView');
    const aboutView = document.getElementById('publicAboutView');
    const contactView = document.getElementById('publicContactView');

    if (homeView) homeView.style.display = page === 'home' ? 'block' : 'none';
    if (catalogView) catalogView.style.display = (page === 'catalog' || page === 'categories') ? 'block' : 'none';
    if (brandsView) brandsView.style.display = page === 'brands' ? 'block' : 'none';
    if (aboutView) aboutView.style.display = page === 'about' ? 'block' : 'none';
    if (contactView) contactView.style.display = page === 'contact' ? 'block' : 'none';

    // Explicitly re-render targeted view
    if (page === 'catalog' || page === 'categories') {
      CatalogModule.renderCatalog();
    } else if (page === 'home') {
      CatalogModule.renderHome();
    } else if (page === 'brands') {
      CatalogModule.renderBrands();
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const linkMap = {
      home: 'navHome',
      catalog: 'navCatalog',
      categories: 'navCategories',
      brands: 'navBrands',
      about: 'navAbout',
      contact: 'navContact'
    };
    const activeLink = document.getElementById(linkMap[page]);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    DOMUtils.refreshIcons();
  }

  switchAdminTab(tab) {
    AppState.data.currentAdminTab = tab;

    // Admin views
    const tabs = ['dashboard', 'inquiries', 'products', 'inventory', 'quotations', 'contacts', 'profile', 'brands', 'categories'];
    tabs.forEach(t => {
      const el = document.getElementById(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });

    // Sidebar active item
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.getElementById(`admNav${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (navItem) navItem.classList.add('active');

    // Header title
    const titleEl = document.getElementById('adminPageHeaderTitle');
    const titles = {
      dashboard: 'Executive Dashboard & Overview',
      inquiries: 'Inquiries & B2B Purchase Orders (RFQs)',
      products: 'Industrial Products Catalog Management',
      inventory: 'Inventory & Stock Audit History',
      quotations: 'GST Proforma Quotation Engine',
      contacts: 'Storefront Inquiries & Messages',
      profile: 'Company Settings & Cloud Integrations',
      brands: 'Authorized OEM Brand Partners Management',
      categories: 'Categories & Subcategories Taxonomy'
    };
    if (titleEl) titleEl.textContent = titles[tab] || 'Admin Control Suite';

    if (tab === 'profile') ContactModule.populateProfileForm();
    if (tab === 'brands') this.renderAdminBrandsTable();

    DOMUtils.refreshIcons();
  }

  renderAdminBrandsTable() {
    const tbody = document.getElementById('adminBrandsTableBody');
    if (!tbody) return;
    tbody.innerHTML = AppState.data.brands.map(b => {
      const count = AppState.data.products.filter(p => p.brandId === b.id).length;
      return `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td>${b.origin}</td>
          <td style="max-width: 320px; font-size: 0.825rem; color: #78716c;">${b.description || ''}</td>
          <td><span class="badge-stock in-stock">${count} Products</span></td>
          <td><span class="badge-stock ${b.isActive ? 'in-stock' : 'out-of-stock'}">${b.isActive ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn-xs-outline" onclick="app.filterByBrandOnly('${b.id}')">View Products →</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderAdminAll() {
    this.renderAdminDashboard();
    AdminInquiriesModule.renderTable();
    AdminProductsModule.renderTable();
    AdminInventoryModule.render();
    QuotationModule.renderAdminTable();
    ContactModule.renderAdminContactMessages();
    this.renderAdminBrandsTable();
    this.updateAdminBadges();
  }

  renderAdminDashboard() {
    const totalInq = AppState.data.inquiries.length;
    const newInq = AppState.data.inquiries.filter(i => i.status === 'New').length;
    const totalProds = AppState.data.products.length;

    let lowStock = 0;
    let outOfStock = 0;
    AppState.data.products.forEach(p => {
      (p.variants || []).forEach(v => {
        if (v.stock <= 0) outOfStock++;
        else if (v.stock <= (v.reorderLevel || 10)) lowStock++;
      });
    });

    const kpiTotalInq = document.getElementById('kpiTotalInquiries');
    const kpiNewInq = document.getElementById('kpiNewInquiries');
    const kpiTotalProd = document.getElementById('kpiTotalProducts');
    const kpiActiveProd = document.getElementById('kpiActiveProducts');
    const kpiLow = document.getElementById('kpiLowStock');
    const kpiOut = document.getElementById('kpiOutOfStock');
    const kpiCatBrand = document.getElementById('kpiCatBrandCount');

    if (kpiTotalInq) kpiTotalInq.textContent = totalInq;
    if (kpiNewInq) kpiNewInq.textContent = `${newInq} New`;
    if (kpiTotalProd) kpiTotalProd.textContent = totalProds;
    if (kpiActiveProd) kpiActiveProd.textContent = totalProds;
    if (kpiLow) kpiLow.textContent = lowStock;
    if (kpiOut) kpiOut.textContent = `${outOfStock} out of stock`;
    if (kpiCatBrand) kpiCatBrand.textContent = `${AppState.data.categories.length} / ${AppState.data.brands.length}`;
  }

  updateAdminBadges() {
    const inqBadge = document.getElementById('admInquiriesBadge');
    const prodBadge = document.getElementById('admProductsBadge');
    const contactBadge = document.getElementById('admContactsBadge');

    if (inqBadge) inqBadge.textContent = AppState.data.inquiries.filter(i => i.status === 'New').length;
    if (prodBadge) prodBadge.textContent = AppState.data.products.length;
    if (contactBadge) contactBadge.textContent = AppState.data.contactMessages.filter(m => m.status === 'Unread').length;
  }

  // =================================================================
  // DELEGATES TO SPECIALIZED MODULES
  // =================================================================

  // Auth Module
  requestAdminAccess() { AuthModule.requestAdminAccess(this); }
  handleAdminLogin(e) { AuthModule.handleAdminLogin(e, this); }
  handleAdminLogout() { AuthModule.handleAdminLogout(this); }
  quickFillAdminCredentials() { AuthModule.quickFillAdminCredentials(); }
  togglePasswordVisibility(id) { AuthModule.togglePasswordVisibility(id); }
  handleChangeAdminPassword(e) {
    e.preventDefault();
    const nameInput = document.getElementById('setAdminName');
    const emailInput = document.getElementById('setAdminEmail');
    const oldPassInput = document.getElementById('setCurrentPassword');
    const newPassInput = document.getElementById('setNewPassword');
    const confirmPassInput = document.getElementById('setConfirmPassword');

    const name = nameInput ? nameInput.value.trim() : 'Harsh';
    const email = emailInput ? emailInput.value.trim() : '';
    const oldPass = oldPassInput ? oldPassInput.value : '';
    const newPass = newPassInput ? newPassInput.value : '';
    const confirmPass = confirmPassInput ? confirmPassInput.value : '';

    const success = AuthModule.changePassword(oldPass, newPass, confirmPass, email, name);
    if (success) {
      if (oldPassInput) oldPassInput.value = '';
      if (newPassInput) newPassInput.value = '';
      if (confirmPassInput) confirmPassInput.value = '';
      const hint = document.getElementById('pwdChangeSuccessHint');
      if (hint) {
        hint.style.display = 'inline';
        setTimeout(() => { hint.style.display = 'none'; }, 4000);
      }
    }
  }

  // Catalog Module
  filterByCategory(id) {
    AppState.data.selectedCategoryFilter = id;
    this.navigatePublic('catalog');
    CatalogModule.renderCatalog();
  }
  toggleBrandFilter(id) {
    if (AppState.data.selectedBrandFilters.has(id)) AppState.data.selectedBrandFilters.delete(id);
    else AppState.data.selectedBrandFilters.add(id);
    CatalogModule.renderCatalog();
    CatalogModule.renderBrands();
  }
  filterByBrandOnly(id) {
    AppState.data.selectedBrandFilters.clear();
    AppState.data.selectedBrandFilters.add(id);
    this.navigatePublic('catalog');
    CatalogModule.renderCatalog();
    CatalogModule.renderBrands();
  }
  clearAllFilters() {
    AppState.data.selectedCategoryFilter = 'ALL';
    AppState.data.selectedBrandFilters.clear();
    const inStock = document.getElementById('filterInStockOnly');
    const priceVis = document.getElementById('filterPriceVisibleOnly');
    const pricePor = document.getElementById('filterPriceOnRequestOnly');
    if (inStock) inStock.checked = false;
    if (priceVis) priceVis.checked = false;
    if (pricePor) pricePor.checked = false;
    CatalogModule.renderCatalog();
    CatalogModule.renderBrands();
  }
  resetCatalogFilters() { this.clearAllFilters(); }
  applyFilters() { CatalogModule.renderProductList(); }
  handleSortChange(val) {
    AppState.data.selectedSort = val;
    CatalogModule.renderProductList();
  }
  handleLiveSearch(query) { CatalogModule.handleLiveSearch(query); }
  selectSearchProduct(id) {
    const dd = document.getElementById('quickSearchDropdown');
    if (dd) dd.classList.remove('open');
    this.openProductModal(id);
  }
  openProductDetail(id) { this.openProductModal(id); }

  // Stepper utility for all quantity inputs
  stepQty(btnOrId, delta) {
    let input = null;
    if (btnOrId && btnOrId.nodeType) {
      // Direct DOM button passed via 'this'
      const group = btnOrId.closest('.qty-input-group') || btnOrId.parentElement;
      if (group) {
        input = group.querySelector('.qty-field') || group.querySelector('input[type="number"]') || group.querySelector('input');
      }
    } else if (typeof btnOrId === 'string') {
      // Element ID or product ID passed
      input = document.getElementById(btnOrId) || document.getElementById(`qty-input-${btnOrId}`);
    }

    if (input) {
      const current = parseInt(input.value) || 1;
      const next = Math.max(1, current + delta);
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Product Card in Catalog
  adjustCardQty(btnOrProdId, delta) {
    this.stepQty(btnOrProdId, delta);
  }

  handleCardVariantChange(elemOrProdId, prodIdOrVarId, maybeVarId) {
    let elem = null;
    let prodId = elemOrProdId;
    let varId = prodIdOrVarId;
    if (elemOrProdId && elemOrProdId.nodeType) {
      elem = elemOrProdId;
      prodId = prodIdOrVarId;
      varId = maybeVarId;
    }
    const prod = AppState.data.products.find(p => p.id === prodId);
    if (!prod) return;
    const variant = (prod.variants || []).find(v => v.id === varId);
    if (!variant) return;

    const card = elem ? elem.closest('.product-card') : null;
    const skuDisplay = card ? card.querySelector('.prod-sku-code') : document.getElementById(`sku-display-${prodId}`);
    const stockHint = card ? (card.querySelector('.stock-hint-badge') || card.querySelector(`[id^="stock-hint"]`)) : document.getElementById(`stock-hint-${prodId}`);
    const priceBox = card ? card.querySelector('.price-box') : document.getElementById(`price-box-${prodId}`);

    if (skuDisplay) skuDisplay.textContent = `SKU: ${variant.sku}`;
    if (stockHint) stockHint.textContent = `${variant.stock} ${prod.unit}`;
    if (priceBox && prod.showPrice && prod.basePrice > 0) {
      priceBox.innerHTML = `<div class="price-main">${Formatters.formatCurrency(variant.price)} <span>/ ${prod.unit}</span></div>`;
    }
  }

  addCardToInquiry(btnOrProdId, maybeProdId) {
    let prodId = btnOrProdId;
    let qty = 1;
    let varId = null;

    if (btnOrProdId && btnOrProdId.nodeType) {
      // Called with (this, productId)
      prodId = maybeProdId || btnOrProdId.getAttribute('data-prod-id');
      const card = btnOrProdId.closest('.product-card');
      if (card) {
        const input = card.querySelector('.qty-field') || card.querySelector('input[type="number"]');
        const select = card.querySelector('.variant-select') || card.querySelector('select');
        if (input) qty = parseInt(input.value) || 1;
        if (select) varId = select.value || null;
      }
    } else {
      // Fallback for string prodId
      const input = document.getElementById(`qty-input-${prodId}`);
      const select = document.getElementById(`var-select-${prodId}`);
      if (input) qty = parseInt(input.value) || 1;
      if (select) varId = select.value || null;
    }

    InquiryCartModule.add(prodId, varId, qty);
  }

  // Product Details Modal
  openProductModal(id) { ProductDetailModule.open(id); }
  switchModalImage(url, thumb) { ProductDetailModule.switchImage(url, thumb); }
  handleModalVariantChange(varId) { ProductDetailModule.handleVariantChange(varId); }
  adjustModalQty(targetOrDelta, maybeDelta) {
    if (targetOrDelta && targetOrDelta.nodeType) {
      this.stepQty(targetOrDelta, maybeDelta);
    } else {
      this.stepQty('modalQtyInput', targetOrDelta);
    }
  }
  addModalToInquiry() {
    const p = AppState.data.activeModalProduct;
    if (!p) return;
    const varSelect = document.getElementById('modalVariantSelect');
    const qtyInput = document.getElementById('modalQtyInput');
    const varId = varSelect ? varSelect.value : null;
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    InquiryCartModule.add(p.id, varId, qty, p.unit);
    DOMUtils.closeModal('productDetailModal');
  }

  // Inquiry Cart & Drawer
  toggleInquiryDrawer(open) { InquiryCartModule.toggleDrawer(open); }
  handleDrawerOverlayClick(e) { InquiryCartModule.handleOverlayClick(e); }
  updateInquiryItemQty(idx, d) { InquiryCartModule.updateQty(idx, d); }
  setInquiryItemQty(idx, val) { InquiryCartModule.setQty(idx, val); }
  updateInquiryItemNotes(idx, n) { InquiryCartModule.updateNotes(idx, n); }
  removeInquiryItem(idx) { InquiryCartModule.remove(idx); }

  // Inquiry Submission Modal
  openInquirySubmitModal() { InquirySubmitModule.openModal(); }
  handleInquirySubmit(e) { InquirySubmitModule.handleSubmit(e); }
  switchSuccessEmailTab(tab) { InquirySubmitModule.switchEmailTab(tab); }

  // Quotation Module
  generateQuotationFromInquiry(inqId) { QuotationModule.generateFromInquiry(inqId); }
  openQuotationModal(qId) { QuotationModule.openModal(qId); }
  sendQuotationViaBrevo() { QuotationModule.sendViaBrevo(); }

  // Admin Products Module
  openNewProductModal() { AdminProductsModule.openNewModal(); }
  editAdminProduct(id) { AdminProductsModule.openEditModal(id); }
  deleteAdminProduct(id) { AdminProductsModule.delete(id); }
  handleProductFormSubmit(e) { AdminProductsModule.handleSave(e); }
  addDynamicSpecRow() { AdminProductsModule.addDynamicSpecRow(); }
  addDynamicVariantRow() { AdminProductsModule.addDynamicVariantRow(); }

  // Admin Inventory Module
  openStockModalForSku(sku) { AdminInventoryModule.openStockModalForSku(sku); }
  handleStockVariantChange(sku) { AdminInventoryModule.handleVariantChange(sku); }
  handleStockAdjustmentSubmit(e) { AdminInventoryModule.handleAdjustmentSubmit(e); }

  // Admin Inquiries Module
  openAdminInquiryDetail(id) { AdminInquiriesModule.openDetailModal(id); }
  updateInquiryStatus(id, s) { AdminInquiriesModule.updateStatus(id, s); }

  // Contact & Profile Module
  handleContactSubmit(e) { ContactModule.handleSubmit(e); }
  handleProfileSave(e) { ContactModule.handleProfileSave(e); }

  // Cloud Diagnostics Module
  checkCloudServicesHealth() { CloudServicesModule.checkHealth(); }
  handleBrevoSaveAndTest(e) { CloudServicesModule.handleBrevoSaveAndTest(e); }

  // Generic Helpers
  closeModal(id) { DOMUtils.closeModal(id); }
  showToast(msg, type) { DOMUtils.showToast(msg, type); }
  resetData() {
    if (confirm("Reset catalog and storefront cache to fresh clean state?")) {
      AppState.reset();
      this.init();
      DOMUtils.showToast("Catalog cache reset to clean state.", "info");
    }
  }
}

// Instantiate on DOM load or immediately if already parsed
function startApp() {
  if (!window.app) {
    window.app = new AppController();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
