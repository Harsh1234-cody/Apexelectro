// Initial Mock Database for Electrical Supplies Vendor Management System
// Structured according to the 73-point technical specification brief

const INITIAL_DATA = {
  businessProfile: {
    name: "Apex Electro Supplies & Switchgear Pvt. Ltd.",
    tagline: "Authorized Industrial Electrical Distributor & Wholesale Procurement Partner",
    about: "Apex Electro Supplies is a premier B2B distributor providing certified electrical switchgear, industrial cables, power distribution equipment, and automation components to commercial EPC contractors, panel builders, and industrial plants across India.",
    phone: "+91 98201 44520",
    email: "procurement@apexelectro.in",
    whatsapp: "+91 98201 44520",
    address: "Plot 42-B, Industrial Area Phase II, MIDC Electronics Zone, Navi Mumbai, MH 400705",
    gstin: "27AABCA1234F1Z9",
    businessHours: "Mon - Sat: 9:00 AM - 7:30 PM (IST)",
    websiteUrl: "https://apexelectro.in",
    currencySymbol: "₹"
  },

  categories: [
    {
      id: "cat-wires-cables",
      name: "Wires & Cables",
      slug: "wires-and-cables",
      description: "Flame retardant, multi-strand house wires, industrial power cables, and instrumentation lines.",
      icon: "cable",
      displayOrder: 1,
      isActive: true,
      subcategories: ["House Wire", "Flexible Cable", "Power Cable", "Control Cable", "Armoured Cable", "Communication Cable"]
    },
    {
      id: "cat-mcb-protection",
      name: "MCB & Electrical Protection",
      slug: "mcb-and-protection",
      description: "Miniature circuit breakers, RCCBs, MCCBs, isolators, and industrial surge arresters.",
      icon: "shield-alert",
      displayOrder: 2,
      isActive: true,
      subcategories: ["MCB", "RCCB", "RCBO", "MCCB", "Isolator", "Fuse"]
    },
    {
      id: "cat-switches-sockets",
      name: "Switches & Sockets",
      slug: "switches-and-sockets",
      description: "Commercial and residential modular switches, multi-pin sockets, regulators, and touch panels.",
      icon: "toggle-right",
      displayOrder: 3,
      isActive: true,
      subcategories: ["Modular Switch", "Socket", "Fan Regulator", "Bell Push", "USB Socket"]
    },
    {
      id: "cat-lighting",
      name: "Lighting Systems",
      slug: "lighting-systems",
      description: "Energy-efficient commercial LED fixtures, downlights, cleanroom panels, and floodlights.",
      icon: "lightbulb",
      displayOrder: 4,
      isActive: true,
      subcategories: ["LED Bulb", "LED Panel", "Flood Light", "Street Light", "Tube Light", "Downlight"]
    },
    {
      id: "cat-distribution",
      name: "Distribution & Switchgear",
      slug: "distribution-and-switchgear",
      description: "Heavy-duty SPN/TPN distribution boards, busbar chambers, and changeover switches.",
      icon: "layout-grid",
      displayOrder: 5,
      isActive: true,
      subcategories: ["Distribution Board", "DB Box", "Busbar", "Changeover"]
    },
    {
      id: "cat-industrial",
      name: "Industrial Electrical",
      slug: "industrial-electrical",
      description: "Magnetic contactors, thermal overload relays, DIN-rail timers, and push buttons.",
      icon: "cpu",
      displayOrder: 6,
      isActive: true,
      subcategories: ["Contactor", "Relay", "Timer", "Push Button", "Indicator", "Terminal Block"]
    },
    {
      id: "cat-fans",
      name: "Fans & Ventilation",
      slug: "fans-and-ventilation",
      description: "High-airflow industrial air circulators, heavy-duty exhaust fans, and energy saver BLDC fans.",
      icon: "fan",
      displayOrder: 7,
      isActive: true,
      subcategories: ["Ceiling Fan", "Exhaust Fan", "Industrial Fan"]
    },
    {
      id: "cat-conduit",
      name: "Conduit & Accessories",
      slug: "conduit-and-accessories",
      description: "FRLS PVC conduits, GI flexible conduits, brass cable glands, and heavy nylon ties.",
      icon: "box",
      displayOrder: 8,
      isActive: true,
      subcategories: ["PVC Conduit", "Flexible Conduit", "Junction Box", "Cable Gland", "Cable Tie"]
    }
  ],

  brands: [
    { id: "brand-polycab", name: "Polycab", slug: "polycab", origin: "India", description: "India's leading manufacturer of high-grade wires and cables.", isActive: true, productCount: 4 },
    { id: "brand-havells", name: "Havells", slug: "havells", origin: "India", description: "Fast moving electrical goods powerhouse with industrial switchgear line.", isActive: true, productCount: 3 },
    { id: "brand-schneider", name: "Schneider Electric", slug: "schneider-electric", origin: "France / Global", description: "Global leader in energy management and digital automation solutions.", isActive: true, productCount: 3 },
    { id: "brand-finolex", name: "Finolex", slug: "finolex", origin: "India", description: "Specialists in precision automotive and industrial electrical cables.", isActive: true, productCount: 2 },
    { id: "brand-abb", name: "ABB", slug: "abb", origin: "Switzerland", description: "Pioneering technology leader in electrification and heavy industry automation.", isActive: true, productCount: 2 },
    { id: "brand-siemens", name: "Siemens", slug: "siemens", origin: "Germany", description: "Heavy electrical engineering, switchgear, and process automation solutions.", isActive: true, productCount: 2 },
    { id: "brand-legrand", name: "Legrand", slug: "legrand", origin: "France", description: "Architectural electrical installations and modular wiring devices.", isActive: true, productCount: 2 },
    { id: "brand-lt", name: "L&T Electrical & Automation", slug: "lt-electrical", origin: "India", description: "Robust low-voltage switchgear, panel accessories, and motor starters.", isActive: true, productCount: 2 },
    { id: "brand-anchor", name: "Anchor by Panasonic", slug: "anchor", origin: "Japan / India", description: "Pioneering modular wiring switches, accessories, and ceiling fittings.", isActive: true, productCount: 2 },
    { id: "brand-kei", name: "KEI Industries", slug: "kei", origin: "India", description: "EHV, HT, and LT power cables for infrastructure projects.", isActive: true, productCount: 1 },
    { id: "brand-rr", name: "RR Kabel", slug: "rr-kabel", origin: "India", description: "Safety cables engineered with UNILAY conductor technology.", isActive: true, productCount: 1 }
  ],

  products: [
    {
      id: "prod-001",
      name: "Polycab Green Wire FRLS Flame Retardant House Wire",
      slug: "polycab-green-wire-frls-copper-cable",
      brandId: "brand-polycab",
      brandName: "Polycab",
      categoryId: "cat-wires-cables",
      categoryName: "Wires & Cables",
      subcategory: "House Wire",
      sku: "POL-GW-FRLS-1100V",
      productCode: "POL-CBL-402",
      modelNumber: "GreenWire-Optima-FRLS",
      manufacturerPartNumber: "PC-GW-FRLS-90M",
      shortDescription: "Electrolytic Grade 99.97% pure bright copper conductors insulated with specially formulated Flame Retardant Low Smoke PVC compound.",
      fullDescription: "Polycab FRLS Industrial House Wires are manufactured with electrolytic grade copper that delivers minimum 100% conductivity. The insulation compound has a high oxygen index (>29%) and low acid gas emission (<20%), ensuring exceptional human safety during electrical fire conditions. Ideal for commercial towers, factories, and residential installations.",
      images: [
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 28.50,
      unit: "Meter",
      bulkPricing: [
        { minQty: 100, maxQty: 500, price: 27.50, unit: "Meter" },
        { minQty: 501, maxQty: 2000, price: 25.80, unit: "Meter" },
        { minQty: 2001, maxQty: null, price: 23.90, unit: "Meter" }
      ],
      status: "Active",
      isFeatured: true,
      variants: [
        { id: "var-001-1", name: "1.0 sq.mm (90m Coil)", sku: "POL-GW-1.0-RED", price: 18.20, stock: 3500, unit: "Meter", reorderLevel: 500 },
        { id: "var-001-2", name: "1.5 sq.mm (90m Coil)", sku: "POL-GW-1.5-RED", price: 28.50, stock: 4250, unit: "Meter", reorderLevel: 600 },
        { id: "var-001-3", name: "2.5 sq.mm (90m Coil)", sku: "POL-GW-2.5-RED", price: 44.00, stock: 2800, unit: "Meter", reorderLevel: 500 },
        { id: "var-001-4", name: "4.0 sq.mm (90m Coil)", sku: "POL-GW-4.0-RED", price: 68.50, stock: 1200, unit: "Meter", reorderLevel: 400 },
        { id: "var-001-5", name: "6.0 sq.mm (90m Coil)", sku: "POL-GW-6.0-RED", price: 102.00, stock: 850, unit: "Meter", reorderLevel: 300 }
      ],
      specifications: [
        { name: "Voltage Grade", value: "1100 Volts (AC)" },
        { name: "Conductor Material", value: "99.97% Pure Annealed Electrolytic Copper" },
        { name: "Insulation Type", value: "FRLS PVC Type A (IS 5831:1984)" },
        { name: "Operating Temp", value: "-15°C to +70°C" },
        { name: "Oxygen Index", value: "> 29%" },
        { name: "Standards", value: "IS 694 : 2010 with ISI Mark" },
        { name: "Standard Coil Length", value: "90 Meters" }
      ]
    },

    {
      id: "prod-002",
      name: "Schneider Electric Acti9 iC60N Miniature Circuit Breaker (MCB)",
      slug: "schneider-acti9-ic60n-miniature-circuit-breaker",
      brandId: "brand-schneider",
      brandName: "Schneider Electric",
      categoryId: "cat-mcb-protection",
      categoryName: "MCB & Electrical Protection",
      subcategory: "MCB",
      sku: "SCH-ACTI9-IC60N",
      productCode: "SCH-MCB-A9N",
      modelNumber: "Acti9-iC60N-C-Curve",
      manufacturerPartNumber: "A9F74216",
      shortDescription: "Industrial grade 10kA breaking capacity DIN rail MCB with VisiTrip and VisiSafe protection indicators.",
      fullDescription: "Schneider Acti9 iC60N MCB provides absolute short circuit and thermal overload protection for industrial automation control panels and commercial distribution networks. Featuring patented VisiTrip red mechanical indicator for rapid fault diagnosis and VisiSafe green strip ensuring downstream circuit is 100% de-energized.",
      images: [
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 420.00,
      unit: "Piece",
      bulkPricing: [
        { minQty: 10, maxQty: 50, price: 395.00, unit: "Piece" },
        { minQty: 51, maxQty: 200, price: 370.00, unit: "Piece" },
        { minQty: 201, maxQty: null, price: 345.00, unit: "Piece" }
      ],
      status: "Active",
      isFeatured: true,
      variants: [
        { id: "var-002-1", name: "1 Pole - 10A (C Curve)", sku: "SCH-IC60N-1P-10A", price: 280.00, stock: 120, unit: "Piece", reorderLevel: 25 },
        { id: "var-002-2", name: "1 Pole - 16A (C Curve)", sku: "SCH-IC60N-1P-16A", price: 290.00, stock: 180, unit: "Piece", reorderLevel: 30 },
        { id: "var-002-3", name: "2 Pole - 20A (C Curve)", sku: "SCH-IC60N-2P-20A", price: 740.00, stock: 85, unit: "Piece", reorderLevel: 20 },
        { id: "var-002-4", name: "3 Pole - 32A (C Curve)", sku: "SCH-IC60N-3P-32A", price: 1450.00, stock: 45, unit: "Piece", reorderLevel: 15 },
        { id: "var-002-5", name: "4 Pole - 63A (C Curve)", sku: "SCH-IC60N-4P-63A", price: 2680.00, stock: 22, unit: "Piece", reorderLevel: 10 }
      ],
      specifications: [
        { name: "Rated Breaking Capacity", value: "10 kA at 415V AC conforming to IEC/EN 60947-2" },
        { name: "Trip Curve", value: "C Curve (5 to 10 In)" },
        { name: "Rated Voltage (Ue)", value: "230V / 400V AC 50/60Hz" },
        { name: "Impulse Voltage (Uimp)", value: "6 kV" },
        { name: "Mounting Support", value: "35mm Symmetrical DIN Rail" },
        { name: "IP Protection", value: "IP20 (Bared terminal), IP40 (Modular enclosure)" },
        { name: "Electrical Endurance", value: "10,000 cycles" }
      ]
    },

    {
      id: "prod-003",
      name: "Havells Adore 2x2 Cleanroom Backlit LED Panel",
      slug: "havells-adore-cleanroom-backlit-led-panel",
      brandId: "brand-havells",
      brandName: "Havells",
      categoryId: "cat-lighting",
      categoryName: "Lighting Systems",
      subcategory: "LED Panel",
      sku: "HAV-ADORE-2X2-36W",
      productCode: "HAV-LGT-202",
      modelNumber: "Adore-LED-36W-CW",
      manufacturerPartNumber: "LHECD0P70360",
      shortDescription: "High-efficacy commercial ceiling recessed backlit LED panel with anti-glare micro-prismatic optics.",
      fullDescription: "Havells Adore series recessed LED luminaire engineered for offices, corporate headquarters, hospitals, and cleanrooms. Built with extruded aluminum housing for rapid thermal dissipation, high CRI > 80, and zero-flicker constant current LED drivers.",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 1750.00,
      unit: "Piece",
      bulkPricing: [
        { minQty: 10, maxQty: 50, price: 1620.00, unit: "Piece" },
        { minQty: 51, maxQty: 150, price: 1510.00, unit: "Piece" },
        { minQty: 151, maxQty: null, price: 1390.00, unit: "Piece" }
      ],
      status: "Active",
      isFeatured: true,
      variants: [
        { id: "var-003-1", name: "36W - 6500K Cool Daylight", sku: "HAV-ADR-36W-CDL", price: 1750.00, stock: 320, unit: "Piece", reorderLevel: 50 },
        { id: "var-003-2", name: "36W - 4000K Neutral White", sku: "HAV-ADR-36W-NW", price: 1750.00, stock: 140, unit: "Piece", reorderLevel: 40 },
        { id: "var-003-3", name: "48W - 6500K High Output", sku: "HAV-ADR-48W-CDL", price: 2150.00, stock: 85, unit: "Piece", reorderLevel: 25 }
      ],
      specifications: [
        { name: "Wattage", value: "36W / 48W" },
        { name: "Luminous Flux", value: "3,960 Lumens (110 lm/W)" },
        { name: "Color Temperature", value: "6500K (Cool Day Light) / 4000K" },
        { name: "Input Voltage", value: "140V - 300V AC, 50Hz" },
        { name: "Power Factor", value: "> 0.95" },
        { name: "CRI", value: "Ra > 80" },
        { name: "Dimensions", value: "595 x 595 x 35 mm" }
      ]
    },

    {
      id: "prod-004",
      name: "ABB AF09 3-Pole Heavy Duty Motor Contactor",
      slug: "abb-af09-3-pole-heavy-duty-motor-contactor",
      brandId: "brand-abb",
      brandName: "ABB",
      categoryId: "cat-industrial",
      categoryName: "Industrial Electrical",
      subcategory: "Contactor",
      sku: "ABB-AF09-30-10-13",
      productCode: "1SBL137001R1310",
      modelNumber: "AF09-30-10-13-24-250V",
      manufacturerPartNumber: "AF09-30-10",
      shortDescription: "Compact 3-pole contactor with wide-range electronically controlled coil (100-250V AC/DC) for motor control.",
      fullDescription: "ABB AF09 3-pole contactors are designed for controlling electric motors up to 4 kW (400V) and switching power circuits up to 25A (AC-1). Equipped with electronic coil interface accepting wide control voltages, eliminating contact chatter and coil burnout from grid fluctuations.",
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: false, // Price on Request mode
      pricingType: "Price on Request",
      basePrice: null,
      unit: "Piece",
      bulkPricing: [],
      status: "Active",
      isFeatured: true,
      variants: [
        { id: "var-004-1", name: "9A (4 kW AC-3) - 100-250V Coil", sku: "ABB-AF09-9A-100V", price: 1850.00, stock: 65, unit: "Piece", reorderLevel: 15 },
        { id: "var-004-2", name: "12A (5.5 kW AC-3) - 100-250V Coil", sku: "ABB-AF12-12A-100V", price: 2190.00, stock: 40, unit: "Piece", reorderLevel: 10 },
        { id: "var-004-3", name: "16A (7.5 kW AC-3) - 100-250V Coil", sku: "ABB-AF16-16A-100V", price: 2650.00, stock: 30, unit: "Piece", reorderLevel: 8 },
        { id: "var-004-4", name: "26A (11 kW AC-3) - 100-250V Coil", sku: "ABB-AF26-26A-100V", price: 3850.00, stock: 18, unit: "Piece", reorderLevel: 5 }
      ],
      specifications: [
        { name: "Number of Main Poles", value: "3 NO (Normally Open)" },
        { name: "Auxiliary Contacts", value: "1 NO Built-in" },
        { name: "Rated Operational Current AC-3", value: "9A / 12A / 16A / 26A (at 400V)" },
        { name: "Control Coil Voltage", value: "100...250 V AC 50/60 Hz / DC" },
        { name: "Terminal Type", value: "Screw Terminals" },
        { name: "Mounting Type", value: "DIN-Rail 35mm / Baseplate Screw" }
      ]
    },

    {
      id: "prod-005",
      name: "Legrand Arteor Anthracite Modular Switches & Sockets",
      slug: "legrand-arteor-anthracite-modular-switches",
      brandId: "brand-legrand",
      brandName: "Legrand",
      categoryId: "cat-switches-sockets",
      categoryName: "Switches & Sockets",
      subcategory: "Modular Switch",
      sku: "LEG-ART-572000",
      productCode: "LEG-ART-SW1",
      modelNumber: "Arteor-Mech-10AX",
      manufacturerPartNumber: "572000",
      shortDescription: "Luxury Italian-designed modular switch mechanisms with silver alloy contacts and soft-click ergonomics.",
      fullDescription: "Legrand Arteor is an international standard modular wiring system tailored for modern commercial towers, luxury hotels, and executive spaces. Tested for over 40,000 switching operations with self-extinguishing polycarbonate casing.",
      images: [
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 195.00,
      unit: "Piece",
      bulkPricing: [
        { minQty: 50, maxQty: 250, price: 180.00, unit: "Piece" },
        { minQty: 251, maxQty: 1000, price: 165.00, unit: "Piece" },
        { minQty: 1001, maxQty: null, price: 148.00, unit: "Piece" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-005-1", name: "1-Way 10AX 1-Module Switch", sku: "LEG-ART-1W-10A", price: 195.00, stock: 850, unit: "Piece", reorderLevel: 100 },
        { id: "var-005-2", name: "2-Way 10AX 1-Module Switch", sku: "LEG-ART-2W-10A", price: 245.00, stock: 420, unit: "Piece", reorderLevel: 60 },
        { id: "var-005-3", name: "16A Heavy Duty Switch with Indicator", sku: "LEG-ART-16A-IND", price: 340.00, stock: 310, unit: "Piece", reorderLevel: 50 },
        { id: "var-005-4", name: "6/16A Universal 3-Pin Socket (2 Mod)", sku: "LEG-ART-SOC-UNI", price: 410.00, stock: 580, unit: "Piece", reorderLevel: 80 }
      ],
      specifications: [
        { name: "Rated Voltage", value: "240V AC 50/60Hz" },
        { name: "Contact Material", value: "Silver Nickel Alloy" },
        { name: "Modules", value: "1M / 2M Standard DIN Grid" },
        { name: "Housing Material", value: "Flame Retardant Polycarbonate (UV Stabilized)" },
        { name: "Certification", value: "IS 3854: 1997 / CE" }
      ]
    },

    {
      id: "prod-006",
      name: "Siemens 3VA1 MCCB Moulded Case Circuit Breaker",
      slug: "siemens-3va1-mccb-moulded-case-circuit-breaker",
      brandId: "brand-siemens",
      brandName: "Siemens",
      categoryId: "cat-mcb-protection",
      categoryName: "MCB & Electrical Protection",
      subcategory: "MCCB",
      sku: "SIE-3VA1-TM210",
      productCode: "3VA1116-3ED36-0AA0",
      modelNumber: "3VA11-160-3P",
      manufacturerPartNumber: "3VA11163ED36",
      shortDescription: "Heavy-duty 160A 3-Pole 25kA MCCB with thermal-magnetic trip unit for main incomers and motor feeders.",
      fullDescription: "Siemens 3VA1 MCCB provides robust line protection for industrial switchboards. Featuring compact dimensions, adjustable thermal overload setting (0.7 to 1.0 x In), and fixed magnetic short circuit protection.",
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: false, // Price on request
      pricingType: "Price on Request",
      basePrice: null,
      unit: "Piece",
      bulkPricing: [],
      status: "Active",
      isFeatured: true,
      variants: [
        { id: "var-006-1", name: "3-Pole 63A (25kA)", sku: "SIE-3VA1-3P-63A", price: 6800.00, stock: 14, unit: "Piece", reorderLevel: 4 },
        { id: "var-006-2", name: "3-Pole 100A (25kA)", sku: "SIE-3VA1-3P-100A", price: 7450.00, stock: 12, unit: "Piece", reorderLevel: 4 },
        { id: "var-006-3", name: "3-Pole 160A (25kA)", sku: "SIE-3VA1-3P-160A", price: 9200.00, stock: 8, unit: "Piece", reorderLevel: 3 },
        { id: "var-006-4", name: "4-Pole 250A (36kA)", sku: "SIE-3VA1-4P-250A", price: 16500.00, stock: 4, unit: "Piece", reorderLevel: 2 }
      ],
      specifications: [
        { name: "Poles", value: "3 Pole / 4 Pole" },
        { name: "Breaking Capacity (Icu)", value: "25 kA / 36 kA at 415V AC" },
        { name: "Trip Unit Type", value: "Thermal-Magnetic TM210 (FTFM / ATFM)" },
        { name: "Rated Insulation Voltage (Ui)", value: "800V AC" },
        { name: "Standard", value: "IEC 60947-2" }
      ]
    },

    {
      id: "prod-007",
      name: "Polycab 4-Core XLPE Armoured Aluminum Power Cable",
      slug: "polycab-4-core-xlpe-armoured-power-cable",
      brandId: "brand-polycab",
      brandName: "Polycab",
      categoryId: "cat-wires-cables",
      categoryName: "Wires & Cables",
      subcategory: "Armoured Cable",
      sku: "POL-4C-XLPE-A2XWY",
      productCode: "POL-ARM-704",
      modelNumber: "A2XWY-1.1KV",
      manufacturerPartNumber: "PC-4C-ARM-LT",
      shortDescription: "Underground LT heavy armored aluminum cable for industrial substation and primary load distribution.",
      fullDescription: "Constructed with stranded compacted sector shaped aluminum conductors, cross-linked polyethylene (XLPE) insulation, extruded inner PVC sheath, galvanized round steel wire/flat strip armouring, and UV resistant outer ST2 PVC sheath.",
      images: [
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 380.00,
      unit: "Meter",
      bulkPricing: [
        { minQty: 100, maxQty: 500, price: 365.00, unit: "Meter" },
        { minQty: 501, maxQty: 1500, price: 345.00, unit: "Meter" },
        { minQty: 1501, maxQty: null, price: 325.00, unit: "Meter" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-007-1", name: "4C x 25 sq.mm (Aluminum XLPE)", sku: "POL-4C-25-ARM", price: 240.00, stock: 1200, unit: "Meter", reorderLevel: 300 },
        { id: "var-007-2", name: "4C x 50 sq.mm (Aluminum XLPE)", sku: "POL-4C-50-ARM", price: 380.00, stock: 950, unit: "Meter", reorderLevel: 250 },
        { id: "var-007-3", name: "4C x 95 sq.mm (Aluminum XLPE)", sku: "POL-4C-95-ARM", price: 620.00, stock: 650, unit: "Meter", reorderLevel: 200 },
        { id: "var-007-4", name: "4C x 185 sq.mm (Aluminum XLPE)", sku: "POL-4C-185-ARM", price: 1150.00, stock: 350, unit: "Meter", reorderLevel: 100 }
      ],
      specifications: [
        { name: "Conductor", value: "Class 2 Stranded Compacted H2 Aluminum" },
        { name: "Insulation", value: "XLPE (Cross Linked Polyethylene)" },
        { name: "Armour Type", value: "Galvanized Round Steel Wire / Flat Strip (IS 3975)" },
        { name: "Sheath Color", value: "Black with meter markings" },
        { name: "Standard", value: "IS 7098 (Part 1) : 1988" }
      ]
    },

    {
      id: "prod-008",
      name: "L&T Tripper TPN Vertical Distribution Board with Door",
      slug: "lt-tripper-tpn-vertical-distribution-board",
      brandId: "brand-lt",
      brandName: "L&T Electrical & Automation",
      categoryId: "cat-distribution",
      categoryName: "Distribution & Switchgear",
      subcategory: "Distribution Board",
      sku: "LT-TRIP-TPN-08W",
      productCode: "LNT-DB-V08",
      modelNumber: "Tripper-TPN-Vert-8Way",
      manufacturerPartNumber: "LT8WTPNV",
      shortDescription: "IP43 CRCA sheet steel vertical TPN distribution board suitable for MCCB/Isolator incomer and MCB outgoings.",
      fullDescription: "L&T Tripper Vertical TPN Distribution Board provides safety and organized cable routing in industrial plants. Powder coated with corrosion resistant RAL 7035 finish, insulated copper busbars rated for 200A, and detachable gland plates.",
      images: [
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Fixed Price",
      basePrice: 5850.00,
      unit: "Piece",
      bulkPricing: [
        { minQty: 5, maxQty: 20, price: 5450.00, unit: "Piece" },
        { minQty: 21, maxQty: null, price: 5100.00, unit: "Piece" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-008-1", name: "4-Way TPN Vertical DB", sku: "LT-DB-TPN-4W", price: 4600.00, stock: 24, unit: "Piece", reorderLevel: 5 },
        { id: "var-008-2", name: "8-Way TPN Vertical DB", sku: "LT-DB-TPN-8W", price: 5850.00, stock: 18, unit: "Piece", reorderLevel: 5 },
        { id: "var-008-3", name: "12-Way TPN Vertical DB", sku: "LT-DB-TPN-12W", price: 7200.00, stock: 10, unit: "Piece", reorderLevel: 3 }
      ],
      specifications: [
        { name: "Enclosure Sheet", value: "1.2mm High Grade CRCA Sheet Steel" },
        { name: "Protection Class", value: "IP43 with Double Door" },
        { name: "Busbar Rating", value: "200A Electrolytic Grade Copper" },
        { name: "Paint Finish", value: "Epoxy Polyester Powder Coating (RAL 7035)" },
        { name: "Standard", value: "IEC 61439-1 & 3" }
      ]
    },
    {
      id: "prod-009",
      name: "Finolex Flameguard FRLS Multi-Strand Industrial Building Wire",
      slug: "finolex-flameguard-frls-copper-wire",
      brandId: "brand-finolex",
      brandName: "Finolex",
      categoryId: "cat-wires-cables",
      categoryName: "Wires & Cables",
      subcategory: "House Wire",
      sku: "FIN-FG-FRLS-1100V",
      productCode: "FIN-CBL-101",
      modelNumber: "Flameguard-FRLS",
      manufacturerPartNumber: "FIN-FG-90M",
      shortDescription: "Electrolytic pure copper multi-strand conductors with high thermal stability and fire-retardant insulation.",
      fullDescription: "Finolex Flameguard FRLS wires are precision-engineered with 99.97% bright annealed electrolytic copper, ensuring lower resistance and reduced energy loss. Specially formulated flame retardant PVC compound emits minimal non-toxic smoke during electrical contingencies. Certified for ISI 694 standards.",
      images: [
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 29.20,
      unit: "Meter",
      bulkPricing: [
        { minQty: 100, maxQty: 500, price: 28.00, unit: "Meter" },
        { minQty: 501, maxQty: null, price: 25.50, unit: "Meter" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-009-1", name: "1.0 sq.mm (90m Coil)", sku: "FIN-FG-1.0-RED", price: 19.50, stock: 1200, unit: "Meter", reorderLevel: 200 },
        { id: "var-009-2", name: "1.5 sq.mm (90m Coil)", sku: "FIN-FG-1.5-RED", price: 29.20, stock: 850, unit: "Meter", reorderLevel: 150 },
        { id: "var-009-3", name: "2.5 sq.mm (90m Coil)", sku: "FIN-FG-2.5-BLU", price: 46.80, stock: 600, unit: "Meter", reorderLevel: 100 }
      ],
      specifications: [
        { name: "Conductor", value: "99.97% Electrolytic Pure Annealed Copper" },
        { name: "Insulation", value: "Special FRLS Grade PVC Compound" },
        { name: "Voltage Grade", value: "1100 Volts (AC)" },
        { name: "Standards", value: "IS 694:2010 with ISI mark" }
      ]
    },
    {
      id: "prod-010",
      name: "Anchor by Panasonic Roma Classic Modular Switch & Socket Set",
      slug: "anchor-roma-classic-modular-switch",
      brandId: "brand-anchor",
      brandName: "Anchor by Panasonic",
      categoryId: "cat-modular-switches",
      categoryName: "Modular Switches & Accessories",
      subcategory: "Modular Switch",
      sku: "ANC-ROMA-10AX-1M",
      productCode: "ANC-SW-201",
      modelNumber: "Roma-Classic-1M",
      manufacturerPartNumber: "ANC-21001",
      shortDescription: "Pioneering modular design with silver-cadmium contacts for high endurance and smooth tactile switching.",
      fullDescription: "Anchor Roma Classic by Panasonic represents India's most trusted modular wiring solution. Equipped with arc-shield technology, heavy silver alloy contacts, and UV-stabilized flame-retardant poly-carbonate body. Tested to over 100,000 electrical operations.",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 65.00,
      unit: "Piece",
      bulkPricing: [
        { minQty: 50, maxQty: 200, price: 58.00, unit: "Piece" },
        { minQty: 201, maxQty: null, price: 52.00, unit: "Piece" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-010-1", name: "10AX 1-Way Switch 1M White", sku: "ANC-ROMA-10A-1W", price: 65.00, stock: 450, unit: "Piece", reorderLevel: 50 },
        { id: "var-010-2", name: "20A Heavy Duty 1-Way Switch 1M", sku: "ANC-ROMA-20A-1W", price: 115.00, stock: 280, unit: "Piece", reorderLevel: 30 },
        { id: "var-010-3", name: "6/16A Combined Shuttered Socket 2M", sku: "ANC-ROMA-SOC-16A", price: 160.00, stock: 320, unit: "Piece", reorderLevel: 40 }
      ],
      specifications: [
        { name: "Current Rating", value: "10AX / 16A / 20A at 240V AC" },
        { name: "Contact Material", value: "Silver Cadmium Oxide Alloy" },
        { name: "Body Material", value: "Flame Retardant Engineering Polycarbonate" },
        { name: "Compliance", value: "IS 3854:1997" }
      ]
    },
    {
      id: "prod-011",
      name: "KEI Conflame FRLS Multi-Core Industrial Control Cable",
      slug: "kei-conflame-frls-copper-control-cable",
      brandId: "brand-kei",
      brandName: "KEI Industries",
      categoryId: "cat-wires-cables",
      categoryName: "Wires & Cables",
      subcategory: "Industrial Cable",
      sku: "KEI-CONF-1.1KV-CBL",
      productCode: "KEI-CBL-501",
      modelNumber: "Conflame-Control-FRLS",
      manufacturerPartNumber: "KEI-CF-4C-2.5",
      shortDescription: "Heavy-duty 1100V multi-core copper control cable engineered for automation and instrumentation panels.",
      fullDescription: "KEI Conflame FRLS Control Cables are designed for critical control circuits in thermal plants, steel mills, and automated machinery. Annealed bare high-conductivity copper conductor insulated with high-grade FRLS PVC with extruded inner sheath and galvanized steel wire armouring.",
      images: [
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 145.00,
      unit: "Meter",
      bulkPricing: [
        { minQty: 100, maxQty: 500, price: 135.00, unit: "Meter" },
        { minQty: 501, maxQty: null, price: 122.00, unit: "Meter" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-011-1", name: "4 Core x 1.5 sq.mm Armoured", sku: "KEI-CTL-4C-1.5", price: 110.00, stock: 950, unit: "Meter", reorderLevel: 100 },
        { id: "var-011-2", name: "4 Core x 2.5 sq.mm Armoured", sku: "KEI-CTL-4C-2.5", price: 145.00, stock: 700, unit: "Meter", reorderLevel: 100 },
        { id: "var-011-3", name: "7 Core x 1.5 sq.mm Armoured", sku: "KEI-CTL-7C-1.5", price: 195.00, stock: 450, unit: "Meter", reorderLevel: 50 }
      ],
      specifications: [
        { name: "Conductor", value: "Class 2 Stranded Pure Annealed Copper" },
        { name: "Armouring", value: "Galvanized Mild Steel Wire / Strip" },
        { name: "Outer Sheath", value: "FRLS PVC Compound Oxygen Index >29%" },
        { name: "Standard", value: "IS 1554 Part 1 / IS 7098" }
      ]
    },
    {
      id: "prod-012",
      name: "RR Kabel Superex FR PVC Insulated Industrial Building Wire",
      slug: "rr-kabel-superex-fr-copper-wire",
      brandId: "brand-rr",
      brandName: "RR Kabel",
      categoryId: "cat-wires-cables",
      categoryName: "Wires & Cables",
      subcategory: "House Wire",
      sku: "RR-SUPEREX-FR-1100V",
      productCode: "RR-WIR-301",
      modelNumber: "Superex-FR-UNILAY",
      manufacturerPartNumber: "RR-SX-FR-90M",
      shortDescription: "Unilay conductor technology wire preventing conductor breakage with superior flame retardant properties.",
      fullDescription: "RR Kabel Superex FR wires feature 100% Electrolytic Grade copper bunched with patented UNILAY conductor design. The uniform compact bunching prevents conductor spread during crimping and reduces heat build-up at terminations. High insulation resistance and dielectric strength.",
      images: [
        "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80"
      ],
      showPrice: true,
      pricingType: "Per Unit",
      basePrice: 28.90,
      unit: "Meter",
      bulkPricing: [
        { minQty: 100, maxQty: 500, price: 27.20, unit: "Meter" },
        { minQty: 501, maxQty: null, price: 24.80, unit: "Meter" }
      ],
      status: "Active",
      isFeatured: false,
      variants: [
        { id: "var-012-1", name: "1.5 sq.mm (90m Coil)", sku: "RR-SX-1.5-RED", price: 28.90, stock: 800, unit: "Meter", reorderLevel: 100 },
        { id: "var-012-2", name: "2.5 sq.mm (90m Coil)", sku: "RR-SX-2.5-YEL", price: 47.50, stock: 650, unit: "Meter", reorderLevel: 100 }
      ],
      specifications: [
        { name: "Conductor", value: "Electrolytic Copper with UNILAY Bunching" },
        { name: "Insulation", value: "FR Flame Retardant PVC" },
        { name: "Temperature Rating", value: "-15°C to +70°C Operating Range" },
        { name: "Certifications", value: "IS 694, CE, REACH & RoHS Compliant" }
      ]
    }
  ],

  inquiries: [],
  quotations: [],
  stockAdjustments: [],
  contactMessages: []
};

// Expose globally or export
if (typeof window !== "undefined") {
  window.INITIAL_DATA = INITIAL_DATA;
}
