// ===================================================================
// APEX ELECTRO - MODULE: ADMIN PRODUCT CATALOG & DYNAMIC SPECS
// ===================================================================

const AdminProductsModule = {
  renderTable() {
    const tableBody = document.getElementById('adminProductsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = AppState.data.products.map(p => {
      const variants = p.variants || [];
      const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      const primaryVar = variants[0] || {};
      const priceText = p.showPrice && p.basePrice > 0
        ? Formatters.formatCurrency(primaryVar.price || p.basePrice)
        : '<span style="color: #0284c7;">On Request</span>';

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80'}" style="width: 36px; height: 36px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-medium);">
              <div>
                <strong style="color: var(--text-main); font-size: 0.85rem;">${p.name}</strong>
                <div style="font-size: 0.7rem; color: #b45309;">${p.brandName} • ${variants.length} Variants</div>
              </div>
            </div>
          </td>
          <td><span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${p.sku}</span></td>
          <td><span style="font-size: 0.8rem; font-weight: 600;">${p.categoryName}</span></td>
          <td><strong style="font-family: var(--font-mono);">${priceText}</strong> <span style="font-size: 0.7rem; color: var(--text-muted);">/${p.unit}</span></td>
          <td><span style="font-weight: 700; font-family: var(--font-mono);">${totalStock}</span></td>
          <td><span class="status-pill ${p.status === 'Active' ? 'won' : 'closed'}">${p.status}</span></td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn-xs-outline" onclick="app.editAdminProduct('${p.id}')">Edit</button>
              <button class="btn-xs-outline" style="color: #dc2626;" onclick="app.deleteAdminProduct('${p.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openNewModal() {
    AppState.data.editingProductId = null;
    const form = document.getElementById('adminProductForm');
    if (form) form.reset();

    const title = document.getElementById('adminProductModalTitle');
    if (title) title.textContent = 'Add New Electrical Product';

    this.populateSelectOptions();
    this.renderDynamicSpecs([]);
    this.renderDynamicVariants([]);

    DOMUtils.openModal('adminProductModal');
  },

  openEditModal(productId) {
    const prod = AppState.data.products.find(p => p.id === productId);
    if (!prod) return;

    AppState.data.editingProductId = productId;
    const title = document.getElementById('adminProductModalTitle');
    if (title) title.textContent = `Edit Product: ${prod.name}`;

    this.populateSelectOptions();

    // Populate standard fields
    const fTitle = document.getElementById('pTitle');
    const fSku = document.getElementById('pSku');
    const fCat = document.getElementById('pCategory');
    const fBrand = document.getElementById('pBrand');
    const fPriceType = document.getElementById('pPriceType');
    const fUnit = document.getElementById('pUnit');
    const fBasePrice = document.getElementById('pBasePrice');
    const fShowPrice = document.getElementById('pShowPrice');
    const fShortDesc = document.getElementById('pShortDesc');
    const fFullDesc = document.getElementById('pFullDesc');
    const fImage = document.getElementById('pImage');

    if (fTitle) fTitle.value = prod.name || '';
    if (fSku) fSku.value = prod.sku || '';
    if (fCat) fCat.value = prod.categoryId || '';
    if (fBrand) fBrand.value = prod.brandId || '';
    if (fPriceType) fPriceType.value = prod.pricingType || 'Per Unit';
    if (fUnit) fUnit.value = prod.unit || 'Piece';
    if (fBasePrice) fBasePrice.value = prod.basePrice || 0;
    if (fShowPrice) fShowPrice.checked = prod.showPrice !== false;
    if (fShortDesc) fShortDesc.value = prod.shortDescription || '';
    if (fFullDesc) fFullDesc.value = prod.fullDescription || '';
    if (fImage) fImage.value = (prod.images && prod.images[0]) || '';

    this.renderDynamicSpecs(prod.specifications || []);
    this.renderDynamicVariants(prod.variants || []);

    DOMUtils.openModal('adminProductModal');
  },

  populateSelectOptions() {
    const catSelect = document.getElementById('pCategory');
    const brandSelect = document.getElementById('pBrand');

    if (catSelect) {
      catSelect.innerHTML = AppState.data.categories.map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');
    }

    if (brandSelect) {
      brandSelect.innerHTML = AppState.data.brands.map(b => `
        <option value="${b.id}">${b.name}</option>
      `).join('');
    }
  },

  renderDynamicSpecs(specs) {
    const list = document.getElementById('dynamicSpecsList');
    if (!list) return;

    list.innerHTML = (specs || []).map((s, idx) => `
      <div style="display: flex; gap: 0.5rem; align-items: center;" class="spec-row">
        <input type="text" class="form-control spec-name" placeholder="Parameter Name (e.g. Current Rating)" value="${s.name || ''}" style="flex: 1;">
        <input type="text" class="form-control spec-val" placeholder="Value (e.g. 16 Amperes)" value="${s.value || ''}" style="flex: 1;">
        <button type="button" class="btn-xs-outline" style="color: #dc2626;" onclick="this.parentElement.remove()">✕</button>
      </div>
    `).join('');
  },

  addDynamicSpecRow() {
    const list = document.getElementById('dynamicSpecsList');
    if (!list) return;

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '0.5rem';
    row.style.alignItems = 'center';
    row.className = 'spec-row';
    row.innerHTML = `
      <input type="text" class="form-control spec-name" placeholder="Parameter Name" style="flex: 1;">
      <input type="text" class="form-control spec-val" placeholder="Value" style="flex: 1;">
      <button type="button" class="btn-xs-outline" style="color: #dc2626;" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(row);
  },

  renderDynamicVariants(variants) {
    const list = document.getElementById('dynamicVariantsList');
    if (!list) return;

    list.innerHTML = (variants || []).map((v, idx) => `
      <div style="display: flex; gap: 0.5rem; align-items: center;" class="variant-row">
        <input type="text" class="form-control var-name" placeholder="Variant Name (e.g. 2.5 sq.mm)" value="${v.name || ''}" style="flex: 2;">
        <input type="text" class="form-control var-sku" placeholder="SKU" value="${v.sku || ''}" style="flex: 1.5;">
        <input type="number" step="0.01" class="form-control var-price" placeholder="Rate (₹)" value="${v.price || 0}" style="flex: 1;">
        <input type="number" class="form-control var-stock" placeholder="Stock" value="${v.stock || 0}" style="flex: 1;">
        <button type="button" class="btn-xs-outline" style="color: #dc2626;" onclick="this.parentElement.remove()">✕</button>
      </div>
    `).join('');
  },

  addDynamicVariantRow() {
    const list = document.getElementById('dynamicVariantsList');
    if (!list) return;

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '0.5rem';
    row.style.alignItems = 'center';
    row.className = 'variant-row';
    row.innerHTML = `
      <input type="text" class="form-control var-name" placeholder="Variant Name" style="flex: 2;">
      <input type="text" class="form-control var-sku" placeholder="SKU" style="flex: 1.5;">
      <input type="number" step="0.01" class="form-control var-price" placeholder="Rate (₹)" value="0" style="flex: 1;">
      <input type="number" class="form-control var-stock" placeholder="Stock" value="100" style="flex: 1;">
      <button type="button" class="btn-xs-outline" style="color: #dc2626;" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(row);
  },

  handleSave(event) {
    event.preventDefault();

    const title = document.getElementById('pTitle').value.trim();
    const sku = document.getElementById('pSku').value.trim();
    const catId = document.getElementById('pCategory').value;
    const brandId = document.getElementById('pBrand').value;
    const priceType = document.getElementById('pPriceType').value;
    const unit = document.getElementById('pUnit').value;
    const basePrice = parseFloat(document.getElementById('pBasePrice').value) || 0;
    const showPrice = document.getElementById('pShowPrice').checked;
    const shortDesc = document.getElementById('pShortDesc').value.trim();
    const fullDesc = document.getElementById('pFullDesc').value.trim();
    const imgUrl = document.getElementById('pImage').value.trim() || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80';

    const catObj = AppState.data.categories.find(c => c.id === catId);
    const brandObj = AppState.data.brands.find(b => b.id === brandId);

    // Read dynamic specs
    const specs = [];
    document.querySelectorAll('.spec-row').forEach(row => {
      const name = row.querySelector('.spec-name')?.value.trim();
      const val = row.querySelector('.spec-val')?.value.trim();
      if (name && val) specs.push({ name, value: val });
    });

    // Read dynamic variants
    const variants = [];
    document.querySelectorAll('.variant-row').forEach((row, idx) => {
      const vName = row.querySelector('.var-name')?.value.trim();
      const vSku = row.querySelector('.var-sku')?.value.trim();
      const vPrice = parseFloat(row.querySelector('.var-price')?.value) || basePrice;
      const vStock = parseInt(row.querySelector('.var-stock')?.value) || 0;
      if (vName) {
        variants.push({
          id: `var-${Date.now()}-${idx}`,
          name: vName,
          sku: vSku || `${sku}-${idx+1}`,
          price: vPrice,
          stock: vStock,
          reorderLevel: 10
        });
      }
    });

    if (variants.length === 0) {
      variants.push({
        id: `var-${Date.now()}-1`,
        name: 'Standard Specification',
        sku: sku,
        price: basePrice,
        stock: 100,
        reorderLevel: 10
      });
    }

    if (AppState.data.editingProductId) {
      // Update existing
      const p = AppState.data.products.find(item => item.id === AppState.data.editingProductId);
      if (p) {
        p.name = title;
        p.sku = sku;
        p.categoryId = catId;
        p.categoryName = catObj ? catObj.name : '';
        p.brandId = brandId;
        p.brandName = brandObj ? brandObj.name : '';
        p.pricingType = priceType;
        p.unit = unit;
        p.basePrice = basePrice;
        p.showPrice = showPrice;
        p.shortDescription = shortDesc;
        p.fullDescription = fullDesc;
        p.images = [imgUrl];
        p.specifications = specs;
        p.variants = variants;
      }
      DOMUtils.showToast(`Product "${title}" updated successfully!`, 'success');
    } else {
      // Create new
      const newProd = {
        id: `prod-${Date.now()}`,
        name: title,
        sku: sku,
        categoryId: catId,
        categoryName: catObj ? catObj.name : '',
        brandId: brandId,
        brandName: brandObj ? brandObj.name : '',
        pricingType: priceType,
        unit: unit,
        basePrice: basePrice,
        showPrice: showPrice,
        shortDescription: shortDesc,
        fullDescription: fullDesc,
        images: [imgUrl],
        specifications: specs,
        variants: variants,
        status: 'Active',
        isFeatured: false
      };
      AppState.data.products.unshift(newProd);
      DOMUtils.showToast(`Product "${title}" added to catalog database!`, 'success');
    }

    AppState.save();
    DOMUtils.closeModal('adminProductModal');
    this.renderTable();
    CatalogModule.renderCatalog();
    CatalogModule.renderHome();
  },

  delete(productId) {
    if (!confirm('Are you sure you want to remove this product from the catalog?')) return;
    AppState.data.products = AppState.data.products.filter(p => p.id !== productId);
    AppState.save();
    this.renderTable();
    CatalogModule.renderCatalog();
    CatalogModule.renderHome();
    DOMUtils.showToast('Product removed from catalog.', 'info');
  }
};

window.AdminProductsModule = AdminProductsModule;
