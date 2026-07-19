import { createClient } from '@supabase/supabase-js';

const universoUrl = import.meta.env.VITE_SUPABASE_UNIVERSO_URL as string | undefined;
const universoKey = import.meta.env.VITE_SUPABASE_UNIVERSO_ANON_KEY as string | undefined;
const pocUrl = import.meta.env.VITE_SUPABASE_POC_URL as string | undefined;
const pocKey = import.meta.env.VITE_SUPABASE_POC_ANON_KEY as string | undefined;

export const supabaseUniverso = universoUrl && universoKey && !universoKey.includes('cole_a_chave')
  ? createClient(universoUrl, universoKey)
  : null;

export const supabasePoc = pocUrl && pocKey && !pocKey.includes('cole_a_chave')
  ? createClient(pocUrl, pocKey)
  : null;

export const hasSupabaseConfig = Boolean(supabaseUniverso && supabasePoc);
