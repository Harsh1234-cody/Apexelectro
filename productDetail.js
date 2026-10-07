// ===================================================================
// APEX ELECTRO - MODULE: PRODUCT DETAIL MODAL & SPECS
// ===================================================================

const ProductDetailModule = {
  open(productId) {
    const product = AppState.data.products.find(p => p.id === productId);
    if (!product) return;

    AppState.data.activeModalProduct = product;
    const modal = document.getElementById('productDetailModal');
    const titleEl = document.getElementById('modalProductTitle');
    const bodyEl = document.getElementById('modalProductBody');

    if (titleEl) titleEl.textContent = product.name;

    const variants = product.variants || [];
    const primaryVar = variants[0] || {};
    const stockStatus = this.calculateStockStatus(primaryVar.stock || 0, primaryVar.reorderLevel || 10);
    const images = product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80'];

    bodyEl.innerHTML = `
      <div class="product-detail-grid">
        <!-- Gallery -->
        <div class="pdetail-gallery">
          <img src="${images[0]}" alt="${product.name}" class="pdetail-main-img" id="modalMainImg">
          <div class="pdetail-thumbs">
            ${images.map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i+1}" class="pdetail-thumb ${i === 0 ? 'active' : ''}" onclick="app.switchModalImage('${img}', this)">
            `).join('')}
          </div>

          ${product.bulkPricing ? `
            <div style="background: #fdfaf5; border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
              <h5 style="color: #b45309; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">
                Wholesale Volume Price Slabs:
              </h5>
              <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse;">
                <thead>
                  <tr style="text-align: left; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                    <th style="padding: 4px 0;">Tier / Slab</th>
                    <th style="padding: 4px 0; text-align: right;">B2B Net Rate</th>
                  </tr>
                </thead>
                <tbody>
                  ${product.bulkPricing.map(tier => `
                    <tr style="border-bottom: 1px solid var(--border-subtle);">
                      <td style="padding: 4px 0;">${tier.minQty}${tier.maxQty ? ` - ${tier.maxQty}` : '+'} ${tier.unit}s</td>
                      <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #b45309; font-family: var(--font-mono);">${Formatters.formatCurrency(tier.price)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>

        <!-- Info & Config -->
        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span class="badge-brand">${product.brandName}</span>
            <span class="cat-subchip">${product.categoryName} • ${product.subcategory || ''}</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.85rem;">
            Model: ${product.modelNumber || 'N/A'} | MPN: ${product.manufacturerPartNumber || 'N/A'}
          </div>

          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
            ${product.fullDescription || product.shortDescription}
          </p>

          <!-- Interactive Variant Chooser -->
          <div style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
            <label class="form-label" style="margin-bottom: 0.5rem; display: block;">Select Specification Variant / Size:</label>
            <select id="modalVariantSelect" class="form-control" onchange="app.handleModalVariantChange(this.value)">
              ${variants.map((v, i) => `
                <option value="${v.id}" ${i === 0 ? 'selected' : ''}>${v.name} (SKU: ${v.sku})</option>
              `).join('')}
            </select>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Unit Rate:</span>
                <span id="modalPriceDisplay" style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); font-family: var(--font-mono);">
                  ${product.showPrice && product.pricingType !== 'Price on Request' ? `${Formatters.formatCurrency(primaryVar.price || product.basePrice)} <span style="font-size: 0.85rem; font-weight: 500; font-family: var(--font-sans); color: var(--text-muted);">/ ${product.unit}</span>` : '<span style="color: #0284c7; font-size: 1.15rem;">Price on Request</span>'}
                </span>
              </div>
              <div id="modalStockStatusDisplay">
                <span class="badge-stock ${stockStatus.class}">${stockStatus.label}</span>
              </div>
            </div>

            <!-- Qty Stepper & Add -->
            <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; align-items: center;">
              <div class="qty-input-group" style="height: 44px;">
                <button type="button" class="qty-btn" style="width: 32px;" onclick="app.adjustModalQty(this, -1)">-</button>
                <input type="number" id="modalQtyInput" class="qty-field" value="10" min="1" style="width: 50px;">
                <button type="button" class="qty-btn" style="width: 32px;" onclick="app.adjustModalQty(this, 1)">+</button>
              </div>
              <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">${product.unit}s</span>

              <button class="btn-primary" style="flex: 1; justify-content: center; height: 44px;" onclick="app.addModalToInquiry()">
                <i data-lucide="clipboard-plus" style="width: 18px; height: 18px;"></i>
                Add to Inquiry List
              </button>
            </div>
          </div>

          <!-- Dynamic Specifications Table -->
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="list-tree" style="width: 16px; height: 16px; color: #b45309;"></i>
            Dynamic Technical Specifications
          </h4>
          <table class="specs-table">
            <tbody>
              ${(product.specifications || []).map(s => `
                <tr>
                  <th>${s.name}</th>
                  <td>${s.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    DOMUtils.openModal('productDetailModal');
  },

  calculateStockStatus(qty, reorderLevel = 10) {
    if (qty <= 0) return { label: '● Out of Stock', class: 'out-of-stock' };
    if (qty <= reorderLevel) return { label: `● Low Stock (${qty})`, class: 'low-stock' };
    return { label: `● Available (${qty})`, class: 'in-stock' };
  },

  switchImage(imgUrl, thumbEl) {
    const main = document.getElementById('modalMainImg');
    if (main) main.src = imgUrl;
    document.querySelectorAll('.pdetail-thumb').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
  },

  handleVariantChange(variantId) {
    const product = AppState.data.activeModalProduct;
    if (!product) return;
    const variant = (product.variants || []).find(v => v.id === variantId);
    if (!variant) return;

    const priceEl = document.getElementById('modalPriceDisplay');
    if (priceEl) {
      if (!product.showPrice || product.pricingType === 'Price on Request') {
        priceEl.innerHTML = '<span style="color: #0284c7; font-size: 1.15rem;">Price on Request</span>';
      } else {
        priceEl.innerHTML = `${Formatters.formatCurrency(variant.price)} <span style="font-size: 0.85rem; font-weight: 500; font-family: var(--font-sans); color: var(--text-muted);">/ ${product.unit}</span>`;
      }
    }

    const stockEl = document.getElementById('modalStockStatusDisplay');
    if (stockEl) {
      const stockStatus = this.calculateStockStatus(variant.stock, variant.reorderLevel);
      stockEl.innerHTML = `<span class="badge-stock ${stockStatus.class}">${stockStatus.label}</span>`;
    }
  }
};

window.ProductDetailModule = ProductDetailModule;
