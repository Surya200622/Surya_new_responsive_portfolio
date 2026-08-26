const fs = require('fs');
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

en.PrivacyPolicy = {
  title: 'Privacy Policy',
  subtitle: 'Your privacy matters to us. This policy explains how we handle your information when you visit suryacsweb.is-cool.dev.',
  effective_date: 'Effective Date: June 14, 2026',
  last_updated: 'Last Updated: June 14, 2026',
  back_to_portfolio: 'Back to Portfolio',
  intro_title: 'Introduction',
  intro_text: 'Welcome to the portfolio website of Surya CS ("we," "us," or "our"), accessible at suryacsweb.is-cool.dev. We are committed to protecting your privacy and ensuring a safe online experience.',
  info_collect_title: 'Information We Collect',
  info_provide: 'Information You Provide',
  info_auto: 'Automatically Collected Information',
  use_info_title: 'How We Use Your Information',
  third_party_title: 'Third-Party Services',
  security_title: 'Data Security',
  retention_title: 'Data Retention',
  rights_title: 'Your Rights',
  children_title: "Children's Privacy",
  changes_title: 'Changes to This Policy',
  payments_title: 'Payments and Refunds',
  payments_text: 'Any payments made for full-stack web development services, project purchases, or related digital products are strictly non-refundable once given. By engaging in our services or purchasing projects, you acknowledge and agree to this no-refund policy.',
  contact_title: 'Contact Us',
  name: 'Name',
  email: 'Email',
  location: 'Location',
  website: 'Website',
  copyright: '© {year} Surya CS. All rights reserved.',
  terms_link: 'Terms of Service'
};

en.TermsOfService = {
  title: 'Terms of Service',
  subtitle: 'These terms govern your use of suryacsweb.is-cool.dev and the services provided by Surya CS. Please read them carefully.',
  effective_date: 'Effective Date: June 14, 2026',
  last_updated: 'Last Updated: June 14, 2026',
  back_to_portfolio: 'Back to Portfolio',
  intro_title: 'Agreement to Terms',
  services_title: 'Services Provided',
  user_resp_title: 'User Responsibilities',
  ip_title: 'Intellectual Property',
  payments_title: 'Payments & Refunds',
  limitation_title: 'Limitation of Liability',
  changes_title: 'Changes to Terms',
  contact_title: 'Contact Information',
  name: 'Name',
  email: 'Email',
  location: 'Location',
  website: 'Website',
  copyright: '© {year} Surya CS. All rights reserved.',
  privacy_link: 'Privacy Policy'
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
