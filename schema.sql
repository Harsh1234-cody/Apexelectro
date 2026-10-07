-- ===================================================================
-- APEX ELECTRO - INDUSTRIAL ELECTRICAL B2B PLATFORM
-- SUPABASE POSTGRESQL DATABASE SCHEMA (PRODUCTION DDL)
-- 100% Compatible with all Supabase PostgreSQL versions (14 / 15 / 16)
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. BUSINESS PROFILE (COMPANY & TAX SETTINGS)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Apex Electro Supplies & Switchgear Pvt. Ltd.',
  legal_name TEXT NOT NULL DEFAULT 'Apex Electro Supplies and Switchgear Private Limited',
  gstin TEXT NOT NULL DEFAULT '27AABCU9603R1ZM',
  cin TEXT DEFAULT 'U31909MH2016PTC288492',
  pan TEXT DEFAULT 'AABCU9603R',
  email TEXT NOT NULL DEFAULT 'sales@apexelectro.in',
  sales_phone TEXT NOT NULL DEFAULT '+91 22 2847 8899',
  support_phone TEXT NOT NULL DEFAULT '+91 98201 44552',
  whatsapp TEXT NOT NULL DEFAULT '+91 98201 44552',
  address_line1 TEXT NOT NULL DEFAULT 'Plot C-14, MIDC Industrial Area, Phase II',
  address_line2 TEXT DEFAULT 'Near Central Substation, Andheri East',
  city TEXT NOT NULL DEFAULT 'Mumbai',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  pincode TEXT NOT NULL DEFAULT '400093',
  country TEXT NOT NULL DEFAULT 'India',
  bank_name TEXT DEFAULT 'HDFC Bank Ltd.',
  bank_account_no TEXT DEFAULT '50200034891122',
  bank_ifsc TEXT DEFAULT 'HDFC0000128',
  bank_branch TEXT DEFAULT 'MIDC Andheri Branch',
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 2. CATEGORIES
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'zap',
  description TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 3. BRANDS (OEMs & MANUFACTURERS)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  origin TEXT DEFAULT 'India',
  tagline TEXT,
  logo_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 4. PRODUCTS CATALOG
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
  model_series TEXT,
  short_desc TEXT,
  full_desc TEXT,
  image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  price_type TEXT DEFAULT 'Per Unit', -- 'Per Unit', 'Fixed Price', 'Price on Request'
  unit_of_measure TEXT DEFAULT 'Piece', -- 'Meter', 'Piece', 'Box', 'Roll', 'Coil'
  base_unit_price NUMERIC(12, 2) DEFAULT 0.00,
  show_price_publicly BOOLEAN DEFAULT TRUE,
  specifications JSONB DEFAULT '{}'::jsonb,
  hsn_code TEXT DEFAULT '8536',
  gst_rate NUMERIC(4, 2) DEFAULT 18.00,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 5. PRODUCT VARIANTS (SKU, SPEC ATTRIBUTES & INVENTORY)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  sku_suffix TEXT NOT NULL,
  full_sku TEXT UNIQUE NOT NULL,
  spec_attributes JSONB DEFAULT '{}'::jsonb,
  additional_price NUMERIC(12, 2) DEFAULT 0.00,
  final_unit_price NUMERIC(12, 2) DEFAULT 0.00,
  stock_quantity INT DEFAULT 0,
  safety_stock_threshold INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 6. INQUIRIES (B2B RFQs)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  inquiry_number TEXT UNIQUE NOT NULL, -- e.g. INQ-2026-00001
  customer_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  gstin TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_pincode TEXT NOT NULL,
  project_type TEXT DEFAULT 'Commercial Contractor',
  notes TEXT,
  total_items INT DEFAULT 1,
  status TEXT DEFAULT 'New', -- 'New', 'Under Review', 'Quoted', 'Approved', 'Rejected'
  ip_address TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 7. INQUIRY LINE ITEMS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,
  quantity INT NOT NULL DEFAULT 1,
  target_price NUMERIC(12, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 8. QUOTATIONS (FORMAL GST QUOTE ENGINE)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotations (
  id TEXT PRIMARY KEY,
  quotation_number TEXT UNIQUE NOT NULL, -- e.g. QUO-2026-00001
  inquiry_id TEXT REFERENCES inquiries(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  gstin TEXT,
  validity_date DATE NOT NULL,
  subtotal NUMERIC(12, 2) DEFAULT 0.00,
  cgst_rate NUMERIC(4, 2) DEFAULT 9.00,
  cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  sgst_rate NUMERIC(4, 2) DEFAULT 9.00,
  sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  igst_rate NUMERIC(4, 2) DEFAULT 0.00,
  igst_amount NUMERIC(12, 2) DEFAULT 0.00,
  freight_charges NUMERIC(12, 2) DEFAULT 0.00,
  grand_total NUMERIC(12, 2) DEFAULT 0.00,
  payment_terms TEXT DEFAULT '100% advance against Proforma Invoice or Net 30 for approved credit.',
  dispatch_timeline TEXT DEFAULT 'Immediate ex-stock dispatch within 24-48 business hours.',
  notes TEXT,
  status TEXT DEFAULT 'Issued', -- 'Draft', 'Issued', 'Accepted', 'Declined', 'Expired'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 9. QUOTATION LINE ITEMS
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id TEXT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  variant_name TEXT,
  hsn_code TEXT DEFAULT '8536',
  quantity INT NOT NULL DEFAULT 1,
  unit_rate NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  taxable_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  gst_rate NUMERIC(4, 2) DEFAULT 18.00,
  gst_amount NUMERIC(12, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 10. STOCK AUDIT LEDGER (INVENTORY ADJUSTMENTS)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  previous_stock INT NOT NULL DEFAULT 0,
  change_qty INT NOT NULL,
  new_stock INT NOT NULL DEFAULT 0,
  reason TEXT NOT NULL, -- 'Batch Receipt PO-2026', 'Defective Scrapped', 'Order Dispatch', etc.
  updated_by TEXT DEFAULT 'Admin (Harsh)',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 11. CONTACT MESSAGES
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Unread', -- 'Unread', 'Read', 'Replied'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------
-- 12. PERFORMANCE INDEXES
-- -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_prod ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_number ON inquiries(inquiry_number);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotations_inquiry ON quotations(inquiry_id);

-- -------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------
ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent duplicate policy errors
DROP POLICY IF EXISTS "Public can view business profile" ON business_profile;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Public can view active brands" ON brands;
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Public can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public can select inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public can insert inquiry items" ON inquiry_items;
DROP POLICY IF EXISTS "Public can select inquiry items" ON inquiry_items;
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can select contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can select quotations" ON quotations;
DROP POLICY IF EXISTS "Public can insert quotations" ON quotations;
DROP POLICY IF EXISTS "Public can select quotation items" ON quotation_items;
DROP POLICY IF EXISTS "Public can insert quotation items" ON quotation_items;
DROP POLICY IF EXISTS "Public can select stock adjustments" ON stock_adjustments;
DROP POLICY IF EXISTS "Public can insert stock adjustments" ON stock_adjustments;
DROP POLICY IF EXISTS "Admins full access to business_profile" ON business_profile;
DROP POLICY IF EXISTS "Admins full access to categories" ON categories;
DROP POLICY IF EXISTS "Admins full access to brands" ON brands;
DROP POLICY IF EXISTS "Admins full access to products" ON products;
DROP POLICY IF EXISTS "Admins full access to product_variants" ON product_variants;
DROP POLICY IF EXISTS "Admins full access to inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins full access to inquiry_items" ON inquiry_items;
DROP POLICY IF EXISTS "Admins full access to quotations" ON quotations;
DROP POLICY IF EXISTS "Admins full access to quotation_items" ON quotation_items;
DROP POLICY IF EXISTS "Admins full access to stock_adjustments" ON stock_adjustments;
DROP POLICY IF EXISTS "Admins full access to contact_messages" ON contact_messages;

-- 1. Storefront Public Read Policies
CREATE POLICY "Public can view business profile" ON business_profile FOR SELECT USING (true);
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (true);

-- 2. Customer Inquiries & RFQs (Insert + Select confirmation)
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can select inquiries" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Public can insert inquiry items" ON inquiry_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can select inquiry items" ON inquiry_items FOR SELECT USING (true);
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can select contact messages" ON contact_messages FOR SELECT USING (true);

-- 3. Quotations & Stock Ledger
CREATE POLICY "Public can select quotations" ON quotations FOR SELECT USING (true);
CREATE POLICY "Public can insert quotations" ON quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can select quotation items" ON quotation_items FOR SELECT USING (true);
CREATE POLICY "Public can insert quotation items" ON quotation_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can select stock adjustments" ON stock_adjustments FOR SELECT USING (true);
CREATE POLICY "Public can insert stock adjustments" ON stock_adjustments FOR INSERT WITH CHECK (true);

-- 4. Full Admin CRUD (Works for both Authenticated Admin and Service Role)
CREATE POLICY "Admins full access to business_profile" ON business_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access to categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access to brands" ON brands FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access to products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins full access to product_variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);
