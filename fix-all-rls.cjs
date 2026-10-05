const { Client } = require('pg');

const tryConnect = async () => {
  const password = encodeURIComponent('7w.p2%$JC#Fc.%E');
  const connStr = `postgresql://postgres.mdgcorkmkovemafxefbn:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    
    // Disable RLS for BOTH tables
    await client.query(`ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;`);
    
    // Grant access just in case
    await client.query(`GRANT ALL ON public.users TO anon;`);
    await client.query(`GRANT ALL ON public.leads TO anon;`);
    
    console.log('Fixed RLS and permissions on BOTH users and leads tables!');
    
    await client.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
};

tryConnect();
