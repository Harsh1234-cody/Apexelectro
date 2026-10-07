// ===================================================================
// APEX ELECTRO - UTILITY: FORMATTERS & CALCULATIONS
// ===================================================================

const Formatters = {
  // Format Indian Rupee Currency: ₹ 1,25,000.00
  formatCurrency(amount, decimals = 2) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
    return '₹' + Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  // Format Date: 08 Oct 2026
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  // Calculate GST Breakdown for an item or subtotal
  calculateGST(subtotal, cgstRate = 9.0, sgstRate = 9.0, freight = 0) {
    const cgstAmount = (subtotal * cgstRate) / 100;
    const sgstAmount = (subtotal * sgstRate) / 100;
    const grandTotal = subtotal + cgstAmount + sgstAmount + freight;
    return {
      subtotal,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      freight,
      grandTotal
    };
  },

  // Generate Unique RFQ Number: INQ-2026-00004
  generateInquiryNumber(sequence) {
    const year = new Date().getFullYear();
    const seqStr = String(sequence).padStart(5, '0');
    return `INQ-${year}-${seqStr}`;
  },

  // Generate Unique Quotation Number: QUO-2026-00002
  generateQuotationNumber(sequence) {
    const year = new Date().getFullYear();
    const seqStr = String(sequence).padStart(5, '0');
    return `QUO-${year}-${seqStr}`;
  }
};

window.Formatters = Formatters;
