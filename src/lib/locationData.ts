import { GoogleGenAI } from '@google/genai';
import { supabase, RedditData } from './supabase';

export interface LocationData {
  historyContent: string;
  historySummary: string;
  redditData: RedditData | null;
}

const normalizeKey = (location: string) =>
  location.toLowerCase().trim().replace(/\s+/g, ' ');

async function fetchFromGemini(location: string): Promise<LocationData> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const [historyResponse, redditResponse] = await Promise.all([
    // History: single call, returns full text + inline summary
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Provide a detailed, engaging historical overview of ${location}. Focus on urban development, key events, and the "vibe" of the place through the decades. Keep it readable and archival in tone.

After the full history, add a section that starts exactly with "SUMMARY:" followed by 3-4 bullet points (each starting with "•") covering the most critical turning points.`,
    }),

    // Reddit: Gemini + Google Search grounding
    ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Search Reddit for recent posts, threads, and comments about "${location}". Analyze what the community is actually saying and return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence overview of the community conversation",
  "sentiment": "positive" or "neutral" or "negative" or "mixed",
  "themes": [{"label": "theme name", "description": "what people are saying about this"}],
  "hot_takes": ["spicy or controversial opinion if present"]
}

Rules:
- themes: include 2-6 themes based on what is genuinely being discussed
- hot_takes: only include this field if controversial opinions actually exist, otherwise omit it entirely
- Be accurate and honest about the sentiment
- Return ONLY the raw JSON object — no markdown, no code blocks, no extra text`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    }),
  ]);

  // Parse history + inline summary
  const fullText = historyResponse.text ?? 'No history found for this location.';
  let historyContent = fullText;
  let historySummary = 'Summary unavailable.';
  const summaryIndex = fullText.indexOf('SUMMARY:');
  if (summaryIndex !== -1) {
    historyContent = fullText.slice(0, summaryIndex).trim();
    historySummary = fullText.slice(summaryIndex + 'SUMMARY:'.length).trim();
  }

  // Parse Reddit JSON
  let redditData: RedditData | null = null;
  try {
    const raw = redditResponse.text ?? '{}';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    redditData = JSON.parse(cleaned) as RedditData;
  } catch {
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

  // Check Supabase cache first
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
