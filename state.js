// ===================================================================
// APEX ELECTRO - STATE MANAGEMENT STORE
// ===================================================================

const AppState = {
  data: {
    businessProfile: null,
    categories: [],
    brands: [],
    products: [],
    inquiries: [],
    quotations: [],
    stockAdjustments: [],
    contactMessages: [],
    inquiryCart: [],
    isAdminLoggedIn: false, // Protected Admin State
    currentRole: 'public', // 'public' | 'admin'
    currentPublicPage: 'home',
    currentAdminTab: 'dashboard',
    selectedCategoryFilter: 'ALL',
    selectedBrandFilters: new Set(),
    selectedSort: 'featured',
    activeModalProduct: null,
    activeAdminInquiry: null,
    activeModalQuotation: null,
    lastSubmittedInquiry: null
  },

  STORAGE_KEY: 'APEX_ELECTRO_STATE_V1',

  load() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
        const seed = window.INITIAL_DATA || {};
        if (!Array.isArray(this.data.brands) || this.data.brands.length === 0) {
          this.data.brands = JSON.parse(JSON.stringify(seed.brands || []));
        } else if (seed.brands && seed.brands.length > 0) {
          const existingBrandIds = new Set(this.data.brands.map(b => b.id));
          seed.brands.forEach(sb => {
            if (!existingBrandIds.has(sb.id)) this.data.brands.push(JSON.parse(JSON.stringify(sb)));
          });
        }

        if (!Array.isArray(this.data.products) || this.data.products.length === 0) {
          this.data.products = JSON.parse(JSON.stringify(seed.products || []));
        } else if (seed.products && seed.products.length > 0) {
          const existingProdIds = new Set(this.data.products.map(p => p.id));
          seed.products.forEach(sp => {
            if (!existingProdIds.has(sp.id)) this.data.products.push(JSON.parse(JSON.stringify(sp)));
          });
        }

        if (!Array.isArray(this.data.categories) || this.data.categories.length === 0) {
          this.data.categories = JSON.parse(JSON.stringify(seed.categories || []));
        }

        // Purge any legacy mock demo inquiries, quotations, stock adjustments, and contact messages
        const mockInquiryIds = new Set(['INQ-2026-00001', 'INQ-2026-00002', 'INQ-2026-00003']);
        const mockQuoteIds = new Set(['QUO-2026-00001']);
        const mockAdjustmentIds = new Set(['STK-ADJ-101', 'STK-ADJ-102', 'STK-ADJ-103']);
        const mockMessageIds = new Set(['MSG-001', 'MSG-002']);

        if (Array.isArray(this.data.inquiries)) {
          this.data.inquiries = this.data.inquiries.filter(i => 
            !mockInquiryIds.has(i.id) && 
            i.customer?.name !== 'Vikram Rathore' && 
            i.customer?.name !== 'Sunil Deshmukh' && 
            i.customer?.name !== 'Arun Mehra'
          );
        } else {
          this.data.inquiries = [];
        }

        if (Array.isArray(this.data.quotations)) {
          this.data.quotations = this.data.quotations.filter(q => 
            !mockQuoteIds.has(q.id) && 
            q.customerName !== 'Vikram Rathore'
          );
        } else {
          this.data.quotations = [];
        }

        if (Array.isArray(this.data.stockAdjustments)) {
          this.data.stockAdjustments = this.data.stockAdjustments.filter(a => !mockAdjustmentIds.has(a.id));
        } else {
          this.data.stockAdjustments = [];
        }

        if (Array.isArray(this.data.contactMessages)) {
          this.data.contactMessages = this.data.contactMessages.filter(m => 
            !mockMessageIds.has(m.id) && 
            m.name !== 'Ramesh Kulkarni' && 
            m.name !== 'Deepak Verma'
          );
        } else {
          this.data.contactMessages = [];
        }

        if (Array.isArray(parsed.selectedBrandFilters)) {
          this.data.selectedBrandFilters = new Set(parsed.selectedBrandFilters);
        } else {
          this.data.selectedBrandFilters = new Set();
        }

        // Persist cleaned state immediately
        this.save();
      } catch (e) {
        console.error('Error parsing stored state:', e);
        this.loadDefault();
      }
    } else {
      this.loadDefault();
    }
  },

  loadDefault() {
    const seed = window.INITIAL_DATA || {};
    this.data.businessProfile = JSON.parse(JSON.stringify(seed.businessProfile || {}));
    this.data.categories = JSON.parse(JSON.stringify(seed.categories || []));
    this.data.brands = JSON.parse(JSON.stringify(seed.brands || []));
    this.data.products = JSON.parse(JSON.stringify(seed.products || []));
    this.data.inquiries = JSON.parse(JSON.stringify(seed.inquiries || []));
    this.data.quotations = JSON.parse(JSON.stringify(seed.quotations || []));
    this.data.stockAdjustments = JSON.parse(JSON.stringify(seed.stockAdjustments || []));
    this.data.contactMessages = JSON.parse(JSON.stringify(seed.contactMessages || []));
    this.data.inquiryCart = [];
    this.data.isAdminLoggedIn = false;
    this.data.selectedBrandFilters = new Set();
    this.save();
  },

  save() {
    const toSave = {
      businessProfile: this.data.businessProfile,
      categories: this.data.categories,
      brands: this.data.brands,
      products: this.data.products,
      inquiries: this.data.inquiries,
      quotations: this.data.quotations,
      stockAdjustments: this.data.stockAdjustments,
      contactMessages: this.data.contactMessages,
      inquiryCart: this.data.inquiryCart,
      isAdminLoggedIn: this.data.isAdminLoggedIn,
      selectedBrandFilters: Array.from(this.data.selectedBrandFilters || [])
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadDefault();
  }
};

window.AppState = AppState;
