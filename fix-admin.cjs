const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function fixAdminDatabase() {
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

  console.log('Fetching user from auth.users...');
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const adminUser = users.find(u => u.email === 'cssurya2006@gmail.com');
  
  if (!adminUser) {
    console.error('Could not find cssurya2006@gmail.com in the database! Please make sure you registered it.');
    return;
  }

  console.log(`Found user: ${adminUser.id}. Upserting profile...`);

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: adminUser.id,
    email: 'cssurya2006@gmail.com',
    full_name: 'Surya Admin',
    role: 'admin'
  });

  if (profileError) {
    console.error('Failed to upsert profile:', profileError);
  } else {
    console.log('SUCCESS: Forcibly created Admin Profile!');
  }
}

fixAdminDatabase();
