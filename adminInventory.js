// ===================================================================
// APEX ELECTRO - MODULE: ADMIN INVENTORY & STOCK AUDIT LEDGER
// ===================================================================

const AdminInventoryModule = {
  render() {
    const invTable = document.getElementById('adminInventoryTableBody');
    if (!invTable) return;

    const rows = [];
    AppState.data.products.forEach(p => {
      (p.variants || []).forEach(v => {
        const available = v.stock || 0;
        const status = ProductDetailModule.calculateStockStatus(available, v.reorderLevel || 10);
        rows.push({
          product: p,
          variant: v,
          available: available,
          status: status
        });
      });
    });

    invTable.innerHTML = rows.map(r => `
      <tr>
        <td><strong>${r.product.name}</strong></td>
        <td><span style="color: #b45309; font-weight: 700;">${r.variant.name}</span></td>
        <td style="font-family: var(--font-mono); font-size: 0.75rem;">${r.variant.sku}</td>
        <td><strong style="font-family: var(--font-mono);">${r.variant.stock}</strong> ${r.product.unit}</td>
        <td>0</td>
        <td><strong style="color: var(--text-main); font-family: var(--font-mono);">${r.available}</strong></td>
        <td>${r.variant.reorderLevel || 10}</td>
        <td><span class="badge-stock ${r.status.class}">${r.status.label}</span></td>
        <td>
          <button class="btn-xs-outline" onclick="app.openStockModalForSku('${r.variant.sku}')">+ Adjust Stock</button>
        </td>
      </tr>
    `).join('');

    // Stock Audit Ledger History
    const auditTable = document.getElementById('adminStockAuditTableBody');
    if (auditTable) {
      if (AppState.data.stockAdjustments.length === 0) {
        auditTable.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No stock adjustment records yet.</td></tr>`;
      } else {
        auditTable.innerHTML = AppState.data.stockAdjustments.map(adj => `
          <tr>
            <td style="font-size: 0.75rem; color: var(--text-dim);">${Formatters.formatDate(adj.timestamp)}</td>
            <td><strong>${adj.productName}</strong><br><span style="font-size: 0.75rem; color: #b45309; font-weight: 700;">${adj.variantName}</span></td>
            <td style="font-family: var(--font-mono); font-size: 0.75rem;">${adj.sku}</td>
            <td>${adj.previousStock}</td>
            <td><strong style="color: ${String(adj.difference).startsWith('+') ? '#059669' : '#dc2626'};">${adj.difference}</strong></td>
            <td><strong>${adj.newStock}</strong></td>
            <td style="font-size: 0.8rem; color: var(--text-main);">${adj.reason}</td>
            <td style="font-size: 0.75rem; color: var(--text-muted);">${adj.adminName || 'Admin'}</td>
          </tr>
        `).join('');
      }
    }
  },

  openStockModalForSku(presetSku) {
    const modal = document.getElementById('adminStockModal');
    const select = document.getElementById('stkSelectVariant');
    if (!select) return;

    const options = [];
    AppState.data.products.forEach(p => {
      (p.variants || []).forEach(v => {
        options.push({
          sku: v.sku,
          label: `${p.name} — ${v.name} (Current: ${v.stock} ${p.unit})`
        });
      });
    });

    select.innerHTML = options.map(o => `
      <option value="${o.sku}" ${presetSku === o.sku ? 'selected' : ''}>${o.label}</option>
    `).join('');

    this.handleVariantChange(presetSku || select.value);
    DOMUtils.openModal('adminStockModal');
  },

  handleVariantChange(sku) {
    let foundVar = null;
    let foundProd = null;

    for (const p of AppState.data.products) {
      const v = (p.variants || []).find(x => x.sku === sku);
      if (v) {
        foundVar = v;
        foundProd = p;
        break;
      }
    }

    const display = document.getElementById('stkCurrentStockDisplay');
    if (display && foundVar) {
      display.value = `${foundVar.stock} ${foundProd.unit}`;
    }
  },

  handleAdjustmentSubmit(event) {
    event.preventDefault();

    const sku = document.getElementById('stkSelectVariant').value;
    const type = document.getElementById('stkAdjustmentType').value; // 'ADD', 'SUBTRACT', 'SET'
    const qty = parseInt(document.getElementById('stkAdjustmentQuantity').value) || 0;
    const reason = document.getElementById('stkReason').value;

    let targetVar = null;
    let targetProd = null;

    for (const p of AppState.data.products) {
      const v = (p.variants || []).find(x => x.sku === sku);
      if (v) {
        targetVar = v;
        targetProd = p;
        break;
      }
    }

    if (!targetVar) return;

    const prevStock = targetVar.stock;
    let newStock = prevStock;
    let diff = 0;

    if (type === 'ADD') {
      newStock = prevStock + qty;
      diff = `+${qty}`;
    } else if (type === 'SUBTRACT') {
      newStock = Math.max(0, prevStock - qty);
      diff = `-${qty}`;
    } else if (type === 'SET') {
      newStock = qty;
      diff = qty >= prevStock ? `+${qty - prevStock}` : `-${prevStock - qty}`;
    }

    targetVar.stock = newStock;

    // Log to Stock Audit Ledger
    AppState.data.stockAdjustments.unshift({
      id: `adj-${Date.now()}`,
      timestamp: new Date().toISOString(),
      productId: targetProd.id,
      productName: targetProd.name,
      variantName: targetVar.name,
      sku: targetVar.sku,
      previousStock: prevStock,
      difference: diff,
      newStock: newStock,
      reason: reason,
      adminName: (AppState.data.adminCredentials && AppState.data.adminCredentials.name) ? `${AppState.data.adminCredentials.name} (Store Admin)` : "Harsh (Store Admin)"
    });

    AppState.save();
    DOMUtils.closeModal('adminStockModal');
    this.render();
    CatalogModule.renderCatalog();
    DOMUtils.showToast(`Stock updated for ${targetVar.sku}: ${prevStock} → ${newStock} units.`, 'success');
  }
};

window.AdminInventoryModule = AdminInventoryModule;
