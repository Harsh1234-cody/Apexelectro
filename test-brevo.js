// API Endpoint: Direct test verification of Brevo API Key
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { apiKey, senderEmail, testRecipient } = req.body || {};
    const effectiveKey = (apiKey && apiKey.trim()) || process.env.BREVO_API_KEY;
    const effectiveSender = (senderEmail && senderEmail.trim()) || process.env.BREVO_SENDER_EMAIL;
    const effectiveRecipient = (testRecipient && testRecipient.trim()) || process.env.ADMIN_NOTIFICATION_EMAIL || effectiveSender;

    if (!effectiveKey) {
      return res.status(400).json({ error: 'Brevo API Key is missing. Please enter your API key starting with xkeysib-...' });
    }
    if (!effectiveSender) {
      return res.status(400).json({ error: 'Sender email is missing. Please enter your verified Brevo sender email.' });
    }

    const payload = {
      sender: { name: 'Apex Electro B2B Test', email: effectiveSender },
      to: [{ email: effectiveRecipient, name: 'Harsh (Store Admin)' }],
      subject: '✅ [Verification Successful] Apex Electro Brevo Integration Live!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d8c8b0; border-radius: 8px; padding: 24px; background: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #b45309; margin: 0;">Apex Electro Supplies & Switchgear</h2>
            <div style="font-size: 12px; color: #78716c;">B2B Electrical Procurement Platform</div>
          </div>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
            <strong style="color: #15803d; font-size: 15px;">✓ Brevo Notification System Is Live & Active!</strong>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #166534;">
              Badhaai ho! Aapka Brevo transactional email connection successfully active ho gaya hai.
            </p>
          </div>
          <p style="font-size: 13px; color: #44403c; line-height: 1.5;">
            Ab jab bhi koi customer aapki website par RFQ inquiry daalega ya contact form bharega, turant aapko is email par inquiry alert prapt hogi.
          </p>
          <div style="font-size: 11px; color: #a8a29e; margin-top: 24px; border-top: 1px solid #e7e5e4; padding-top: 8px;">
            Dispatched via Brevo SMTP API on ${new Date().toLocaleString('en-IN')}.
          </div>
        </div>
      `
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': effectiveKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsed = {};
      try { parsed = JSON.parse(errText); } catch(e) {}
      return res.status(response.status).json({
        success: false,
        error: parsed.message || errText || 'Brevo API rejected the request.'
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      messageId: data.messageId,
      recipient: effectiveRecipient,
      message: `Test email successfully sent to ${effectiveRecipient}!`
    });
  } catch (err) {
    console.error('Error testing Brevo:', err);
    return res.status(500).json({ error: err.message });
  }
};
