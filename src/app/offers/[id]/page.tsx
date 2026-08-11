import { notFound } from 'next/navigation';
import { db } from '@/db';
import { offers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PortfolioLayout from '@/components/PortfolioLayout';
import { Tag, Calendar, ArrowRight } from 'lucide-react';
import { PROJECT_TYPES } from '@/data/calculatorData';

export const revalidate = 0; // Disable static rendering for this dynamic route

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default async function SingleOfferPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  const fetchedOffers = await db.select().from(offers).where(eq(offers.id, id));

  if (fetchedOffers.length === 0) {
    notFound();
  }

  const offer = fetchedOffers[0];

  // Logic to get the service query
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
    <PortfolioLayout>
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-2xl bg-[#12121e] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden isolate">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#c9a84c]/20 blur-[100px] -z-10 rounded-full" />
          
          {offer.imageUrl && (
            <div className="w-full h-64 mb-8 rounded-xl overflow-hidden bg-black/30 relative">
              <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-contain" />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {offer.discountPercentage && offer.discountPercentage > 0 ? (
              <div className="inline-flex items-center gap-2 bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/30 px-3 py-1.5 rounded-full text-sm font-bold w-fit">
                <Tag size={16} /> {offer.discountPercentage}% OFF
              </div>
            ) : null}

            <h1 className="text-3xl font-bold text-[#f0ece2] font-display">{offer.title}</h1>

            <div className="text-[#a09a8e] leading-relaxed space-y-4 text-lg">
              {offer.description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[#6b6560] font-medium bg-black/20 p-4 rounded-xl border border-white/5 w-fit">
              <Calendar size={18} />
              <span>Valid till {formatDate(offer.validUntil)}</span>
            </div>

            <div className="mt-8">
              <a
                href={`/${serviceQuery}#calculator`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#d4956a] text-white px-8 py-4 rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-[#f97316]/20 w-full sm:w-auto justify-center text-lg"
              >
                Claim This Offer <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </PortfolioLayout>
  );
}
