// ===================================================================
// APEX ELECTRO - MODULE: PUBLIC CATALOG & PRODUCT DISPLAY
// ===================================================================

const CatalogModule = {
  renderHome() {
    this.renderHomeCategories();
    this.renderHomeFeatured();
    DOMUtils.refreshIcons();
  },

  renderHomeCategories() {
    const grid = document.getElementById('homeCategoryGrid');
    if (!grid) return;

    grid.innerHTML = AppState.data.categories.map(cat => `
      <div class="category-card" onclick="app.filterByCategory('${cat.id}')">
        <div class="cat-icon-wrap">
          <i data-lucide="${cat.icon || 'zap'}" style="width: 24px; height: 24px;"></i>
        </div>
        <h3>${cat.name}</h3>
        <p>${cat.description || ''}</p>
        <div class="cat-subchips">
          ${(cat.subcategories || []).slice(0, 4).map(sub => `
            <span class="cat-subchip">${sub}</span>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  renderHomeFeatured() {
    const grid = document.getElementById('homeFeaturedProductsGrid') || document.getElementById('homeFeaturedGrid');
    if (!grid) return;

    const featured = AppState.data.products.filter(p => p.isFeatured && (!p.status || p.status === 'Active' || p.status === 'active'));
    const toShow = featured.length > 0 ? featured : AppState.data.products;
    grid.innerHTML = toShow.slice(0, 8).map(p => this.renderProductCardHtml(p)).join('');
  },

  renderBrands() {
    const strip = document.getElementById('heroBrandsPillList') || document.getElementById('brandsStripList');
    if (strip) {
      strip.innerHTML = AppState.data.brands.map(b => {
        const prodCount = AppState.data.products.filter(p => p.brandId === b.id).length || b.productCount || 0;
        return `
          <div class="brand-chip ${AppState.data.selectedBrandFilters && AppState.data.selectedBrandFilters.has(b.id) ? 'active' : ''}" onclick="app.toggleBrandFilter('${b.id}')">
            <span>${b.name}</span>
            <span style="font-size: 0.65rem; color: #a8a29e;">(${prodCount})</span>
          </div>
        `;
      }).join('');
    }

    const grid = document.getElementById('brandsDirectoryGrid') || document.getElementById('brandsGridAll');
    if (grid) {
      const originFlags = {
        'India': '🇮🇳 India',
        'France': '🇫🇷 France',
        'France / Global': '🇫🇷 France',
        'Germany': '🇩🇪 Germany',
        'Switzerland': '🇨🇭 Switzerland',
        'Japan / India': '🇯🇵 Japan'
      };

      grid.innerHTML = AppState.data.brands.map(b => {
        const prodCount = AppState.data.products.filter(p => p.brandId === b.id).length || b.productCount || 0;
        const initials = b.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        const originLabel = originFlags[b.origin] || `🌐 ${b.origin}`;

        return `
          <div class="brand-card" onclick="app.filterByBrandOnly('${b.id}')">
            <div>
              <div class="brand-card-header">
                <div class="brand-logo-badge" title="${b.name}">
                  ${initials}
                </div>
                <div class="brand-meta-pills">
                  <span class="badge-oem-tag">● Certified Partner</span>
                  <span class="badge-origin-tag">${originLabel}</span>
                </div>
              </div>
              <h3 class="brand-title">${b.name}</h3>
              <p class="brand-desc">${b.description || 'Authorized industrial electrical equipment & components manufacturer.'}</p>
            </div>
            <div class="brand-card-footer">
              <span class="brand-count-hint">
                <i data-lucide="package-check" style="width: 15px; height: 15px;"></i>
                ${prodCount} Certified Products
              </span>
              <span class="brand-cta-btn">
                Browse Products →
              </span>
            </div>
          </div>
        `;
      }).join('');
    }
    DOMUtils.refreshIcons();
  },

  renderCatalog() {
    this.renderCategoryFilterSidebar();
    this.renderBrandFilterSidebar();
    this.renderProductList();
    DOMUtils.refreshIcons();
  },

  renderCategoryFilterSidebar() {
    const list = document.getElementById('filterCategoryList') || document.getElementById('catalogCategoryFilterList');
    if (!list) return;

    const current = AppState.data.selectedCategoryFilter;
    list.innerHTML = `
      <label class="filter-checkbox-label">
        <input type="radio" name="catFilter" value="ALL" ${current === 'ALL' ? 'checked' : ''} onchange="app.filterByCategory('ALL')">
        <span>All Categories (${AppState.data.products.length})</span>
      </label>
      ${AppState.data.categories.map(c => {
        const count = AppState.data.products.filter(p => p.categoryId === c.id).length;
        return `
          <label class="filter-checkbox-label">
            <input type="radio" name="catFilter" value="${c.id}" ${current === c.id ? 'checked' : ''} onchange="app.filterByCategory('${c.id}')">
            <span>${c.name} (${count})</span>
          </label>
        `;
      }).join('')}
    `;
  },

  renderBrandFilterSidebar() {
    const list = document.getElementById('filterBrandList') || document.getElementById('catalogBrandFilterList');
    if (!list) return;

    list.innerHTML = AppState.data.brands.map(b => {
      const isChecked = AppState.data.selectedBrandFilters && AppState.data.selectedBrandFilters.has(b.id);
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" value="${b.id}" ${isChecked ? 'checked' : ''} onchange="app.toggleBrandFilter('${b.id}')">
          <span>${b.name}</span>
        </label>
      `;
    }).join('');
  },

  getFilteredProducts() {
    let prods = AppState.data.products.filter(p => !p.status || p.status === 'Active' || p.status === 'active');

    // Category Filter
    if (AppState.data.selectedCategoryFilter && AppState.data.selectedCategoryFilter !== 'ALL') {
      prods = prods.filter(p => p.categoryId === AppState.data.selectedCategoryFilter);
    }

    // Brand Filter
    if (AppState.data.selectedBrandFilters && AppState.data.selectedBrandFilters.size > 0) {
      prods = prods.filter(p => AppState.data.selectedBrandFilters.has(p.brandId));
    }

    // Checkboxes filter: In Stock Only
    const inStockOnly = document.getElementById('filterInStockOnly');
    if (inStockOnly && inStockOnly.checked) {
      prods = prods.filter(p => {
        const totalStock = (p.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0);
        return totalStock > 0;
      });
    }

    // Checkboxes filter: Price Displayed
    const priceVisibleOnly = document.getElementById('filterPriceVisibleOnly');
    if (priceVisibleOnly && priceVisibleOnly.checked) {
      prods = prods.filter(p => p.showPrice && p.pricingType !== 'Price on Request');
    }

    // Checkboxes filter: Price on Request (RFQ)
    const priceOnRequestOnly = document.getElementById('filterPriceOnRequestOnly');
    if (priceOnRequestOnly && priceOnRequestOnly.checked) {
      prods = prods.filter(p => !p.showPrice || p.pricingType === 'Price on Request');
    }

    // Sorting
    const sort = AppState.data.selectedSort;
    if (sort === 'price-low' || sort === 'price-asc') {
      prods.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
    } else if (sort === 'price-high' || sort === 'price-desc') {
      prods.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
    } else if (sort === 'name' || sort === 'name-asc') {
      prods.sort((a, b) => a.name.localeCompare(b.name));
    }

    return prods;
  },

  renderProductList() {
    const grid = document.getElementById('catalogProductsGrid');
    const countEl = document.getElementById('catalogResultsCount');
    if (!grid) return;

    const prods = this.getFilteredProducts();
    if (countEl) countEl.textContent = prods.length;

    if (prods.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <i data-lucide="package-x" style="width: 48px; height: 48px; color: var(--text-dim); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--text-main);">No Products Match Selection</h3>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Try resetting your category or brand filters to view available industrial stock.</p>
          <button class="btn-secondary" style="margin-top: 1.25rem;" onclick="app.clearAllFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = prods.map(p => this.renderProductCardHtml(p)).join('');
  },

  renderProductCardHtml(product) {
    const variants = product.variants || [];
    const activeVar = variants[0] || null;
    const priceDisplay = (product.showPrice && product.basePrice > 0)
      ? `<div class="price-main">${Formatters.formatCurrency(activeVar ? activeVar.price : product.basePrice)} <span>/ ${product.unit}</span></div>`
      : `<div class="price-por"><i data-lucide="help-circle" style="width: 14px; height: 14px;"></i> Price on Request</div>`;

    const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    let stockBadge = `<span class="badge-stock in-stock">● In Stock (${totalStock})</span>`;
    if (totalStock === 0) {
      stockBadge = `<span class="badge-stock out-of-stock">● Out of Stock</span>`;
    } else if (totalStock < 100) {
      stockBadge = `<span class="badge-stock low-stock">● Low Stock (${totalStock})</span>`;
    }

    const img = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80';

    return `
      <div class="product-card" id="card-${product.id}">
        <div class="prod-card-media" onclick="app.openProductModal('${product.id}')">
          <img src="${img}" alt="${product.name}" class="prod-card-img" loading="lazy">
          <div class="prod-card-badges">
            <span class="badge-brand">${product.brandName}</span>
            ${stockBadge}
          </div>
        </div>

        <div class="prod-card-body">
          <span class="prod-category-tag">${product.categoryName}</span>
          <h3 class="prod-title" onclick="app.openProductModal('${product.id}')">${product.name}</h3>
          <div class="prod-sku-code" id="sku-display-${product.id}">SKU: ${activeVar ? activeVar.sku : product.sku}</div>

          ${variants.length > 0 ? `
            <div class="card-variant-section">
              <div class="variant-label">
                <span>Select Specification Variant:</span>
                <span id="stock-hint-${product.id}" style="color: #b45309; font-weight: 700;">${activeVar ? activeVar.stock : 0} ${product.unit}</span>
              </div>
              <select class="variant-select" id="var-select-${product.id}" onchange="app.handleCardVariantChange(this, '${product.id}', this.value)">
                ${variants.map(v => `
                  <option value="${v.id}" data-price="${v.price}" data-sku="${v.sku}" data-stock="${v.stock}">
                    ${v.name} - ${v.sku}
                  </option>
                `).join('')}
              </select>
            </div>
          ` : ''}

          <div class="card-pricing-row">
            <div class="price-box" id="price-box-${product.id}">
              ${priceDisplay}
            </div>
            ${product.bulkPricing ? `<span class="slab-indicator">Slab Tier Discount</span>` : ''}
          </div>

          <div class="card-actions-row">
            <div class="qty-input-group">
              <button type="button" class="qty-btn" onclick="app.adjustCardQty(this, -1)">-</button>
              <input type="number" class="qty-field" id="qty-input-${product.id}" value="10" min="1">
              <button type="button" class="qty-btn" onclick="app.adjustCardQty(this, 1)">+</button>
            </div>
            <button class="btn-add-inquiry" onclick="app.addCardToInquiry(this, '${product.id}')">
              <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
              Add to RFQ
            </button>
          </div>

          <button class="btn-quick-view" onclick="app.openProductModal('${product.id}')">
            View Full Technical Specifications →
          </button>
        </div>
      </div>
    `;
  },

  handleLiveSearch(query) {
    const dd = document.getElementById('quickSearchDropdown');
    if (!dd) return;

    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      dd.classList.remove('open');
      return;
    }

    const matches = AppState.data.products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.variants && p.variants.some(v => v.name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q)))
    ).slice(0, 7);

    if (matches.length === 0) {
      dd.innerHTML = `<div style="padding: 1rem; color: var(--text-dim); text-align: center; font-size: 0.8rem;">No products match "${query}"</div>`;
    } else {
      dd.innerHTML = matches.map(p => `
        <div class="search-result-item" onclick="app.selectSearchProduct('${p.id}')">
          <div>
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.85rem;">${p.name}</div>
            <div style="font-size: 0.725rem; color: #b45309;">${p.brandName} • SKU: ${p.sku}</div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${p.unit}</span>
        </div>
      `).join('');
    }

    dd.classList.add('open');
  }
};

window.CatalogModule = CatalogModule;
