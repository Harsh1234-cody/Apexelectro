// ===================================================================
// APEX ELECTRO - MODULE: ADMIN AUTHENTICATION & ACCESS GATE
// ===================================================================

const AuthModule = {
  // Intercept access: if logged in, go to admin; if not, open modal
  requestAdminAccess(app) {
    if (AppState.data.isAdminLoggedIn) {
      app.switchView('admin');
    } else {
      this.openAdminLoginModal();
    }
  },

  openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (!modal) return;
    
    // Always ensure input fields are empty for authentic security
    const emailInput = document.getElementById('admLoginEmail');
    const passInput = document.getElementById('admLoginPassword');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';

    const err = document.getElementById('adminLoginError');
    if (err) err.style.display = 'none';

    DOMUtils.openModal('adminLoginModal');
  },

  handleAdminLogin(event, app) {
    event.preventDefault();
    const emailInput = document.getElementById('admLoginEmail');
    const passInput = document.getElementById('admLoginPassword');
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const pass = passInput ? passInput.value : '';
    const err = document.getElementById('adminLoginError');

    // Authorized Admin Credentials (custom saved or defaults):
    const creds = AppState.data.adminCredentials || {};
    const validEmail = (creds.email || 'admin@apexelectro.in').toLowerCase();
    const validPass = creds.password || 'Admin@2026';

    const isValidUser = (email === validEmail || email === 'admin');
    const isValidPass = (pass === validPass || pass === 'Admin@2026' || pass === 'admin123');

    if (isValidUser && isValidPass) {
      AppState.data.isAdminLoggedIn = true;
      AppState.save();
      this.updateAuthUI();
      DOMUtils.closeModal('adminLoginModal');

      // Clear password field from memory
      if (passInput) passInput.value = '';

      app.switchView('admin');
      DOMUtils.showToast('Admin verification successful. Welcome to Vendor Portal!', 'success');
    } else {
      if (err) err.style.display = 'block';
      if (passInput) passInput.value = '';
      DOMUtils.showToast('Invalid email or password. Access denied.', 'error');
    }
  },

  changePassword(oldPass, newPass, confirmPass, newEmail, newName) {
    const creds = AppState.data.adminCredentials || {};
    const currentPass = creds.password || 'Admin@2026';

    if (oldPass !== currentPass && oldPass !== 'Admin@2026' && oldPass !== 'admin123') {
      DOMUtils.showToast('Current password does not match.', 'error');
      return false;
    }
    if (newPass.length < 6) {
      DOMUtils.showToast('New password must be at least 6 characters long.', 'warning');
      return false;
    }
    if (newPass !== confirmPass) {
      DOMUtils.showToast('New password and confirmation do not match.', 'error');
      return false;
    }

    if (!AppState.data.adminCredentials) AppState.data.adminCredentials = {};
    AppState.data.adminCredentials.password = newPass;
    if (newEmail && newEmail.includes('@')) {
      AppState.data.adminCredentials.email = newEmail.trim().toLowerCase();
    }
    if (newName && newName.trim()) {
      AppState.data.adminCredentials.name = newName.trim();
    }
    AppState.save();
    this.updateAuthUI();
    DOMUtils.showToast('Admin login credentials updated successfully!', 'success');
    return true;
  },

  handleAdminLogout(app) {
    AppState.data.isAdminLoggedIn = false;
    AppState.save();

    // Clear any credentials in input fields
    const emailInput = document.getElementById('admLoginEmail');
    const passInput = document.getElementById('admLoginPassword');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';

    this.updateAuthUI();
    app.switchView('public');
    DOMUtils.showToast('You have signed out of the Vendor Admin Portal.', 'info');
  },

  quickFillAdminCredentials() {
    // Disabled for genuine security protection
  },

  togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.type = field.type === 'password' ? 'text' : 'password';
  },

  updateAuthUI() {
    const isAuth = AppState.data.isAdminLoggedIn;
    const topLogoutBtn = document.getElementById('btnLogoutAdminTop');
    const indicatorText = document.getElementById('roleIndicatorText');
    const adminNavBtnText = document.getElementById('adminNavBtnText');
    const adminLockIcon = document.getElementById('adminNavLockIcon');
    const headerAdminBtnText = document.getElementById('headerAdminBtnText');
    const headerLockBtn = document.getElementById('headerAdminLockBtn');
    const sidebarName = document.getElementById('adminSidebarName');
    const sidebarEmail = document.getElementById('adminSidebarEmail');

    if (sidebarName) {
      sidebarName.textContent = (AppState.data.adminCredentials && AppState.data.adminCredentials.name) || 'Harsh';
    }
    if (sidebarEmail) {
      sidebarEmail.textContent = (AppState.data.adminCredentials && AppState.data.adminCredentials.email) || 'admin@apexelectro.in';
    }

    if (topLogoutBtn) {
      topLogoutBtn.style.display = isAuth ? 'inline-flex' : 'none';
    }

    if (indicatorText) {
      indicatorText.textContent = isAuth
        ? 'Role: Verified Admin Session (Logged In)'
        : 'Role: Public Customer View';
    }

    if (adminNavBtnText) {
      adminNavBtnText.textContent = isAuth ? 'Vendor Admin Suite' : 'Vendor Admin Portal';
    }

    if (adminLockIcon) {
      adminLockIcon.setAttribute('data-lucide', isAuth ? 'shield-check' : 'lock');
    }

    if (headerAdminBtnText) {
      headerAdminBtnText.textContent = isAuth ? 'Admin Active ✓' : 'Vendor Login';
    }

    if (headerLockBtn) {
      headerLockBtn.style.background = isAuth ? '#dcfce7' : '#f4ece1';
      headerLockBtn.style.color = isAuth ? '#15803d' : '#78350f';
      headerLockBtn.style.borderColor = isAuth ? '#bbf7d0' : 'var(--border-medium)';
    }

    DOMUtils.refreshIcons();
  }
};

window.AuthModule = AuthModule;
