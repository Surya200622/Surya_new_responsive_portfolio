'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2, ShoppingCart, Palette, LayoutDashboard, Settings, Rocket,
  Brain, CalendarCheck, BookOpen, Users, Code, Shield, Database,
  CreditCard, FileEdit, Search, Server, Sparkles, MessageCircle,
  BarChart3, MessageSquare, Mail, ArrowRight, UsersRound, Video, Image, PenTool,
} from 'lucide-react';
import {
  PROJECT_TYPES, FEATURE_COSTS, PACKAGES, MAINTENANCE_OPTIONS,
  DELIVERY_SPEEDS, ADDON_CATEGORIES,
  calculatePricing, generateWhatsAppMessage, generateEmailBody,
} from '../data/calculatorData';
import PaymentModal from '../components/payment/PaymentModal';

import './CalculatorSection.css';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  Building2, ShoppingCart, Palette, LayoutDashboard, Settings, Rocket,
  Brain, CalendarCheck, BookOpen, Users, Code, Shield, Database,
  CreditCard, FileEdit, Search, Server, Sparkles, MessageCircle, BarChart3, UsersRound, Video, Image, PenTool,
};

export default function CalculatorSection() {
  
  const searchParams = useSearchParams();
  const [config, setConfig] = useState(null);
  const [projectType, setProjectType] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [selectedPackage, setSelectedPackage] = useState('starter');
  const [addons, setAddons] = useState({});
  const [features, setFeatures] = useState({
    adminDashboard: false,
    clientDashboard: false,
    database: false,
    paymentGateway: false,
    cms: false,
    seo: true,
    maintenance: 'none',
    hosting: true,
    apiIntegrations: 0,
    aiFeatures: false,
    customAnimations: false,
    realtimeChat: false,
    analyticsDashboard: false,
    googleBusinessProfile: false,
    adCampaigns: false,
    socialMediaSetup: false,
    promoVideo: false,
    posters: false,
    logos: false,
    customGraphics: false,
    imageFaceswap: false,
    videoFaceswap: false,
  });

  const [offers, setOffers] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Refresh ScrollTrigger when calculator content expands/collapses
  // so that animations in sections below (About, Timeline, etc.) recalculate correctly
  useEffect(() => {
    // Wait for framer-motion layout animations to finish before refreshing
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [projectType]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setOffers(data.offers || []);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    }
    fetchOffers();
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/settings?key=calculator_data');
        if (res.ok) {
          const data = await res.json();
          if (data.value && typeof data.value === 'object') {
            const safeConfig = { ...data.value };
            // Ignore old array format so it falls back to correct object format
            if (Array.isArray(safeConfig.PACKAGES)) {
              delete safeConfig.PACKAGES;
            }
            setConfig(safeConfig);
          }
        }
      } catch (error) {
        console.error('Failed to fetch calculator config:', error);
      }
    }
    fetchConfig();
  }, []);

  // Listen to searchParams and hash changes to dynamically select projectType and scroll
  useEffect(() => {
    const handleScroll = () => {
      let shouldScroll = false;
      if (searchParams) {
        const serviceParam = searchParams.get('service');
        if (serviceParam) {
          setProjectType(serviceParam);
          if (!['marketing', 'promo-graphics', 'ai-faceswap'].includes(serviceParam)) {
            const allPkgs = config?.PACKAGES || PACKAGES;
            const projectPkgs = allPkgs[serviceParam] || [];
            if (projectPkgs.length > 0) {
              handlePackageSelect(projectPkgs[0].id);
            }
          } else {
            setFeatures(prev => {
              const newF = { ...prev };
              Object.keys(newF).forEach(k => {
                if (typeof newF[k] === 'boolean') newF[k] = false;
              });
              newF.apiIntegrations = 0;
              newF.maintenance = 'none';
              return newF;
            });
          }
          shouldScroll = true;
        }
      }
      
      if (typeof window !== 'undefined' && window.location.hash === '#calculator') {
        shouldScroll = true;
      }

      if (shouldScroll) {
        setTimeout(() => {
          document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    handleScroll();
  }, [searchParams]);

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePackageSelect = (pkgId) => {
    setSelectedPackage(pkgId);
    
    setFeatures(prev => {
      const newFeatures = { ...prev };
      
      // Reset all boolean features before applying the package's features
      Object.keys(newFeatures).forEach(key => {
        if (typeof newFeatures[key] === 'boolean') {
          newFeatures[key] = false;
        }
      });
      newFeatures.apiIntegrations = 0;
      
      if (!pkgId) return newFeatures;
      
      const pkgIdStr = String(pkgId).toLowerCase();
      const pType = pkgIdStr.split('-')[0];
      
      // Find all textual features for this package, including inherited ones ("Everything in X")
      const allPkgs = config?.PACKAGES || PACKAGES;
      const projectPkgs = allPkgs[pType] || [];
      
      let allText = '';
      const targetIndex = projectPkgs.findIndex(p => p.id === pkgId);
      if (targetIndex !== -1) {
        for (let i = 0; i <= targetIndex; i++) {
          if (projectPkgs[i].features) {
            allText += projectPkgs[i].features.join(' ').toLowerCase() + ' ';
          }
        }
      }
      
      const selectedPkg = targetIndex !== -1 ? projectPkgs[targetIndex] : null;
      
      if (selectedPkg && Array.isArray(selectedPkg.autoFeatures) && selectedPkg.autoFeatures.length > 0) {
        // Use manually defined feature checklist from Admin Dashboard
        selectedPkg.autoFeatures.forEach(featKey => {
          newFeatures[featKey] = true;
        });
      } else {
        // Fallback: Smart dynamic toggles based on actual textual features
        const has = (kw) => allText.includes(kw.toLowerCase());
        if (has('seo')) newFeatures.seo = true;
        if (has('hosting') || has('ssl') || has('domain') || has('responsive') || pkgIdStr.includes('starter')) newFeatures.hosting = true;
        if (has('social media') || has('marketing')) newFeatures.socialMediaSetup = true;
        if (has('cms') || has('content') || has('blog') || has('catalog')) newFeatures.cms = true;
        if (has('animation') || has('premium ui')) newFeatures.customAnimations = true;
        if (has('admin') || has('management') || has('dashboard')) newFeatures.adminDashboard = true;
        if (has('customer') || has('client') || has('login') || has('account')) newFeatures.clientDashboard = true;
        if (has('analytic') || has('report')) newFeatures.analyticsDashboard = true;
        if (has('payment') || has('gateway') || has('checkout') || has('cart')) newFeatures.paymentGateway = true;
        if (has('campaign') || has('ad ') || has('ads')) newFeatures.adCampaigns = true;
        if (has('database') || has('inventory') || has('storage')) newFeatures.database = true;
        if (has('chat') || has('messaging')) newFeatures.realtimeChat = true;
        if (has('google business') || has('gbp')) newFeatures.googleBusinessProfile = true;
      }
      
      // API Integrations (quantifiable)
      if (pkgIdStr.includes('business')) {
        if (newFeatures.apiIntegrations === 0) newFeatures.apiIntegrations = 2;
      } else if (pkgIdStr.includes('enterprise')) {
        if (newFeatures.apiIntegrations < 3) newFeatures.apiIntegrations = 5;
      }
      return newFeatures;
    });
  };

  const state = useMemo(() => ({
    projectType, deliverySpeed, selectedPackage, features, addons,
  }), [projectType, deliverySpeed, selectedPackage, features, addons]);

  const applicableOffer = useMemo(() => {
    if (!projectType || !offers.length) return null;
    const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
    const currentProject = pTypes.find(p => p.id === projectType);
    if (!currentProject) return null;
    
    return offers.find(offer => {
      const offerTitleLower = offer.title.toLowerCase();
      const nameLower = currentProject.name.toLowerCase();
      const idLower = currentProject.id.toLowerCase();
      const firstWord = nameLower.split(' ')[0];
      
      const matchesProject = offerTitleLower.includes(nameLower) || 
                             offerTitleLower.includes(idLower) || 
                             offerTitleLower.includes(firstWord);
                             
      return matchesProject && offer.discountPercentage > 0;
    });
  }, [projectType, offers]);

  const pricing = useMemo(() => {
    const basePricing = calculatePricing(state, config);
    if (applicableOffer) {
      return {
        ...basePricing,
        originalTotal: basePricing.total,
        total: Math.round(basePricing.total * (1 - applicableOffer.discountPercentage / 100)),
        discountPercentage: applicableOffer.discountPercentage
      };
    }
    return basePricing;
  }, [state, applicableOffer]);

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage(state, pricing, config);
    window.open(`https://wa.me/918220443165?text=${msg}`, '_blank');
  };

  const handleEmail = () => {
    const { subject, body } = generateEmailBody(state, pricing, config);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=cssurya2006@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleGetQuote = () => {
    // Save to localStorage
    const quoteData = {
      projectType, deliverySpeed, selectedPackage, features,
      addons, pricing,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pendingQuote', JSON.stringify(quoteData));
    
    // Redirect to dashboard (will redirect to login if not authenticated)
    window.location.href = '/dashboard/quotations';
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentProject = useMemo(() => {
    const pTypes = config?.PROJECT_TYPES || PROJECT_TYPES;
    const p = pTypes.find(p => p.id === projectType);
    
    // If the database config is missing the hasAddons property (e.g. from an older save), fallback to default
    if (p && typeof p.hasAddons === 'undefined') {
      const defaultP = PROJECT_TYPES.find(dp => dp.id === projectType);
      if (defaultP) {
        return { ...p, hasAddons: defaultP.hasAddons };
      }
    }
    
    return p;
  }, [projectType, config]);

  const hasAddons = currentProject?.hasAddons;

  const booleanFeatures = useMemo(() => {
    const mergedFeatureCosts = { ...FEATURE_COSTS, ...(config?.FEATURE_COSTS || {}) };
    
    // Completely remove googleBusinessProfile if it's cached in the db config
    if (mergedFeatureCosts.googleBusinessProfile) {
      delete mergedFeatureCosts.googleBusinessProfile;
    }

    return Object.entries(mergedFeatureCosts).filter(([key]) => {
      if (typeof features[key] === 'undefined') return false;
      
      if (projectType === 'marketing') {
        return ['adCampaigns', 'socialMediaSetup'].includes(key);
      }
      if (projectType === 'promo-graphics') {
        return ['promoVideo', 'posters', 'logos', 'customGraphics'].includes(key);
      }
      if (projectType === 'ai-faceswap') {
        return ['imageFaceswap', 'videoFaceswap'].includes(key);
      }
      
      return !['promoVideo', 'posters', 'logos', 'customGraphics', 'imageFaceswap', 'videoFaceswap', 'adCampaigns'].includes(key);
    });
  }, [config, features, projectType]);

  const isSimpleProject = ['promo-graphics', 'ai-faceswap'].includes(projectType);

  return (
    <section className="calculator section" id="calculator">
      <div className="container">
        <motion.div
          className="about__section-label"
          style={{ justifyContent: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="about__section-label-line" />
          {"Pricing"}
        </motion.div>

        <motion.h2
          className="calculator__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {"Project Budget"} <span className="text-gradient">{"Calculator"}</span>
        </motion.h2>

        <motion.p
          className="calculator__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {"Configure your project and get an instant estimate"}
        </motion.p>

        {/* Step 1: Project Type */}
        <div className="calc__step-label">{"Step 01 — Choose Your Project"}</div>
        <h3 className="calc__step-title">{"What are we building?"}</h3>

        <div className="calc__types-grid">
          {(config?.PROJECT_TYPES || PROJECT_TYPES).map(type => {
            const IconComp = ICON_MAP[type.icon] || Code;
            return (
              <motion.div
                key={type.id}
                className={`calc__type-card${projectType === type.id ? ' calc__type-card--active' : ''}`}
                onClick={() => {
                  setProjectType(type.id);
                  if (!['marketing', 'promo-graphics', 'ai-faceswap'].includes(type.id)) {
                    const pkgsObj = config?.PACKAGES || PACKAGES;
                    const typePkgs = pkgsObj[type.id] || [];
                    if (typePkgs.length > 0) {
                      handlePackageSelect(typePkgs[0].id);
                    } else {
                      handlePackageSelect('starter');
                    }
                  } else {
                    setFeatures(prev => {
                      const newF = { ...prev };
                      Object.keys(newF).forEach(k => {
                        if (typeof newF[k] === 'boolean') newF[k] = false;
                      });
                      newF.apiIntegrations = 0;
                      newF.maintenance = 'none';
                      return newF;
                    });
                  }
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="calc__type-icon"><IconComp size={28} /></div>
                <div className="calc__type-name">{type.name}</div>
                <div className="calc__type-desc">{type.description}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Step 2: Package Selection */}
        {projectType && projectType !== 'marketing' && !isSimpleProject && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="calc__step-label">{"Step 02 — Choose Package"}</div>
            <h3 className="calc__step-title">{"Select your package tier"}</h3>

            <div className="calc__packages">
              {((config?.PACKAGES && config?.PACKAGES[projectType]) || PACKAGES[projectType] || []).map(pkg => (
                <motion.div
                  key={pkg.id}
                  className={`calc__package-card${selectedPackage === pkg.id ? ' calc__package-card--active' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  {pkg.badge && <div className="calc__package-badge">{pkg.badge}</div>}
                  <div className="calc__package-name">{pkg.name}</div>
                  <div className="calc__package-mult">×{pkg.multiplier} multiplier</div>
                  <div className="calc__package-desc">{pkg.description}</div>
                  <div className="calc__package-features">
                    {Array.isArray(pkg.features) && pkg.features.map(f => (
                      <span key={f} className="calc__package-feature">{f}</span>
                    ))}
                  </div>
                  <div className="calc__package-support">{pkg.support}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Configuration */}
        {projectType && (
          <motion.div
            className="calc__config"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="calc__step-label">
              {projectType === 'marketing' || isSimpleProject ? "Step 02" : "Step 03"} {"— Configure Features"}
            </div>
            <h3 className="calc__step-title">{"Customize your requirements"}</h3>



            <div className="calc__config-grid">

            </div>

            {/* Delivery Speed */}
            {projectType !== 'marketing' && !isSimpleProject && (
              <div className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>{"Delivery Speed"}</div>
                <div className="calc__radio-options">
                  {Object.entries(config?.DELIVERY_SPEEDS || DELIVERY_SPEEDS).map(([key, val]) => (
                    <div
                      key={key}
                      className={`calc__radio-card${deliverySpeed === key ? ' calc__radio-card--active' : ''}`}
                      onClick={() => setDeliverySpeed(key)}
                    >
                      <div className="calc__radio-card-label">{val.label}</div>
                      <div className="calc__radio-card-desc">{val.description}</div>
                      {val.multiplier !== 1 && <div className="calc__radio-card-mult">×{val.multiplier}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Features */}
            {booleanFeatures.length > 0 && (
              <div className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>{"Extra Features"}</div>
              <div className="calc__radio-options">
                {booleanFeatures.map(([key, val]) => {
                  const IconComp = ICON_MAP[val.icon] || Code;
                  return (
                    <div
                      key={key}
                      className={`calc__radio-card${features[key] ? ' calc__radio-card--active' : ''}`}
                      onClick={() => toggleFeature(key)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <IconComp size={16} />
                        <div className="calc__radio-card-label">{val.label}</div>
                      </div>
                      <div className="calc__radio-card-mult">+₹{Number(val.cost || 0).toLocaleString('en-IN')}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}


            {/* Dynamic Addon Categories */}
            {hasAddons && (config?.ADDON_CATEGORIES || ADDON_CATEGORIES).map(category => (
              <div key={category.id} className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>{category.title}</div>
                <div className="calc__radio-options">
                  {(category.options || []).map(opt => (
                    <div
                      key={opt.value}
                      className={`calc__radio-card${addons[category.id] === opt.value ? ' calc__radio-card--active' : ''}`}
                      onClick={() => setAddons(prev => ({ ...prev, [category.id]: opt.value }))}
                    >
                      <div className="calc__radio-card-label">{opt.label}</div>
                      {opt.cost > 0 && <div className="calc__radio-card-mult">+₹{Number(opt.cost || 0).toLocaleString('en-IN')}</div>}
                      {opt.duration && <div className="calc__radio-card-desc">{opt.duration}</div>}
                      {opt.description && <div className="calc__radio-card-desc">{opt.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Maintenance */}
            {hasAddons && (
              <div className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>{"Maintenance Support"}</div>
                <div className="calc__radio-options">
                  {(config?.MAINTENANCE_OPTIONS || MAINTENANCE_OPTIONS).map(opt => (
                    <div
                      key={opt.value}
                      className={`calc__radio-card${features.maintenance === opt.value ? ' calc__radio-card--active' : ''}`}
                      onClick={() => setFeatures(prev => ({ ...prev, maintenance: opt.value }))}
                    >
                      <div className="calc__radio-card-label">{opt.label}</div>
                      {opt.cost > 0 && <div className="calc__radio-card-mult">+₹{Number(opt.cost || 0).toLocaleString('en-IN')}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Floating Total */}
        {projectType && (
          <motion.div
            className="calc__total"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="calc__total-info">
              <div className="calc__total-item">
                <span className="calc__total-label">{"Estimated Cost"}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  {pricing.originalTotal && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="calc__total-value" style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9em' }}>
                        ₹{Number(pricing.originalTotal || 0).toLocaleString('en-IN')}
                      </span>
                      <span style={{ 
                        background: 'rgba(249, 115, 22, 0.2)', 
                        color: '#f97316', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75em',
                        fontWeight: 'bold'
                      }}>
                        {"Save"} {pricing.discountPercentage}%
                      </span>
                    </div>
                  )}
                  <span className="calc__total-value">₹{Number(pricing.total || 0).toLocaleString('en-IN')}</span>
                  {(projectType === 'marketing' || selectedPackage === 'enterprise') && (
                    <span style={{ color: '#34A853', fontSize: '0.75em', marginTop: '4px', fontWeight: '500' }}>
                      {"* 20,000 ad credits was credit in your google business profile page"}
                    </span>
                  )}
                </div>
              </div>
              <div className="calc__total-item">
                <span className="calc__total-label">{"Timeline"}</span>
                <span className="calc__total-value calc__total-value--small">{pricing.timeline} {"Days"}</span>
              </div>
              {projectType !== 'marketing' && !isSimpleProject && (
                <div className="calc__total-item">
                  <span className="calc__total-label">{"Complexity"}</span>
                  <span className="calc__total-value calc__total-value--small">{pricing.complexity}</span>
                </div>
              )}
              {projectType !== 'marketing' && !isSimpleProject && (
                <div className="calc__total-item">
                  <span className="calc__total-label">{"Package"}</span>
                  <span className="calc__total-value calc__total-value--small">{pricing.package?.name || '—'}</span>
                </div>
              )}
            </div>

            <div className="calc__total-actions">
              <button 
                className="btn btn--primary" 
                onClick={() => setIsPaymentModalOpen(true)} 
                style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)', border: 'none', color: 'white' }}
              >
                {"Pay via GPay"}
              </button>
              <button className="btn btn--glass" onClick={handleGetQuote}>
                {"Save Quote"}
              </button>
              <button className="btn btn--glass" onClick={handleWhatsApp}>
                <MessageSquare size={14} /> {"Discuss"}
              </button>
            </div>
          </motion.div>
        )}
        
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={pricing.total}
          projectName={projectType ? PROJECT_TYPES.find(p => p.id === projectType)?.name || 'Custom Project' : 'Custom Project'}
          referenceCode={`QUOTE-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`}
          allowRemaining={false}
        />
      </div>
    </section>
  );
}
