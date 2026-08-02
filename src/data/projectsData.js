// ========================================
// Surya CS — Portfolio Data
// ========================================

export const PROJECTS = [
  {
    id: 'dental-experts',
    title: 'DentalExperts',
    category: 'Booking System',
    description:
      'A comprehensive full-stack web application designed to streamline dental appointment booking, clinic information access, and efficient management of patient records & doctor schedules.',
    image: '/images/Dental experts.png',
    tech: ['Python', 'Django', 'HTML/CSS', 'SQLite', 'Bootstrap'],
    year: '2025',
    link: 'https://suryacs.pythonanywhere.com',
  },
  {
    id: 'cipher-apparel',
    title: 'CipherApparel',
    category: 'E-commerce',
    description:
      'A responsive fashion e-commerce web application with login/signup, product listings, offers, and dynamic backend integration using Python and web technologies.',
    image: '/images/Cipherapparel.png',
    tech: ['Python', 'Django', 'JavaScript', 'Bootstrap', 'PostgreSQL'],
    year: '2025',
    link: 'https://cipher-apparel.vercel.app',
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio',
    category: 'Portfolio',
    description:
      'A responsive portfolio built with React Vite featuring parallax effects to showcase projects, skills, and professional experience.',
    image: '/images/Screenshot 2026-05-25 174918.png',
    tech: ['React.js', 'Vite', 'Framer Motion', 'CSS3'],
    year: '2025',
    link: 'https://suryacs.is-a.dev',
  },
  {
    id: 'face-swap-editor',
    title: 'Face Swap Photo & Video Editor',
    category: 'AI',
    description:
      'Professional face swap tool for photos and videos, built with modern web technologies and AI-powered editing capabilities.',
    image: '/images/surya-casual.jpg',
    tech: ['AI-powered editing capabilities'],
    year: '2025',
    link: '#',
    hideLink: true,
  },
];

export const SKILLS = [
  // Languages
  { name: 'Python', category: 'Language', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', iconType: 'image' },
  { name: 'JavaScript', category: 'Language', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', iconType: 'image' },
  { name: 'HTML', category: 'Language', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', iconType: 'image' },
  { name: 'CSS', category: 'Language', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', iconType: 'image' },

  // Frameworks & Libraries
  { name: 'Django', category: 'Framework', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', iconType: 'image' },
  { name: 'Django REST', category: 'Framework', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', iconType: 'image' },
  { name: 'React.js', category: 'Framework', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', iconType: 'image' },
  { name: 'Next.js', category: 'Framework', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', iconType: 'image' },
  { name: 'Bootstrap', category: 'Framework', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', iconType: 'image' },

  // Databases
  { name: 'MySQL', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', iconType: 'image' },
  { name: 'SQLite', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg', iconType: 'image' },
  { name: 'Supabase', category: 'Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg', iconType: 'image' },
  { name: 'Turso', category: 'Database', icon: 'Database', iconType: 'lucide' },

  // Tools & Platforms
  { name: 'GitHub', category: 'Tool', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', iconType: 'image' },
  { name: 'PythonAnywhere', category: 'Platform', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', iconType: 'image' },
  { name: 'Vercel', category: 'Platform', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', iconType: 'image' },
  { name: 'VS Code', category: 'Tool', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg', iconType: 'image' },

  // Core Concepts
  { name: 'REST APIs', category: 'Concept', icon: 'Server', iconType: 'lucide' },
  { name: 'Responsive Web Design', category: 'Concept', icon: 'MonitorSmartphone', iconType: 'lucide' },
  { name: 'Auth & Auth', category: 'Concept', icon: 'ShieldCheck', iconType: 'lucide' },
  { name: 'MVC/MVT', category: 'Concept', icon: 'Layers', iconType: 'lucide' },

  // Soft Skills
  { name: 'Problem Solving', category: 'Soft Skill', icon: 'Brain', iconType: 'lucide' },
  { name: 'Communication', category: 'Soft Skill', icon: 'MessageCircle', iconType: 'lucide' },
  { name: 'Adaptability', category: 'Soft Skill', icon: 'RefreshCw', iconType: 'lucide' },
  { name: 'Creativity', category: 'Soft Skill', icon: 'Lightbulb', iconType: 'lucide' },
  { name: 'Team Collaboration', category: 'Soft Skill', icon: 'Users', iconType: 'lucide' },
];

export const TIMELINE_DATA = [
  {
    year: '2023',
    title: 'Started B.COM.CA at Sri Ramakrishna College',
    description:
      'Began my journey in Computer Applications at Sri Ramakrishna College of Arts & Science, Nava-India, Coimbatore. Developed a passion for web development alongside my studies.',
    type: 'education',
  },
  {
    year: '2024',
    title: 'IBM & ITC Python Pandas & NumPy Training',
    description:
      'Completed IBM & ITC collaborative training in Python Pandas & NumPy, building strong data analysis and manipulation foundations with hands-on project experience.',
    type: 'milestone',
  },
  {
    year: '2025',
    title: 'Indra Institute of Education — Full-Stack Python',
    description:
      'Full-Stack Python training at Indra Institute of Education, 100 Feet Road. Intensive program from July 09, 2025 to December 15, 2025, deepening expertise in Python full-stack development.',
    type: 'education',
  },
  {
    year: '2025',
    title: 'Launched DentalExperts, CipherApparel & Portfolio',
    description:
      'Built a dental clinic management system with appointment booking & patient records, a fashion e-commerce platform with Django, and a cinematic personal portfolio with React & Vite — establishing my freelance web development practice.',
    type: 'project',
  },
  {
    year: '2026',
    title: 'Full-Stack Python Developer — Open to Opportunities',
    description:
      'Actively seeking to apply my Python full-stack development skills, contribute to innovative projects, and grow professionally in a dynamic IT company.',
    type: 'current',
  },
];

export const STATS = [
  { value: '1+', label: 'Projects Delivered', icon: 'Briefcase' },
  { value: '2+', label: 'Certifications', icon: 'Award' },
  { value: '10+', label: 'Technologies', icon: 'Code' },
  { value: '1+', label: 'Years Experience', icon: 'Heart' },
];
export const SOCIAL_LINKS = [
  { name: 'GitHub', icon: 'Github', url: 'https://github.com/Surya200622' },
  { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/in/suryacs22/' },
  { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/suryacs.is_a.dev/' },
  { name: 'Facebook', icon: 'Facebook', url: 'https://www.facebook.com/suryacswebdev' },
  { name: 'YouTube', icon: 'Youtube', url: 'https://www.youtube.com/@suryacs.is-a.dev1' },
];

export const CONTACT_INFO = {
  email: 'suryacs.is.a.dev@gmail.com',
  whatsapp: '+918220443165',
  location: 'Coimbatore, Tamil Nadu, India',
};
