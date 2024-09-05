import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseKey) {
    throw new Error('Missing Supabase Key. Make sure you have set the VITE_SUPABASE_ANON_KEY environment variable.');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;


