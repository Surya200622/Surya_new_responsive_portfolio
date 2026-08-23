import fs from 'fs';
import { 
  DOMAIN_OPTIONS, 
  HOSTING_OPTIONS, 
  DATABASE_OPTIONS, 
  STORAGE_OPTIONS, 
  AUTHENTICATION_OPTIONS, 
  SETUP_OPTIONS 
} from '../src/data/calculatorData.js';

const ADDON_CATEGORIES = [
  { id: 'domain', title: 'Domain Options', options: DOMAIN_OPTIONS },
  { id: 'hosting', title: 'Hosting Options', options: HOSTING_OPTIONS },
  { id: 'database', title: 'Database Provider', options: DATABASE_OPTIONS },
  { id: 'storage', title: 'Storage Provider', options: STORAGE_OPTIONS },
  { id: 'authentication', title: 'Authentication Setup', options: AUTHENTICATION_OPTIONS },
  { id: 'setup', title: 'Additional Setup', options: SETUP_OPTIONS }
];

let content = fs.readFileSync('./src/data/calculatorData.js', 'utf8');

// Replace the individual exports with ADDON_CATEGORIES
content = content.replace(/export const DOMAIN_OPTIONS = \[[\s\S]*?export const SETUP_OPTIONS = \[[\s\S]*?\];\n/m, 
  `export const ADDON_CATEGORIES = ${JSON.stringify(ADDON_CATEGORIES, null, 2)};\n`
);

fs.writeFileSync('./src/data/calculatorData.js', content, 'utf8');
console.log('Merged addons successfully.');
