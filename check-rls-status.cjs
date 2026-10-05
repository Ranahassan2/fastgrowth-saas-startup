const { Client } = require('pg');

const tryConnect = async () => {
  const password = encodeURIComponent('7w.p2%$JC#Fc.%E');
  const connStr = `postgresql://postgres.mdgcorkmkovemafxefbn:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    
    const res = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname = 'users';
    `);
    console.log('RLS Status:', res.rows[0]);
    
    if (res.rows[0].relrowsecurity) {
      console.log('RLS is ENABLED! The database is secure.');
    } else {
      console.log('WARNING: RLS is disabled!');
    }
    
    await client.end();
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
};

tryConnect();
