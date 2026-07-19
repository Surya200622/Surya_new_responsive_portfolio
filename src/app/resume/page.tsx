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
              <a href="mailto:suryacs.is.a.dev@gmail.com"><Mail size={16} /> suryacs.is.a.dev@gmail.com</a>
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
            <img src="/images/Gemini_Generated_Image_it4uq5it4uq5it4u.png" alt="Surya CS" loading="lazy" />
          </div>
        </header>

        <div className="resume-content-grid">
          {/* Main Column */}
          <main className="main-col">
            <section className="resume-section">
              <h3 className="section-title">Professional Summary</h3>
              <p className="profile-text">
                Highly motivated Entry-Level Python Full-Stack Developer with expertise in Django, MySQL, and Responsive Web Design. Proven ability to architect and deploy functional web applications (E-commerce, CRM, and Blog platforms), seeking to contribute technical skills and innovation to a dynamic IT environment.
              </p>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Work Experience</h3>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>Icon Graphics — ID Cards &amp; Lanyards</h4>
                  <span className="date">27 April 2026 - 17 June 2026</span>
                </div>
                <ul className="experience-list">
                  <li>Part-time role handling ID card lanyards for companies and schools.</li>
                </ul>
              </div>
            </section>
              
            <section className="resume-section">
              <h3 className="section-title">Projects</h3>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>DentalExperts — Django</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">2025</span>
                    <a href="https://suryacs.pythonanywhere.com" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Architected a full-stack CRM using Django/Python to streamline dental appointment booking.</li>
                  <li>The system enables online scheduling, clinic information access, and efficient management of patient records and doctor schedules.</li>
                  <li>Deployed live on PythonAnywhere.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>CipherApparel — Django</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">2025</span>
                    <a href="https://github.com/Surya200622/CipherApparel" target="_blank" rel="noreferrer" className="project-link"><GithubIcon size={14} /></a>
                    <a href="https://cipher-apparel.vercel.app" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Built a responsive fashion e-commerce platform with Django, featuring secure user authentication, dynamic product listings, offers management, and seamless Python backend integration.</li>
                  <li>Deployed live on Vercel.</li>
                </ul>
              </div>

              <div className="experience-item">
                <div className="experience-header">
                  <h4>Blogcraft — Django</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">2026</span>
                    <a href="https://blogcraft.pythonanywhere.com" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Engineered a full-stack blog platform using Django, implementing robust user authentication and systems for efficient post creation and management.</li>
                  <li>Deployed live on PythonAnywhere.</li>
                </ul>
              </div>
              
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Personal Portfolio — React/Next.js</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="date">2026</span>
                    <a href="https://suryacs.is-a.dev" target="_blank" rel="noreferrer" className="project-link"><ExternalLink size={14} /></a>
                  </div>
                </div>
                <ul className="experience-list">
                  <li>Developed a cinematic personal portfolio using React and Next.js to showcase expertise in over ten front-end and back-end technologies.</li>
                  <li>Deployed live on Vercel.</li>
                </ul>
              </div>
            </section>
            
            <section className="resume-section">
              <h3 className="section-title">Education</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Sri Ramakrishna College of Arts &amp; Science, Nava-India</h4>
                  <span className="date">July 2023 - March 2026</span>
                </div>
                <p>B.COM.CA (Bachelor of Commerce in Computer Applications)</p>
              </div>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Mani&apos;s Higher Secondary School, Nethaji Road, Papanaickenpalayam</h4>
                </div>
                <p>10th mark - All pass, 11th mark - 56%, 12th mark - 66%</p>
              </div>
            </section>

            <section className="resume-section">
              <h3 className="section-title">Extra-Curricular Activities</h3>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>Indra Institute of Education, 100 Feet Road</h4>
                  <span className="date">July 09, 2025 - Dec 15, 2025</span>
                </div>
                <p>Full-Stack Python</p>
              </div>
              <div className="experience-item">
                <div className="experience-header">
                  <h4>IBM &amp; ITC Python Certificate in College</h4>
                  <span className="date">Nov 03, 2025 - Nov 11, 2025</span>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="sidebar-col">
            <section className="resume-section">
              <h3 className="section-title">Skills</h3>
              
              <div className="skill-category">
                <h4>Technical Skills</h4>
                <div className="skill-tags">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>JavaScript</span>
                  <span>Bootstrap</span>
                  <span>Python</span>
                  <span>Django</span>
                  <span>MySQL</span>
                  <span>Responsive Web Design</span>
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
