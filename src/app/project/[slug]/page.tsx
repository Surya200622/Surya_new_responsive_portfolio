import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PROJECT_TYPES } from '../../../data/calculatorData'
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: project } = await supabase
    .from('portfolio_projects')
    .select('title, description')
    .eq('slug', params.slug)
    .single()

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
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: project } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!project) {
    notFound()
  }

  // Parse custom info from description appended by sync script
  let displayDesc = project.description || '';
  const readMoreMatch = displayDesc.match(/Read more details:\s*(https?:\/\/[^\s]+)/i);
  let blogLink = readMoreMatch ? readMoreMatch[1] : null;
  if (blogLink) displayDesc = displayDesc.replace(/Read more details:\s*(https?:\/\/[^\s]+)/i, '');

  const priceMatch = displayDesc.match(/Price:\s*(.*)/i);
  let projectPrice = priceMatch ? priceMatch[1] : null;
  if (priceMatch) displayDesc = displayDesc.replace(/Price:\s*(.*)/i, '');

  // fallback to calculatorData if no explicit price
  if (!projectPrice || projectPrice.trim() === 'N/A') {
    const matchedType = PROJECT_TYPES.find(p => p.name.toLowerCase().includes(project.category.toLowerCase()) || project.category.toLowerCase().includes(p.name.split(' ')[0].toLowerCase()));
    if (matchedType) projectPrice = `Starting at ₹${matchedType.basePrice}`;
  }

  return (
    <main className="pt-32 pb-16 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/#projects" className="inline-flex items-center gap-2 mb-8" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={18} /> Back to Portfolio
        </Link>
        
        <div style={{ marginBottom: '2rem' }}>
           <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
             {project.title}
           </h1>
           <div className="flex flex-wrap gap-4" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
             <span className="flex items-center gap-1"><Calendar size={16} /> {project.year}</span>
             <span className="flex items-center gap-1"><Tag size={16} /> {project.category}</span>
           </div>
        </div>

        {project.image && (
          <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--border-color)' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '2.5rem', 
          borderRadius: '1.5rem', 
          marginBottom: '3rem',
          border: '1px solid var(--border-color)'
        }}>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Project Details</h3>
           <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
             {displayDesc.trim()}
           </p>

           <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
             {project.tech_array?.map((tech: string) => (
               <span key={tech} style={{ 
                 background: 'var(--bg-tertiary)', 
                 padding: '0.4rem 1rem', 
                 borderRadius: '2rem', 
                 fontSize: '0.85rem',
                 color: 'var(--text-primary)',
                 border: '1px solid var(--border-color)'
               }}>{tech}</span>
             ))}
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Pricing</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '2rem' }}>
              {projectPrice || 'Custom Quote'}
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              {project.buyable ? (
                 <button 
                   onClick={() => window.open(`https://wa.me/919994566325?text=Hi%20Surya,%20I'm%20interested%20in%20buying%20the%20project:%20${encodeURIComponent(project.title)}`, '_blank')}
                   style={{ background: '#25D366', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, width: '100%', fontSize: '1.1rem', cursor: 'pointer', border: 'none', transition: 'transform 0.2s' }}
                   onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                 >
                   Buy this project
                 </button>
              ) : (
                <a 
                  href="/#contact"
                  style={{ display: 'block', textAlign: 'center', background: 'var(--accent)', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, width: '100%', fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Start Similar Project
                </a>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore More</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {project.link && (
                 <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none' }}>
                   <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', color: 'var(--text-secondary)' }}>
                     <ExternalLink size={20} />
                   </div>
                   Visit Live Project
                 </a>
               )}
               {blogLink && (
                 <a href={blogLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent)', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none' }}>
                   <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', color: 'var(--accent)' }}>
                     <ExternalLink size={20} />
                   </div>
                   Read Full Blog Post
                 </a>
               )}
               {!blogLink && (
                 <a href="https://blogcraft.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent)', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none' }}>
                   <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', color: 'var(--accent)' }}>
                     <ExternalLink size={20} />
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
