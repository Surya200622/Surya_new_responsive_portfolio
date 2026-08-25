import type { Metadata } from 'next';
import Link from 'next/link';
import LegalThemeToggle from '@/components/LegalThemeToggle';
import '../legal.css';

export const metadata: Metadata = {
  title: 'Terms of Service | Surya CS',
  description:
    'Terms of Service for suryacs-websolutions.vercel.app — Read the terms and conditions governing your use of the Surya CS portfolio website.',
};

export default function TermsOfServicePage() {
    return (
    <div className="legal-page">
      {/* Decorative background orbs */}
      <div
        className="gradient-orb gradient-orb--accent"
        style={{ width: 400, height: 400, top: '-10%', right: '-5%' }}
      />
      <div
        className="gradient-orb gradient-orb--tertiary"
        style={{ width: 350, height: 350, bottom: '5%', left: '-6%' }}
      />

      <div className="legal-container relative">
        <LegalThemeToggle />
        
        {/* Back navigation */}
        <Link href="/" className="legal-back">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {"Back to Portfolio"}
        </Link>

        {/* Header */}
        <header className="legal-header">
          <div className="legal-badge">{"Terms of Service"}</div>
          <h1 className="legal-title">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="legal-subtitle">
            {"These terms govern your use of suryacs-websolutions.vercel.app and the services provided by Surya CS. Please read them carefully."}
          </p>
          <div className="legal-meta">
            <span>{"Effective Date: June 14, 2026"}</span>
            <span className="legal-meta-divider">•</span>
            <span>{"Last Updated: June 14, 2026"}</span>
          </div>
        </header>

        {/* Content */}
        <main className="legal-content">
          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">01</span>
              {"Agreement to Terms"}
            </h2>
            <p>
              By accessing and using the portfolio website of{' '}
              <strong>Surya CS</strong> (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) located at <strong>suryacs-websolutions.vercel.app</strong>, you
              accept and agree to be bound by these Terms of Service. If you do
              not agree with any part of these terms, please do not use our
              website.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">02</span>
              {"Services Provided"}
            </h2>
            <p>
              This website serves as a personal portfolio and professional
              showcase for Surya CS, a Full-Stack Python Developer based in
              Coimbatore, India. The website provides:
            </p>
            <ul className="legal-list">
              <li>Information about professional skills and experience</li>
              <li>Portfolio of completed projects</li>
              <li>Contact information for professional inquiries</li>
              <li>A project cost calculator for estimation purposes</li>
              <li>Blog content related to web development</li>
              <li>An AI-powered chatbot for visitor assistance</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">03</span>
              {"Intellectual Property"}
            </h2>
            <p>
              All content on this website, including but not limited to text,
              graphics, logos, images, design elements, animations, code
              snippets, and the overall visual design, is the intellectual
              property of Surya CS unless otherwise stated. This content is
              protected by applicable copyright and intellectual property laws.
            </p>
            <p>You may <strong>not</strong>:</p>
            <ul className="legal-list">
              <li>
                Copy, reproduce, or redistribute any content without prior
                written permission
              </li>
              <li>
                Use any content for commercial purposes without authorization
              </li>
              <li>
                Modify or create derivative works based on the website&apos;s
                content
              </li>
              <li>
                Remove any copyright or proprietary notices from the website
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">04</span>
              {"User Responsibilities"}
            </h2>
            <p>
              When using this website, you agree to:
            </p>
            <ul className="legal-list">
              <li>Use the website only for lawful purposes</li>
              <li>
                Not attempt to gain unauthorized access to any part of the
                website, server, or any connected systems
              </li>
              <li>
                Not use the website in any way that could damage, disable, or
                impair the website&apos;s functionality
              </li>
              <li>
                Not use automated tools (bots, scrapers) to access the website
                without prior permission
              </li>
              <li>
                Not transmit any viruses, malware, or other harmful code
              </li>
              <li>
                Provide accurate information when using the contact form
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">05</span>
              Project Calculator &amp; Estimates
            </h2>
            <p>
              The project cost calculator provided on this website is for
              <strong> estimation purposes only</strong>. Estimates generated are
              approximate and do not constitute a binding quote, offer, or
              contract. Actual project costs may vary based on detailed
              requirements, scope changes, and other factors discussed during
              consultation.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">06</span>
              AI Chatbot
            </h2>
            <p>
              This website may feature an AI-powered chatbot for visitor
              assistance. Please note:
            </p>
            <ul className="legal-list">
              <li>
                The chatbot provides general information and is not a
                substitute for professional consultation
              </li>
              <li>
                Responses generated by the chatbot are automated and may not
                always be fully accurate
              </li>
              <li>
                Do not share sensitive personal information (passwords,
                financial details) with the chatbot
              </li>
              <li>
                Chatbot interactions may be logged for quality improvement
                purposes
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">07</span>
              Third-Party Links
            </h2>
            <p>
              This website may contain links to third-party websites or
              services, including but not limited to GitHub, LinkedIn,
              Instagram, and our blog platform. These links are provided for
              convenience only. We do not control, endorse, or assume
              responsibility for the content or practices of any third-party
              websites. You access them at your own risk.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">08</span>
              Freelance Services
            </h2>
            <p>
              Any freelance or development services discussed through this
              website are subject to separate agreements between Surya CS and
              the client. These Terms of Service govern only the use of this
              website, not any professional services that may be contracted
              separately.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">09</span>
              Disclaimer of Warranties
            </h2>
            <p>
              This website is provided on an <strong>&quot;as is&quot;</strong>{' '}
              and <strong>&quot;as available&quot;</strong> basis without
              warranties of any kind, either express or implied, including but
              not limited to implied warranties of merchantability, fitness for
              a particular purpose, or non-infringement.
            </p>
            <p>We do not warrant that:</p>
            <ul className="legal-list">
              <li>
                The website will be available at all times without interruption
              </li>
              <li>The website will be free from errors or vulnerabilities</li>
              <li>
                Any information on the website is complete, accurate, or
                up-to-date
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">10</span>
              {"Limitation of Liability"}
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Surya CS shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of
              data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="legal-list">
              <li>Your use or inability to use the website</li>
              <li>
                Any unauthorized access to or alteration of your data
              </li>
              <li>Any content or conduct of any third party on the website</li>
              <li>Any other matter relating to this website</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">11</span>
              Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of India. Any disputes arising out of or in
              connection with these terms shall be subject to the exclusive
              jurisdiction of the courts located in Coimbatore, Tamil Nadu,
              India.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">12</span>
              {"Changes to Terms"}
            </h2>
            <p>
              We reserve the right to modify or replace these Terms of Service
              at any time. Changes will be posted on this page with an updated
              effective date. Your continued use of the website after changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">13</span>
              {"Payments & Refunds"}
            </h2>
            <p>
              All payments made for full-stack web development services, freelance work, and digital project purchases are final and non-refundable. Once a payment is processed or a project is purchased, no refunds will be issued under any circumstances. By proceeding with a purchase or engaging our services, you expressly agree to this strict no-refund policy.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">14</span>
              {"Contact Information"}
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="legal-contact-card glass-card">
              <div className="legal-contact-item">
                <span className="legal-contact-label">{"Name"}</span>
                <span className="legal-contact-value">Surya CS</span>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">{"Email"}</span>
                <a
                  href="mailto:cssurya2006@gmail.com"
                  className="legal-contact-value legal-link"
                >
                  cssurya2006@gmail.com
                </a>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">{"Location"}</span>
                <span className="legal-contact-value">
                  Coimbatore, Tamil Nadu, India
                </span>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">{"Website"}</span>
                <a
                  href="https://suryacs-websolutions.vercel.app"
                  className="legal-contact-value legal-link"
                >
                  suryacs-websolutions.vercel.app
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="legal-footer">
          <p>
            {`© ${new Date().getFullYear()} Surya CS. All rights reserved.`}
          </p>
          <div className="legal-footer-links">
            <Link href="/privacy-policy" className="legal-footer-link">
              {"Privacy Policy"}
            </Link>
            <Link href="/" className="legal-footer-link">
              {"Back to Portfolio"}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
