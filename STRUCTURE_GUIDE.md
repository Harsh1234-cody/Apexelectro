# 📂 Project Folder & Section Guide (Code Editing Guide)

Aapke request ke mutabik pura codebase alag-alag dedicated folders aur modular sections me divide kiya gaya hai jisse aapko ya kisi bhi developer ko future me edit karna **bahut easy aur fast** ho jaye.

---

## 🗂️ Complete Directory Map (Kis Folder Me Kya Hai?)

```
electrical-b2b-platform/
│
├── 📁 components/              <-- HTML SECTIONS (Har ek section ka alag file)
│   ├── 📁 layout/              <-- Top Bar, Header, Footer
│   │   ├── switcher-bar.html   (Clean production placeholder)
│   │   ├── header.html         (Store logo, live search bar, nav links, RFQ cart button)
│   │   └── footer.html         (Footer links, credentials, GSTIN, copyright)
│   │
│   ├── 📁 storefront/          <-- Public Customer Pages
│   │   ├── hero.html           (Hero banner, call to actions, quick stats)
│   │   ├── categories.html     (8 Electrical category cards with quick links)
│   │   ├── brands.html         (Authorized OEM brands ticker: Polycab, Schneider, etc.)
│   │   ├── catalog.html        (Main product catalog, sidebar filters, sorting, cards)
│   │   ├── why-us.html         (B2B advantages: GST invoice, batch testing, express logistics)
│   │   └── contact.html        (Warehouse address, phone, email & contact message form)
│   │
│   ├── 📁 drawer/              <-- Slide-out Drawers
│   │   └── inquiry-drawer.html (Slide-out RFQ Inquiry cart drawer, item list & proceed button)
│   │
│   ├── 📁 admin/               <-- Vendor Admin Portal Sections
│   │   ├── admin-sidebar.html  (Admin sidebar navigation menu)
│   │   ├── admin-topbar.html   (Admin top navigation bar)
│   │   ├── tab-dashboard.html  (KPI stats: Inquiries, Quotations, Low Stock alerts)
│   │   ├── tab-inquiries.html  (All Customer RFQs table & status filter)
│   │   ├── tab-products.html   (Products management table & New Product button)
│   │   ├── tab-inventory.html  (Stock ledger & adjustment audit trail table)
│   │   ├── tab-quotations.html (GST Quotation generator & history)
│   │   ├── tab-categories.html (Category & Subcategory management table)
│   │   ├── tab-brands.html     (OEM Brands table)
│   │   ├── tab-contacts.html   (Inbound customer messages table)
│   │   └── tab-profile.html    (Business profile details & Cloud API status)
│   │
│   └── 📁 modals/              <-- Popups & Dialogs
│       ├── modal-admin-login.html        (Admin password authentication gate)
│       ├── modal-product-detail.html     (Technical specs sheet & variant selector)
│       ├── modal-inquiry-submit.html     (RFQ Checkout form: GSTIN, delivery date, urgency)
│       ├── modal-inquiry-success.html    (Inquiry reference token popup)
│       ├── modal-quotation-view.html     (Formal printable GST quotation preview)
│       ├── modal-admin-stock.html        (Stock adjustment modal with audit log)
│       ├── modal-admin-product.html      (Add / Edit product modal with dynamic specs builder)
│       └── modal-admin-inquiry-detail.html (Inquiry view & status update modal)
│
├── 📁 css/                     <-- STYLING & LUXURY THEME
│   ├── variables.css           (Color palette: White, Beige, Cream, Sandstone, Fonts, Shadows)
│   ├── base.css                (Reset, buttons, inputs, pills, toasts)
│   ├── header.css              (Header layout, live search dropdown, switcher bar)
│   ├── public.css              (Hero, category cards, brand ticker, product cards)
│   ├── drawer.css              (Slide-out RFQ drawer styles & animations)
│   ├── modals.css              (Popups & dialog windows)
│   ├── admin.css               (Admin portal layout, sidebar, tables, quotation sheet)
│   └── styles.css              (Master CSS file importing all above modular stylesheets)
│
├── 📁 js/                      <-- JAVASCRIPT LOGIC & CONTROLLERS
│   ├── 📁 utils/
│   │   ├── formatters.js       (Currency format ₹, date formatting, GST 18% calculation)
│   │   └── dom.js              (Toast notifications, modal open/close, Lucide icons refresher)
│   │
│   ├── 📁 modules/             <-- Har Feature Ka Alag JavaScript Module
│   │   ├── auth.js             (Admin password login, session verification gate, logout)
│   │   ├── catalog.js          (Product listing, category filtering, search, sorting)
│   │   ├── productDetail.js    (Product detail modal, image switcher, dynamic specs)
│   │   ├── inquiryCart.js      (Cart state, add/remove items, quantity stepper)
│   │   ├── inquirySubmit.js    (RFQ token generator, Brevo email trigger, validation)
│   │   ├── quotation.js        (GST Proforma Quotation calculation, print & email dispatch)
│   │   ├── adminProducts.js    (Product CRUD, dynamic specifications, variant builder)
│   │   ├── adminInventory.js   (Stock adjustments, ledger audit log, low-stock alerts)
│   │   ├── adminInquiries.js   (RFQ inquiries table, status filters & updater)
│   │   ├── contact.js          (Contact form submit, business profile save)
│   │   └── cloudServices.js    (Supabase, Brevo, Vercel healthcheck diagnostics)
│   │
│   ├── state.js                (Central state store with localStorage persistence)
│   ├── data.js                 (Initial seed data: 8 categories, 11 brands, industrial catalog)
│   └── app.js                  (Root controller class wiring all modules to window.app)
│
├── 📁 api/                     <-- VERCEL SERVERLESS BACKEND (Node.js)
│   ├── health.js               (GET: Diagnostic healthcheck for Supabase & Brevo)
│   ├── inquiry.js              (POST: Inserts RFQ in Supabase + sends customer & admin email via Brevo)
│   ├── send-quotation.js       (POST: Sends itemized GST Quotation email to client via Brevo)
│   └── contact.js              (POST: Saves contact message & alerts admin via Brevo)
│
├── 📁 supabase/                <-- DATABASE SCHEMA & SEED (PostgreSQL)
│   ├── schema.sql              (11 PostgreSQL tables, RLS security policies, triggers & indexes)
│   └── seed.sql                (Master seed data for all categories, brands, products)
│
├── 📁 scripts/                 <-- BUILD & HELPER SCRIPTS
│   ├── build-html.js           (Compiles components/ folder into index.html)
│   ├── watch.js                (Watches components/ and auto-rebuilds index.html on every save)
│   └── test-endpoints.js       (Automated test verifying all CSS and JS files load with 200 OK)
│
├── index.template.html         (Master template with clean {{include:...}} tags)
├── index.html                  (Compiled production single-page application)
├── vercel.json                 (Vercel edge serverless routing configuration)
├── package.json                (NPM scripts & dependencies)
├── .env.example                (Environment variables template for Supabase & Brevo)
└── README.md                   (Full production setup & deployment manual)
```

---

## 🛠️ Kaise Edit Karein? (How to Edit Easily?)

### 1. Agar UI / HTML ka koi section change karna ho:
- **Header ya Logo badalna hai?** 👉 `components/layout/header.html` me edit karein.
- **Hero Banner / Tagline badalna hai?** 👉 `components/storefront/hero.html` me edit karein.
- **Why Choose Us section badalna hai?** 👉 `components/storefront/why-us.html` me edit karein.
- **Warehouse Address / Phone number badalna hai?** 👉 `components/storefront/contact.html` me edit karein.
- **Inquiry Drawer ka design change karna hai?** 👉 `components/drawer/inquiry-drawer.html` me edit karein.
- **Admin Dashboard ya Sidebar badalna hai?** 👉 `components/admin/tab-dashboard.html` ya `components/admin/admin-sidebar.html` me edit karein.
- **Popups / Modals me kuch change karna hai?** 👉 `components/modals/` folder me specific modal file edit karein.

> **Note:** Component file edit karne ke baad sirf command run karein:
> ```bash
> npm run build
> ```
> Ya development ke time auto-watcher on rakhein:
> ```bash
> npm run watch
> ```
> Yeh automatically `index.html` ko compile kar dega bina kisi error ke!

---

### 2. Agar Colors ya Styling badalna ho:
- **Theme colors (White, Beige, Cream, Accent Brown):** 👉 `css/variables.css`
- **Buttons, inputs, alerts, toasts:** 👉 `css/base.css`
- **Catalog grid ya product cards:** 👉 `css/public.css`
- **Admin portal layout & tables:** 👉 `css/admin.css`
- **Slide drawer animations:** 👉 `css/drawer.css`

---

### 3. Agar Logic ya Functionality badalna ho:
- **Admin password check ya login behavior:** 👉 `js/modules/auth.js`
- **Products filter ya search algorithm:** 👉 `js/modules/catalog.js`
- **RFQ Inquiry cart calculation ya quantity slab:** 👉 `js/modules/inquiryCart.js`
- **GST quotation calculation (18% tax, HSN breakdown):** 👉 `js/modules/quotation.js`
- **Stock adjustment & audit ledger:** 👉 `js/modules/adminInventory.js`
- **Initial sample products / categories:** 👉 `js/data.js`

---

### 4. Agar Database ya Backend Email badalna ho:
- **PostgreSQL Database Schema:** 👉 `supabase/schema.sql`
- **RFQ Email Template & Brevo API:** 👉 `api/inquiry.js`
- **Quotation Email Dispatch via Brevo:** 👉 `api/send-quotation.js`
- **Environment variables (API keys):** 👉 `.env.example`
