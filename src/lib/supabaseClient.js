/**
 * Supabase client configuration.
 * Creates and exports a single Supabase client instance to be reused across the entire application.
 */

import {createClient} from '@supabase/supabase-js'

// Supabase project URL 
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Supabase anonymous public API key
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase client instance
export const supabase = createClient(supabaseURL, supabaseAnonKey)