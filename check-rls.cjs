const { Client } = require('pg');

const tryConnect = async () => {
  const password = encodeURIComponent('7w.p2%$JC#Fc.%E');
  const connStr = `postgresql://postgres.mdgcorkmkovemafxefbn:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    
    // Disable RLS
    await client.query(`ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;`);
    console.log('RLS disabled successfully!');
    
    await client.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
};

tryConnect();
