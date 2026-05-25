import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CalculatorContext = createContext(null);

const DEFAULT_STATE = {
  projectType: '',
  pages: 5,
  uiComplexity: 'professional',
  animationLevel: 'subtle',
  features: {
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
  },
  deliverySpeed: 'standard',
  selectedPackage: 'professional',
};

export function CalculatorProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);

  const updateField = useCallback((field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateFeature = useCallback((feature, value) => {
    setState(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value },
    }));
  }, []);

  const resetCalculator = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const value = useMemo(() => ({
    ...state,
    updateField,
    updateFeature,
    resetCalculator,
  }), [state, updateField, updateFeature, resetCalculator]);

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorStore() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorStore must be used within CalculatorProvider');
  }
  return context;
}
