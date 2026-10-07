// API Endpoint to save environment configuration (.env)
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const {
      brevoApiKey,
      brevoSenderEmail,
      brevoSenderName,
      adminNotificationEmail,
      supabaseUrl,
      supabaseAnonKey,
      supabaseServiceRoleKey
    } = req.body || {};

    const envPath = path.resolve(__dirname, '..', '.env');
    let existingEnv = {};

    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      lines.forEach(l => {
        const parts = l.split('=');
        if (parts.length >= 2 && !parts[0].trim().startsWith('#')) {
          existingEnv[parts[0].trim()] = parts.slice(1).join('=').trim();
        }
      });
    }

    if (brevoApiKey) existingEnv['BREVO_API_KEY'] = brevoApiKey.trim();
    if (brevoSenderEmail) existingEnv['BREVO_SENDER_EMAIL'] = brevoSenderEmail.trim();
    if (brevoSenderName) existingEnv['BREVO_SENDER_NAME'] = brevoSenderName.trim();
    if (adminNotificationEmail) existingEnv['ADMIN_NOTIFICATION_EMAIL'] = adminNotificationEmail.trim();
    if (supabaseUrl) existingEnv['SUPABASE_URL'] = supabaseUrl.trim();
    if (supabaseAnonKey) existingEnv['SUPABASE_ANON_KEY'] = supabaseAnonKey.trim();
    if (supabaseServiceRoleKey) existingEnv['SUPABASE_SERVICE_ROLE_KEY'] = supabaseServiceRoleKey.trim();

    // Update running process.env immediately
    Object.keys(existingEnv).forEach(k => {
      process.env[k] = existingEnv[k];
    });

    // Write to .env
    const content = [
      '# ===================================================================',
      '# APEX ELECTRO B2B PLATFORM - ENVIRONMENT CONFIGURATION',
      '# ===================================================================',
      '',
      `SUPABASE_URL=${existingEnv['SUPABASE_URL'] || ''}`,
      `SUPABASE_ANON_KEY=${existingEnv['SUPABASE_ANON_KEY'] || ''}`,
      `SUPABASE_SERVICE_ROLE_KEY=${existingEnv['SUPABASE_SERVICE_ROLE_KEY'] || ''}`,
      '',
      `BREVO_API_KEY=${existingEnv['BREVO_API_KEY'] || ''}`,
      `BREVO_SENDER_EMAIL=${existingEnv['BREVO_SENDER_EMAIL'] || 'notifications@apexelectro.in'}`,
      `BREVO_SENDER_NAME=${existingEnv['BREVO_SENDER_NAME'] || 'Apex Electro B2B Procurement'}`,
      `ADMIN_NOTIFICATION_EMAIL=${existingEnv['ADMIN_NOTIFICATION_EMAIL'] || 'admin@apexelectro.in'}`,
      '',
      `SITE_URL=${existingEnv['SITE_URL'] || 'http://localhost:3000'}`
    ].join('\n');

    fs.writeFileSync(envPath, content, 'utf8');

    return res.status(200).json({
      success: true,
      message: 'Configuration saved successfully to .env and loaded into memory!'
    });
  } catch (err) {
    console.error('Error saving .env:', err);
    return res.status(500).json({ error: err.message });
  }
};
