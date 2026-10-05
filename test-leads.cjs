const { createClient } = require('@supabase/supabase-js');
const url = 'https://mdgcorkmkovemafxefbn.supabase.co';
const key = 'sb_publishable_d-5yqNcjIjWrfaXk_c2D7w_-wpJTaeC'; 
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('Recent leads:', data);
}
run();
