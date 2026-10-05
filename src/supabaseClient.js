import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveToolDataToSupabase = async (toolName, inputData, outputResult) => {
  try {
    const leadDataStr = localStorage.getItem('leadData');
    if (!leadDataStr) {
      console.warn('No lead data found to link with tool usage.');
      return;
    }

    const leadData = JSON.parse(leadDataStr);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          tool_name: toolName,
          input_data: JSON.stringify(inputData),
          output_result: typeof outputResult === 'string' ? outputResult : JSON.stringify(outputResult),
        },
      ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
    } else {
      console.log('Successfully saved to Supabase:', data);
    }
  } catch (err) {
    console.error('Exception saving to Supabase:', err);
  }
};
