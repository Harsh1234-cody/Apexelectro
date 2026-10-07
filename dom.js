// ===================================================================
// APEX ELECTRO - UTILITY: DOM & UI HELPERS
// ===================================================================

const DOMUtils = {
  // Re-render Lucide SVG icons across the document
  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  // Display a toast notification popup
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'alert-triangle';
    if (type === 'error') icon = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Open an HTML5 dialog element
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    this.refreshIcons();
  },

  // Close an HTML5 dialog element
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }
};

window.DOMUtils = DOMUtils;
