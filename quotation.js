// ===================================================================
// APEX ELECTRO - MODULE: GST QUOTATION ENGINE & BREVO DISPATCH
// ===================================================================

const QuotationModule = {
  generateFromInquiry(inquiryId) {
    const inq = AppState.data.inquiries.find(i => i.id === inquiryId);
    if (!inq) return;

    const nextSeq = AppState.data.quotations.length + 1;
    const quoteId = Formatters.generateQuotationNumber(nextSeq);

    const items = inq.items.map((it, idx) => {
      const unitRate = it.estimatedUnitPrice || 100.00;
      const taxable = unitRate * it.quantity;
      return {
        id: `qi-${Date.now()}-${idx + 1}`,
        productName: it.productName,
        variantName: it.variantName,
        sku: it.sku,
        quantity: it.quantity,
        unit: it.unit,
        unitPrice: unitRate,
        totalPrice: taxable,
        hsnCode: '8536',
        gstRate: 18.0
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstMath = Formatters.calculateGST(subtotal, 9.0, 9.0, 450.00);

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 15);

    const quote = {
      id: quoteId,
      quotationNumber: quoteId,
      inquiryId: inq.id,
      customerName: inq.customer.name,
      companyName: inq.customer.company,
      gstin: inq.customer.gstin,
      email: inq.customer.email,
      phone: inq.customer.mobile,
      deliveryLocation: inq.customer.deliveryLocation,
      date: new Date().toLocaleDateString('en-IN'),
      validUntil: validUntilDate.toLocaleDateString('en-IN'),
      subtotal: gstMath.subtotal,
      cgstRate: gstMath.cgstRate,
      cgstAmount: gstMath.cgstAmount,
      sgstRate: gstMath.sgstRate,
      sgstAmount: gstMath.sgstAmount,
      freightCharges: gstMath.freight,
      grandTotal: gstMath.grandTotal,
      paymentTerms: "100% advance against Proforma Invoice or Net 30 for approved corporate credit.",
      deliveryTimeline: "Immediate ex-stock dispatch within 24-48 business hours via surface logistics.",
      items: items,
      status: 'Issued'
    };

    AppState.data.quotations.unshift(quote);
    inq.status = 'Quoted';
    inq.quotationNumber = quoteId;
    AppState.save();

    DOMUtils.showToast(`Proforma Quotation ${quoteId} generated successfully with GST breakdown!`, 'success');
    DOMUtils.closeModal('adminInquiryDetailModal');
    this.openModal(quote.id);
  },

  openModal(quotationId) {
    const quote = AppState.data.quotations.find(q => q.id === quotationId);
    if (!quote) return;

    AppState.data.activeModalQuotation = quote;
    const modal = document.getElementById('quotationModal');
    const bodyEl = document.getElementById('quotationSheetBody');
    const bp = AppState.data.businessProfile || {};

    bodyEl.innerHTML = `
      <div class="quotation-sheet">
        <!-- Letterhead Header -->
        <div class="quote-header-row">
          <div>
            <h2 class="quote-title">${bp.name}</h2>
            <div style="font-size: 0.8rem; color: #57534e; max-width: 400px; margin-top: 0.25rem;">
              ${bp.tagline}<br>
              <strong>Address:</strong> ${bp.address}<br>
              <strong>GSTIN:</strong> ${bp.gstin} | <strong>Email:</strong> ${bp.email}
            </div>
          </div>
          <div class="quote-num-date">
            <h3 style="font-size: 1.4rem; color: #1c1917; font-weight: 800;">PROFORMA QUOTATION</h3>
            <div style="font-size: 1rem; font-weight: 800; color: #b45309; margin-top: 0.25rem;">${quote.id}</div>
            <div style="color: #78716c; font-size: 0.8rem; margin-top: 0.35rem;">
              Ref Inquiry: <strong>${quote.inquiryId}</strong><br>
              Date: <strong>${quote.date}</strong><br>
              Valid Until: <strong>${quote.validUntil}</strong>
            </div>
          </div>
        </div>

        <!-- Bill To / Deliver To -->
        <div class="quote-parties">
          <div>
            <h4 style="font-size: 0.75rem; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 0.35rem;">Billed To / Customer:</h4>
            <strong style="color: #1c1917; font-size: 0.95rem;">${quote.companyName}</strong>
            <div style="font-size: 0.825rem; color: #44403c; line-height: 1.5;">
              Attn: ${quote.customerName}<br>
              Phone: ${quote.phone} | Email: ${quote.email}<br>
              GSTIN: <strong>${quote.gstin || 'Unregistered'}</strong>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 0.35rem;">Consignee / Delivery Destination:</h4>
            <div style="font-size: 0.825rem; color: #44403c; line-height: 1.5;">
              <strong>Project Site Location:</strong><br>
              ${quote.deliveryLocation || 'Client Designated Depot'}<br>
              Dispatch Mode: Surface Transport / Crane Offloading
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <table class="quote-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description of Industrial Goods</th>
              <th>HSN</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Rate (₹)</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items.map((it, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>
                  <strong>${it.productName}</strong><br>
                  <span style="font-size: 0.75rem; color: #b45309;">${it.variantName}</span> (SKU: ${it.sku})
                </td>
                <td>${it.hsnCode}</td>
                <td style="text-align: center; font-weight: 700;">${it.quantity} ${it.unit}</td>
                <td style="text-align: right; font-family: var(--font-mono);">${Formatters.formatCurrency(it.unitPrice)}</td>
                <td style="text-align: right; font-weight: 800; font-family: var(--font-mono);">${Formatters.formatCurrency(it.totalPrice)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & GST Math Breakdown -->
        <div class="quote-totals-wrap">
          <div class="quote-tot-row">
            <span>Taxable Subtotal:</span>
            <span style="font-family: var(--font-mono); font-weight: 700;">${Formatters.formatCurrency(quote.subtotal)}</span>
          </div>
          <div class="quote-tot-row">
            <span>Freight / Logistics:</span>
            <span style="font-family: var(--font-mono);">${Formatters.formatCurrency(quote.freightCharges)}</span>
          </div>
          <div class="quote-tot-row">
            <span>CGST (9.0%):</span>
            <span style="font-family: var(--font-mono);">${Formatters.formatCurrency(quote.cgstAmount)}</span>
          </div>
          <div class="quote-tot-row">
            <span>SGST (9.0%):</span>
            <span style="font-family: var(--font-mono);">${Formatters.formatCurrency(quote.sgstAmount)}</span>
          </div>
          <div class="quote-tot-row grand">
            <span>Grand Total:</span>
            <span style="color: #1c1917;">${Formatters.formatCurrency(quote.grandTotal)}</span>
          </div>
        </div>

        <!-- Commercial Terms -->
        <div style="background: #fdfaf5; border: 1px solid var(--border-medium); border-radius: 6px; padding: 1rem; font-size: 0.775rem; color: #57534e; line-height: 1.6;">
          <h5 style="color: #1c1917; margin-bottom: 0.35rem; font-size: 0.8rem; font-weight: 800;">Commercial Terms & Conditions:</h5>
          1. <strong>Payment:</strong> ${quote.paymentTerms}.<br>
          2. <strong>Delivery:</strong> ${quote.deliveryTimeline}.<br>
          3. <strong>Warranty:</strong> Manufacturer warranty as per OEM standards.<br>
          4. <strong>Validity:</strong> Prices valid until ${quote.validUntil}. Subject to copper / resin index fluctuations.
        </div>
      </div>
    `;

    DOMUtils.openModal('quotationModal');
  },

  renderAdminTable() {
    const tableBody = document.getElementById('adminQuotationsTableBody');
    if (!tableBody) return;

    if (AppState.data.quotations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-dim);">No quotations generated yet. Select any inquiry to create a formal quotation.</td></tr>`;
      return;
    }

    tableBody.innerHTML = AppState.data.quotations.map(q => `
      <tr>
        <td><strong style="color: #b45309; font-family: var(--font-mono);">${q.id}</strong></td>
        <td><span style="color: #0284c7; font-family: var(--font-mono);">${q.inquiryId}</span></td>
        <td><strong>${q.customerName}</strong><br><span style="font-size: 0.75rem; color: var(--text-muted);">${q.companyName}</span></td>
        <td><strong style="font-family: var(--font-mono); color: var(--text-main);">${Formatters.formatCurrency(q.grandTotal)}</strong></td>
        <td><span class="status-pill quotation-sent">CGST 9% + SGST 9%</span></td>
        <td>${q.date}</td>
        <td>${q.validUntil}</td>
        <td>
          <button class="btn-xs-outline" onclick="app.openQuotationModal('${q.id}')">View & Print PDF →</button>
        </td>
      </tr>
    `).join('');
  },

  sendViaBrevo() {
    const quote = AppState.data.activeModalQuotation;
    if (!quote) {
      DOMUtils.showToast('No active quotation selected.', 'warning');
      return;
    }

    const recipient = quote.email || prompt("Enter client recipient email address for Brevo dispatch:", "client@epccontractor.in");
    if (!recipient) return;

    const sendBtn = document.getElementById('btnSendQuoteBrevo');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<i data-lucide="loader" style="width: 14px; height: 14px; animation: spin 1s linear infinite;"></i> Sending via Brevo...`;
    }

    fetch('/api/send-quotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quotation: quote,
        items: quote.items || [],
        customerEmail: recipient,
        profile: AppState.data.businessProfile
      })
    })
    .then(r => r.json())
    .then(data => {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<i data-lucide="mail" style="width: 16px; height: 16px;"></i> Send Quote via Brevo Email`;
      }
      if (data.success) {
        DOMUtils.showToast(`Proforma Quotation ${quote.id} successfully emailed to ${recipient} via Brevo!`, 'success');
      } else {
        DOMUtils.showToast(`Brevo notice: ${data.message || 'Check BREVO_API_KEY in Vercel settings.'}`, 'info');
      }
      DOMUtils.refreshIcons();
    })
    .catch(() => {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<i data-lucide="mail" style="width: 16px; height: 16px;"></i> Send Quote via Brevo Email`;
      }
      DOMUtils.showToast('Email dispatch service offline. Check BREVO_API_KEY settings.', 'info');
      DOMUtils.refreshIcons();
    });
  }
};

window.QuotationModule = QuotationModule;
