// ===================================================================
// APEX ELECTRO - MODULE: CONTACT & BUSINESS PROFILE
// ===================================================================

const ContactModule = {
  handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('cntName').value.trim();
    const phone = document.getElementById('cntPhone').value.trim();
    const email = document.getElementById('cntEmail').value.trim();
    const company = document.getElementById('cntCompany')?.value.trim() || 'N/A';
    const subject = document.getElementById('cntSubject').value.trim();
    const message = document.getElementById('cntMessage').value.trim();

    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      email,
      company,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      status: 'Unread'
    };

    AppState.data.contactMessages.unshift(newMsg);
    AppState.save();
    DOMUtils.showToast(`Thank you ${name}! Your inquiry message has been submitted to the vendor desk.`, 'success');
    document.getElementById('publicContactForm').reset();

    // Asynchronous backend dispatch to Supabase & Brevo
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message })
    }).catch(() => {});
  },

  renderBusinessDetails() {
    const bp = AppState.data.businessProfile || {};

    const aboutText = document.getElementById('aboutCompanyText');
    if (aboutText) aboutText.textContent = bp.about || '';

    const addr = document.getElementById('contactAddressText');
    if (addr) addr.textContent = bp.address || '';

    const phoneEl = document.getElementById('contactPhoneText');
    if (phoneEl) phoneEl.textContent = bp.phone || '';

    const emailEl = document.getElementById('contactEmailText');
    if (emailEl) emailEl.textContent = bp.email || '';

    const hoursEl = document.getElementById('contactHoursText');
    if (hoursEl) hoursEl.textContent = bp.businessHours || '';
  },

  populateProfileForm() {
    const bp = AppState.data.businessProfile || {};
    const fName = document.getElementById('profBusinessName');
    const fTag = document.getElementById('profTagline');
    const fPhone = document.getElementById('profPhone');
    const fEmail = document.getElementById('profEmail');
    const fWa = document.getElementById('profWhatsapp');
    const fGst = document.getElementById('profGstin');
    const fAddr = document.getElementById('profAddress');
    const fHours = document.getElementById('profHours');
    const fAbout = document.getElementById('profAbout');

    if (fName) fName.value = bp.name || '';
    if (fTag) fTag.value = bp.tagline || '';
    if (fPhone) fPhone.value = bp.phone || '';
    if (fEmail) fEmail.value = bp.email || '';
    if (fWa) fWa.value = bp.whatsapp || '';
    if (fGst) fGst.value = bp.gstin || '';
    if (fAddr) fAddr.value = bp.address || '';
    if (fHours) fHours.value = bp.businessHours || '';
    if (fAbout) fAbout.value = bp.about || '';

    const fAdminName = document.getElementById('setAdminName');
    if (fAdminName) {
      fAdminName.value = (AppState.data.adminCredentials && AppState.data.adminCredentials.name) || 'Harsh';
    }

    const fAdminEmail = document.getElementById('setAdminEmail');
    if (fAdminEmail) {
      fAdminEmail.value = (AppState.data.adminCredentials && AppState.data.adminCredentials.email) || 'admin@apexelectro.in';
    }
  },

  handleProfileSave(event) {
    event.preventDefault();

    AppState.data.businessProfile = {
      name: document.getElementById('profBusinessName').value.trim(),
      tagline: document.getElementById('profTagline').value.trim(),
      phone: document.getElementById('profPhone').value.trim(),
      email: document.getElementById('profEmail').value.trim(),
      whatsapp: document.getElementById('profWhatsapp').value.trim(),
      gstin: document.getElementById('profGstin').value.trim(),
      address: document.getElementById('profAddress').value.trim(),
      businessHours: document.getElementById('profHours').value.trim(),
      about: document.getElementById('profAbout').value.trim()
    };

    AppState.save();
    this.renderBusinessDetails();
    DOMUtils.showToast('Business profile and storefront details saved!', 'success');
  },

  renderAdminContactMessages() {
    const tableBody = document.getElementById('adminContactsTableBody');
    if (!tableBody) return;

    if (AppState.data.contactMessages.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-dim);">No contact messages.</td></tr>`;
      return;
    }

    tableBody.innerHTML = AppState.data.contactMessages.map(m => `
      <tr>
        <td><strong>${m.name}</strong><br><span style="font-size: 0.75rem; color: var(--text-muted);">${m.company}</span></td>
        <td>${m.email}<br><span style="font-size: 0.75rem; color: var(--text-dim);">${m.phone}</span></td>
        <td><strong>${m.subject}</strong></td>
        <td><div style="font-size: 0.8rem; max-width: 300px; color: #44403c;">${m.message}</div></td>
        <td><span class="status-pill ${m.status === 'Unread' ? 'new' : 'won'}">${m.status}</span></td>
        <td><span style="font-size: 0.75rem; color: var(--text-dim);">${Formatters.formatDate(m.submittedAt)}</span></td>
      </tr>
    `).join('');
  }
};

window.ContactModule = ContactModule;
