const { Client } = require('pg');

const tryConnect = async () => {
  const password = encodeURIComponent('7w.p2%$JC#Fc.%E');
  const connStr = `postgresql://postgres.mdgcorkmkovemafxefbn:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    console.log(`SUCCESS connected to database!`);
    
    // Enable RLS for BOTH tables
    await client.query(`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`);
    
    // Drop old policies if they exist (to avoid errors)
    await client.query(`DROP POLICY IF EXISTS "Allow anon insert to users" ON public.users;`);
    await client.query(`DROP POLICY IF EXISTS "Allow anon insert to leads" ON public.leads;`);
    
    // Create strict policies for users: Only INSERT allowed for anon
    await client.query(`
      CREATE POLICY "Allow anon insert to users" 
      ON public.users 
      FOR INSERT 
      TO anon 
      WITH CHECK (true);
    `);
    
    // Create strict policies for leads: Only INSERT allowed for anon
    await client.query(`
      CREATE POLICY "Allow anon insert to leads" 
      ON public.leads 
      FOR INSERT 
      TO anon 
      WITH CHECK (true);
    `);
    
    console.log('✅ Security Fixed: RLS Enabled and INSERT-only policies created for both tables!');
    
    await client.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
};

tryConnect();
