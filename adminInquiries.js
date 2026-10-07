// ===================================================================
// APEX ELECTRO - MODULE: ADMIN INQUIRIES & RFQ STATUS PIPELINE
// ===================================================================

const AdminInquiriesModule = {
  renderTable() {
    const tableBody = document.getElementById('adminInquiriesTableBody');
    if (!tableBody) return;

    if (AppState.data.inquiries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-dim);">No inquiries recorded yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = AppState.data.inquiries.map(inq => {
      const itemsCount = (inq.items || []).length;
      return `
        <tr>
          <td><strong style="color: #b45309; font-family: var(--font-mono);">${inq.id}</strong></td>
          <td>
            <strong>${inq.customer.name}</strong><br>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${inq.customer.company}</span>
          </td>
          <td><span style="font-size: 0.8rem;">${inq.customer.mobile}</span></td>
          <td><span style="font-weight: 700;">${itemsCount} products</span></td>
          <td><span class="status-pill ${this.getStatusClass(inq.status)}">${inq.status}</span></td>
          <td><span style="font-size: 0.75rem; color: var(--text-dim);">${Formatters.formatDate(inq.submittedAt)}</span></td>
          <td>
            <button class="btn-xs-outline" onclick="app.openAdminInquiryDetail('${inq.id}')">View Details & Quote →</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  getStatusClass(status) {
    if (status === 'New') return 'new';
    if (status === 'Under Review') return 'under-review';
    if (status === 'Quoted') return 'quotation-sent';
    if (status === 'Approved') return 'approved';
    return 'rejected';
  },

  openDetailModal(inquiryId) {
    const inq = AppState.data.inquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    AppState.data.activeAdminInquiry = inq;
    const modal = document.getElementById('adminInquiryDetailModal');
    const titleEl = document.getElementById('adminInquiryModalTitle');
    const bodyEl = document.getElementById('adminInquiryModalBody');

    if (titleEl) titleEl.textContent = `Inquiry Details: ${inq.id} — ${inq.customer.company}`;

    bodyEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; background: #ffffff; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 800;">Client & Project Contact</div>
          <h4 style="font-size: 1.15rem; color: var(--text-main); margin-top: 0.25rem;">${inq.customer.name}</h4>
          <div style="font-size: 0.825rem; color: #57534e; margin-top: 0.35rem; line-height: 1.5;">
            Company: <strong>${inq.customer.company}</strong> | Role: ${inq.customer.designation}<br>
            Phone: <strong>${inq.customer.mobile}</strong> | Email: <strong>${inq.customer.email}</strong><br>
            GSTIN: <strong>${inq.customer.gstin || 'Unregistered'}</strong>
          </div>
        </div>

        <div style="text-align: right;">
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Manage Status:</label>
          <select class="form-control" style="font-size: 0.8rem; font-weight: 700;" onchange="app.updateInquiryStatus('${inq.id}', this.value)">
            <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Under Review" ${inq.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option value="Quoted" ${inq.status === 'Quoted' ? 'selected' : ''}>Quoted</option>
            <option value="Approved" ${inq.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Rejected" ${inq.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
      </div>

      <!-- Line Items List -->
      <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">Requested Items (${(inq.items || []).length}):</h4>
      <div style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.5rem;">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Item & Variant</th>
              <th>SKU</th>
              <th>Required Qty</th>
              <th>Estimated Net Rate</th>
              <th>Item Note</th>
            </tr>
          </thead>
          <tbody>
            ${(inq.items || []).map(it => `
              <tr>
                <td><strong>${it.productName}</strong><br><span style="color: #b45309; font-size: 0.75rem; font-weight: 700;">${it.variantName}</span></td>
                <td><span style="font-family: var(--font-mono); font-size: 0.75rem;">${it.sku}</span></td>
                <td><strong style="font-family: var(--font-mono); font-size: 0.9rem;">${it.quantity}</strong> ${it.unit}</td>
                <td>${Formatters.formatCurrency(it.estimatedUnitPrice)}</td>
                <td><span style="font-size: 0.75rem; color: var(--text-dim);">${it.notes || '—'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button class="btn-secondary" onclick="app.closeModal('adminInquiryDetailModal')">Close</button>
        <button class="btn-primary" onclick="app.generateQuotationFromInquiry('${inq.id}')">
          <i data-lucide="file-plus" style="width: 16px; height: 16px;"></i>
          Generate Formal GST Quotation
        </button>
      </div>
    `;

    DOMUtils.openModal('adminInquiryDetailModal');
  },

  updateStatus(inquiryId, newStatus) {
    const inq = AppState.data.inquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    inq.status = newStatus;
    AppState.save();
    this.renderTable();
    DOMUtils.showToast(`Inquiry ${inquiryId} status updated to "${newStatus}".`, 'info');
  }
};

window.AdminInquiriesModule = AdminInquiriesModule;
