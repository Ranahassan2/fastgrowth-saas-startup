const { createClient } = require('@supabase/supabase-js');
const url = 'https://mdgcorkmkovemafxefbn.supabase.co';
const key = 'sb_publishable_d-5yqNcjIjWrfaXk_c2D7w_-wpJTaeC'; // They exposed it earlier
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('users').insert([{
    name: 'Test',
    phone: '123',
    email: 'test@test.com',
    tool_name: 'Test Tool',
    input_data: JSON.stringify({a: 1}),
    output_result: 'Output'
  }]);
  console.log('Result:', data, error);
}
run();
