import PortfolioLayout from '@/components/PortfolioLayout';
import OffersSection from '@/sections/OffersSection';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { db } from '@/db';
import { offers } from '@/db/schema';
import { eq, desc, and, gt } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Exclusive Deals & Services | Suryacs Web Solutions',
  description: 'Special offers and freelance services by Surya CS. Web Development, Python automation, React, and Django projects tailored for you.',
  keywords: 'Freelance web development offers, Python developer services, React development deals, Django developer for hire, Suryacs Web Solutions services',
  openGraph: {
    title: 'Exclusive Deals & Services | Suryacs Web Solutions',
    description: 'Special offers and freelance services by Surya CS. Web Development, Python automation, React, and Django projects tailored for you.',
    url: 'https://suryacs-websolutions.vercel.app/offers',
  }
};

export default async function OffersPage() {
  let initialOffers = [];
  try {
    initialOffers = await db
      .select()
      .from(offers)
      .where(
        and(
          eq(offers.isActive, true),
          gt(offers.validUntil, new Date().toISOString())
        )
      )
      .orderBy(desc(offers.createdAt));
  } catch (error) {
    console.error('Failed to fetch offers server-side:', error);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    'name': 'Web Development & Python Services',
    'description': 'Exclusive offers and freelance services provided by Suryacs Web Solutions.',
    'itemListElement': initialOffers.map((offer, index) => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': offer.title,
        'description': offer.description,
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'Suryacs Web Solutions'
        }
      },
      'priceCurrency': 'INR',
      'price': 'Contact for pricing',
      'validThrough': offer.validUntil,
      'position': index + 1
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
        <PortfolioLayout>
          <div style={{ paddingTop: '80px' }}>
            <OffersSection initialOffers={initialOffers} />
          </div>
        </PortfolioLayout>
      </Suspense>
    </>
  );
}
