// ============================================================
// SURYACS WEB SOLUTIONS — PROJECT PRICING CONFIGURATION
// ============================================================

export const PROJECT_TYPES = [
  {
    id: 'landing',
    name: 'Landing Page',
    icon: 'Rocket',
    basePrice: 1999,
    baseTimeline: 5,
    description: 'High-converting professional single-page website',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    icon: 'Palette',
    basePrice: 2999,
    baseTimeline: 7,
    description: 'Professional portfolio website for individuals and freelancers',
  },
  {
    id: 'business',
    name: 'Business Website',
    icon: 'Building2',
    basePrice: 4999,
    baseTimeline: 7,
    description: 'Professional website for small and growing businesses',
  },
  {
    id: 'blog',
    name: 'Blog Website',
    icon: 'BookOpen',
    basePrice: 4999,
    baseTimeline: 7,
    description: 'Professional content and blogging website',
  },
  {
    id: 'booking',
    name: 'Booking Website',
    icon: 'CalendarCheck',
    basePrice: 7999,
    baseTimeline: 14,
    description: 'Online appointment and reservation website',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Website',
    icon: 'ShoppingCart',
    basePrice: 9999,
    baseTimeline: 14,
    description: 'Online store for selling products and managing orders',
  },
  {
    id: 'marketing',
    name: 'Google Business Profile',
    icon: 'MapPin',
    basePrice: 22500,
    baseTimeline: 3,
    description: 'Google Business Profile setup and optimization',
  },
  {
    id: 'crm',
    name: 'CRM & Management System',
    icon: 'UsersRound',
    basePrice: 24999,
    baseTimeline: 20,
    description: 'Custom CRM and business management system',
  },
  {
    id: 'saas',
    name: 'SaaS Dashboard',
    icon: 'LayoutDashboard',
    basePrice: 29999,
    baseTimeline: 25,
    description: 'Scalable software-as-a-service application',
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    icon: 'Code',
    basePrice: 29999,
    baseTimeline: 25,
    description: 'Custom web application built for specific requirements',
  },
  {
    id: 'promo-graphics',
    name: 'Promo Videos & Graphics',
    icon: 'Video',
    basePrice: 0,
    baseTimeline: 1,
    description: 'Promo videos, posters, logos and custom graphics',
  },
  {
    id: 'ai-faceswap',
    name: 'AI Face Swap',
    icon: 'Sparkles',
    basePrice: 0,
    baseTimeline: 1,
    description: 'AI-powered image and video face swap service',
  },
];

export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    multiplier: 1.0,
    timelineMultiplier: 1.0,
    description: 'Affordable essential package for individuals and small businesses',
    features: [
      'Responsive Design',
      'Mobile & Desktop Support',
      'Basic SEO',
      'SSL Configuration',
      'WhatsApp Integration',
      'Contact Form',
      '1 Revision Round',
    ],
    support: 'Email & WhatsApp Support',
    badge: null,
  },
  {
    id: 'professional',
    name: 'Professional',
    multiplier: 1.0,
    timelineMultiplier: 1.0,
    description: 'Premium package with enhanced design and functionality',
    features: [
      'Everything in Starter',
      'Premium UI Design',
      'Custom Animations',
      'CMS Support',
      'Google Analytics',
      'Google Search Console',
      'Social Media Integration',
      'Gallery / Testimonials / FAQ',
      '3 Revision Rounds',
    ],
    support: 'Priority Email + WhatsApp Support',
    badge: 'Most Popular',
  },
  {
    id: 'business',
    name: 'Business',
    multiplier: 1.0,
    timelineMultiplier: 1.0,
    description: 'Advanced package for growing businesses and professional applications',
    features: [
      'Everything in Professional',
      'Admin Dashboard',
      'Client Dashboard',
      'Database Integration',
      'Payment Gateway',
      'Advanced Analytics',
      'Advanced SEO',
      'Email Notifications',
      'API Integrations',
      'Advanced Forms',
      '3 Revision Rounds',
    ],
    support: 'Dedicated Support',
    badge: null,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    multiplier: 1.0,
    timelineMultiplier: 1.0,
    description: 'Fully customized solution for advanced business requirements',
    features: [
      'Everything in Business',
      'Advanced Database',
      'Advanced Admin Panel',
      'Advanced Client Dashboard',
      'Real-time Features',
      'Multiple API Integrations',
      'Advanced Automation',
      'Custom Business Logic',
      'Advanced Analytics',
      'Priority Development',
      'Dedicated Support',
    ],
    support: 'Priority Dedicated Support',
    badge: 'Premium',
  },
];

export const FEATURE_COSTS = {
  adminDashboard: { cost: 3000, timeline: 3, label: 'Admin Dashboard', icon: 'LayoutDashboard' },
  clientDashboard: { cost: 2000, timeline: 2, label: 'Client Dashboard', icon: 'Users' },
  database: { cost: 2500, timeline: 2, label: 'Database Integration', icon: 'Database' },
  paymentGateway: { cost: 1500, timeline: 2, label: 'Payment Gateway', icon: 'CreditCard' },
  cms: { cost: 2500, timeline: 2, label: 'CMS Support', icon: 'FileEdit' },
  seo: { cost: 1500, timeline: 1, label: 'SEO Optimization', icon: 'Search' },
  hosting: { cost: 500, timeline: 1, label: 'Hosting Setup', icon: 'Server' },
  customAnimations: { cost: 1500, timeline: 2, label: 'Custom Animations', icon: 'Sparkles' },
  realtimeChat: { cost: 3000, timeline: 4, label: 'Real-time Chat', icon: 'MessageCircle' },
  analyticsDashboard: { cost: 1500, timeline: 2, label: 'Analytics Dashboard', icon: 'BarChart3' },
  apiIntegrations: { cost: 1000, timeline: 2, label: 'API Integration', icon: 'Plug' },
  emailIntegration: { cost: 1000, timeline: 1, label: 'Email Integration', icon: 'Mail' },
  whatsappIntegration: { cost: 500, timeline: 1, label: 'WhatsApp Integration', icon: 'MessageCircle' },
  googleMaps: { cost: 500, timeline: 1, label: 'Google Maps', icon: 'MapPin' },
  socialMediaSetup: { cost: 2000, timeline: 1, label: 'Social Media Setup', icon: 'Share2' },
  customGraphics: { cost: 750, timeline: 1, label: 'Custom Graphics', icon: 'PenTool' },
  extraPage: { cost: 500, timeline: 1, label: 'Extra Page', icon: 'FilePlus' },
  extraRevision: { cost: 500, timeline: 1, label: 'Extra Revision', icon: 'RefreshCw' },
  promoVideo: { cost: 500, timeline: 1, label: 'Promo Video', icon: 'Video' },
  posters: { cost: 400, timeline: 1, label: 'Poster Design', icon: 'Image' },
  logos: { cost: 750, timeline: 1, label: 'Logo Design', icon: 'Palette' },
  imageFaceswap: { cost: 500, timeline: 1, label: 'Image Face Swap', icon: 'Image' },
  videoFaceswap: { cost: 1000, timeline: 1, label: 'Video Face Swap', icon: 'Video' },
};

export const PROJECT_PACKAGE_FEATURES = {
  landing: {
    starter: [ '1 Professional Page', 'Responsive Design', 'WhatsApp CTA', 'Basic SEO', 'SSL', '1 Revision' ],
    professional: [ 'Everything in Starter', 'Premium UI Design', 'Custom Animations', 'Contact Form', 'Google Maps', 'Social Media Links', '3 Revisions' ],
    business: [ 'Everything in Professional', 'Advanced Animations', 'Analytics', 'Lead Management', 'Advanced SEO', 'API Integration' ],
    enterprise: [ 'Everything in Business', 'Custom Sections', 'Advanced Integrations', 'Custom Functionality', 'Priority Support' ],
  },
  portfolio: {
    starter: [ 'Up to 5 Pages', 'Home', 'About', 'Skills', 'Projects', 'Contact', 'Responsive Design' ],
    professional: [ 'Everything in Starter', 'Premium UI', 'Custom Animations', 'Dark / Light Mode', 'Resume Section', 'SEO', 'Analytics', 'WhatsApp' ],
    business: [ 'Everything in Professional', 'CMS', 'Blog', 'Advanced SEO', 'Advanced Animations', 'Project Management' ],
    enterprise: [ 'Everything in Business', 'Custom CMS', 'Advanced Dashboard', 'API Integrations', 'Custom Features' ],
  },
  business: {
    starter: [ 'Up to 5 Pages', 'Responsive Design', 'WhatsApp', 'Contact Form', 'Google Maps', 'Social Links', 'Basic SEO', 'SSL', '1 Revision' ],
    professional: [ 'Everything in Starter', 'Up to 8 Pages', 'Premium UI Design', 'Custom Animations', 'Gallery', 'Testimonials', 'FAQ', 'Google Analytics', 'Search Console', '3 Revisions' ],
    business: [ 'Everything in Professional', 'CMS', 'Admin Dashboard', 'Blog', 'Lead Management', 'Advanced SEO', 'Analytics Dashboard', 'API Integration' ],
    enterprise: [ 'Everything in Business', 'Client Dashboard', 'Database', 'Advanced Admin', 'Multiple API Integrations', 'Automation', 'Custom Business Logic' ],
  },
  blog: {
    starter: [ 'Blog', 'Categories', 'Search', 'Responsive Design', 'Basic SEO' ],
    professional: [ 'Everything in Starter', 'CMS', 'Admin Dashboard', 'Rich Text Editor', 'Tags', 'SEO Controls', 'Analytics' ],
    business: [ 'Everything in Professional', 'Author Management', 'Comments', 'Newsletter', 'Advanced SEO', 'Advanced Analytics' ],
    enterprise: [ 'Everything in Business', 'Custom Publishing Workflow', 'Membership System', 'Advanced CMS', 'API Integrations' ],
  },
  booking: {
    starter: [ 'Services', 'Booking Form', 'Date Selection', 'Time Selection', 'WhatsApp', 'Email Notification', 'Responsive Design' ],
    professional: [ 'Everything in Starter', 'Online Payment', 'Customer Login', 'Booking Dashboard', 'Admin Dashboard', 'Cancellation', 'Rescheduling', 'Calendar Integration' ],
    business: [ 'Everything in Professional', 'Staff Management', 'Multiple Services', 'Multiple Locations', 'Automated Reminders', 'Reports', 'Advanced Scheduling' ],
    enterprise: [ 'Everything in Business', 'Advanced Calendar', 'Custom Booking Logic', 'API Integrations', 'Automation', 'Advanced Reports' ],
  },
  ecommerce: {
    starter: [ 'Responsive Store', 'Homepage', 'Product Catalog', 'Categories', 'Product Details', 'Cart', 'Basic Checkout', 'WhatsApp', 'Customer Order Form', 'Up to 20 Products', 'Basic SEO', 'SSL', '1 Revision' ],
    professional: [ 'Everything in Starter', 'Up to 100 Products', 'Customer Accounts', 'Wishlist', 'Product Variants', 'Coupons', 'Inventory Management', 'Order Management', 'Payment Gateway', 'Shipping Configuration', 'Product Reviews', 'Analytics', '3 Revisions' ],
    business: [ 'Everything in Professional', '250+ Products', 'Advanced Inventory', 'Advanced Search', 'Advanced Filters', 'Customer Dashboard', 'Sales Analytics', 'Advanced Admin', 'Email Notifications', 'Marketing Integrations', 'Advanced SEO', '3 Months Maintenance' ],
    enterprise: [ 'Everything in Business', 'Custom Store Features', 'Advanced Automation', 'Multiple Payment Gateways', 'Advanced Shipping', 'Advanced Reports', 'Custom API Integrations', 'Priority Support' ],
  },
  crm: {
    starter: [ 'User Login', 'Customer Management', 'Lead Management', 'Basic Dashboard', 'Database', 'Responsive Interface' ],
    professional: [ 'Everything in Starter', 'User Roles', 'Permissions', 'Advanced Dashboard', 'Search & Filters', 'Reports', 'Activity Tracking', 'Email Notifications' ],
    business: [ 'Everything in Professional', 'Workflow Automation', 'Advanced Analytics', 'Multiple Users', 'Advanced Reports', 'API Integration', 'Admin Management' ],
    enterprise: [ 'Everything in Business', 'Custom Workflows', 'Advanced Automation', 'Multiple Integrations', 'Custom Modules', 'Advanced Security', 'Priority Support' ],
  },
  saas: {
    starter: [ 'Authentication', 'User Dashboard', 'Database', 'Responsive UI', 'User Management' ],
    professional: [ 'Everything in Starter', 'User Roles', 'Subscriptions', 'Payment Integration', 'Advanced Dashboard', 'Analytics', 'Email Notifications' ],
    business: [ 'Everything in Professional', 'Advanced Permissions', 'Billing System', 'API Integrations', 'Automation', 'Admin Dashboard', 'Advanced Analytics' ],
    enterprise: [ 'Everything in Business', 'Multi-Tenant Architecture', 'Advanced Billing', 'Advanced Automation', 'Custom Integrations', 'Scalable Architecture', 'Priority Support' ],
  },
  custom: {
    starter: [ 'Custom UI', 'Responsive Design', 'Authentication', 'Basic Dashboard', 'Database' ],
    professional: [ 'Everything in Starter', 'Advanced Dashboard', 'User Roles', 'API Integrations', 'Analytics', 'Notifications' ],
    business: [ 'Everything in Professional', 'Advanced Workflows', 'Automation', 'Advanced Database', 'Multiple APIs', 'Admin Dashboard', 'Client Dashboard' ],
    enterprise: [ 'Everything in Business', 'Custom Architecture', 'Advanced Automation', 'Scalable Infrastructure', 'Advanced Integrations', 'Custom Business Logic' ],
  },
};

export const DOMAIN_OPTIONS = [
  { value: 'none', label: 'No Domain', cost: 0, timeline: 0, duration: 'No Domain' },
  // Budget-Friendly / Small Business Options
  { value: 'online-hostinger', label: '.ONLINE / .STORE — Hostinger', cost: 149, timeline: 1, duration: '1 Year' },
  { value: 'co-in-hostinger', label: '.CO.IN Domain — Hostinger', cost: 399, timeline: 1, duration: '1 Year' },
  { value: 'in-hostinger', label: '.IN Domain — Hostinger', cost: 499, timeline: 1, duration: '1 Year' },
  { value: 'in-godaddy', label: '.IN Domain — GoDaddy', cost: 599, timeline: 1, duration: '1 Year' },
  { value: 'com-hostinger', label: '.COM Domain — Hostinger', cost: 799, timeline: 1, duration: '1 Year' },
  { value: 'com-godaddy', label: '.COM Domain — GoDaddy', cost: 899, timeline: 1, duration: '1 Year' },
  // Premium / Standard Options
  { value: 'in', label: '.IN Domain — MilesWeb', cost: 799, timeline: 1, duration: '1 Year' },
  { value: 'co-in', label: '.CO.IN Domain — MilesWeb', cost: 799, timeline: 1, duration: '1 Year' },
  { value: 'com', label: '.COM Domain — MilesWeb', cost: 999, timeline: 1, duration: '1 Year' },
];

export const HOSTING_OPTIONS = [
  { value: 'none', label: 'No Hosting', cost: 0, timeline: 0, duration: 'No Hosting' },
  // Free / Very Cheap Tier
  { value: 'github-pages', label: 'GitHub Pages / Netlify (Free)', cost: 500, timeline: 1, duration: 'Setup Only', description: 'Best for static sites, free hosting forever' },
  { value: 'vercel', label: 'Vercel Deployment (Free Tier)', cost: 500, timeline: 1, duration: 'Setup Only', description: 'Professional Next.js deployment and configuration' },
  // Modern PaaS
  { value: 'render', label: 'Render Deployment', cost: 1000, timeline: 1, duration: 'Setup', description: 'Excellent PaaS for web apps with auto-deploys' },
  { value: 'railway', label: 'Railway Deployment', cost: 1000, timeline: 1, duration: 'Setup', description: 'Modern infrastructure platform for full-stack apps' },
  // Budget Shared Hosting
  { value: 'milesweb-ignite', label: 'MilesWeb Ignite Hosting', cost: 1200, timeline: 1, duration: '1 Year', description: 'Budget friendly hosting for startups' },
  { value: 'hostinger-single', label: 'Hostinger Single Web Hosting', cost: 1499, timeline: 1, duration: '1 Year', description: 'Very affordable, good for basic small business sites' },
  { value: 'hostinger-premium', label: 'Hostinger Premium Web Hosting', cost: 2499, timeline: 1, duration: '1 Year', description: 'Good for growing sites with more traffic' },
  // Managed / Premium
  { value: 'vercel-managed', label: 'Vercel Managed Hosting', cost: 1999, timeline: 1, duration: '1 Year', description: 'Deployment, monitoring and maintenance management' },
];

export const DATABASE_OPTIONS = [
  { value: 'none', label: 'No Database', cost: 0, timeline: 0, duration: '' },
  { value: 'supabase', label: 'Supabase (PostgreSQL)', cost: 1500, timeline: 2, duration: 'Setup', description: 'Powerful open-source Postgres database' },
  { value: 'firebase', label: 'Firebase Firestore', cost: 600, timeline: 1, duration: 'Setup', description: 'Real-time NoSQL database' },
  { value: 'mongodb', label: 'MongoDB Atlas', cost: 1500, timeline: 2, duration: 'Setup', description: 'Flexible NoSQL document database' },
  { value: 'turso', label: 'Turso (Edge SQLite)', cost: 1200, timeline: 1, duration: 'Setup', description: 'Ultra-fast edge database' },
  { value: 'vercel-postgres', label: 'Vercel Postgres', cost: 1000, timeline: 1, duration: 'Setup', description: 'Easy serverless SQL database integration' },
];

export const STORAGE_OPTIONS = [
  { value: 'none', label: 'No Storage', cost: 0, timeline: 0, duration: '' },
  { value: 'cloudinary', label: 'Cloudinary Media', cost: 400, timeline: 1, duration: 'Setup', description: 'Optimized image and video delivery' },
  { value: 'vercel-blob', label: 'Vercel Blob Storage', cost: 500, timeline: 1, duration: 'Setup', description: 'Simple edge storage for files and media' },
  { value: 'firebase-storage', label: 'Firebase Storage', cost: 400, timeline: 1, duration: 'Setup', description: 'Simple file storage' },
];

export const AUTHENTICATION_OPTIONS = [
  { value: 'none', label: 'No Authentication', cost: 0, timeline: 0, duration: '' },
  { value: 'nextauth', label: 'NextAuth.js / Auth.js', cost: 700, timeline: 2, duration: 'Setup', description: 'Secure custom authentication' },
  { value: 'clerk', label: 'Clerk Authentication', cost: 1000, timeline: 1, duration: 'Setup', description: 'Modern drop-in auth UI and user management' },
  { value: 'firebase-auth', label: 'Firebase Auth', cost: 1000, timeline: 1, duration: 'Setup', description: 'Google, Facebook, and Email login' },
];

// Infrastructure options migrated to Database and Storage options

export const SETUP_OPTIONS = [
  { value: 'none', label: 'No Setup', cost: 0, timeline: 0 },
  { value: 'domain', label: 'Domain Configuration', cost: 300, timeline: 1 },
  { value: 'deployment', label: 'Vercel Deployment', cost: 500, timeline: 1 },
  { value: 'full', label: 'Full Deployment Setup', cost: 1000, timeline: 2 },
];

export const MAINTENANCE_OPTIONS = [
  { value: 'none', label: 'No Maintenance', cost: 0, timeline: 0 },
  { value: '3months', label: '3 Months Maintenance', cost: 1499, timeline: 0 },
  { value: '6months', label: '6 Months Maintenance', cost: 2499, timeline: 0 },
  { value: '12months', label: '12 Months Maintenance', cost: 3999, timeline: 0 },
];

export const DELIVERY_SPEEDS = {
  standard: { multiplier: 1.0, label: 'Standard', description: 'Regular delivery timeline' },
  express: { multiplier: 1.3, label: 'Express', description: '30% faster delivery' },
};

export const PACKAGE_PRICES = {
  landing: { starter: 1999, professional: 3499, business: 5999, enterprise: 9999 },
  portfolio: { starter: 2999, professional: 5999, business: 9999, enterprise: 14999 },
  business: { starter: 4999, professional: 9999, business: 17999, enterprise: 29999 },
  blog: { starter: 4999, professional: 8999, business: 14999, enterprise: 24999 },
  booking: { starter: 7999, professional: 14999, business: 24999, enterprise: 39999 },
  ecommerce: { starter: 9999, professional: 17999, business: 29999, enterprise: 49999 },
  crm: { starter: 24999, professional: 39999, business: 59999, enterprise: 99999 },
  saas: { starter: 29999, professional: 49999, business: 79999, enterprise: 149999 },
  custom: { starter: 29999, professional: 49999, business: 79999, enterprise: 149999 },
};

export const CREATIVE_SERVICE_PRICES = {
  promoVideo: 500,
  poster: 400,
  logo: 750,
  customGraphic: 750,
  imageFaceSwap: 500,
  videoFaceSwap: 1000,
};

export const PRICING_RULES = {
  domainAndHostingAreSeparate: true,
  domainIsRecurring: true,
  hostingIsRecurring: true,
  sslIncluded: true,
  paymentGatewayChargesSeparate: true,
  thirdPartyApiChargesSeparate: true,
  aiApiUsageChargesSeparate: true,
  advertisingBudgetSeparate: true,
  packagePricesIncludeDevelopment: true,
  packagePricesDoNotIncludeDomain: true,
  packagePricesDoNotIncludeHosting: true,
};

export function calculatePricing(state, config = null) {
  const pTypes = PROJECT_TYPES.map(p => {
    const override = config?.PROJECT_TYPES?.find(c => c.id === p.id);
    if (['promo-graphics', 'ai-faceswap'].includes(p.id)) {
      return override ? { ...p, ...override, basePrice: 0 } : p;
    }
    return override ? { ...p, ...override } : p;
  });
  const projectType = pTypes.find(p => p.id === state.projectType);
  if (!projectType) return { total: 0, timeline: 0, breakdown: [] };

  const breakdown = [];
  let totalCost = projectType.basePrice;
  let totalTimeline = projectType.baseTimeline;

  const pkgs = config?.PACKAGES || PACKAGES;
  const selectedPkg = pkgs.find(p => p.id === state.selectedPackage);
  const pkgName = selectedPkg ? selectedPkg.name : 'Starter';
  
  const bItem = { label: `${projectType.name} (${pkgName})`, cost: projectType.basePrice };
  breakdown.push(bItem);

  const isSimpleProject = ['promo-graphics', 'ai-faceswap'].includes(state.projectType);

  // New configuration options
  const dOpts = config?.DOMAIN_OPTIONS || DOMAIN_OPTIONS;
  const hOpts = config?.HOSTING_OPTIONS || HOSTING_OPTIONS;
  const sOpts = config?.SETUP_OPTIONS || SETUP_OPTIONS;

  if (state.domain && state.domain !== 'none') {
    const domain = dOpts.find(d => d.value === state.domain);
    if (domain) {
      totalCost += domain.cost;
      totalTimeline += domain.timeline;
      breakdown.push({ label: `Domain: ${domain.label}`, cost: domain.cost });
    }
  }

  if (state.hosting && state.hosting !== 'none') {
    const hosting = hOpts.find(h => h.value === state.hosting);
    if (hosting) {
      totalCost += hosting.cost;
      totalTimeline += hosting.timeline;
      breakdown.push({ label: `Hosting: ${hosting.label}`, cost: hosting.cost });
    }
  }

  if (state.setup && state.setup !== 'none') {
    const setup = sOpts.find(s => s.value === state.setup);
    if (setup) {
      totalCost += setup.cost;
      totalTimeline += setup.timeline;
      breakdown.push({ label: `Setup: ${setup.label}`, cost: setup.cost });
    }
  }

  const dbOpts = config?.DATABASE_OPTIONS || DATABASE_OPTIONS;
  const stOpts = config?.STORAGE_OPTIONS || STORAGE_OPTIONS;
  const authOpts = config?.AUTHENTICATION_OPTIONS || AUTHENTICATION_OPTIONS;

  if (state.database && state.database !== 'none') {
    const db = dbOpts.find(d => d.value === state.database);
    if (db) {
      totalCost += db.cost;
      totalTimeline += db.timeline;
      breakdown.push({ label: `Database: ${db.label}`, cost: db.cost });
    }
  }

  if (state.storage && state.storage !== 'none') {
    const st = stOpts.find(s => s.value === state.storage);
    if (st) {
      totalCost += st.cost;
      totalTimeline += st.timeline;
      breakdown.push({ label: `Storage: ${st.label}`, cost: st.cost });
    }
  }

  if (state.authentication && state.authentication !== 'none') {
    const auth = authOpts.find(a => a.value === state.authentication);
    if (auth) {
      totalCost += auth.cost;
      totalTimeline += auth.timeline;
      breakdown.push({ label: `Auth: ${auth.label}`, cost: auth.cost });
    }
  }

  // Removed infrastructure loop

  // Features
  const fCosts = { ...FEATURE_COSTS, ...(config?.FEATURE_COSTS || {}) };
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  
  Object.entries(state.features).forEach(([key, value]) => {
    if (key === 'maintenance') {
      const maint = maintOpts.find(m => m.value === value);
      if (maint && maint.cost > 0) {
        totalCost += maint.cost;
        breakdown.push({ label: `Maintenance (${maint.label})`, cost: maint.cost });
      }
    } else if (key === 'apiIntegrations' && value > 0) {
      const apiCost = value * 1000;
      totalCost += apiCost;
      totalTimeline += value * 2;
      breakdown.push({ label: `${value} API Integrations`, cost: apiCost });
    } else if (value === true && fCosts[key]) {
      totalCost += fCosts[key].cost;
      totalTimeline += fCosts[key].timeline;
      breakdown.push({ label: fCosts[key].label, cost: fCosts[key].cost });
    }
  });

  // Package Multiplier / Specific Prices
  let pkg = null;
  if (state.projectType !== 'marketing' && !isSimpleProject) {
    pkg = pkgs.find(p => p.id === state.selectedPackage);
    const pkgTimelineMult = pkg?.timelineMultiplier || 1;
    
    // Check if we have specific package prices defined
    const pkgPrices = config?.PACKAGE_PRICES || PACKAGE_PRICES;
    if (pkgPrices[state.projectType] && pkgPrices[state.projectType][state.selectedPackage]) {
      const specificCost = pkgPrices[state.projectType][state.selectedPackage];
      totalCost = totalCost - bItem.cost + specificCost;
      bItem.cost = specificCost;
    } else {
      const pkgMult = pkg?.multiplier || 1;
      // Distribute multiplier to breakdown items
      breakdown.forEach(item => {
        if (!item.isPackageFeature) {
            item.cost = Math.round(item.cost * pkgMult);
        }
      });
      totalCost = Math.round(totalCost * pkgMult);
    }
    
    // Add package features
    if (pkg && pkg.features) {
      pkg.features.forEach(f => {
        breakdown.push({ label: `✓ ${f}`, cost: 0, isPackageFeature: true });
      });
    }

    // Apply specialized package timeline multiplier 
    // (prevents timeline exploding on higher tiers like Business/Enterprise)
    totalTimeline = Math.round(totalTimeline * pkgTimelineMult);
  }

  // Delivery Speed
  let speedMult = 1;
  if (!isSimpleProject) {
    const dSpeeds = config?.DELIVERY_SPEEDS || DELIVERY_SPEEDS;
    speedMult = dSpeeds[state.deliverySpeed]?.multiplier || 1;
    
    if (speedMult !== 1) {
      breakdown.forEach(item => {
        if (!item.isPackageFeature) {
            item.cost = Math.round(item.cost * speedMult);
        }
      });
    }
  }
  
  totalCost = Math.round(totalCost * speedMult);
  totalTimeline = Math.round(totalTimeline / speedMult);

  // Complexity score
  const featureCount = Object.values(state.features).filter(v => v === true).length;
  const complexity = featureCount <= 3 ? 'Simple' : featureCount <= 7 ? 'Moderate' : featureCount <= 11 ? 'Complex' : 'Enterprise';

  return {
    total: totalCost,
    timeline: totalTimeline,
    breakdown,
    complexity,
    package: pkg,
    recommendedPackage: featureCount <= 3 ? 'starter' : featureCount <= 6 ? 'professional' : featureCount <= 9 ? 'business' : 'enterprise',
  };
}

function formatAdditionalOptions(state, config) {
  const opts = [];
  
  if (state.domain && state.domain !== 'none') {
    const dOpts = config?.DOMAIN_OPTIONS || DOMAIN_OPTIONS;
    const domain = dOpts.find(d => d.value === state.domain);
    if (domain) opts.push(`Domain: ${domain.label}`);
  }
  
  if (state.hosting && state.hosting !== 'none') {
    const hOpts = config?.HOSTING_OPTIONS || HOSTING_OPTIONS;
    const hosting = hOpts.find(h => h.value === state.hosting);
    if (hosting) opts.push(`Hosting: ${hosting.label}`);
  }
  
  if (state.setup && state.setup !== 'none') {
    const sOpts = config?.SETUP_OPTIONS || SETUP_OPTIONS;
    const setup = sOpts.find(s => s.value === state.setup);
    if (setup) opts.push(`Setup: ${setup.label}`);
  }
  
  if (state.database && state.database !== 'none') {
    const dbOpts = config?.DATABASE_OPTIONS || DATABASE_OPTIONS;
    const db = dbOpts.find(d => d.value === state.database);
    if (db) opts.push(`Database: ${db.label}`);
  }

  if (state.storage && state.storage !== 'none') {
    const stOpts = config?.STORAGE_OPTIONS || STORAGE_OPTIONS;
    const st = stOpts.find(s => s.value === state.storage);
    if (st) opts.push(`Storage: ${st.label}`);
  }

  if (state.authentication && state.authentication !== 'none') {
    const authOpts = config?.AUTHENTICATION_OPTIONS || AUTHENTICATION_OPTIONS;
    const auth = authOpts.find(a => a.value === state.authentication);
    if (auth) opts.push(`Auth: ${auth.label}`);
  }

  // Removed infrastructure formatting

  return opts;
}

export function generateWhatsAppMessage(state, pricing, config = null) {
  const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
  const fCosts = config?.FEATURE_COSTS || FEATURE_COSTS;
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  const pkgs = config?.PACKAGES || PACKAGES;

  const projectType = pTypes.find(p => p.id === state.projectType);
  
  const additionalOptions = formatAdditionalOptions(state, config);
  
  const enabledFeatures = Object.entries(state.features)
    .filter(([key, val]) => {
      if (key === 'maintenance') return val !== 'none';
      if (key === 'apiIntegrations') return val > 0;
      return val === true;
    })
    .map(([key]) => {
      if (key === 'apiIntegrations') return `${state.features.apiIntegrations} API Integrations`;
      if (key === 'maintenance') {
        const m = maintOpts.find(opt => opt.value === state.features.maintenance);
        return `Maintenance: ${m?.label}`;
      }
      return fCosts[key]?.label || key;
    });
    
  const allAdditions = [...additionalOptions, ...enabledFeatures];

  const pkg = pkgs.find(p => p.id === state.selectedPackage);

  let msg = `Hello Surya,\n\n`;
  msg += `I need a ${projectType?.name || 'Custom Project'}.\n\n`;
  
  if (allAdditions.length > 0) {
    msg += `Selected Features & Options:\n`;
    allAdditions.forEach(f => { msg += `- ${f}\n`; });
    msg += `\n`;
  }

  msg += `Estimated Budget:\n₹${pricing.total.toLocaleString('en-IN')}\n\n`;
  msg += `Estimated Timeline:\n${pricing.timeline} Days\n\n`;
  msg += `Package: ${pkg?.name || 'Custom'}\n\n`;
  msg += `Please contact me regarding this project.`;

  return encodeURIComponent(msg);
}

export function generateEmailBody(state, pricing, config = null) {
  const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
  const fCosts = config?.FEATURE_COSTS || FEATURE_COSTS;
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  const pkgs = config?.PACKAGES || PACKAGES;

  const projectType = pTypes.find(p => p.id === state.projectType);
  const additionalOptions = formatAdditionalOptions(state, config);
  
  const enabledFeatures = Object.entries(state.features)
    .filter(([key, val]) => {
      if (key === 'maintenance') return val !== 'none';
      if (key === 'apiIntegrations') return val > 0;
      return val === true;
    })
    .map(([key]) => {
      if (key === 'apiIntegrations') return `${state.features.apiIntegrations} API Integrations`;
      if (key === 'maintenance') {
        const m = maintOpts.find(opt => opt.value === state.features.maintenance);
        return `Maintenance: ${m?.label}`;
      }
      return fCosts[key]?.label || key;
    });
    
  const allAdditions = [...additionalOptions, ...enabledFeatures];

  const pkg = pkgs.find(p => p.id === state.selectedPackage);

  const subject = `Project Inquiry: ${projectType?.name || 'Custom Project'}`;
  let body = `Hello Surya,\n\n`;
  body += `I am interested in your web development services.\n\n`;
  body += `Project Type: ${projectType?.name || 'Custom'}\n`;
  body += `Package: ${pkg?.name || 'Custom'}\n\n`;

  if (allAdditions.length > 0) {
    body += `Selected Features & Options:\n`;
    allAdditions.forEach(f => { body += `• ${f}\n`; });
    body += `\n`;
  }

  body += `Estimated Budget: ₹${pricing.total.toLocaleString('en-IN')}\n`;
  body += `Estimated Timeline: ${pricing.timeline} Days\n`;
  body += `Complexity: ${pricing.complexity}\n\n`;
  body += `Please contact me to discuss this project further.\n\n`;
  body += `Best regards`;

  return { subject, body };
}
