-- Run this in your Supabase dashboard → SQL Editor

create table if not exists location_cache (
  id           uuid        default gen_random_uuid() primary key,
  location_key text        unique not null,
  history_content   text,
  history_summary   text,
  reddit_content    jsonb,
  created_at   timestamptz default now(),
  expires_at   timestamptz default (now() + interval '24 hours')
);

-- Fast lookup by key + expiry
create index if not exists location_cache_key_idx     on location_cache (location_key);
create index if not exists location_cache_expires_idx on location_cache (expires_at);
