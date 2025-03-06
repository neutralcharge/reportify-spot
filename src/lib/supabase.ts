
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Using the URL and API key provided by the user
const supabaseUrl = 'https://rfgtryzdddjglrpzlxql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZ3RyeXpkZGRqZ2xycHpseHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDA1NDksImV4cCI6MjA1NjgxNjU0OX0.ggEyu1LZbJbqgUR9u5zA4cwWNJWVy0-UF82Yjs0wHKU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
