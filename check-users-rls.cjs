const { Client } = require('pg');

const tryConnect = async () => {
  const password = encodeURIComponent('7w.p2%$JC#Fc.%E');
  const connStr = `postgresql://postgres.mdgcorkmkovemafxefbn:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    
    // Explicitly disable RLS on the users table
    await client.query(`ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;`);
    console.log('RLS disabled successfully!');
    
    // Also, Supabase forces RLS if you don't grant permissions to anon
    await client.query(`GRANT ALL ON public.users TO anon;`);
    await client.query(`GRANT ALL ON public.users TO authenticated;`);
    await client.query(`GRANT ALL ON public.users TO service_role;`);
    console.log('Permissions granted to anon!');
    
    await client.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
};

tryConnect();
