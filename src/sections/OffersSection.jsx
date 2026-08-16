'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Calendar, ArrowRight, X, Eye, Link, Check } from 'lucide-react';
import { PROJECT_TYPES } from '../data/calculatorData';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Offers');
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
              <h2 className="offer-modal-header-title">{t('offer_details')}</h2>
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
                  <Tag size={16} /> {offer.discountPercentage}% {t('off')}
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
                  <span>{t('valid_till')} {formatDate(offer.validUntil)}</span>
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
                {t('claim_offer')} <ArrowRight size={18} />
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
  const t = useTranslations('Offers');
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedServiceQuery, setSelectedServiceQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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
    return null;
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
          <h2 className="offers-title">{t('title_1')} <span className="text-gradient">{t('title_accent')}</span></h2>
          <p className="offers-subtitle">{t('subtitle')}</p>
        </motion.div>

        <div className="offers-grid">
          {offers.map((offer, index) => {
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
                    <Tag size={14} /> {offer.discountPercentage}% {t('off')}
                  </div>
                )}
                
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{truncateText(offer.description)}</p>
                
                <div className="offer-footer">
                  <div className="offer-expiry">
                    <Calendar size={14} />
                    <span>{t('valid_till')} {formatDate(offer.validUntil)}</span>
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
                      <Eye size={15} /> {t('view')}
                    </button>
                    <button
                      className="offer-view-btn"
                      style={{ flex: 1, backgroundColor: copiedId === offer.id ? 'var(--color-accent-primary)' : 'rgba(255, 255, 255, 0.05)' }}
                      onClick={() => copyToClipboard(offer.id)}
                    >
                      {copiedId === offer.id ? <Check size={15} /> : <Link size={15} />}
                      {copiedId === offer.id ? ` ${t('copied')}` : ` ${t('copy_link')}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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
