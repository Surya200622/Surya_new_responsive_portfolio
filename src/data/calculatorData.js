export const PROJECT_TYPES = [
  {
    id: 'business',
    name: 'Business Website',
    icon: 'Building2',
    basePrice: 3500,
    baseTimeline: 25,
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
    baseTimeline: 14,
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
    id: 'crm',
    name: 'CRM & Management System',
    icon: 'UsersRound',
    basePrice: 12000,
    baseTimeline: 35,
    description: 'Custom business management system with users, data & automation',
  },
  {
    id: 'landing',
    name: 'Landing Page',
    icon: 'Rocket',
    basePrice: 2000,
    baseTimeline: 10,
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
    baseTimeline: 20,
    description: 'Content-rich blog with CMS',
  },
  {
    id: 'marketing',
    name: 'Google Business Profile',
    icon: 'Rocket',
    basePrice: 22500,
    baseTimeline: 6,
    description: 'Google Business Profile, Ads & Marketing',
  },
  {
    id: 'custom',
    name: 'Custom Web App',
    icon: 'Code',
    basePrice: 10000,
    baseTimeline: 35,
    description: 'Tailored solution for unique needs',
  },
  {
    id: 'promo-graphics',
    name: 'Promo Videos & Graphics',
    icon: 'Video',
    basePrice: 0,
    baseTimeline: 7,
    description: 'Promo videos, posters, logos, and custom graphics',
  },
  {
    id: 'ai-faceswap',
    name: 'AI Face Swap',
    icon: 'Sparkles',
    basePrice: 0,
    baseTimeline: 3,
    description: 'Professional face swap for images and videos',
  },
];

export const FEATURE_COSTS = {
  adminDashboard: { cost: 1500, timeline: 7, label: 'Admin Dashboard', icon: 'LayoutDashboard' },
  clientDashboard: { cost: 1000, timeline: 5, label: 'Client Dashboard', icon: 'Users' },
  database: { cost: 2500, timeline: 4, label: 'Database Integration', icon: 'Database' },
  paymentGateway: { cost: 1000, timeline: 5, label: 'Payment Gateway', icon: 'CreditCard' },
  cms: { cost: 2000, timeline: 4, label: 'CMS Support', icon: 'FileEdit' },
  seo: { cost: 1000, timeline: 2, label: 'SEO Optimization', icon: 'Search' },
  hosting: { cost: 1000, timeline: 1, label: 'Hosting Setup', icon: 'Server' },
  customAnimations: { cost: 1000, timeline: 4, label: 'Custom Animations', icon: 'Sparkles' },
  realtimeChat: { cost: 1500, timeline: 7, label: 'Real-time Chat', icon: 'MessageCircle' },
  analyticsDashboard: { cost: 1000, timeline: 5, label: 'Analytics Dashboard', icon: 'BarChart3' },
  googleBusinessProfile: { cost: 2500, timeline: 3, label: 'Google Business Profile', icon: 'Building2' },
  adCampaigns: { cost: 5000, timeline: 5, label: 'Ad Campaigns Setup', icon: 'Rocket' },
  socialMediaSetup: { cost: 3000, timeline: 4, label: 'Social Media Setup', icon: 'MessageCircle' },
  promoVideo: { cost: 500, timeline: 3, label: 'Promo Video', icon: 'Video' },
  posters: { cost: 400, timeline: 2, label: 'Posters', icon: 'Image' },
  logos: { cost: 500, timeline: 3, label: 'Logos', icon: 'Palette' },
  customGraphics: { cost: 1000, timeline: 4, label: 'Custom Graphics', icon: 'PenTool' },
  imageFaceswap: { cost: 500, timeline: 1, label: 'Images Faceswap', icon: 'Image' },
  videoFaceswap: { cost: 650, timeline: 2, label: 'Video Faceswap', icon: 'Video' },
};

export const MAINTENANCE_OPTIONS = [
  { value: 'none', label: 'No Maintenance', cost: 0, timeline: 0 },
  { value: '3months', label: '3 Months', cost: 400, timeline: 0 },
  { value: '6months', label: '6 Months', cost: 800, timeline: 0 },
  { value: '12months', label: '12 Months', cost: 1100, timeline: 0 },
];

export const DELIVERY_SPEEDS = {
  standard: { multiplier: 1.0, label: 'Standard', description: 'Regular timeline' },
  express: { multiplier: 1.3, label: 'Express', description: '30% faster delivery' },
};

export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    multiplier: 1.0,
    timelineMultiplier: 1.0,
    description: 'Essential features with clean design',
    features: ['SEO & Hosting', 'Contact Form', '1 Revision Round'],
    support: 'Email & WhatsApp support',
    badge: null,
  },
  {
    id: 'professional',
    name: 'Professional',
    multiplier: 1.5,
    timelineMultiplier: 1.05,
    description: 'Enhanced features with premium polish',
    features: ['Everything in Starter', 'CMS Support', 'Social Media Setup', 'Custom Animations', '3 Revision Rounds'],
    support: 'Priority email + WhatsApp',
    badge: 'Most Popular',
  },
  {
    id: 'business',
    name: 'Business',
    multiplier: 2.2,
    timelineMultiplier: 1.1,
    description: 'Full-stack with advanced integrations',
    features: ['Everything in Professional', 'Admin & Client Dashboards', 'Analytics & Payments', '2 API Integrations'],
    support: 'Dedicated support channel',
    badge: null,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    multiplier: 3.5,
    timelineMultiplier: 1.2,
    description: 'Custom everything with priority support',
    features: ['Everything in Business', 'Ad Campaigns & Google Business', 'Real-time Chat', 'Custom Database', '5 API Integrations', 'Unlimited Revisions'],
    support: '24/7 priority support',
    badge: 'Premium',
  },
];

export function calculatePricing(state, config = null) {
  const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
  const projectType = pTypes.find(p => p.id === state.projectType);
  if (!projectType) return { total: 0, timeline: 0, breakdown: [] };

  const breakdown = [];
  let totalCost = projectType.basePrice;
  let totalTimeline = projectType.baseTimeline;

  const pkgs = config?.PACKAGES || PACKAGES;
  const selectedPkg = pkgs.find(p => p.id === state.selectedPackage);
  const pkgName = selectedPkg ? selectedPkg.name : 'Starter';
  
  breakdown.push({ label: `${projectType.name} (${pkgName})`, cost: projectType.basePrice });

  const isSimpleProject = ['promo-graphics', 'ai-faceswap'].includes(state.projectType);

  // Features
  const fCosts = config?.FEATURE_COSTS || FEATURE_COSTS;
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  
  if (!isSimpleProject) {
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
  }

  // Package Multiplier
  let pkg = null;
  if (state.projectType !== 'marketing' && !isSimpleProject) {
    const pkgs = config?.PACKAGES || PACKAGES;
    pkg = pkgs.find(p => p.id === state.selectedPackage);
    const pkgMult = pkg?.multiplier || 1;
    const pkgTimelineMult = pkg?.timelineMultiplier || 1;
    
    // Distribute multiplier to breakdown items
    breakdown.forEach(item => {
      item.cost = Math.round(item.cost * pkgMult);
    });
    
    // Add package features
    if (pkg && pkg.features) {
      pkg.features.forEach(f => {
        breakdown.push({ label: `✓ ${f}`, cost: 0, isPackageFeature: true });
      });
    }

    totalCost = Math.round(totalCost * pkgMult);
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
        item.cost = Math.round(item.cost * speedMult);
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

export function generateWhatsAppMessage(state, pricing, config = null) {
  const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
  const fCosts = config?.FEATURE_COSTS || FEATURE_COSTS;
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  const pkgs = config?.PACKAGES || PACKAGES;

  const projectType = pTypes.find(p => p.id === state.projectType);
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

  const pkg = pkgs.find(p => p.id === state.selectedPackage);

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

export function generateEmailBody(state, pricing, config = null) {
  const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
  const fCosts = config?.FEATURE_COSTS || FEATURE_COSTS;
  const maintOpts = config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS;
  const pkgs = config?.PACKAGES || PACKAGES;

  const projectType = pTypes.find(p => p.id === state.projectType);
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

  const pkg = pkgs.find(p => p.id === state.selectedPackage);

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
