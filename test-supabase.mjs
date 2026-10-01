import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhuzzbgehqvxwmohmvgz.supabase.co';
const supabaseKey = 'sb_publishable_2y1bjOuSI65upwNX3bW58w_QN21szzn';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data: todos, error: todosErr } = await supabase.from('todos').select('*').limit(1);
    console.log('todos table test:', { todos, error: todosErr?.message });

    const { data: menu, error: menuErr } = await supabase.from('menu_items').select('*').limit(1);
    console.log('menu_items table test:', { menu, error: menuErr?.message });

    const { data: slides, error: slidesErr } = await supabase.from('slides').select('*').limit(1);
    console.log('slides table test:', { slides, error: slidesErr?.message });
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
