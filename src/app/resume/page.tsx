import Link from 'next/link';
import { ArrowLeft, Download, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import './resume.css';

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const metadata = {
  title: 'Resume | Surya CS - Full-Stack Python Developer',
  description: 'Interactive resume for Surya CS. View skills, experience, and education.',
};

export default function ResumePage() {
  return (
    <div className="resume-page-wrapper">
      <div className="resume-nav">
        <Link href="/" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Portfolio</span>
        </Link>
        <a href="/api/resume/download" download="SuryaCS-resume.pdf" className="download-btn">
          <Download size={18} />
          <span>Download PDF</span>
        </a>
      </div>

      <div className="resume-container">
        {/* Header Section */}
        <header className="resume-header">
          <div className="header-content">
            <h1 className="resume-name">Surya CS</h1>
            <h2 className="resume-title">Full-Stack Python Developer</h2>
            
            <div className="contact-info">
              <a href="mailto:cssurya2006@gmail.com"><Mail size={16} /> cssurya2006@gmail.com</a>
              <a href="tel:+918220443165"><Phone size={16} /> +91 8220443165</a>
              <span><MapPin size={16} /> Coimbatore, India</span>
            </div>
            
            <div className="social-links">
              <a href="https://github.com/Surya200622" target="_blank" rel="noreferrer"><GithubIcon size={16} /> GitHub</a>
              <a href="https://linkedin.com/in/suryacs22/" target="_blank" rel="noreferrer"><LinkedinIcon size={16} /> LinkedIn</a>
              <a href="https://suryacs-web.vercel.app" target="_blank" rel="noreferrer"><ExternalLink size={16} /> suryacs-web.vercel.app</a>
            </div>
          </div>
          <div className="resume-header-image">
            <img src="/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png" alt="Surya CS" fetchPriority="high" />
          </div>
        </header>

        <div className="resume-content-grid">
          {/* Main Column */}
          <main className="main-col">
            <section className="resume-section">
              <h3 className="section-title">Professional Summary</h3>
              <p className="profile-text">
                Entry-level Full-Stack Developer skilled in Python, Django, React, and MySQL, with hands-on experience designing and deploying four live web applications spanning CRM, e-commerce, and blogging platforms. Published researcher (IJSRED) with a strong grasp of the full development lifecycle, from database design to live deployment. Looking to bring this practical, self-driven project experience to an entry-level developer role.
              </p>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Projects</h3>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>DentalExperts</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">Django, Python, SQlite</span>
                    <a href="https://suryacs.pythonanywhere.com" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Designed and built a full-stack CRM to streamline dental appointment booking for clinics.</li>
                  <li>Implemented online scheduling, clinic information pages, and management of patient records and doctor schedules.</li>
                  <li>Deployed live on PythonAnywhere; formed the basis of a published research paper (see Publications).</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>CipherApparel</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">React.js, Django, Python, SQlite</span>
                    <a href="https://cipher-apparel.vercel.app" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Built a responsive fashion e-commerce platform with secure user authentication and session handling.</li>
                  <li>Developed dynamic product listing and offers-management features backed by a Django/Python API.</li>
                  <li>Integrated a React front end with the Django backend for a seamless, single-page-style shopping experience.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>Blogcraft</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">React.js, Django, Python</span>
                    <a href="https://blogcraft.pythonanywhere.com" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Engineered a full-stack blogging platform with user authentication and role-based access.</li>
                  <li>Built post creation, editing, and management workflows for efficient content publishing.</li>
                </ul>
              </div>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Personal Portfolio</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">Next.js, Supabase</span>
                    <a href="https://suryacs-web.vercel.app" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Developed and deployed a cinematic personal portfolio site showcasing 10+ front-end and back-end technologies.</li>
                  <li>Hosted live on Vercel with a focus on animation and responsive layout.</li>
                  <li>Obtained via the free is-a.dev developer community, providing accessible subdomain branding for developer projects.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>Spice Kitchen</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">React, Vite</span>
                    <a href="https://spice-kitchen-veg-nonveg.vercel.app" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Developed a lightweight, responsive digital menu application to streamline the dining experience, featuring intuitive category browsing.</li>
                  <li>Deployed on Vercel to ensure high availability and fast load times for end users.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>Restaurant POS &amp; Billing System</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">React, Node.js, Express.js, Turso</span>
                    <a href="https://restaurant-pos-frontend-steel.vercel.app" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Built a cloud-ready Point of Sale system facilitating real-time order management, menu administration, and efficient checkout processes.</li>
                  <li>Integrated Cloudinary for media management and Turso (LibSQL) for high-performance, scalable edge database operations.</li>
                </ul>
              </div>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Research Publications</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>&quot;A Study on Web-Based Dental Appointment Booking System&quot;</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <a href="https://www.ijsred.com/volume9/issue1/paper-details/IJSRED-V9I1P214.html" target="_blank" rel="noreferrer" className="project-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--color-accent-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span>View Publication</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                <p>Published in IJSRED, Volume 9, Issue 1.</p>
              </div>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Education</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Sri Ramakrishna College of Arts &amp; Science, Nava-India</h4>
                  <span className="date">Jul 2023 - Apr 2026 | completed</span>
                </div>
                <p>B.Com. with Computer Applications (B.Com CA)</p>
              </div>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Mani&apos;s Higher Secondary School, Nethaji Road, Papanaickenpalayam</h4>
                  <span className="date">Completed</span>
                </div>
                <p>Higher Secondary (12th) &amp; SSLC (10th) | 12th: 66% | 10th: All Pass</p>
              </div>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Certifications &amp; Training</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Full-Stack Python Development</h4>
                  <span className="date">Jul 2025 - Dec 2025</span>
                </div>
                <p>Indra Institute of Education, 100 Feet Road</p>
              </div>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Data Analytics</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">Nov 2025</span>
                    <a href="https://drive.google.com/file/d/1UFR6S13iJSiycCxFsXYNVcVLOek4UkHY/view?usp=drive_link" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <p>IBM &amp; ITC, in association with Sri Ramakrishna College Of Arts &amp; Science</p>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="sidebar-col">
            <section className="resume-section">
              <h3 className="section-title">Skills</h3>
              
              <div className="skill-category">
                <h4>Languages</h4>
                <div className="skill-tags">
                  <span>Python</span>
                  <span>JavaScript</span>
                  <span>HTML</span>
                  <span>CSS</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>Frameworks &amp; Libraries</h4>
                <div className="skill-tags">
                  <span>Django</span>
                  <span>Django REST</span>
                  <span>React.js</span>
                  <span>Next.js</span>
                  <span>Bootstrap</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>Databases</h4>
                <div className="skill-tags">
                  <span>MySQL</span>
                  <span>SQLite</span>
                  <span>Supabase</span>
                  <span>Turso</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>Tools &amp; Platforms</h4>
                <div className="skill-tags">
                  <span>GitHub</span>
                  <span>PythonAnywhere</span>
                  <span>Vercel</span>
                  <span>VS Code</span>
                </div>
              </div>

              <div className="skill-category">
                <h4>Core Concepts</h4>
                <div className="skill-tags">
                  <span>REST APIs</span>
                  <span>Responsive Web Design</span>
                  <span>Auth &amp; Auth</span>
                  <span>MVC/MVT</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>Soft Skills</h4>
                <div className="skill-tags">
                  <span>Problem Solving</span>
                  <span>Communication</span>
                  <span>Adaptability</span>
                  <span>Creativity</span>
                  <span>Team Collaboration</span>
                </div>
              </div>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Languages</h3>
              <ul className="lang-list">
                <li>English (Professional Working)</li>
                <li>Tamil (Native)</li>
              </ul>
            </section>
          </aside>

          {/* Full Width Declaration */}
          <section className="resume-section" style={{ gridColumn: '1 / -1' }}>
            <h3 className="section-title">Declaration</h3>
            <div className="profile-text" style={{ textAlign: 'left', width: '100%', marginBottom: 0 }}>
              I hereby declare that the above-mentioned information is true to the best of my knowledge and belief.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
