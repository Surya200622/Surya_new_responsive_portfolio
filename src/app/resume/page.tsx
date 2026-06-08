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
        <a href="/resume.pdf" download="Surya_CS_Resume.pdf" className="download-btn">
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
              <a href="https://suryacs.is-a.dev" target="_blank" rel="noreferrer"><ExternalLink size={16} /> suryacs.is-a.dev</a>
            </div>
          </div>
          <div className="resume-header-image">
            <img src="/images/surya-portrait.jpg" alt="Surya CS" loading="lazy" />
          </div>
        </header>

        <div className="resume-content-grid">
          {/* Main Column */}
          <main className="main-col">
            <section className="resume-section">
              <h3 className="section-title">Professional Profile</h3>
              <p className="profile-text">
                Dedicated Full-Stack Developer specializing in Python, Django, and React. With a strong foundation in Computer Applications (B.COM.CA), I craft comprehensive web solutions focusing on performance, responsive design, and seamless user experiences. Completed IBM & ITC collaborative training in Data Science (Pandas & NumPy).
              </p>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Experience & Projects</h3>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>DentalExperts — Clinic Management System</h4>
                  <span className="date">2025</span>
                </div>
                <p className="tech-stack">Python, Django, SQLite, Bootstrap</p>
                <ul className="experience-list">
                  <li>Developed a full-stack booking system allowing patients to easily schedule appointments.</li>
                  <li>Implemented secure doctor/admin dashboards to manage patient records and schedules efficiently.</li>
                  <li>Deployed the application successfully on PythonAnywhere.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>CipherApparel — E-commerce Platform</h4>
                  <span className="date">2025</span>
                </div>
                <p className="tech-stack">Django, PostgreSQL, JavaScript, CSS3</p>
                <ul className="experience-list">
                  <li>Built a responsive fashion e-commerce web application with robust user authentication.</li>
                  <li>Designed dynamic product listing, cart, and checkout workflows.</li>
                  <li>Integrated database models for real-time inventory and order tracking.</li>
                </ul>
              </div>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Magical Portfolio</h4>
                  <span className="date">2025</span>
                </div>
                <p className="tech-stack">React (Next.js), GSAP, Framer Motion, Supabase</p>
                <ul className="experience-list">
                  <li>Designed an interactive, highly animated single-page portfolio using GSAP ScrollTrigger.</li>
                  <li>Integrated Supabase for dynamic quotation requests and backend management.</li>
                </ul>
              </div>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Education</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Bachelor of Commerce in Computer Applications (B.COM.CA)</h4>
                  <span className="date">2023 - 2026</span>
                </div>
                <p>Sri Ramakrishna College of Arts & Science, Nava-India, Coimbatore</p>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="sidebar-col">
            <section className="resume-section">
              <h3 className="section-title">Skills</h3>
              
              <div className="skill-category">
                <h4>Backend Development</h4>
                <div className="skill-tags">
                  <span>Python</span>
                  <span>Django</span>
                  <span>REST APIs</span>
                  <span>SQLite</span>
                  <span>PostgreSQL</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>Frontend Development</h4>
                <div className="skill-tags">
                  <span>React.js</span>
                  <span>Next.js</span>
                  <span>JavaScript (ES6+)</span>
                  <span>HTML5 / CSS3</span>
                  <span>Tailwind CSS</span>
                  <span>GSAP</span>
                  <span>Framer Motion</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h4>Tools & Others</h4>
                <div className="skill-tags">
                  <span>Git & GitHub</span>
                  <span>Supabase</span>
                  <span>Data Analysis (Pandas/NumPy)</span>
                  <span>Vite</span>
                </div>
              </div>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Certifications</h3>
              <ul className="cert-list">
                <li>IBM & ITC Collaborative Training — Python Pandas & NumPy</li>
              </ul>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Languages</h3>
              <ul className="lang-list">
                <li>English (Professional Working)</li>
                <li>Tamil (Native)</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
