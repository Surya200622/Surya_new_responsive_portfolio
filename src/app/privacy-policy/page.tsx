import type { Metadata } from 'next';
import Link from 'next/link';
import LegalThemeToggle from '@/components/LegalThemeToggle';
import '../legal.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Surya CS',
  description:
    'Privacy Policy for suryacs.is-a.dev — Learn how Surya CS collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      {/* Decorative background orbs */}
      <div
        className="gradient-orb gradient-orb--accent"
        style={{ width: 400, height: 400, top: '-10%', right: '-5%' }}
      />
      <div
        className="gradient-orb gradient-orb--secondary"
        style={{ width: 300, height: 300, bottom: '10%', left: '-8%' }}
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
          Back to Portfolio
        </Link>

        {/* Header */}
        <header className="legal-header">
          <div className="legal-badge">Privacy Policy</div>
          <h1 className="legal-title">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="legal-subtitle">
            Your privacy matters to us. This policy explains how we handle your
            information when you visit{' '}
            <strong>suryacs.is-a.dev</strong>.
          </p>
          <div className="legal-meta">
            <span>Effective Date: June 14, 2026</span>
            <span className="legal-meta-divider">•</span>
            <span>Last Updated: June 14, 2026</span>
          </div>
        </header>

        {/* Content */}
        <main className="legal-content">
          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">01</span>
              Introduction
            </h2>
            <p>
              Welcome to the portfolio website of <strong>Surya CS</strong>{' '}
              (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), accessible at{' '}
              <strong>suryacs.is-a.dev</strong>. We are committed to protecting
              your privacy and ensuring a safe online experience. This Privacy
              Policy describes what information we collect, how we use it, and
              the choices you have.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">02</span>
              Information We Collect
            </h2>

            <h3 className="legal-subsection-title">
              Information You Provide
            </h3>
            <ul className="legal-list">
              <li>
                <strong>Contact Form Submissions:</strong> When you use our
                contact form, we collect your name, email address, and message
                content so we can respond to your inquiry.
              </li>
              <li>
                <strong>Email Communications:</strong> If you reach out to us
                directly via email at{' '}
                <a href="mailto:suryacs.is.a.dev@gmail.com" className="legal-link">
                  suryacs.is.a.dev@gmail.com
                </a>
                , we retain that correspondence.
              </li>
            </ul>

            <h3 className="legal-subsection-title">
              Automatically Collected Information
            </h3>
            <ul className="legal-list">
              <li>
                <strong>Usage Data:</strong> We may collect anonymized analytics
                data such as pages visited, time spent on the site, browser
                type, device type, and referring URLs to improve user
                experience.
              </li>
              <li>
                <strong>Cookies &amp; Local Storage:</strong> We use local
                storage to save your theme preference (dark/light mode). No
                tracking cookies are used for advertising purposes.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">03</span>
              How We Use Your Information
            </h2>
            <ul className="legal-list">
              <li>To respond to your inquiries and project requests</li>
              <li>To improve website functionality and user experience</li>
              <li>To maintain and operate the website</li>
              <li>To protect against misuse or unauthorized access</li>
              <li>
                To communicate about freelance projects or collaborations you
                initiate
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">04</span>
              Third-Party Services
            </h2>
            <p>
              Our website may use the following third-party services, each
              governed by their own privacy policies:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Google Fonts:</strong> For typography rendering. Google
                may collect usage data. See{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Turso:</strong> Used as our primary database for storing application data. See{' '}
                <a
                  href="https://turso.tech/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  Turso&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>NextAuth:</strong> Used for secure user authentication and session management.
              </li>
              <li>
                <strong>Cloudinary:</strong> Used exclusively for storing user-uploaded files related to projects. See{' '}
                <a
                  href="https://cloudinary.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  Cloudinary&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Resend:</strong> Used for email delivery. See{' '}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="legal-link"
                >
                  Resend&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">05</span>
              Data Security
            </h2>
            <p>
              We take reasonable precautions to protect your personal
              information. However, no method of transmission over the Internet
              or electronic storage is 100% secure. While we strive to use
              commercially acceptable means to protect your data, we cannot
              guarantee its absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">06</span>
              Data Retention
            </h2>
            <p>
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this policy, unless a longer
              retention period is required or permitted by law. Contact form
              submissions are retained for the duration of our communication
              and then deleted.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">07</span>
              Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="legal-list">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of any inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for data processing at any time</li>
              <li>
                Object to processing of your personal data for specific
                purposes
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:suryacs.is.a.dev@gmail.com" className="legal-link">
                suryacs.is.a.dev@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">08</span>
              Children&apos;s Privacy
            </h2>
            <p>
              This website is not directed at individuals under the age of 13.
              We do not knowingly collect personal information from children. If
              we become aware that we have inadvertently gathered data from a
              child under 13, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">09</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated effective date. We
              encourage you to review this page periodically for the latest
              information on our privacy practices.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">10</span>
              Payments and Refunds
            </h2>
            <p>
              Any payments made for full-stack web development services, project purchases, or related digital products are strictly non-refundable once given. By engaging in our services or purchasing projects, you acknowledge and agree to this no-refund policy.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="legal-section-title">
              <span className="legal-section-number">11</span>
              Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us:
            </p>
            <div className="legal-contact-card glass-card">
              <div className="legal-contact-item">
                <span className="legal-contact-label">Name</span>
                <span className="legal-contact-value">Surya CS</span>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">Email</span>
                <a
                  href="mailto:suryacs.is.a.dev@gmail.com"
                  className="legal-contact-value legal-link"
                >
                  suryacs.is.a.dev@gmail.com
                </a>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">Location</span>
                <span className="legal-contact-value">
                  Coimbatore, Tamil Nadu, India
                </span>
              </div>
              <div className="legal-contact-item">
                <span className="legal-contact-label">Website</span>
                <a
                  href="https://suryacs.is-a.dev"
                  className="legal-contact-value legal-link"
                >
                  suryacs.is-a.dev
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="legal-footer">
          <p>
            © {new Date().getFullYear()} Surya CS. All rights reserved.
          </p>
          <div className="legal-footer-links">
            <Link href="/terms-of-service" className="legal-footer-link">
              Terms of Service
            </Link>
            <Link href="/" className="legal-footer-link">
              Back to Portfolio
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
