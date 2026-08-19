'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Calendar, ArrowRight, X, Eye, Link, Check } from 'lucide-react';
import { PROJECT_TYPES } from '../data/calculatorData';
import './OffersSection.css';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function truncateText(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '…';
}

function OfferModal({ offer, isOpen, onClose, serviceQuery }) {
    const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted || !offer) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="offer-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="offer-modal-container"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glow */}
            <div className="offer-modal-glow" />

            {/* Header */}
            <div className="offer-modal-header">
              <h2 className="offer-modal-header-title">{"Offer Details"}</h2>
              <button onClick={onClose} className="offer-modal-close">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="offer-modal-body">
              {offer.imageUrl && (
                <div className="offer-modal-image">
                  <img src={offer.imageUrl} alt={offer.title} />
                </div>
              )}

              {offer.discountPercentage > 0 && (
                <div className="offer-modal-badge">
                  <Tag size={16} /> {offer.discountPercentage}% {"OFF"}
                </div>
              )}

              <h3 className="offer-modal-title">{offer.title}</h3>

              <div className="offer-modal-desc">
                {offer.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="offer-modal-meta">
                <div className="offer-modal-meta-item">
                  <Calendar size={16} />
                  <span>{"Valid till"} {formatDate(offer.validUntil)}</span>
                </div>
              </div>

              <a
                href={`/${serviceQuery}#calculator`}
                className="offer-modal-cta"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  router.push(`/${serviceQuery}#calculator`);
                }}
              >
                {"Claim This Offer"} <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function OffersSection() {
    const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedServiceQuery, setSelectedServiceQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showAllOffers, setShowAllOffers] = useState(false);

  const copyToClipboard = (id) => {
    const url = `${window.location.origin}/offers/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  if (loading || offers.length === 0) {
    return <section id="offers" style={{ display: 'none' }}></section>;
  }

  function getServiceQuery(offer) {
    const offerTitleLower = offer.title.toLowerCase();
    const matchedProject = PROJECT_TYPES.find(p => {
      const nameLower = p.name.toLowerCase();
      const idLower = p.id.toLowerCase();
      const firstWord = nameLower.split(' ')[0];
      return offerTitleLower.includes(nameLower) ||
             offerTitleLower.includes(idLower) ||
             offerTitleLower.includes(firstWord);
    });
    return matchedProject ? `?service=${matchedProject.id}` : '';
  }

  const displayedOffers = showAllOffers ? offers : offers.slice(0, 4);

  return (
    <section id="offers" className="offers-section">
      <div className="section-container">
        <motion.div 
          className="offers-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="offers-title">{"Special"} <span className="text-gradient">{"Offers"}</span></h2>
          <p className="offers-subtitle">{"Exclusive weekly deals for freelance web development and Python projects."}</p>
        </motion.div>

        <div className="offers-grid">
          {displayedOffers.map((offer, index) => {
            const serviceQuery = getServiceQuery(offer);

            return (
              <motion.div 
                key={offer.id}
                className="offer-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="offer-card-glow" />
                
                {offer.imageUrl && (
                  <div className="offer-image-container">
                    <img src={offer.imageUrl} alt={offer.title} className="offer-image" />
                  </div>
                )}
                
                {offer.discountPercentage > 0 && (
                  <div className="offer-badge">
                    <Tag size={14} /> {offer.discountPercentage}% {"OFF"}
                  </div>
                )}
                
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{truncateText(offer.description)}</p>
                
                <div className="offer-footer">
                  <div className="offer-expiry">
                    <Calendar size={14} />
                    <span>{"Valid till"} {formatDate(offer.validUntil)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button
                      className="offer-view-btn"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setSelectedOffer(offer);
                        setSelectedServiceQuery(serviceQuery);
                      }}
                    >
                      <Eye size={15} /> {"View"}
                    </button>
                    <button
                      className="offer-view-btn"
                      style={{ flex: 1, backgroundColor: copiedId === offer.id ? 'var(--color-accent-primary)' : 'rgba(255, 255, 255, 0.05)' }}
                      onClick={() => copyToClipboard(offer.id)}
                    >
                      {copiedId === offer.id ? <Check size={15} /> : <Link size={15} />}
                      {copiedId === offer.id ? ` ${"Copied"}` : ` ${"Copy Link"}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {offers.length > 4 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => setShowAllOffers(!showAllOffers)}
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-glass-border)',
                color: 'var(--color-text-primary)',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-primary)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.borderColor = 'var(--color-glass-border)';
              }}
            >
              {showAllOffers ? 'Show Less' : 'View All Offers'} <ArrowRight size={16} style={{ transform: showAllOffers ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
            </button>
          </div>
        )}
      </div>

      <OfferModal
        offer={selectedOffer}
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        serviceQuery={selectedServiceQuery}
      />
    </section>
  );
}
