
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nwqcwtmkmvhkuvyvyrsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53cWN3dG1rbXZoa3V2eXZ5cnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNzg3MzgsImV4cCI6MjA1Mjc1NDczOH0.or9ToNj9M_Jh9lJUmX4c9g7-x6YpkQl202DJ_dBVSoE";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce'
    }
  }
);
