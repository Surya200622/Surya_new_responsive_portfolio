export const PROJECT_TYPES = [
  {
    id: 'business',
    name: 'Business Website',
    icon: 'Building2',
    basePrice: 3500,
    baseTimeline: 14,
    description: 'Professional web presence for your business',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Website',
    icon: 'ShoppingCart',
    basePrice: 8000,
    baseTimeline: 28,
    description: 'Full-featured online store with payments',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    icon: 'Palette',
    basePrice: 2500,
    baseTimeline: 10,
    description: 'Stunning showcase for your work',
  },
  {
    id: 'saas',
    name: 'SaaS Dashboard',
    icon: 'LayoutDashboard',
    basePrice: 12000,
    baseTimeline: 35,
    description: 'Scalable software-as-a-service platform',
  },
  {
    id: 'admin',
    name: 'Admin Dashboard',
    icon: 'Settings',
    basePrice: 7500,
    baseTimeline: 21,
    description: 'Powerful admin panel with analytics',
  },
  {
    id: 'landing',
    name: 'Landing Page',
    icon: 'Rocket',
    basePrice: 2000,
    baseTimeline: 7,
    description: 'High-converting single page experience',
  },
  {
    id: 'booking',
    name: 'Booking Website',
    icon: 'CalendarCheck',
    basePrice: 6000,
    baseTimeline: 21,
    description: 'Appointment & reservation system',
  },
  {
    id: 'blog',
    name: 'Blog Website',
    icon: 'BookOpen',
    basePrice: 3000,
    baseTimeline: 10,
    description: 'Content-rich blog with CMS',
  },
  {
    id: 'portal',
    name: 'Client Portal',
    icon: 'Users',
    basePrice: 9000,
    baseTimeline: 28,
    description: 'Secure client management portal',
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    icon: 'Code',
    basePrice: 10000,
    baseTimeline: 35,
    description: 'Tailored solution for unique needs',
  },
];

export const FEATURE_COSTS = {
  adminDashboard: { cost: 1500, timeline: 7, label: 'Admin Dashboard', icon: 'LayoutDashboard' },
  clientDashboard: { cost: 1000, timeline: 5, label: 'Client Dashboard', icon: 'Users' },
  authentication: { cost: 500, timeline: 3, label: 'Authentication System', icon: 'Shield' },
  database: { cost: 2500, timeline: 4, label: 'Database Integration', icon: 'Database' },
  paymentGateway: { cost: 1000, timeline: 5, label: 'Payment Gateway', icon: 'CreditCard' },
  cms: { cost: 2000, timeline: 4, label: 'CMS Support', icon: 'FileEdit' },
  seo: { cost: 1000, timeline: 2, label: 'SEO Optimization', icon: 'Search' },
  hosting: { cost: 1000, timeline: 1, label: 'Hosting Setup', icon: 'Server' },
  customAnimations: { cost: 1000, timeline: 4, label: 'Custom Animations', icon: 'Sparkles' },
  realtimeChat: { cost: 1500, timeline: 7, label: 'Real-time Chat', icon: 'MessageCircle' },
  analyticsDashboard: { cost: 1000, timeline: 5, label: 'Analytics Dashboard', icon: 'BarChart3' },
};

export const MAINTENANCE_OPTIONS = [
  { value: 'none', label: 'No Maintenance', cost: 0, timeline: 0 },
  { value: '3months', label: '3 Months', cost: 400, timeline: 0 },
  { value: '6months', label: '6 Months', cost: 800, timeline: 0 },
  { value: '12months', label: '12 Months', cost: 1100, timeline: 0 },
];

export const UI_COMPLEXITY = {
  basic: { multiplier: 1.0, label: 'Basic', description: 'Clean & functional' },
  professional: { multiplier: 1.3, label: 'Professional', description: 'Polished & refined' },
  premium: { multiplier: 1.7, label: 'Premium', description: 'Luxury & cinematic' },
};

export const ANIMATION_LEVELS = {
  none: { multiplier: 1.0, label: 'None', description: 'Static design' },
  subtle: { multiplier: 1.1, label: 'Subtle', description: 'Smooth transitions' },
  moderate: { multiplier: 1.25, label: 'Moderate', description: 'Interactive animations' },
};

export const DELIVERY_SPEEDS = {
  standard: { multiplier: 1.0, label: 'Standard', description: 'Regular timeline' },
  express: { multiplier: 1.3, label: 'Express', description: '30% faster delivery' },

export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    multiplier: 1.0,
    description: 'Essential features with clean design',
    features: ['Responsive Design', 'Basic SEO', 'Contact Form', '1 Revision Round'],
    support: 'Email support',
    badge: null,
  },
  {
    id: 'professional',
    name: 'Professional',
    multiplier: 1.5,
    description: 'Enhanced features with premium polish',
    features: ['Everything in Starter', 'Advanced SEO', 'Performance Optimization', '3 Revision Rounds', 'Social Integration'],
    support: 'Priority email + WhatsApp',
    badge: 'Most Popular',
  },
  {
    id: 'business',
    name: 'Business',
    multiplier: 2.2,
    description: 'Full-stack with advanced integrations',
    features: ['Everything in Professional', 'Admin Dashboard', 'Analytics', 'API Integrations', '5 Revision Rounds', 'Demo Session'],
    support: 'Dedicated support channel',
    badge: null,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    multiplier: 3.5,
    description: 'Custom everything with priority support',
    features: ['Everything in Business', 'Custom Architecture', 'Security Audit', 'Load Testing', 'Unlimited Revisions'],
    support: '24/7 priority support',
    badge: 'Premium',
  },
];

export const PAGE_RATE = 500; // per page

export function calculatePricing(state) {
  const projectType = PROJECT_TYPES.find(p => p.id === state.projectType);
  if (!projectType) return { total: 0, timeline: 0, breakdown: [] };

  const breakdown = [];
  let totalCost = projectType.basePrice;
  let totalTimeline = projectType.baseTimeline;

  breakdown.push({ label: `${projectType.name} (Base)`, cost: projectType.basePrice });

  // Pages
  const pageCost = (state.pages - 1) * PAGE_RATE;
  if (pageCost > 0) {
    totalCost += pageCost;
    totalTimeline += Math.ceil(state.pages / 5);
    breakdown.push({ label: `${state.pages} Pages`, cost: pageCost });
  }

  // Features
  Object.entries(state.features).forEach(([key, value]) => {
    if (key === 'maintenance') {
      const maint = MAINTENANCE_OPTIONS.find(m => m.value === value);
      if (maint && maint.cost > 0) {
        totalCost += maint.cost;
        breakdown.push({ label: `Maintenance (${maint.label})`, cost: maint.cost });
      }
    } else if (key === 'apiIntegrations' && value > 0) {
      const apiCost = value * 1000;
      totalCost += apiCost;
      totalTimeline += value * 2;
      breakdown.push({ label: `${value} API Integrations`, cost: apiCost });
    } else if (value === true && FEATURE_COSTS[key]) {
      totalCost += FEATURE_COSTS[key].cost;
      totalTimeline += FEATURE_COSTS[key].timeline;
      breakdown.push({ label: FEATURE_COSTS[key].label, cost: FEATURE_COSTS[key].cost });
    }
  });

  // UI Complexity
  const uiMult = UI_COMPLEXITY[state.uiComplexity]?.multiplier || 1;
  totalCost = Math.round(totalCost * uiMult);
  breakdown.push({ label: `UI: ${UI_COMPLEXITY[state.uiComplexity]?.label}`, cost: null, note: `×${uiMult}` });

  // Animation Level
  const animMult = ANIMATION_LEVELS[state.animationLevel]?.multiplier || 1;
  totalCost = Math.round(totalCost * animMult);

  // Package Multiplier
  const pkg = PACKAGES.find(p => p.id === state.selectedPackage);
  const pkgMult = pkg?.multiplier || 1;
  totalCost = Math.round(totalCost * pkgMult);

  // Delivery Speed
  const speedMult = DELIVERY_SPEEDS[state.deliverySpeed]?.multiplier || 1;
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

export function generateWhatsAppMessage(state, pricing) {
  const projectType = PROJECT_TYPES.find(p => p.id === state.projectType);
  const enabledFeatures = Object.entries(state.features)
    .filter(([key, val]) => {
      if (key === 'maintenance') return val !== 'none';
      if (key === 'apiIntegrations') return val > 0;
      return val === true;
    })
    .map(([key]) => {
      if (key === 'apiIntegrations') return `${state.features.apiIntegrations} API Integrations`;
      if (key === 'maintenance') {
        const m = MAINTENANCE_OPTIONS.find(opt => opt.value === state.features.maintenance);
        return `Maintenance: ${m?.label}`;
      }
      return FEATURE_COSTS[key]?.label || key;
    });

  const pkg = PACKAGES.find(p => p.id === state.selectedPackage);

  let msg = `Hello Surya,\n\n`;
  msg += `I need a ${projectType?.name || 'Custom Project'}.\n\n`;
  
  if (enabledFeatures.length > 0) {
    msg += `Selected Features:\n`;
    enabledFeatures.forEach(f => { msg += `- ${f}\n`; });
    msg += `\n`;
  }

  msg += `Estimated Budget:\n₹${pricing.total.toLocaleString('en-IN')}\n\n`;
  msg += `Estimated Timeline:\n${pricing.timeline} Days\n\n`;
  msg += `Package: ${pkg?.name || 'Custom'}\n\n`;
  msg += `Please contact me regarding this project.`;

  return encodeURIComponent(msg);
}

export function generateEmailBody(state, pricing) {
  const projectType = PROJECT_TYPES.find(p => p.id === state.projectType);
  const enabledFeatures = Object.entries(state.features)
    .filter(([key, val]) => {
      if (key === 'maintenance') return val !== 'none';
      if (key === 'apiIntegrations') return val > 0;
      return val === true;
    })
    .map(([key]) => {
      if (key === 'apiIntegrations') return `${state.features.apiIntegrations} API Integrations`;
      if (key === 'maintenance') {
        const m = MAINTENANCE_OPTIONS.find(opt => opt.value === state.features.maintenance);
        return `Maintenance: ${m?.label}`;
      }
      return FEATURE_COSTS[key]?.label || key;
    });

  const pkg = PACKAGES.find(p => p.id === state.selectedPackage);

  const subject = `Project Inquiry: ${projectType?.name || 'Custom Project'}`;
  let body = `Hello Surya,\n\n`;
  body += `I am interested in your web development services.\n\n`;
  body += `Project Type: ${projectType?.name || 'Custom'}\n`;
  body += `Package: ${pkg?.name || 'Custom'}\n\n`;

  if (enabledFeatures.length > 0) {
    body += `Selected Features:\n`;
    enabledFeatures.forEach(f => { body += `• ${f}\n`; });
    body += `\n`;
  }

  body += `Estimated Budget: ₹${pricing.total.toLocaleString('en-IN')}\n`;
  body += `Estimated Timeline: ${pricing.timeline} Days\n`;
  body += `Complexity: ${pricing.complexity}\n\n`;
  body += `Please contact me to discuss this project further.\n\n`;
  body += `Best regards`;

  return { subject, body };
}
