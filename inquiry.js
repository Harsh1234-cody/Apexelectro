// Vercel Serverless Function: RFQ Submission -> Supabase Sync & Brevo Transactional Email Dispatch
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client if environment variables exist
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Brevo (Sendinblue) Transactional Email Dispatcher
async function sendBrevoEmail({ toEmail, toName, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'notifications@apexelectro.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'Apex Electro B2B Procurement';

  if (!apiKey) {
    console.warn('BREVO_API_KEY not configured. Skipping email dispatch.');
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
      const errText = await response.text();
      console.error('Brevo API Error:', response.status, errText);
      return { sent: false, status: response.status, error: errText };
    }

    const data = await response.json();
    return { sent: true, messageId: data.messageId };
  } catch (error) {
    console.error('Brevo network exception:', error);
    return { sent: false, error: error.message };
  }
}

// Helper: Build Luxury HTML Email for Customer
function buildCustomerEmailHtml(inquiry, items) {
  const itemsRows = items.map((item, idx) => `
    <tr style="border-bottom: 1px solid #e9decb;">
      <td style="padding: 10px 12px; font-size: 13px; color: #1c1917;">${idx + 1}</td>
      <td style="padding: 10px 12px; font-size: 13px; color: #1c1917;">
        <strong>${item.productName || item.title || 'Electrical Item'}</strong><br/>
        <span style="font-size: 11px; color: #b45309;">${item.variantName || 'Standard Variant'}</span>
        ${item.sku ? `<span style="font-size: 11px; color: #78716c; font-family: monospace;"> (SKU: ${item.sku})</span>` : ''}
      </td>
      <td style="padding: 10px 12px; font-size: 13px; color: #1c1917; text-align: center; font-weight: bold;">
        ${item.quantity} ${item.unit || 'Units'}
      </td>
      <td style="padding: 10px 12px; font-size: 13px; color: #1c1917; text-align: right;">
        ${item.targetPrice ? `₹${Number(item.targetPrice).toLocaleString('en-IN')}` : 'Market B2B Best'}
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Inquiry Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fbf9f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1c1917;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fbf9f5; padding: 30px 15px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #d8c8b0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            
            <!-- Header Banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #1c1917 0%, #292524 100%); padding: 25px 30px; text-align: left; border-bottom: 3px solid #d97706;">
                <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                  Apex<span style="color: #fbbf24;">Electro</span>
                </h1>
                <p style="margin: 4px 0 0 0; color: #d6d3d1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                  Industrial Electrical Supplies & Switchgear Procurement
                </p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 30px 30px 20px 30px;">
                <h2 style="margin: 0 0 10px 0; color: #1c1917; font-size: 18px; font-weight: 700;">
                  Quotation Request Received (RFQ Confirmed)
                </h2>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #57534e; line-height: 1.6;">
                  Dear <strong>${inquiry.customerName || inquiry.contactPerson}</strong>,<br/>
                  Thank you for submitting your procurement requirement to Apex Electro Supplies. Our technical estimation and dispatch desk has logged your request.
                </p>

                <!-- Token Pill -->
                <div style="background-color: #fef3c7; border: 1.5px dashed #b45309; border-radius: 8px; padding: 14px 20px; text-align: center; margin-bottom: 25px;">
                  <span style="display: block; font-size: 11px; text-transform: uppercase; color: #92400e; font-weight: 700; letter-spacing: 1px;">Your Official RFQ Reference Number</span>
                  <strong style="display: block; font-size: 22px; color: #b45309; font-family: monospace; margin-top: 4px;">${inquiry.inquiryNumber}</strong>
                  <span style="display: block; font-size: 12px; color: #78350f; margin-top: 4px;">Quote turnaround SLA: Within 2 to 4 business hours</span>
                </div>

                <!-- Procurement Specs Summary -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 13px; color: #57534e;">
                  <tr>
                    <td style="padding: 4px 0;"><strong>Company Name:</strong> ${inquiry.companyName}</td>
                    <td style="padding: 4px 0;"><strong>Delivery Pincode:</strong> ${inquiry.deliveryPincode || inquiry.deliveryLocation}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0;"><strong>GSTIN:</strong> ${inquiry.gstin || inquiry.gstNumber || 'Unregistered / Retail'}</td>
                    <td style="padding: 4px 0;"><strong>Project Type:</strong> ${inquiry.projectType || 'Standard'}</td>
                  </tr>
                </table>

                <!-- Requested Items Table -->
                <h3 style="margin: 20px 0 10px 0; font-size: 14px; text-transform: uppercase; color: #1c1917; letter-spacing: 0.5px;">
                  Requested Material Breakdown (${items.length} line items)
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e9decb; border-radius: 6px; overflow: hidden; margin-bottom: 25px;">
                  <thead>
                    <tr style="background-color: #f4ece1; text-align: left;">
                      <th style="padding: 10px 12px; font-size: 12px; color: #78350f;">#</th>
                      <th style="padding: 10px 12px; font-size: 12px; color: #78350f;">Item & Specifications</th>
                      <th style="padding: 10px 12px; font-size: 12px; color: #78350f; text-align: center;">Qty</th>
                      <th style="padding: 10px 12px; font-size: 12px; color: #78350f; text-align: right;">Target Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>

                ${inquiry.notes ? `
                  <div style="background-color: #f5f5f4; border-left: 3px solid #b45309; padding: 10px 15px; margin-bottom: 20px; font-size: 12px; color: #44403c;">
                    <strong>Special Instructions / Delivery Notes:</strong><br/>
                    ${inquiry.notes}
                  </div>
                ` : ''}

                <p style="margin: 20px 0 0 0; font-size: 13px; color: #78716c; line-height: 1.5;">
                  Our sales engineer will prepare a formal GST-compliant proforma quotation with volume slabs and freight timelines. For urgent priority dispatch, reach our desk directly at <strong>+91 98201 44520</strong>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8f6f0; border-top: 1px solid #e9decb; padding: 20px 30px; text-align: center; font-size: 11px; color: #78716c;">
                Apex Electro Supplies & Switchgear Pvt. Ltd. | MIDC Industrial Zone, Mumbai, MH 400093<br/>
                Authorized Distributor: Polycab | Schneider Electric | Havells | ABB | Siemens | Legrand
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

// Helper: Build Admin Alert Email
function buildAdminAlertEmailHtml(inquiry, items) {
  const itemsText = items.map(it => `• ${it.productName || it.title} (${it.variantName || 'Std'}) - Qty: ${it.quantity}`).join('<br/>');

  return `
  <div style="font-family: Arial, sans-serif; background: #ffffff; padding: 20px; border: 1px solid #d8c8b0; border-radius: 8px;">
    <h2 style="color: #b45309; margin-top: 0;">⚡ New B2B RFQ Inquiry Received: ${inquiry.inquiryNumber}</h2>
    <p>A new purchase quotation has been submitted on the storefront:</p>
    <ul>
      <li><strong>Client:</strong> ${inquiry.customerName || inquiry.contactPerson} (${inquiry.companyName})</li>
      <li><strong>Email:</strong> ${inquiry.email}</li>
      <li><strong>Phone / WhatsApp:</strong> ${inquiry.phone}</li>
      <li><strong>GSTIN:</strong> ${inquiry.gstin || inquiry.gstNumber || 'Not provided'}</li>
      <li><strong>Delivery Pincode:</strong> ${inquiry.deliveryPincode || inquiry.deliveryLocation}</li>
      <li><strong>Project Type:</strong> ${inquiry.projectType}</li>
    </ul>
    <h3>Requested Products (${items.length}):</h3>
    <div style="background: #fdfaf5; padding: 12px; border: 1px solid #e9decb; border-radius: 6px;">
      ${itemsText}
    </div>
    ${inquiry.notes ? `<p><strong>Notes:</strong> ${inquiry.notes}</p>` : ''}
    <p style="margin-top: 20px;">
      <a href="${process.env.SITE_URL || 'https://apexelectro.vercel.app'}" style="background: #b45309; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Open Admin Portal to Issue Quotation →
      </a>
    </p>
  </div>
  `;
}

// Main Handler
module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { inquiry, items } = req.body || {};

    if (!inquiry || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid request: inquiry details and items array are required.' });
    }

    const inquiryId = inquiry.id || `inq-${Date.now()}`;
    const inquiryNumber = inquiry.inquiryNumber || inquiry.id || `INQ-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

    let supabaseSynced = false;
    const supabase = getSupabaseClient();

    // 1. SUPABASE SYNC (Insert inquiry + line items)
    if (supabase) {
      try {
        const { error: inqErr } = await supabase.from('inquiries').upsert({
          id: inquiryId,
          inquiry_number: inquiryNumber,
          customer_name: inquiry.customerName || inquiry.contactPerson,
          company_name: inquiry.companyName,
          gstin: inquiry.gstin || inquiry.gstNumber,
          email: inquiry.email,
          phone: inquiry.phone,
          delivery_pincode: inquiry.deliveryPincode || inquiry.deliveryLocation,
          project_type: inquiry.projectType,
          notes: inquiry.notes,
          total_items: items.length,
          status: 'New'
        });

        if (inqErr) {
          console.error('Supabase Inquiries Insert Error:', inqErr);
        } else {
          // Insert line items
          const dbItems = items.map(item => ({
            inquiry_id: inquiryId,
            product_id: item.productId || null,
            variant_id: item.variantId || null,
            product_title: item.productName || item.title || 'Product',
            variant_name: item.variantName || null,
            sku: item.sku || null,
            quantity: item.quantity || 1,
            target_price: item.targetPrice ? Number(item.targetPrice) : null,
            notes: item.notes || null
          }));

          const { error: itemsErr } = await supabase.from('inquiry_items').insert(dbItems);
          if (itemsErr) console.error('Supabase Items Insert Error:', itemsErr);
          else supabaseSynced = true;
        }
      } catch (dbEx) {
        console.error('Supabase sync exception:', dbEx);
      }
    }

    // 2. BREVO TRANSACTIONAL EMAIL DISPATCH
    let brevoClientEmail = { sent: false };
    let brevoAdminEmail = { sent: false };

    if (process.env.BREVO_API_KEY && inquiry.email) {
      // Send acknowledgement to customer
      brevoClientEmail = await sendBrevoEmail({
        toEmail: inquiry.email,
        toName: inquiry.customerName || inquiry.companyName,
        subject: `Quotation Request Confirmed [${inquiryNumber}] | Apex Electro Supplies`,
        htmlContent: buildCustomerEmailHtml({ ...inquiry, inquiryNumber }, items)
      });

      // Send alert to admin
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@apexelectro.in';
      brevoAdminEmail = await sendBrevoEmail({
        toEmail: adminEmail,
        toName: 'Apex Store Admin',
        subject: `⚡ [New RFQ Alert] ${inquiryNumber} from ${inquiry.companyName}`,
        htmlContent: buildAdminAlertEmailHtml({ ...inquiry, inquiryNumber }, items)
      });
    }

    return res.status(200).json({
      success: true,
      inquiryId: inquiryId,
      inquiryNumber: inquiryNumber,
      supabaseSynced: supabaseSynced,
      brevo: {
        customerEmail: brevoClientEmail,
        adminAlert: brevoAdminEmail
      },
      message: 'Inquiry processed successfully.'
    });

  } catch (error) {
    console.error('Inquiry API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
