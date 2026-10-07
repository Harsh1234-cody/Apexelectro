// Vercel Serverless Function: Send Formal GST Quotation via Brevo Email
const { createClient } = require('@supabase/supabase-js');

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function sendBrevoEmail({ toEmail, toName, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'quotes@apexelectro.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'Apex Electro B2B Procurement';

  if (!apiKey) {
    return { sent: false, reason: 'BREVO_API_KEY_MISSING' };
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail, name: toName || toEmail }],
    subject: subject,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      return { sent: false, error: err };
    }
    const data = await response.json();
    return { sent: true, messageId: data.messageId };
  } catch (err) {
    return { sent: false, error: err.message };
  }
}

function buildQuotationEmailHtml(quote, items, profile) {
  const itemRows = (items || []).map((it, idx) => `
    <tr style="border-bottom: 1px solid #e9decb;">
      <td style="padding: 10px; font-size: 13px; color: #1c1917;">${idx + 1}</td>
      <td style="padding: 10px; font-size: 13px; color: #1c1917;">
        <strong>${it.productName || it.title}</strong><br/>
        <span style="font-size: 11px; color: #b45309;">${it.variantName || ''}</span>
      </td>
      <td style="padding: 10px; font-size: 13px; color: #78716c; text-align: center;">${it.hsnCode || '8536'}</td>
      <td style="padding: 10px; font-size: 13px; text-align: center; font-weight: bold;">${it.quantity}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right;">₹${Number(it.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold;">₹${Number(it.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="margin: 0; padding: 0; background: #fbf9f5; font-family: Arial, sans-serif; color: #1c1917;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #fbf9f5; padding: 30px 15px;">
      <tr>
        <td align="center">
          <table width="650" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; border: 1px solid #d8c8b0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background: #1c1917; padding: 25px 30px; border-bottom: 3px solid #d97706;">
                <table width="100%">
                  <tr>
                    <td>
                      <h1 style="margin: 0; color: #ffffff; font-size: 22px;">Apex<span style="color: #fbbf24;">Electro</span></h1>
                      <div style="color: #a8a29e; font-size: 11px; text-transform: uppercase;">GST Reg: ${profile.gstin || '27AABCU9603R1ZM'}</div>
                    </td>
                    <td align="right">
                      <span style="background: #b45309; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">PROFORMA QUOTATION</span>
                      <div style="color: #fbbf24; font-size: 14px; font-family: monospace; font-weight: bold; margin-top: 5px;">${quote.quotationNumber}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Client & Quote Meta -->
            <tr>
              <td style="padding: 25px 30px; background: #fdfaf5; border-bottom: 1px solid #e9decb;">
                <table width="100%" style="font-size: 13px;">
                  <tr>
                    <td width="55%" style="vertical-align: top;">
                      <strong style="color: #78350f; text-transform: uppercase; font-size: 11px;">Quotation Prepared For:</strong><br/>
                      <strong style="font-size: 15px; color: #1c1917;">${quote.companyName}</strong><br/>
                      Attn: ${quote.customerName}<br/>
                      GSTIN: ${quote.gstin || 'Unregistered'}<br/>
                      Delivery: ${quote.deliveryLocation || 'Customer Site'}
                    </td>
                    <td width="45%" style="vertical-align: top; text-align: right;">
                      <strong>Quote Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br/>
                      <strong>Validity:</strong> 15 Days (Till ${quote.validityDate || 'Standard'})<br/>
                      <strong>Inquiry Ref:</strong> ${quote.inquiryNumber || quote.inquiryId || 'Direct RFQ'}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items Table -->
            <tr>
              <td style="padding: 25px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e9decb;">
                  <thead>
                    <tr style="background: #f4ece1; font-size: 12px; color: #78350f; text-align: left;">
                      <th style="padding: 10px;">#</th>
                      <th style="padding: 10px;">Description</th>
                      <th style="padding: 10px; text-align: center;">HSN</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Rate (₹)</th>
                      <th style="padding: 10px; text-align: right;">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemRows}
                  </tbody>
                </table>

                <!-- Summary Breakdown Table -->
                <table width="100%" style="margin-top: 20px; font-size: 13px;">
                  <tr>
                    <td width="55%" style="vertical-align: top; font-size: 12px; color: #57534e;">
                      <strong>Payment Terms:</strong><br/>${quote.paymentTerms || '100% advance against Proforma Invoice.'}<br/><br/>
                      <strong>Dispatch Timeline:</strong><br/>${quote.deliveryTimeline || '24-48 business hours ex-stock.'}
                    </td>
                    <td width="45%" style="vertical-align: top;">
                      <table width="100%" cellpadding="4" cellspacing="0">
                        <tr><td>Taxable Subtotal:</td><td align="right">₹${Number(quote.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                        <tr><td>CGST (9%):</td><td align="right">₹${Number(quote.cgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                        <tr><td>SGST (9%):</td><td align="right">₹${Number(quote.sgstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                        ${quote.freightCharges ? `<tr><td>Freight / Delivery:</td><td align="right">₹${Number(quote.freightCharges).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>` : ''}
                        <tr style="border-top: 2px solid #b45309; font-size: 16px; font-weight: bold; color: #b45309;">
                          <td style="padding-top: 8px;">Grand Total:</td>
                          <td align="right" style="padding-top: 8px;">₹${Number(quote.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f8f6f0; border-top: 1px solid #e9decb; padding: 20px 30px; text-align: center; font-size: 11px; color: #78716c;">
                To accept this quotation and arrange dispatch, reply to this email or contact your assigned account manager.<br/>
                Apex Electro Supplies & Switchgear Pvt. Ltd. | Phone: +91 98201 44520 | Email: sales@apexelectro.in
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { quotation, items, customerEmail, profile } = req.body || {};

    if (!quotation || !customerEmail) {
      return res.status(400).json({ error: 'Quotation object and recipient customerEmail are required.' });
    }

    const emailHtml = buildQuotationEmailHtml(quotation, items || quotation.items || [], profile || {});

    const result = await sendBrevoEmail({
      toEmail: customerEmail,
      toName: quotation.customerName || quotation.companyName,
      subject: `Proforma Quotation [${quotation.quotationNumber}] - Apex Electro Supplies`,
      htmlContent: emailHtml
    });

    // Optionally update Supabase quotation status
    const supabase = getSupabaseClient();
    if (supabase && quotation.id) {
      await supabase.from('quotations').update({ status: 'Issued' }).eq('id', quotation.id);
    }

    return res.status(200).json({
      success: result.sent,
      brevoResult: result,
      message: result.sent ? 'Quotation dispatched via Brevo successfully.' : 'Failed to send via Brevo.'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
