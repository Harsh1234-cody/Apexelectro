# Apex Electro Supplies & Switchgear - B2B Industrial Platform

A production-ready B2B Electrical Supplies Vendor Management System and Product Showcase platform engineered according to industrial procurement standards.

---

## 🏗️ Production Architecture Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Vanilla HTML5, CSS3, ES6 JavaScript | High performance, zero-bundle overhead, luxury White/Beige/Cream palette |
| **Backend & APIs** | Vercel Serverless Functions (Node.js) | Serverless endpoints in `/api/*` for secure DB sync and transactional emails |
| **Database** | **Supabase** (PostgreSQL) | Products, Variants, B2B RFQs, Quotations, Inventory Ledger, and RLS security |
| **Email Service** | **Brevo** (formerly Sendinblue) | Transactional RFQ acknowledgements, admin alerts, and formal GST quote dispatch |
| **Hosting & CI/CD** | **Vercel** | Edge global CDN hosting with automated GitHub deploy pipeline |
| **Codebase** | **GitHub** | Version control with clean `.gitignore` and `.env.example` templates |

---

## 📂 Modular Code Structure & Editing Guide

All sections of the codebase have been cleanly separated into dedicated folders:
- **`components/`** -> HTML sections (`components/layout/`, `components/storefront/`, `components/admin/`, `components/modals/`, `components/drawer/`)
- **`css/`** -> Modular stylesheets (`variables.css`, `base.css`, `header.css`, `public.css`, `admin.css`, `drawer.css`, `modals.css`)
- **`js/`** -> Isolated ES6 modules (`js/modules/auth.js`, `catalog.js`, `inquiryCart.js`, `quotation.js`, `adminProducts.js`, etc.)
- **`api/`** -> Serverless functions (`/api/inquiry`, `/api/send-quotation`, `/api/health`, `/api/contact`)
- **`supabase/`** -> Database PostgreSQL DDL (`schema.sql`) and seed data (`seed.sql`)

👉 **See the complete editing manual in [`STRUCTURE_GUIDE.md`](STRUCTURE_GUIDE.md)** for file-by-file instructions!

---

## 🚀 Step-by-Step Deployment & Setup Guide

### STEP 1: Supabase Database Setup
1. Create a free account at [supabase.com](https://supabase.com) and create a **New Project**.
2. Navigate to the **SQL Editor** on the left menu.
3. Open [`supabase/schema.sql`](supabase/schema.sql), copy its entire contents, paste it into the SQL Editor, and click **Run**.
   - *This creates all tables, foreign keys, performance indexes, and Row Level Security (RLS) policies.*
4. Open [`supabase/seed.sql`](supabase/seed.sql), paste it into the SQL Editor, and click **Run**.
   - *This populates all 8 electrical categories, 11 OEM brands, and enterprise catalog products.*
5. Go to **Project Settings** -> **API** and copy:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **Anon Public Key** (`anon` `public`)
   - **Service Role Secret** (`service_role` `secret`)

---

### STEP 2: Brevo (Sendinblue) Transactional Mail Setup
1. Create a free account at [brevo.com](https://brevo.com).
2. Go to **Senders, Domains & Dedicated IPs** -> **Senders** and add/verify your sender email (e.g. `rfq@yourdomain.com` or your Gmail address).
3. Go to **SMTP & API** -> **API Keys** -> **Generate a new API key**.
4. Copy the generated key (starts with `xkeysib-...`).

---

### STEP 3: Push Codebase to GitHub
Run the following commands in this project folder:

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: Apex Electro B2B platform with Supabase, Vercel & Brevo integration"

# 4. Create a repository on github.com, then link and push:
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

### STEP 4: Deploy to Vercel
1. Log in to [vercel.com](https://vercel.com) and click **"Add New" -> "Project"**.
2. Select your newly pushed **GitHub repository**.
3. Under **Environment Variables**, add the following keys:

| Environment Variable | Value Example | Description |
|---|---|---|
| `SUPABASE_URL` | `https://xyzcompany.supabase.co` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Public Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase Private Service Role Secret |
| `BREVO_API_KEY` | `xkeysib-xxxxxxxxxxxx` | Brevo Transactional API Key |
| `BREVO_SENDER_EMAIL` | `rfq@apexelectro.in` | Verified sender address in Brevo |
| `BREVO_SENDER_NAME` | `Apex Electro B2B Procurement` | Display name on emails |
| `ADMIN_NOTIFICATION_EMAIL` | `admin@apexelectro.in` | Where RFQ alert emails are sent |
| `SITE_URL` | `https://your-project.vercel.app` | Production URL |

4. Click **Deploy**. Vercel will build and deploy your site in ~30 seconds with global CDN and live serverless functions!

---

## ⚡ Serverless API Endpoints Reference

| Endpoint | Method | Action |
|---|---|---|
| `/api/health` | `GET` | Healthcheck and verification of Supabase & Brevo environment configuration. |
| `/api/inquiry` | `POST` | Stores RFQ inquiry in Supabase & dispatches Brevo transactional emails to customer + admin. |
| `/api/send-quotation` | `POST` | Dispatches formal GST Proforma Quotation breakdown to client via Brevo email. |
| `/api/contact` | `POST` | Saves customer contact messages to Supabase and alerts store admin via Brevo. |

---

## 🛡️ Admin Security & Credentials

- **Admin Login Gate**: Direct access to the Admin Portal is locked by default.
- **Default Test Admin**: `admin@apexelectro.in`
- **Default Password**: `Admin@2026`
- **Theme Palette**: Luxury White, Beige & Cream (`#fbf9f5`, `#f4ece1`, `#ffffff`, `#d8c8b0`, with warm amber `#b45309`).
