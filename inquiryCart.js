// ===================================================================
// APEX ELECTRO - MODULE: INQUIRY CART & DRAWER
// ===================================================================

const InquiryCartModule = {
  add(productId, variantId, quantity, unit, customNotes = "") {
    const product = AppState.data.products.find(p => p.id === productId);
    if (!product) return;

    const variant = (product.variants || []).find(v => v.id === variantId) || product.variants[0] || {
      id: 'default',
      name: 'Standard Specification',
      sku: product.sku,
      price: product.basePrice || 0
    };

    const existing = AppState.data.inquiryCart.find(
      item => item.productId === productId && item.variantId === variant.id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      AppState.data.inquiryCart.push({
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        sku: variant.sku || product.sku,
        quantity: quantity,
        unit: unit || product.unit || 'Piece',
        estimatedUnitPrice: variant.price || product.basePrice || 0,
        notes: customNotes
      });
    }

    AppState.save();
    this.renderHeaderCount();
    this.renderDrawer();
    DOMUtils.showToast(`Added ${quantity} ${unit || product.unit} of "${product.name}" to Inquiry List.`, 'success');
  },

  renderHeaderCount() {
    const totalItems = AppState.data.inquiryCart.length;
    const badge = document.getElementById('headerInquiryCount');
    if (badge) badge.textContent = totalItems;
  },

  toggleDrawer(open) {
    const overlay = document.getElementById('inquiryDrawerOverlay');
    if (!overlay) return;
    if (open) {
      this.renderDrawer();
      overlay.classList.add('open');
    } else {
      overlay.classList.remove('open');
    }
    DOMUtils.refreshIcons();
  },

  handleOverlayClick(e) {
    if (e.target.id === 'inquiryDrawerOverlay') {
      this.toggleDrawer(false);
    }
  },

  renderDrawer() {
    const listEl = document.getElementById('drawerItemsList');
    const countEl = document.getElementById('drawerCountText');
    const summaryCountEl = document.getElementById('drawerSummaryCount');
    const proceedBtn = document.getElementById('drawerProceedBtn');

    if (!listEl) return;

    const count = AppState.data.inquiryCart.length;
    if (countEl) countEl.textContent = count;
    if (summaryCountEl) summaryCountEl.textContent = `${count} products`;

    if (count === 0) {
      listEl.innerHTML = `
        <div class="inquiry-empty-state">
          <div class="inquiry-empty-icon">
            <i data-lucide="clipboard-x" style="width: 28px; height: 28px;"></i>
          </div>
          <h4 style="color: var(--text-main); margin-bottom: 0.5rem;">Your Inquiry List is Empty</h4>
          <p style="font-size: 0.85rem; line-height: 1.5;">Browse electrical cables, switchgears, or lighting products and add required variants to prepare your consolidated RFQ.</p>
          <button class="btn-secondary" style="margin-top: 1.25rem;" onclick="app.toggleInquiryDrawer(false); app.navigatePublic('catalog');">
            Browse Product Catalog
          </button>
        </div>
      `;
      if (proceedBtn) proceedBtn.disabled = true;
    } else {
      if (proceedBtn) proceedBtn.disabled = false;
      listEl.innerHTML = AppState.data.inquiryCart.map((item, idx) => `
        <div class="inquiry-item-card">
          <div class="inquiry-item-header">
            <div>
              <div class="inquiry-item-title">${item.productName}</div>
              <div class="inquiry-item-variant">${item.variantName}</div>
              <div class="inquiry-item-sku">SKU: ${item.sku}</div>
            </div>
            <button class="btn-remove-inquiry-item" onclick="app.removeInquiryItem(${idx})" title="Remove product">
              <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
          </div>

          <input type="text" class="inquiry-item-note-input" placeholder="Item requirement note (e.g. Red color, 100m drums, test report...)" value="${item.notes || ''}" onchange="app.updateInquiryItemNotes(${idx}, this.value)">

          <div class="inquiry-item-footer">
            <span style="font-size: 0.775rem; color: var(--text-muted);">Required Quantity:</span>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <div class="qty-input-group" style="height: 30px;">
                <button type="button" class="qty-btn" style="width: 24px; height: 28px;" onclick="app.updateInquiryItemQty(${idx}, -1)">-</button>
                <input type="number" class="qty-field" style="width: 48px; font-size: 0.8rem;" value="${item.quantity}" min="1" onchange="app.setInquiryItemQty(${idx}, this.value)">
                <button type="button" class="qty-btn" style="width: 24px; height: 28px;" onclick="app.updateInquiryItemQty(${idx}, 1)">+</button>
              </div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">${item.unit}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    DOMUtils.refreshIcons();
  },

  updateQty(index, delta) {
    if (!AppState.data.inquiryCart[index]) return;
    const current = parseInt(AppState.data.inquiryCart[index].quantity) || 1;
    AppState.data.inquiryCart[index].quantity = Math.max(1, current + delta);
    AppState.save();
    this.renderDrawer();
    this.renderHeaderCount();
  },

  setQty(index, val) {
    if (!AppState.data.inquiryCart[index]) return;
    AppState.data.inquiryCart[index].quantity = Math.max(1, parseInt(val) || 1);
    AppState.save();
    this.renderDrawer();
    this.renderHeaderCount();
  },

  updateNotes(index, note) {
    if (!AppState.data.inquiryCart[index]) return;
    AppState.data.inquiryCart[index].notes = note;
    AppState.save();
  },

  remove(index) {
    AppState.data.inquiryCart.splice(index, 1);
    AppState.save();
    this.renderHeaderCount();
    this.renderDrawer();
    DOMUtils.showToast('Item removed from inquiry list.', 'info');
  }
};

window.InquiryCartModule = InquiryCartModule;
