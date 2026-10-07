// ===================================================================
// APEX ELECTRO - MODULE: INQUIRY SUBMISSION (SUPABASE & BREVO SYNC)
// ===================================================================

const InquirySubmitModule = {
  openModal() {
    if (AppState.data.inquiryCart.length === 0) {
      DOMUtils.showToast('Please add at least one product to your inquiry list.', 'warning');
      return;
    }

    InquiryCartModule.toggleDrawer(false);
    const countEl = document.getElementById('inqFormItemsCount');
    const summaryEl = document.getElementById('inqFormItemsSummary');

    if (countEl) countEl.textContent = AppState.data.inquiryCart.length;

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="background: #ffffff; border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 0.85rem; max-height: 180px; overflow-y: auto;">
          <table style="width: 100%; font-size: 0.775rem; border-collapse: collapse;">
            <tbody>
              ${AppState.data.inquiryCart.map(item => `
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 0.4rem 0;">
                    <strong style="color: var(--text-main);">${item.productName}</strong><br>
                    <span style="color: #b45309; font-weight: 700;">${item.variantName}</span> (SKU: ${item.sku})
                    ${item.notes ? `<div style="font-style: italic; color: var(--text-dim); font-size: 0.7rem;">Note: ${item.notes}</div>` : ''}
                  </td>
                  <td style="text-align: right; font-weight: 800; color: var(--text-main); font-family: var(--font-mono); white-space: nowrap; padding-left: 1rem;">
                    ${item.quantity} ${item.unit}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    DOMUtils.openModal('inquirySubmitModal');
  },

  handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('inqFullName').value.trim();
    const mobile = document.getElementById('inqMobile').value.trim();
    const email = document.getElementById('inqEmail').value.trim();
    const company = document.getElementById('inqCompany').value.trim() || 'Direct Client';
    const designation = document.getElementById('inqDesignation').value.trim() || 'Procurement';
    const gstin = document.getElementById('inqGst').value.trim() || 'N/A';
    const deliveryDate = document.getElementById('inqDeliveryDate').value || 'Immediate';
    const billingAddress = document.getElementById('inqBillingAddress').value.trim() || 'Same as site address';
    const deliveryLocation = document.getElementById('inqDeliveryLocation').value.trim() || 'Customer Site';
    const message = document.getElementById('inqMessage').value.trim();

    const nextSeq = AppState.data.inquiries.length + 1;
    const newInquiryId = Formatters.generateInquiryNumber(nextSeq);

    const newInquiry = {
      id: newInquiryId,
      customer: {
        name,
        mobile,
        email,
        company,
        designation,
        gstin,
        billingAddress,
        deliveryLocation,
        preferredDeliveryDate: deliveryDate
      },
      items: JSON.parse(JSON.stringify(AppState.data.inquiryCart)),
      additionalMessage: message,
      status: 'New',
      quotationNumber: null,
      submittedAt: new Date().toISOString(),
      adminNotes: "Automated submission via public portal. Awaiting technical sales review."
    };

    AppState.data.inquiries.unshift(newInquiry);
    AppState.data.inquiryCart = [];
    AppState.save();

    InquiryCartModule.renderHeaderCount();
    DOMUtils.closeModal('inquirySubmitModal');
    this.openSuccessModal(newInquiry);

    // Asynchronous backend dispatch to Supabase & Brevo Mail System (Vercel Serverless)
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inquiry: {
          id: newInquiryId,
          inquiryNumber: newInquiryId,
          customerName: name,
          contactPerson: name,
          companyName: company,
          gstin: gstin,
          email: email,
          phone: mobile,
          deliveryPincode: deliveryLocation,
          projectType: designation,
          notes: message
        },
        items: newInquiry.items
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.success) {
        if (data.brevo && data.brevo.customerEmail && data.brevo.customerEmail.sent) {
          DOMUtils.showToast(`Transactional confirmation dispatched to ${email} via Brevo!`, 'success');
        }
      }
    })
    .catch(() => {
      console.log('API /api/inquiry note: running in local offline mode or serverless endpoint pending.');
    });
  },

  openSuccessModal(inquiry) {
    const modal = document.getElementById('inquirySuccessModal');
    const bodyEl = document.getElementById('inquirySuccessBody');
    AppState.data.lastSubmittedInquiry = inquiry;

    const bp = AppState.data.businessProfile || {};

    bodyEl.innerHTML = `
      <div class="success-banner">
        <div style="font-size: 0.85rem; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800;">RFQ Submission Confirmed</div>
        <h3 style="font-size: 1.5rem; color: var(--text-main); margin-top: 0.25rem;">Your Multi-Product Inquiry Has Been Dispatched</h3>
        <div class="inquiry-token-box">${inquiry.id}</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 540px; margin: 0 auto;">
          Our technical commercial team at <strong>${bp.name || 'Apex Electro'}</strong> will review inventory availability and dispatch your formal GST quotation within 2 hours.
        </p>
      </div>

      <!-- Simulated Automated Email Previews -->
      <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-medium); margin-bottom: 1rem;">
        <button type="button" class="btn-xs-outline" id="btnTabEmailCustomer" style="background: #fef3c7; color: #92400e; border-color: #d97706;" onclick="app.switchSuccessEmailTab('customer')">
          📧 Customer Confirmation Email (Simulated)
        </button>
        <button type="button" class="btn-xs-outline" id="btnTabEmailAdmin" onclick="app.switchSuccessEmailTab('admin')">
          🔔 Vendor Admin Alert Notification (Simulated)
        </button>
      </div>

      <!-- Tab Content: Customer Email -->
      <div id="emailViewCustomer" class="email-preview-box">
        <div class="email-meta-header">
          <div><strong>From:</strong> ${bp.name} &lt;${bp.email}&gt;</div>
          <div><strong>To:</strong> ${inquiry.customer.name} &lt;${inquiry.customer.email}&gt;</div>
          <div><strong>Subject:</strong> RFQ Acknowledgment: ${inquiry.id} - ${bp.name}</div>
        </div>
        <p style="margin-bottom: 0.75rem;">Dear <strong>${inquiry.customer.name}</strong> (${inquiry.customer.company}),</p>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 1rem;">
          Thank you for your inquiry. Your B2B electrical requirement has been recorded under reference <strong>${inquiry.id}</strong>. Our dispatch and sales department is reviewing factory stock and will send you an official tax quotation shortly.
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-bottom: 1rem;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 6px;">Product</th>
              <th style="padding: 6px; text-align: right;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${inquiry.items.map(it => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px;">${it.productName} (${it.variantName})</td>
                <td style="padding: 6px; text-align: right; font-weight: 700;">${it.quantity} ${it.unit}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Tab Content: Admin Email -->
      <div id="emailViewAdmin" class="email-preview-box" style="display: none;">
        <div class="email-meta-header">
          <div><strong>To:</strong> Store Dispatch & Sales Desk &lt;${bp.email}&gt;</div>
          <div><strong>Alert:</strong> New RFQ Received from ${inquiry.customer.company}</div>
          <div><strong>Priority:</strong> Normal Commercial Inquiry</div>
        </div>
        <p style="font-size: 0.85rem; margin-bottom: 0.5rem;">
          <strong>Client:</strong> ${inquiry.customer.name} (${inquiry.customer.mobile})<br>
          <strong>Company:</strong> ${inquiry.customer.company} | GSTIN: ${inquiry.customer.gstin}<br>
          <strong>Delivery Location:</strong> ${inquiry.customer.deliveryLocation}
        </p>
      </div>
    `;

    DOMUtils.openModal('inquirySuccessModal');
  },

  switchEmailTab(tab) {
    const custView = document.getElementById('emailViewCustomer');
    const admView = document.getElementById('emailViewAdmin');
    const btnCust = document.getElementById('btnTabEmailCustomer');
    const btnAdm = document.getElementById('btnTabEmailAdmin');

    if (!custView || !admView) return;

    if (tab === 'customer') {
      custView.style.display = 'block';
      admView.style.display = 'none';
      if (btnCust) { btnCust.style.background = '#fef3c7'; btnCust.style.color = '#92400e'; }
      if (btnAdm) { btnAdm.style.background = '#ffffff'; btnAdm.style.color = 'var(--text-muted)'; }
    } else {
      custView.style.display = 'none';
      admView.style.display = 'block';
      if (btnAdm) { btnAdm.style.background = '#fef3c7'; btnAdm.style.color = '#92400e'; }
      if (btnCust) { btnCust.style.background = '#ffffff'; btnCust.style.color = 'var(--text-muted)'; }
    }
  }
};

window.InquirySubmitModule = InquirySubmitModule;
