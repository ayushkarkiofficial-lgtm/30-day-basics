// supabase.js — creates and exports a single Supabase client instance.
//
// WHY A SEPARATE FILE?
// The client needs to be created once and reused everywhere.
// If you called createClient() inside every component, you'd create
// a new connection on every render. One file, one instance, imported
// wherever it's needed.
//
// WHY import.meta.env?
// Vite's way of reading environment variables from the .env file.
// Only variables that start with VITE_ are exposed to browser code.
// import.meta.env.VITE_SUPABASE_URL reads the value at build time.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
