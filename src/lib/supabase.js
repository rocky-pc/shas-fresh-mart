import { createClient } from '@supabase/supabase-js';

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://urgstkdxyeumcnyziich.supabase.co';

const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ3N0a2R4eWV1bWNueXppaWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjkyNTYsImV4cCI6MjEwOTIwNTI1Nn0.1UaJNcifdzO6N43KGpvjwjMCi2jmnjvvYtYZOCVSUzw';

export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
