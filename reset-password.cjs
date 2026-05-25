const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function resetPassword() {
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
    console.error('Could not find cssurya2006@gmail.com in the database!');
    return;
  }

  console.log(`Resetting password for user: ${adminUser.id}...`);

  const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
    password: 'SURYA_ADMIN_SECURE'
  });

  if (error) {
    console.error('Failed to reset password:', error);
  } else {
    console.log('SUCCESS: Password forcibly reset to SURYA_ADMIN_SECURE!');
  }
}

resetPassword();
