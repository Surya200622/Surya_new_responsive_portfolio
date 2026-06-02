'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tag, Calendar, ArrowRight } from 'lucide-react';
import { PROJECT_TYPES } from '../data/calculatorData';
import './OffersSection.css';

export default function OffersSection() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return null; // Don't show the section if there are no active offers
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
          <h2 className="section-title">Special <span className="text-gradient">Offers</span></h2>
          <p className="section-subtitle">Exclusive weekly deals for freelance web development and Python projects.</p>
        </motion.div>

        <div className="offers-grid">
          {offers.map((offer, index) => {
            let serviceQuery = '';
            const offerTitleLower = offer.title.toLowerCase();
            const matchedProject = PROJECT_TYPES.find(p => {
              const nameLower = p.name.toLowerCase();
              const idLower = p.id.toLowerCase();
              const firstWord = nameLower.split(' ')[0];
              return offerTitleLower.includes(nameLower) || 
                     offerTitleLower.includes(idLower) || 
                     offerTitleLower.includes(firstWord);
            });
            
            if (matchedProject) {
              serviceQuery = `?service=${matchedProject.id}`;
            }

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
                
                {offer.image_url && (
                  <div className="offer-image-container">
                    <img src={offer.image_url} alt={offer.title} className="offer-image" />
                  </div>
                )}
                
                {offer.discount_percentage > 0 && (
                  <div className="offer-badge">
                    <Tag size={14} /> {offer.discount_percentage}% OFF
                  </div>
                )}
                
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>
                
                <div className="offer-footer">
                  <div className="offer-expiry">
                    <Calendar size={14} />
                    <span>Valid till {new Date(offer.valid_until).toLocaleDateString()}</span>
                  </div>
                  
                  <a 
                    href={`/${serviceQuery}#calculator`} 
                    className="offer-cta"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/${serviceQuery}#calculator`);
                    }}
                  >
                    Claim Offer <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
