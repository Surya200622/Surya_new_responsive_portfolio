import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, ShoppingCart, Palette, LayoutDashboard, Settings, Rocket,
  Brain, CalendarCheck, BookOpen, Users, Code, Shield, Database,
  CreditCard, FileEdit, Search, Server, Sparkles, MessageCircle,
  BarChart3, MessageSquare, Mail, ArrowRight,
} from 'lucide-react';
import {
  PROJECT_TYPES, FEATURE_COSTS, PACKAGES, MAINTENANCE_OPTIONS,
  UI_COMPLEXITY, ANIMATION_LEVELS, DELIVERY_SPEEDS, PAGE_RATE,
  calculatePricing, generateWhatsAppMessage, generateEmailBody,
} from '../data/calculatorData';
import './CalculatorSection.css';

const ICON_MAP = {
  Building2, ShoppingCart, Palette, LayoutDashboard, Settings, Rocket,
  Brain, CalendarCheck, BookOpen, Users, Code, Shield, Database,
  CreditCard, FileEdit, Search, Server, Sparkles, MessageCircle, BarChart3,
};

export default function CalculatorSection() {
  const [projectType, setProjectType] = useState('');
  const [pages, setPages] = useState(5);
  const [uiComplexity, setUiComplexity] = useState('professional');
  const [animationLevel, setAnimationLevel] = useState('subtle');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [selectedPackage, setSelectedPackage] = useState('professional');
  const [features, setFeatures] = useState({
    adminDashboard: false,
    clientDashboard: false,
    authentication: false,
    database: false,
    paymentGateway: false,
    cms: false,
    seo: false,
    maintenance: 'none',
    hosting: false,
    apiIntegrations: 0,
    aiFeatures: false,
    customAnimations: false,
    realtimeChat: false,
    analyticsDashboard: false,
  });

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const state = useMemo(() => ({
    projectType, pages, uiComplexity, animationLevel, deliverySpeed, selectedPackage, features,
  }), [projectType, pages, uiComplexity, animationLevel, deliverySpeed, selectedPackage, features]);

  const pricing = useMemo(() => calculatePricing(state), [state]);

  const handleWhatsApp = () => {
    const msg = generateWhatsAppMessage(state, pricing);
    window.open(`https://wa.me/918220443165?text=${msg}`, '_blank');
  };

  const handleEmail = () => {
    const { subject, body } = generateEmailBody(state, pricing);
    window.location.href = `mailto:cssurya2006@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleGetQuote = () => {
    // Save to localStorage
    const quoteData = {
      projectType,
      pages,
      uiComplexity,
      animationLevel,
      deliverySpeed,
      selectedPackage,
      features,
      pricing,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('pendingQuote', JSON.stringify(quoteData));
    
    // Redirect to dashboard (will redirect to login if not authenticated)
    window.location.href = '/dashboard/quotations';
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const booleanFeatures = Object.entries(FEATURE_COSTS).filter(([key]) =>
    key !== 'apiIntegrations' && key !== 'maintenance'
  );

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
          Pricing
        </motion.div>

        <motion.h2
          className="calculator__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Project Budget <span className="text-gradient">Calculator</span>
        </motion.h2>

        <motion.p
          className="calculator__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Configure your project and get an instant estimate
        </motion.p>

        {/* Step 1: Project Type */}
        <div className="calc__step-label">Step 01 — Choose Your Project</div>
        <h3 className="calc__step-title">What are we building?</h3>

        <div className="calc__types-grid">
          {PROJECT_TYPES.map(type => {
            const IconComp = ICON_MAP[type.icon] || Code;
            return (
              <motion.div
                key={type.id}
                className={`calc__type-card${projectType === type.id ? ' calc__type-card--active' : ''}`}
                onClick={() => setProjectType(type.id)}
                whileTap={{ scale: 0.97 }}
              >
                <div className="calc__type-icon"><IconComp size={28} /></div>
                <div className="calc__type-name">{type.name}</div>
                <div className="calc__type-desc">{type.description}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Step 2: Configuration */}
        {projectType && (
          <motion.div
            className="calc__config"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="calc__step-label">Step 02 — Configure Features</div>
            <h3 className="calc__step-title">Customize your requirements</h3>

            {/* Pages Slider */}
            <div className="calc__slider-group">
              <div className="calc__slider-header">
                <span className="calc__slider-label">Number of Pages</span>
                <span className="calc__slider-value">{pages}</span>
              </div>
              <input
                type="range"
                className="calc__slider"
                min="1"
                max="50"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
              />
            </div>

            <div className="calc__config-grid">
              {/* UI Complexity */}
              <div className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>UI Complexity</div>
                <div className="calc__radio-options">
                  {Object.entries(UI_COMPLEXITY).map(([key, val]) => (
                    <div
                      key={key}
                      className={`calc__radio-card${uiComplexity === key ? ' calc__radio-card--active' : ''}`}
                      onClick={() => setUiComplexity(key)}
                    >
                      <div className="calc__radio-card-label">{val.label}</div>
                      <div className="calc__radio-card-desc">{val.description}</div>
                      <div className="calc__radio-card-mult">×{val.multiplier}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animation Level */}
              <div className="calc__radio-group">
                <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>Animation Level</div>
                <div className="calc__radio-options">
                  {Object.entries(ANIMATION_LEVELS).map(([key, val]) => (
                    <div
                      key={key}
                      className={`calc__radio-card${animationLevel === key ? ' calc__radio-card--active' : ''}`}
                      onClick={() => setAnimationLevel(key)}
                    >
                      <div className="calc__radio-card-label">{val.label}</div>
                      <div className="calc__radio-card-desc">{val.description}</div>
                      <div className="calc__radio-card-mult">×{val.multiplier}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Speed */}
            <div className="calc__radio-group">
              <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>Delivery Speed</div>
              <div className="calc__radio-options">
                {Object.entries(DELIVERY_SPEEDS).map(([key, val]) => (
                  <div
                    key={key}
                    className={`calc__radio-card${deliverySpeed === key ? ' calc__radio-card--active' : ''}`}
                    onClick={() => setDeliverySpeed(key)}
                  >
                    <div className="calc__radio-card-label">{val.label}</div>
                    <div className="calc__radio-card-desc">{val.description}</div>
                    <div className="calc__radio-card-mult">×{val.multiplier}</div>
                  </div>
                ))}
              </div>
            </div>



            {/* Maintenance */}
            <div className="calc__radio-group">
              <div className="calc__slider-label" style={{ marginBottom: 'var(--space-sm)' }}>Maintenance Support</div>
              <div className="calc__radio-options">
                {MAINTENANCE_OPTIONS.map(opt => (
                  <div
                    key={opt.value}
                    className={`calc__radio-card${features.maintenance === opt.value ? ' calc__radio-card--active' : ''}`}
                    onClick={() => setFeatures(prev => ({ ...prev, maintenance: opt.value }))}
                  >
                    <div className="calc__radio-card-label">{opt.label}</div>
                    {opt.cost > 0 && <div className="calc__radio-card-mult">+₹{opt.cost.toLocaleString('en-IN')}</div>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Package Selection */}
        {projectType && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="calc__step-label">Step 03 — Choose Package</div>
            <h3 className="calc__step-title">Select your package tier</h3>

            <div className="calc__packages">
              {PACKAGES.map(pkg => (
                <motion.div
                  key={pkg.id}
                  className={`calc__package-card${selectedPackage === pkg.id ? ' calc__package-card--active' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  {pkg.badge && <div className="calc__package-badge">{pkg.badge}</div>}
                  <div className="calc__package-name">{pkg.name}</div>
                  <div className="calc__package-mult">×{pkg.multiplier} multiplier</div>
                  <div className="calc__package-desc">{pkg.description}</div>
                  <div className="calc__package-features">
                    {pkg.features.map(f => (
                      <span key={f} className="calc__package-feature">{f}</span>
                    ))}
                  </div>
                  <div className="calc__package-support">{pkg.support}</div>
                </motion.div>
              ))}
            </div>
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
                <span className="calc__total-label">Estimated Cost</span>
                <span className="calc__total-value">₹{pricing.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc__total-item">
                <span className="calc__total-label">Timeline</span>
                <span className="calc__total-value calc__total-value--small">{pricing.timeline} Days</span>
              </div>
              <div className="calc__total-item">
                <span className="calc__total-label">Complexity</span>
                <span className="calc__total-value calc__total-value--small">{pricing.complexity}</span>
              </div>
              <div className="calc__total-item">
                <span className="calc__total-label">Package</span>
                <span className="calc__total-value calc__total-value--small">{pricing.package?.name || '—'}</span>
              </div>
            </div>

            <div className="calc__total-actions">
              <button className="btn btn--primary" onClick={handleGetQuote}>
                Get Quote <ArrowRight size={14} />
              </button>
              <button className="btn btn--glass" onClick={handleWhatsApp}>
                <MessageSquare size={14} /> WhatsApp
              </button>
              <button className="btn btn--glass" onClick={handleEmail}>
                <Mail size={14} /> Email
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
