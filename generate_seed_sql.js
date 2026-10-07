// Script to generate supabase/seed.sql from js/data.js
const fs = require('fs');
const path = require('path');

// Mock browser window.INITIAL_DATA
global.window = {};
require('../js/data.js');
const data = global.INITIAL_DATA || window.INITIAL_DATA;

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ===================================================================
-- APEX ELECTRO B2B PLATFORM - SEED DATA FOR SUPABASE
-- Run this in your Supabase SQL Editor after running schema.sql
-- ===================================================================

-- Clear existing data if re-seeding
TRUNCATE TABLE quotation_items, quotations, inquiry_items, inquiries, stock_adjustments, contact_messages, product_variants, products, brands, categories, business_profile CASCADE;

-- 1. BUSINESS PROFILE
INSERT INTO business_profile (
  company_name, legal_name, gstin, email, sales_phone, support_phone, whatsapp,
  address_line1, city, state, pincode, country
) VALUES (
  ${esc(data.businessProfile.name)},
  ${esc(data.businessProfile.name)},
  ${esc(data.businessProfile.gstin)},
  ${esc(data.businessProfile.email)},
  ${esc(data.businessProfile.phone)},
  ${esc(data.businessProfile.phone)},
  ${esc(data.businessProfile.whatsapp)},
  ${esc(data.businessProfile.address)},
  'Navi Mumbai', 'Maharashtra', '400705', 'India'
);

-- 2. CATEGORIES
`;

data.categories.forEach(c => {
  sql += `INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.slug)}, ${esc(c.icon)}, ${esc(c.description)}, ${c.displayOrder || 0}, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n`;
});

sql += `\n-- 3. BRANDS\n`;
data.brands.forEach(b => {
  sql += `INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES (${esc(b.id)}, ${esc(b.name)}, ${esc(b.slug)}, ${esc(b.origin)}, ${esc(b.description)}, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n`;
});

sql += `\n-- 4. PRODUCTS & VARIANTS\n`;
data.products.forEach(p => {
  const specs = p.specifications || {};
  const gallery = p.images || [];
  const primaryImg = gallery[0] || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80';
  
  sql += `INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  ${esc(p.id)}, ${esc(p.sku)}, ${esc(p.name)}, ${esc(p.slug)}, ${esc(p.categoryId)}, ${esc(p.brandId)},
  ${esc(p.modelNumber || p.sku)}, ${esc(p.shortDescription)}, ${esc(p.fullDescription)},
  ${esc(primaryImg)}, ${esc(gallery)}, ${esc(p.pricingType || 'Per Unit')},
  ${esc(p.unit || 'Piece')}, ${p.basePrice || 0}, ${p.showPrice !== false},
  ${esc(specs)}, ${p.isFeatured ? 'TRUE' : 'FALSE'}, TRUE
) ON CONFLICT (id) DO NOTHING;\n`;

  if (Array.isArray(p.variants)) {
    p.variants.forEach(v => {
      const vAttrs = {
        size: v.name,
        color: v.color || null,
        pole: v.poles || null,
        curve: v.curve || null,
        rating: v.rating || null
      };
      sql += `INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  ${esc(v.id)}, ${esc(p.id)}, ${esc(v.name)}, ${esc(v.sku.split('-').pop())}, ${esc(v.sku)},
  ${esc(vAttrs)}, 0.00, ${v.price || 0}, ${v.stock || 0}, ${v.reorderLevel || 10}
) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }
});

const outDir = path.join(__dirname, '../supabase');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'seed.sql'), sql, 'utf8');
console.log('Successfully generated supabase/seed.sql!');
