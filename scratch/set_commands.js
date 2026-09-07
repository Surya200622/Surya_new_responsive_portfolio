const fetch = require('node-fetch') || globalThis.fetch;

async function setCommands() {
  const TELEGRAM_TOKEN = '8935643612:AAEy1oXEsbJFKpmoDGgz2opTaNEPXFJBKzE';
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setMyCommands`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [
        { command: 'start', description: 'Wake up the AI assistant' },
        { command: 'services', description: 'View my freelance services' },
        { command: 'portfolio', description: 'See my latest projects' },
        { command: 'offers', description: 'View current discounts' },
        { command: 'contact', description: 'Get my WhatsApp and Email' },
        { command: 'about', description: 'Learn about Surya CS' },
        { command: 'skills', description: 'View my tech stack' },
        { command: 'reviews', description: 'Read client testimonials' },
        { command: 'resume', description: 'Download my resume' }
      ]
    })
  });
  
  const data = await response.json();
  console.log(data);
}

setCommands();
