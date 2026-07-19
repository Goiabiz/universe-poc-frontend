import { createClient } from '@supabase/supabase-js';

const universoUrl = import.meta.env.VITE_SUPABASE_UNIVERSO_URL;
const universoAnonKey = import.meta.env.VITE_SUPABASE_UNIVERSO_ANON_KEY;

const pocUrl = import.meta.env.VITE_SUPABASE_POC_URL;
const pocAnonKey = import.meta.env.VITE_SUPABASE_POC_ANON_KEY;

export const universoSupabase =
  universoUrl && universoAnonKey ? createClient(universoUrl, universoAnonKey) : null;

export const pocSupabase =
  pocUrl && pocAnonKey ? createClient(pocUrl, pocAnonKey) : null;

export const isUniversoConfigured = Boolean(universoUrl && universoAnonKey);
export const isPocConfigured = Boolean(pocUrl && pocAnonKey);
