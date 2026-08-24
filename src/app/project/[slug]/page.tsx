import { db } from '@/db'
import { portfolioProjects } from '@/db/schema'
import { like } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { PROJECT_TYPES } from '../../../data/calculatorData'
import { ShieldCheck, Calendar, Tag, ExternalLink, ArrowLeft, CheckCircle } from 'lucide-react'
import BuyProjectButton from '@/components/payment/BuyProjectButton'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug)

  const project = await db.select({ title: portfolioProjects.title, description: portfolioProjects.description })
    .from(portfolioProjects)
    .where(like(portfolioProjects.slug, decodedSlug))
    .get()

  if (!project) {
    return {
      title: 'Project Not Found | Surya CS'
    }
  }

  return {
    title: `${project.title} | Surya CS`,
    description: project.description?.substring(0, 160) || 'Project details',
  }
}


export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug)

  const project = await db.select()
    .from(portfolioProjects)
    .where(like(portfolioProjects.slug, decodedSlug))
    .get()

  if (!project) {
    notFound()
  }

  // Parse custom info from description appended by sync script
  let displayDesc = project.description || '';
  let blogLink = project.viewDetailsUrl || null;
  
  if (!blogLink) {
    const readMoreMatch = displayDesc.match(/Read more details:\s*(https?:\/\/[^\s]+)/i);
    blogLink = readMoreMatch ? readMoreMatch[1] : null;
  }
  
  if (displayDesc.match(/Read more details:\s*(https?:\/\/[^\s]+)/i)) {
    displayDesc = displayDesc.replace(/Read more details:\s*(https?:\/\/[^\s]+)/i, '');
  }

  let projectPrice = project.projectPrice ? String(project.projectPrice) : null;

  const priceMatch = displayDesc.match(/Price:\s*(.*)/i);
  if (priceMatch) {
    if (!projectPrice) {
      projectPrice = priceMatch[1];
    }
    displayDesc = displayDesc.replace(/Price:\s*(.*)/i, '');
  }

  // fallback to calculatorData if no explicit price
  if (!projectPrice || projectPrice.trim() === 'N/A') {
    const matchedType = PROJECT_TYPES.find(p => p.name.toLowerCase().includes(project.category.toLowerCase()) || project.category.toLowerCase().includes(p.name.split(' ')[0].toLowerCase()));
    if (matchedType) projectPrice = `Starting at ₹${matchedType.basePrice}`;
  } else if (!projectPrice.startsWith('₹') && !projectPrice.toLowerCase().includes('starting') && !projectPrice.toLowerCase().includes('custom')) {
    projectPrice = `₹${projectPrice}`;
  }

  let discountPrice = project.offersDiscountPrice ? String(project.offersDiscountPrice) : null;
  if (discountPrice && !discountPrice.startsWith('₹') && !discountPrice.toLowerCase().includes('starting') && !discountPrice.toLowerCase().includes('custom')) {
    discountPrice = `₹${discountPrice}`;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: project.title,
    description: displayDesc.trim() || project.description || 'Custom Web Development Project',
    image: project.image ? (project.image.startsWith('http') ? project.image : `https://suryacs-web.vercel.app${project.image}`) : 'https://suryacs-web.vercel.app/logo.png',
    offers: {
      '@type': 'Offer',
      price: discountPrice ? discountPrice.replace(/[^0-9]/g, '') : (projectPrice ? projectPrice.replace(/[^0-9]/g, '') : '5000'),
      priceCurrency: 'INR',
      availability: project.buyable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://suryacs-web.vercel.app/project/${project.slug}`,
    }
  };

  return (
    <main className="pt-24 md:pt-32 pb-16 min-h-screen bg-[var(--bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/#projects" className="inline-flex items-center gap-2 mb-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} /> Back to Portfolio
        </Link>
        
        <div className="mb-8 md:mb-10">
           <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-4 text-[var(--text-primary)] leading-tight">
             {project.title}
           </h1>
           <div className="flex flex-wrap gap-4 text-sm md:text-base text-[var(--text-tertiary)]">
             <span className="flex items-center gap-1.5"><Calendar size={18} /> {project.year}</span>
             <span className="flex items-center gap-1.5"><Tag size={18} /> {project.category}</span>
           </div>
        </div>

        {project.isYoutube && project.youtubeId ? (
          <div className="rounded-2xl overflow-hidden mb-10 md:mb-12 border border-[var(--border-color)] relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${project.youtubeId}?rel=0`}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-none"
            ></iframe>
          </div>
        ) : (
          project.image && (
            <div className="rounded-2xl overflow-hidden mb-10 md:mb-12 border border-[var(--border-color)]">
              <img src={project.image} alt={project.title} className="w-full h-auto max-h-[400px] md:max-h-[600px] object-cover block" />
            </div>
          )
        )}

        <div className="bg-[var(--bg-secondary)] p-6 md:p-10 rounded-3xl mb-10 md:mb-12 border border-[var(--border-color)]">
           <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Project Details</h3>
           <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-base md:text-lg mb-8">
             {displayDesc.trim()}
           </p>

           <div className="flex flex-wrap gap-2 md:gap-3">
            {(project.techArray as string[])?.map((tech: string) => (
              <span key={tech} className="bg-[var(--bg-tertiary)] px-4 py-1.5 rounded-full text-sm md:text-base text-[var(--text-primary)] border border-[var(--border-color)]">
                 {tech}
              </span>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-[var(--bg-secondary)] p-6 md:p-10 rounded-3xl border border-[var(--border-color)] flex flex-col">
            <h4 className="text-[var(--text-secondary)] text-sm font-semibold mb-2 uppercase tracking-wider">Estimated Pricing</h4>
            <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent-primary)] mb-8 flex items-baseline gap-3 flex-wrap">
              {discountPrice ? (
                <>
                  <span>{discountPrice}</span>
                  <span className="text-xl md:text-2xl text-[var(--text-muted)] line-through font-medium opacity-60">
                    {projectPrice || 'Custom Quote'}
                  </span>
                </>
              ) : (
                projectPrice || 'Custom Quote'
              )}
            </div>
            
            <div className="mt-auto">
              {project.buyable ? (
                 <BuyProjectButton projectTitle={project.title} projectPrice={discountPrice || projectPrice || '5000'} />
              ) : (
                <a 
                  href="/#contact"
                  className="block text-center bg-[var(--color-accent-primary)] text-white py-4 px-6 rounded-xl font-semibold w-full text-lg hover:opacity-90 transition-opacity"
                >
                  Start Similar Project
                </a>
              )}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] p-6 md:p-10 rounded-3xl border border-[var(--border-color)] flex flex-col">
            <h4 className="text-[var(--text-secondary)] text-sm font-semibold mb-6 uppercase tracking-wider">Explore More</h4>
            <div className="flex flex-col gap-5">
               {project.link && (
                 <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--text-primary)] font-medium text-lg hover:opacity-80 transition-opacity">
                   <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-[var(--text-secondary)] flex-shrink-0">
                     <ExternalLink size={24} />
                   </div>
                   Visit Live Project
                 </a>
               )}
               {blogLink && (
                 <a href={blogLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--color-accent-primary)] font-medium text-lg hover:opacity-80 transition-opacity">
                   <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-[var(--color-accent-primary)] flex-shrink-0">
                     <ExternalLink size={24} />
                   </div>
                   Read Full Blog Post
                 </a>
               )}
               {!blogLink && (
                 <a href="https://blogcraft.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--color-accent-primary)] font-medium text-lg hover:opacity-80 transition-opacity">
                   <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-[var(--color-accent-primary)] flex-shrink-0">
                     <ExternalLink size={24} />
                   </div>
                   Read My Blog
                 </a>
               )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
