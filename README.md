
Where You At 📍
Urban Layer Explorer
Search any neighborhood, city, or address and instantly surface its history, community pulse, and safety data — all in one place.

What It Does
Where You At is a location intelligence app with three layers of insight for any place you search:

Tab	What you get
🏛️ History	AI-generated archival narrative — urban development, key eras, cultural shifts
💬 Reddit	AI summary of what the community is actually saying — sentiment, themes, hot takes
🛡️ Safety	Live registered offender count and risk breakdown within a 1-mile radius
The app validates every search against real geocoding data — no hallucinated histories for fake locations.

Tech Stack
Frontend — React 19 + TypeScript + Vite
Styling — Tailwind CSS v4
AI — Google Gemini 2.5 Flash
Database / Cache — Supabase (Postgres) — 24hr TTL cache per location
Safety Data — Offenders.io API
Geocoding — OpenStreetMap Nominatim (location validation + coordinates)
Animations — Motion (Framer Motion)
Getting Started
Prerequisites
Node.js 18+
A Gemini API key
A Supabase project
An Offenders.io API key
1. Clone & Install
git clone https://github.com/HashirAligb/WhereYouAt.git
cd WhereYouAt
npm install

2. Set Up Environment
Create a .env.local file in the root:

GEMINI_API_KEY="your_gemini_api_key"
VITE_SUPABASE_URL="your_supabase_data_api_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
VITE_OFFENDERS_API_KEY="your_offenders_io_api_key"

3. Run
npm run dev

How the Data Flow Works
User searches location
        ↓
Nominatim geocoding validates it's a real place
        ↓
Check Supabase cache (24hr TTL)
        ↓
Cache hit?  →  Render instantly
        ↓ miss
Promise.all([Gemini History, Gemini Reddit])  ←  both fire in parallel
        ↓
Save to Supabase cache
        ↓
Render both tabs simultaneously

Safety data fetches independently on the Safety tab — geocodes the location and hits Offenders.io.

Features
🔍 Location validation — Nominatim rejects gibberish before any API call is made
⚡ Parallel fetching — History and Reddit load simultaneously
💾 Supabase caching — Repeat searches are instant, no redundant API calls
🐱 Mood-aware cat mascot — Pixel art cat reacts differently per tab and data
📱 Fully responsive — Mobile menu, adaptive layouts
🔄 Auto-retry — Exponential backoff on Gemini rate limits
