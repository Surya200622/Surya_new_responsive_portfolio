const fs = require('fs');

async function checkProfiles() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const envLines = envContent.split('\n');
  let supabaseUrl = '';
  let serviceRoleKey = '';

  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      serviceRoleKey = line.split('=')[1].trim();
    }
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=*`, {
    method: 'GET',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

checkProfiles();
