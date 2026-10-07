-- ===================================================================
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
  'Apex Electro Supplies & Switchgear Pvt. Ltd.',
  'Apex Electro Supplies & Switchgear Pvt. Ltd.',
  '27AABCA1234F1Z9',
  'procurement@apexelectro.in',
  '+91 98201 44520',
  '+91 98201 44520',
  '+91 98201 44520',
  'Plot 42-B, Industrial Area Phase II, MIDC Electronics Zone, Navi Mumbai, MH 400705',
  'Navi Mumbai', 'Maharashtra', '400705', 'India'
);

-- 2. CATEGORIES
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-wires-cables', 'Wires & Cables', 'wires-and-cables', 'cable', 'Flame retardant, multi-strand house wires, industrial power cables, and instrumentation lines.', 1, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-mcb-protection', 'MCB & Electrical Protection', 'mcb-and-protection', 'shield-alert', 'Miniature circuit breakers, RCCBs, MCCBs, isolators, and industrial surge arresters.', 2, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-switches-sockets', 'Switches & Sockets', 'switches-and-sockets', 'toggle-right', 'Commercial and residential modular switches, multi-pin sockets, regulators, and touch panels.', 3, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-lighting', 'Lighting Systems', 'lighting-systems', 'lightbulb', 'Energy-efficient commercial LED fixtures, downlights, cleanroom panels, and floodlights.', 4, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-distribution', 'Distribution & Switchgear', 'distribution-and-switchgear', 'layout-grid', 'Heavy-duty SPN/TPN distribution boards, busbar chambers, and changeover switches.', 5, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-industrial', 'Industrial Electrical', 'industrial-electrical', 'cpu', 'Magnetic contactors, thermal overload relays, DIN-rail timers, and push buttons.', 6, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-fans', 'Fans & Ventilation', 'fans-and-ventilation', 'fan', 'High-airflow industrial air circulators, heavy-duty exhaust fans, and energy saver BLDC fans.', 7, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO categories (id, name, slug, icon, description, display_order, active)
VALUES ('cat-conduit', 'Conduit & Accessories', 'conduit-and-accessories', 'box', 'FRLS PVC conduits, GI flexible conduits, brass cable glands, and heavy nylon ties.', 8, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. BRANDS
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-polycab', 'Polycab', 'polycab', 'India', 'India''s leading manufacturer of high-grade wires and cables.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-havells', 'Havells', 'havells', 'India', 'Fast moving electrical goods powerhouse with industrial switchgear line.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-schneider', 'Schneider Electric', 'schneider-electric', 'France / Global', 'Global leader in energy management and digital automation solutions.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-finolex', 'Finolex', 'finolex', 'India', 'Specialists in precision automotive and industrial electrical cables.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-abb', 'ABB', 'abb', 'Switzerland', 'Pioneering technology leader in electrification and heavy industry automation.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-siemens', 'Siemens', 'siemens', 'Germany', 'Heavy electrical engineering, switchgear, and process automation solutions.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-legrand', 'Legrand', 'legrand', 'France', 'Architectural electrical installations and modular wiring devices.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-lt', 'L&T Electrical & Automation', 'lt-electrical', 'India', 'Robust low-voltage switchgear, panel accessories, and motor starters.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-anchor', 'Anchor by Panasonic', 'anchor', 'Japan / India', 'Pioneering modular wiring switches, accessories, and ceiling fittings.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-kei', 'KEI Industries', 'kei', 'India', 'EHV, HT, and LT power cables for infrastructure projects.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO brands (id, name, slug, origin, tagline, active)
VALUES ('brand-rr', 'RR Kabel', 'rr-kabel', 'India', 'Safety cables engineered with UNILAY conductor technology.', TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. PRODUCTS & VARIANTS
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-001', 'POL-GW-FRLS-1100V', 'Polycab Green Wire FRLS Flame Retardant House Wire', 'polycab-green-wire-frls-copper-cable', 'cat-wires-cables', 'brand-polycab',
  'GreenWire-Optima-FRLS', 'Electrolytic Grade 99.97% pure bright copper conductors insulated with specially formulated Flame Retardant Low Smoke PVC compound.', 'Polycab FRLS Industrial House Wires are manufactured with electrolytic grade copper that delivers minimum 100% conductivity. The insulation compound has a high oxygen index (>29%) and low acid gas emission (<20%), ensuring exceptional human safety during electrical fire conditions. Ideal for commercial towers, factories, and residential installations.',
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Meter', 28.5, true,
  '[{"name":"Voltage Grade","value":"1100 Volts (AC)"},{"name":"Conductor Material","value":"99.97% Pure Annealed Electrolytic Copper"},{"name":"Insulation Type","value":"FRLS PVC Type A (IS 5831:1984)"},{"name":"Operating Temp","value":"-15°C to +70°C"},{"name":"Oxygen Index","value":"> 29%"},{"name":"Standards","value":"IS 694 : 2010 with ISI Mark"},{"name":"Standard Coil Length","value":"90 Meters"}]'::jsonb, TRUE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-001-1', 'prod-001', '1.0 sq.mm (90m Coil)', 'RED', 'POL-GW-1.0-RED',
  '{"size":"1.0 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 18.2, 3500, 500
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-001-2', 'prod-001', '1.5 sq.mm (90m Coil)', 'RED', 'POL-GW-1.5-RED',
  '{"size":"1.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 28.5, 4250, 600
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-001-3', 'prod-001', '2.5 sq.mm (90m Coil)', 'RED', 'POL-GW-2.5-RED',
  '{"size":"2.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 44, 2800, 500
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-001-4', 'prod-001', '4.0 sq.mm (90m Coil)', 'RED', 'POL-GW-4.0-RED',
  '{"size":"4.0 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 68.5, 1200, 400
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-001-5', 'prod-001', '6.0 sq.mm (90m Coil)', 'RED', 'POL-GW-6.0-RED',
  '{"size":"6.0 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 102, 850, 300
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-002', 'SCH-ACTI9-IC60N', 'Schneider Electric Acti9 iC60N Miniature Circuit Breaker (MCB)', 'schneider-acti9-ic60n-miniature-circuit-breaker', 'cat-mcb-protection', 'brand-schneider',
  'Acti9-iC60N-C-Curve', 'Industrial grade 10kA breaking capacity DIN rail MCB with VisiTrip and VisiSafe protection indicators.', 'Schneider Acti9 iC60N MCB provides absolute short circuit and thermal overload protection for industrial automation control panels and commercial distribution networks. Featuring patented VisiTrip red mechanical indicator for rapid fault diagnosis and VisiSafe green strip ensuring downstream circuit is 100% de-energized.',
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Piece', 420, true,
  '[{"name":"Rated Breaking Capacity","value":"10 kA at 415V AC conforming to IEC/EN 60947-2"},{"name":"Trip Curve","value":"C Curve (5 to 10 In)"},{"name":"Rated Voltage (Ue)","value":"230V / 400V AC 50/60Hz"},{"name":"Impulse Voltage (Uimp)","value":"6 kV"},{"name":"Mounting Support","value":"35mm Symmetrical DIN Rail"},{"name":"IP Protection","value":"IP20 (Bared terminal), IP40 (Modular enclosure)"},{"name":"Electrical Endurance","value":"10,000 cycles"}]'::jsonb, TRUE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-002-1', 'prod-002', '1 Pole - 10A (C Curve)', '10A', 'SCH-IC60N-1P-10A',
  '{"size":"1 Pole - 10A (C Curve)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 280, 120, 25
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-002-2', 'prod-002', '1 Pole - 16A (C Curve)', '16A', 'SCH-IC60N-1P-16A',
  '{"size":"1 Pole - 16A (C Curve)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 290, 180, 30
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-002-3', 'prod-002', '2 Pole - 20A (C Curve)', '20A', 'SCH-IC60N-2P-20A',
  '{"size":"2 Pole - 20A (C Curve)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 740, 85, 20
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-002-4', 'prod-002', '3 Pole - 32A (C Curve)', '32A', 'SCH-IC60N-3P-32A',
  '{"size":"3 Pole - 32A (C Curve)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 1450, 45, 15
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-002-5', 'prod-002', '4 Pole - 63A (C Curve)', '63A', 'SCH-IC60N-4P-63A',
  '{"size":"4 Pole - 63A (C Curve)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 2680, 22, 10
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-003', 'HAV-ADORE-2X2-36W', 'Havells Adore 2x2 Cleanroom Backlit LED Panel', 'havells-adore-cleanroom-backlit-led-panel', 'cat-lighting', 'brand-havells',
  'Adore-LED-36W-CW', 'High-efficacy commercial ceiling recessed backlit LED panel with anti-glare micro-prismatic optics.', 'Havells Adore series recessed LED luminaire engineered for offices, corporate headquarters, hospitals, and cleanrooms. Built with extruded aluminum housing for rapid thermal dissipation, high CRI > 80, and zero-flicker constant current LED drivers.',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Piece', 1750, true,
  '[{"name":"Wattage","value":"36W / 48W"},{"name":"Luminous Flux","value":"3,960 Lumens (110 lm/W)"},{"name":"Color Temperature","value":"6500K (Cool Day Light) / 4000K"},{"name":"Input Voltage","value":"140V - 300V AC, 50Hz"},{"name":"Power Factor","value":"> 0.95"},{"name":"CRI","value":"Ra > 80"},{"name":"Dimensions","value":"595 x 595 x 35 mm"}]'::jsonb, TRUE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-003-1', 'prod-003', '36W - 6500K Cool Daylight', 'CDL', 'HAV-ADR-36W-CDL',
  '{"size":"36W - 6500K Cool Daylight","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 1750, 320, 50
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-003-2', 'prod-003', '36W - 4000K Neutral White', 'NW', 'HAV-ADR-36W-NW',
  '{"size":"36W - 4000K Neutral White","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 1750, 140, 40
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-003-3', 'prod-003', '48W - 6500K High Output', 'CDL', 'HAV-ADR-48W-CDL',
  '{"size":"48W - 6500K High Output","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 2150, 85, 25
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-004', 'ABB-AF09-30-10-13', 'ABB AF09 3-Pole Heavy Duty Motor Contactor', 'abb-af09-3-pole-heavy-duty-motor-contactor', 'cat-industrial', 'brand-abb',
  'AF09-30-10-13-24-250V', 'Compact 3-pole contactor with wide-range electronically controlled coil (100-250V AC/DC) for motor control.', 'ABB AF09 3-pole contactors are designed for controlling electric motors up to 4 kW (400V) and switching power circuits up to 25A (AC-1). Equipped with electronic coil interface accepting wide control voltages, eliminating contact chatter and coil burnout from grid fluctuations.',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Price on Request',
  'Piece', 0, false,
  '[{"name":"Number of Main Poles","value":"3 NO (Normally Open)"},{"name":"Auxiliary Contacts","value":"1 NO Built-in"},{"name":"Rated Operational Current AC-3","value":"9A / 12A / 16A / 26A (at 400V)"},{"name":"Control Coil Voltage","value":"100...250 V AC 50/60 Hz / DC"},{"name":"Terminal Type","value":"Screw Terminals"},{"name":"Mounting Type","value":"DIN-Rail 35mm / Baseplate Screw"}]'::jsonb, TRUE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-004-1', 'prod-004', '9A (4 kW AC-3) - 100-250V Coil', '100V', 'ABB-AF09-9A-100V',
  '{"size":"9A (4 kW AC-3) - 100-250V Coil","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 1850, 65, 15
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-004-2', 'prod-004', '12A (5.5 kW AC-3) - 100-250V Coil', '100V', 'ABB-AF12-12A-100V',
  '{"size":"12A (5.5 kW AC-3) - 100-250V Coil","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 2190, 40, 10
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-004-3', 'prod-004', '16A (7.5 kW AC-3) - 100-250V Coil', '100V', 'ABB-AF16-16A-100V',
  '{"size":"16A (7.5 kW AC-3) - 100-250V Coil","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 2650, 30, 8
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-004-4', 'prod-004', '26A (11 kW AC-3) - 100-250V Coil', '100V', 'ABB-AF26-26A-100V',
  '{"size":"26A (11 kW AC-3) - 100-250V Coil","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 3850, 18, 5
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-005', 'LEG-ART-572000', 'Legrand Arteor Anthracite Modular Switches & Sockets', 'legrand-arteor-anthracite-modular-switches', 'cat-switches-sockets', 'brand-legrand',
  'Arteor-Mech-10AX', 'Luxury Italian-designed modular switch mechanisms with silver alloy contacts and soft-click ergonomics.', 'Legrand Arteor is an international standard modular wiring system tailored for modern commercial towers, luxury hotels, and executive spaces. Tested for over 40,000 switching operations with self-extinguishing polycarbonate casing.',
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Piece', 195, true,
  '[{"name":"Rated Voltage","value":"240V AC 50/60Hz"},{"name":"Contact Material","value":"Silver Nickel Alloy"},{"name":"Modules","value":"1M / 2M Standard DIN Grid"},{"name":"Housing Material","value":"Flame Retardant Polycarbonate (UV Stabilized)"},{"name":"Certification","value":"IS 3854: 1997 / CE"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-005-1', 'prod-005', '1-Way 10AX 1-Module Switch', '10A', 'LEG-ART-1W-10A',
  '{"size":"1-Way 10AX 1-Module Switch","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 195, 850, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-005-2', 'prod-005', '2-Way 10AX 1-Module Switch', '10A', 'LEG-ART-2W-10A',
  '{"size":"2-Way 10AX 1-Module Switch","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 245, 420, 60
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-005-3', 'prod-005', '16A Heavy Duty Switch with Indicator', 'IND', 'LEG-ART-16A-IND',
  '{"size":"16A Heavy Duty Switch with Indicator","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 340, 310, 50
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-005-4', 'prod-005', '6/16A Universal 3-Pin Socket (2 Mod)', 'UNI', 'LEG-ART-SOC-UNI',
  '{"size":"6/16A Universal 3-Pin Socket (2 Mod)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 410, 580, 80
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-006', 'SIE-3VA1-TM210', 'Siemens 3VA1 MCCB Moulded Case Circuit Breaker', 'siemens-3va1-mccb-moulded-case-circuit-breaker', 'cat-mcb-protection', 'brand-siemens',
  '3VA11-160-3P', 'Heavy-duty 160A 3-Pole 25kA MCCB with thermal-magnetic trip unit for main incomers and motor feeders.', 'Siemens 3VA1 MCCB provides robust line protection for industrial switchboards. Featuring compact dimensions, adjustable thermal overload setting (0.7 to 1.0 x In), and fixed magnetic short circuit protection.',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Price on Request',
  'Piece', 0, false,
  '[{"name":"Poles","value":"3 Pole / 4 Pole"},{"name":"Breaking Capacity (Icu)","value":"25 kA / 36 kA at 415V AC"},{"name":"Trip Unit Type","value":"Thermal-Magnetic TM210 (FTFM / ATFM)"},{"name":"Rated Insulation Voltage (Ui)","value":"800V AC"},{"name":"Standard","value":"IEC 60947-2"}]'::jsonb, TRUE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-006-1', 'prod-006', '3-Pole 63A (25kA)', '63A', 'SIE-3VA1-3P-63A',
  '{"size":"3-Pole 63A (25kA)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 6800, 14, 4
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-006-2', 'prod-006', '3-Pole 100A (25kA)', '100A', 'SIE-3VA1-3P-100A',
  '{"size":"3-Pole 100A (25kA)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 7450, 12, 4
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-006-3', 'prod-006', '3-Pole 160A (25kA)', '160A', 'SIE-3VA1-3P-160A',
  '{"size":"3-Pole 160A (25kA)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 9200, 8, 3
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-006-4', 'prod-006', '4-Pole 250A (36kA)', '250A', 'SIE-3VA1-4P-250A',
  '{"size":"4-Pole 250A (36kA)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 16500, 4, 2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-007', 'POL-4C-XLPE-A2XWY', 'Polycab 4-Core XLPE Armoured Aluminum Power Cable', 'polycab-4-core-xlpe-armoured-power-cable', 'cat-wires-cables', 'brand-polycab',
  'A2XWY-1.1KV', 'Underground LT heavy armored aluminum cable for industrial substation and primary load distribution.', 'Constructed with stranded compacted sector shaped aluminum conductors, cross-linked polyethylene (XLPE) insulation, extruded inner PVC sheath, galvanized round steel wire/flat strip armouring, and UV resistant outer ST2 PVC sheath.',
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Meter', 380, true,
  '[{"name":"Conductor","value":"Class 2 Stranded Compacted H2 Aluminum"},{"name":"Insulation","value":"XLPE (Cross Linked Polyethylene)"},{"name":"Armour Type","value":"Galvanized Round Steel Wire / Flat Strip (IS 3975)"},{"name":"Sheath Color","value":"Black with meter markings"},{"name":"Standard","value":"IS 7098 (Part 1) : 1988"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-007-1', 'prod-007', '4C x 25 sq.mm (Aluminum XLPE)', 'ARM', 'POL-4C-25-ARM',
  '{"size":"4C x 25 sq.mm (Aluminum XLPE)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 240, 1200, 300
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-007-2', 'prod-007', '4C x 50 sq.mm (Aluminum XLPE)', 'ARM', 'POL-4C-50-ARM',
  '{"size":"4C x 50 sq.mm (Aluminum XLPE)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 380, 950, 250
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-007-3', 'prod-007', '4C x 95 sq.mm (Aluminum XLPE)', 'ARM', 'POL-4C-95-ARM',
  '{"size":"4C x 95 sq.mm (Aluminum XLPE)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 620, 650, 200
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-007-4', 'prod-007', '4C x 185 sq.mm (Aluminum XLPE)', 'ARM', 'POL-4C-185-ARM',
  '{"size":"4C x 185 sq.mm (Aluminum XLPE)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 1150, 350, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-008', 'LT-TRIP-TPN-08W', 'L&T Tripper TPN Vertical Distribution Board with Door', 'lt-tripper-tpn-vertical-distribution-board', 'cat-distribution', 'brand-lt',
  'Tripper-TPN-Vert-8Way', 'IP43 CRCA sheet steel vertical TPN distribution board suitable for MCCB/Isolator incomer and MCB outgoings.', 'L&T Tripper Vertical TPN Distribution Board provides safety and organized cable routing in industrial plants. Powder coated with corrosion resistant RAL 7035 finish, insulated copper busbars rated for 200A, and detachable gland plates.',
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Fixed Price',
  'Piece', 5850, true,
  '[{"name":"Enclosure Sheet","value":"1.2mm High Grade CRCA Sheet Steel"},{"name":"Protection Class","value":"IP43 with Double Door"},{"name":"Busbar Rating","value":"200A Electrolytic Grade Copper"},{"name":"Paint Finish","value":"Epoxy Polyester Powder Coating (RAL 7035)"},{"name":"Standard","value":"IEC 61439-1 & 3"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-008-1', 'prod-008', '4-Way TPN Vertical DB', '4W', 'LT-DB-TPN-4W',
  '{"size":"4-Way TPN Vertical DB","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 4600, 24, 5
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-008-2', 'prod-008', '8-Way TPN Vertical DB', '8W', 'LT-DB-TPN-8W',
  '{"size":"8-Way TPN Vertical DB","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 5850, 18, 5
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-008-3', 'prod-008', '12-Way TPN Vertical DB', '12W', 'LT-DB-TPN-12W',
  '{"size":"12-Way TPN Vertical DB","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 7200, 10, 3
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-009', 'FIN-FG-FRLS-1100V', 'Finolex Flameguard FRLS Multi-Strand Industrial Building Wire', 'finolex-flameguard-frls-copper-wire', 'cat-wires-cables', 'brand-finolex',
  'Flameguard-FRLS', 'Electrolytic pure copper multi-strand conductors with high thermal stability and fire-retardant insulation.', 'Finolex Flameguard FRLS wires are precision-engineered with 99.97% bright annealed electrolytic copper, ensuring lower resistance and reduced energy loss. Specially formulated flame retardant PVC compound emits minimal non-toxic smoke during electrical contingencies. Certified for ISI 694 standards.',
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Meter', 29.2, true,
  '[{"name":"Conductor","value":"99.97% Electrolytic Pure Annealed Copper"},{"name":"Insulation","value":"Special FRLS Grade PVC Compound"},{"name":"Voltage Grade","value":"1100 Volts (AC)"},{"name":"Standards","value":"IS 694:2010 with ISI mark"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-009-1', 'prod-009', '1.0 sq.mm (90m Coil)', 'RED', 'FIN-FG-1.0-RED',
  '{"size":"1.0 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 19.5, 1200, 200
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-009-2', 'prod-009', '1.5 sq.mm (90m Coil)', 'RED', 'FIN-FG-1.5-RED',
  '{"size":"1.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 29.2, 850, 150
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-009-3', 'prod-009', '2.5 sq.mm (90m Coil)', 'BLU', 'FIN-FG-2.5-BLU',
  '{"size":"2.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 46.8, 600, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-010', 'ANC-ROMA-10AX-1M', 'Anchor by Panasonic Roma Classic Modular Switch & Socket Set', 'anchor-roma-classic-modular-switch', 'cat-modular-switches', 'brand-anchor',
  'Roma-Classic-1M', 'Pioneering modular design with silver-cadmium contacts for high endurance and smooth tactile switching.', 'Anchor Roma Classic by Panasonic represents India''s most trusted modular wiring solution. Equipped with arc-shield technology, heavy silver alloy contacts, and UV-stabilized flame-retardant poly-carbonate body. Tested to over 100,000 electrical operations.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Piece', 65, true,
  '[{"name":"Current Rating","value":"10AX / 16A / 20A at 240V AC"},{"name":"Contact Material","value":"Silver Cadmium Oxide Alloy"},{"name":"Body Material","value":"Flame Retardant Engineering Polycarbonate"},{"name":"Compliance","value":"IS 3854:1997"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-010-1', 'prod-010', '10AX 1-Way Switch 1M White', '1W', 'ANC-ROMA-10A-1W',
  '{"size":"10AX 1-Way Switch 1M White","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 65, 450, 50
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-010-2', 'prod-010', '20A Heavy Duty 1-Way Switch 1M', '1W', 'ANC-ROMA-20A-1W',
  '{"size":"20A Heavy Duty 1-Way Switch 1M","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 115, 280, 30
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-010-3', 'prod-010', '6/16A Combined Shuttered Socket 2M', '16A', 'ANC-ROMA-SOC-16A',
  '{"size":"6/16A Combined Shuttered Socket 2M","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 160, 320, 40
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-011', 'KEI-CONF-1.1KV-CBL', 'KEI Conflame FRLS Multi-Core Industrial Control Cable', 'kei-conflame-frls-copper-control-cable', 'cat-wires-cables', 'brand-kei',
  'Conflame-Control-FRLS', 'Heavy-duty 1100V multi-core copper control cable engineered for automation and instrumentation panels.', 'KEI Conflame FRLS Control Cables are designed for critical control circuits in thermal plants, steel mills, and automated machinery. Annealed bare high-conductivity copper conductor insulated with high-grade FRLS PVC with extruded inner sheath and galvanized steel wire armouring.',
  'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Meter', 145, true,
  '[{"name":"Conductor","value":"Class 2 Stranded Pure Annealed Copper"},{"name":"Armouring","value":"Galvanized Mild Steel Wire / Strip"},{"name":"Outer Sheath","value":"FRLS PVC Compound Oxygen Index >29%"},{"name":"Standard","value":"IS 1554 Part 1 / IS 7098"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-011-1', 'prod-011', '4 Core x 1.5 sq.mm Armoured', '1.5', 'KEI-CTL-4C-1.5',
  '{"size":"4 Core x 1.5 sq.mm Armoured","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 110, 950, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-011-2', 'prod-011', '4 Core x 2.5 sq.mm Armoured', '2.5', 'KEI-CTL-4C-2.5',
  '{"size":"4 Core x 2.5 sq.mm Armoured","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 145, 700, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-011-3', 'prod-011', '7 Core x 1.5 sq.mm Armoured', '1.5', 'KEI-CTL-7C-1.5',
  '{"size":"7 Core x 1.5 sq.mm Armoured","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 195, 450, 50
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, sku, title, slug, category_id, brand_id, model_series, short_desc, full_desc,
  image_url, gallery, price_type, unit_of_measure, base_unit_price, show_price_publicly,
  specifications, featured, active
) VALUES (
  'prod-012', 'RR-SUPEREX-FR-1100V', 'RR Kabel Superex FR PVC Insulated Industrial Building Wire', 'rr-kabel-superex-fr-copper-wire', 'cat-wires-cables', 'brand-rr',
  'Superex-FR-UNILAY', 'Unilay conductor technology wire preventing conductor breakage with superior flame retardant properties.', 'RR Kabel Superex FR wires feature 100% Electrolytic Grade copper bunched with patented UNILAY conductor design. The uniform compact bunching prevents conductor spread during crimping and reduces heat build-up at terminations. High insulation resistance and dielectric strength.',
  'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Per Unit',
  'Meter', 28.9, true,
  '[{"name":"Conductor","value":"Electrolytic Copper with UNILAY Bunching"},{"name":"Insulation","value":"FR Flame Retardant PVC"},{"name":"Temperature Rating","value":"-15°C to +70°C Operating Range"},{"name":"Certifications","value":"IS 694, CE, REACH & RoHS Compliant"}]'::jsonb, FALSE, TRUE
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-012-1', 'prod-012', '1.5 sq.mm (90m Coil)', 'RED', 'RR-SX-1.5-RED',
  '{"size":"1.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 28.9, 800, 100
) ON CONFLICT (id) DO NOTHING;
INSERT INTO product_variants (
  id, product_id, variant_name, sku_suffix, full_sku, spec_attributes,
  additional_price, final_unit_price, stock_quantity, safety_stock_threshold
) VALUES (
  'var-012-2', 'prod-012', '2.5 sq.mm (90m Coil)', 'YEL', 'RR-SX-2.5-YEL',
  '{"size":"2.5 sq.mm (90m Coil)","color":null,"pole":null,"curve":null,"rating":null}'::jsonb, 0.00, 47.5, 650, 100
) ON CONFLICT (id) DO NOTHING;
