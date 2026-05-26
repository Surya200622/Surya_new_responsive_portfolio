import { Resend } from 'resend';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/RESEND_API_KEY=(.*)/);
const key = match ? match[1].trim() : null;

const resend = new Resend(key);

async function test() {
  console.log('Testing Resend with key:', key ? 'Key found' : 'No key');
  
  try {
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['test@example.com'],
      subject: 'Test Email',
      html: '<p>This is a test.</p>'
    });
    console.log('Success!', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
