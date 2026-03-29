import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RedditTheme {
  label: string;
  description: string;
}

export interface RedditData {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  themes: RedditTheme[];
  hot_takes?: string[];
}

export interface LocationCacheRow {
  id: string;
  location_key: string;
  history_content: string;
  history_summary: string;
  reddit_content: RedditData;
  created_at: string;
  expires_at: string;
}
