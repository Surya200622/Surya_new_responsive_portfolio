const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function dumpDatabase() {
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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.log('Profiles table:', JSON.stringify(profiles, null, 2));

  const { data: { users }, error: uError } = await supabase.auth.admin.listUsers();
  console.log('Auth users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
}

dumpDatabase();
