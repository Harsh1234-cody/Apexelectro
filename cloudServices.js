// ===================================================================
// APEX ELECTRO - MODULE: CLOUD SERVICES & INTEGRATIONS CHECKER
// ===================================================================

const CloudServicesModule = {
  checkHealth() {
    const box = document.getElementById('cloudHealthStatusBox');
    if (!box) return;

    box.style.display = 'block';
    box.innerHTML = `<div style="color: var(--text-muted);"><i data-lucide="loader" style="width: 14px; height: 14px; animation: spin 1s linear infinite;"></i> Checking API endpoints (/api/health)...</div>`;
    DOMUtils.refreshIcons();

    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        const supaOk = data.integrations?.supabase?.configured;
        const brevoOk = data.integrations?.brevo?.configured;
        box.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="font-weight: 800; color: #15803d; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="check-circle" style="width: 16px; height: 16px;"></i>
              Backend API Server Online & Active (${data.service})
            </div>
            <div style="font-size: 0.8rem; color: #44403c; line-height: 1.6;">
              • <strong>Supabase Database:</strong> ${supaOk ? '<span style="color: #15803d; font-weight: bold;">Connected ✓</span>' : '<span style="color: #b45309;">Pending env setup (Set SUPABASE_URL in .env)</span>'}<br/>
              • <strong>Brevo Transactional SMTP:</strong> ${brevoOk ? '<span style="color: #15803d; font-weight: bold;">Configured & Active ✓ (' + data.integrations.brevo.senderEmail + ')</span>' : '<span style="color: #dc2626; font-weight: bold;">Not Configured (Enter key below to activate)</span>'}
            </div>
          </div>
        `;
        DOMUtils.refreshIcons();
      })
      .catch((err) => {
        box.innerHTML = `
          <div style="color: #dc2626; line-height: 1.5;">
            <strong>⚠️ API Server Connection Failed:</strong><br/>
            ${err.message || 'Unable to connect to /api/health.'}
          </div>
        `;
      });
  },

  async handleBrevoSaveAndTest(event) {
    event.preventDefault();
    const btn = document.getElementById('btnSaveTestBrevo');
    const msg = document.getElementById('brevoTestResultMsg');
    const key = document.getElementById('cfgBrevoKey')?.value.trim();
    const sender = document.getElementById('cfgBrevoSender')?.value.trim();
    const admin = document.getElementById('cfgAdminEmail')?.value.trim();

    if (!key || !sender || !admin) {
      DOMUtils.showToast('Please fill all fields: API Key, Sender Email, and Admin Email.', 'warning');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader" style="width: 16px; height: 16px; animation: spin 1s linear infinite;"></i> Connecting & Testing...`;
    }
    if (msg) msg.style.display = 'none';

    try {
      // 1. Save config to .env and memory
      const saveRes = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brevoApiKey: key,
          brevoSenderEmail: sender,
          adminNotificationEmail: admin
        })
      });
      const saveJson = await saveRes.json();

      if (!saveJson.success) {
        throw new Error(saveJson.error || 'Failed to save configuration');
      }

      // 2. Test Brevo key by sending live verification email
      const testRes = await fetch('/api/test-brevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: key,
          senderEmail: sender,
          testRecipient: admin
        })
      });
      const testJson = await testRes.json();

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="send" style="width: 16px; height: 16px;"></i> Save & Send Live Test Email`;
      }

      if (testJson.success) {
        DOMUtils.showToast(`✓ Brevo Connected! Test email sent to ${admin}`, 'success');
        if (msg) {
          msg.style.display = 'inline-block';
          msg.style.color = '#15803d';
          msg.innerHTML = `✓ Active! Test email sent to ${admin}. Please check your inbox.`;
        }
        this.checkHealth();
      } else {
        DOMUtils.showToast(`Brevo Error: ${testJson.error || 'Invalid API key or sender email'}`, 'error');
        if (msg) {
          msg.style.display = 'inline-block';
          msg.style.color = '#dc2626';
          msg.textContent = `❌ ${testJson.error}`;
        }
      }
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="send" style="width: 16px; height: 16px;"></i> Save & Send Live Test Email`;
      }
      DOMUtils.showToast(`Error: ${err.message}`, 'error');
      if (msg) {
        msg.style.display = 'inline-block';
        msg.style.color = '#dc2626';
        msg.textContent = `❌ ${err.message}`;
      }
    }

    DOMUtils.refreshIcons();
  }
};

window.CloudServicesModule = CloudServicesModule;
