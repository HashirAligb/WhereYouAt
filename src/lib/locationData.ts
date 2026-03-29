import { GoogleGenAI } from '@google/genai';
import { supabase, RedditData } from './supabase';

export interface LocationData {
  historyContent: string;
  historySummary: string;
  redditData: RedditData | null;
}

const normalizeKey = (location: string) =>
  location.toLowerCase().trim().replace(/\s+/g, ' ');

export class InvalidLocationError extends Error {
  constructor(location: string) {
    super(`"${location}" doesn't appear to be a real place. Try a neighborhood, city, or address.`);
    this.name = 'InvalidLocationError';
  }
}

async function validateLocation(location: string): Promise<void> {
  try {
    const query = encodeURIComponent(location);
    const res = await fetch(`/api/geocode/search?q=${query}&format=json&limit=1`);
    const data = await res.json();
    if (!data || data.length === 0) throw new InvalidLocationError(location);
  } catch (e) {
    if (e instanceof InvalidLocationError) throw e;
    // If geocoding itself fails (network error), allow through
  }
}

// Retry a Gemini call up to maxRetries times on 429 rate limit errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 2000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes('429') || err.message.toLowerCase().includes('too many requests'));

      if (isRateLimit && attempt < maxRetries - 1) {
        await new Promise(res => setTimeout(res, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchFromGemini(location: string): Promise<LocationData> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[locationData] API key present:', !!apiKey, '| length:', apiKey?.length ?? 0);
  const ai = new GoogleGenAI({ apiKey });

  const [historyResponse, redditResponse] = await Promise.allSettled([
    // History: single call, returns full text + inline summary
    withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a detailed, engaging historical overview of ${location}. Focus on urban development, key events, and the "vibe" of the place through the decades. Keep it readable and archival in tone.

After the full history, add a section that starts exactly with "SUMMARY:" followed by 3-4 bullet points (each starting with "•") covering the most critical turning points.`,
    })),

    // Reddit: Gemini synthesizes community knowledge about the location
    withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are summarizing what Reddit communities typically say about "${location}". Based on your knowledge of Reddit discussions, local subreddits, and community sentiment about this place, return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence overview of the community conversation and general vibe",
  "sentiment": "positive" or "neutral" or "negative" or "mixed",
  "themes": [{"label": "theme name", "description": "what people typically discuss about this"}],
  "hot_takes": ["a spicy or controversial opinion people hold about this place"]
}

Rules:
- themes: include 2-6 themes that are genuinely relevant to this specific location
- hot_takes: only include if real controversial takes exist about this place, otherwise omit the field entirely
- sentiment should reflect the actual overall community feeling
- Be specific to this location, not generic
- Return ONLY the raw JSON object — no markdown, no code blocks, no extra text`,
    })),
  ]);

  // Log any failures so we can debug
  if (historyResponse.status === 'rejected') {
    console.error('[locationData] History call failed:', historyResponse.reason);
  }
  if (redditResponse.status === 'rejected') {
    console.error('[locationData] Reddit call failed:', redditResponse.reason);
  }

  // Parse history + inline summary
  const historyText = historyResponse.status === 'fulfilled'
    ? (historyResponse.value.text ?? 'No history found for this location.')
    : 'No history found — the API may be rate limited. Try again in a moment.';
  let historyContent = historyText;
  let historySummary = 'Summary unavailable.';
  const summaryIndex = historyText.indexOf('SUMMARY:');
  if (summaryIndex !== -1) {
    historyContent = historyText.slice(0, summaryIndex).trim();
    historySummary = historyText.slice(summaryIndex + 'SUMMARY:'.length).trim();
  }

  // Parse Reddit JSON
  let redditData: RedditData | null = null;
  try {
    const raw = redditResponse.status === 'fulfilled'
      ? (redditResponse.value.text ?? '{}')
      : '{}';
    console.log('[locationData] Reddit raw response (first 300):', raw.slice(0, 300));
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    redditData = JSON.parse(cleaned) as RedditData;
    console.log('[locationData] Reddit parsed OK:', !!redditData);
  } catch (e) {
    console.error('[locationData] Reddit JSON parse failed:', e);
    redditData = {
      summary: `Could not load Reddit community data for ${location} right now.`,
      sentiment: 'neutral',
      themes: [],
    };
  }

  return { historyContent, historySummary, redditData };
}

export async function getLocationData(location: string): Promise<LocationData> {
  const key = normalizeKey(location);

  // Validate FIRST — always reject fake/gibberish locations before cache or API
  await validateLocation(location);

  // Check Supabase cache
  const { data: cached } = await supabase
    .from('location_cache')
    .select('*')
    .eq('location_key', key)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    return {
      historyContent: cached.history_content,
      historySummary: cached.history_summary,
      redditData: cached.reddit_content,
    };
  }

  // Cache miss — fetch fresh from Gemini
  const data = await fetchFromGemini(location);

  // Upsert into cache with 24hr TTL
  await supabase.from('location_cache').upsert(
    {
      location_key: key,
      history_content: data.historyContent,
      history_summary: data.historySummary,
      reddit_content: data.redditData,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'location_key' }
  );

  return data;
}
