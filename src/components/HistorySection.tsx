import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Sparkles, Loader2, MapPin } from 'lucide-react';
import CatMascot from './CatMascot';

interface HistorySectionProps {
  location: string;
}

export default function HistorySection({ location }: HistorySectionProps) {
  const [history, setHistory] = React.useState<string>('');
  const [summary, setSummary] = React.useState<string>('');
  const [isSummarized, setIsSummarized] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchHistory = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a detailed, engaging historical overview of ${location}. Focus on urban development, key events, and the "vibe" of the place through the decades. Keep it readable and archival in tone.`,
      });
      const fullText = response.text || 'No history found for this location.';
      setHistory(fullText);

      // Generate a quick summary as well
      const summaryResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following history of ${location} into 3-4 bullet points focusing on the most critical turning points: ${fullText}`,
      });
      setSummary(summaryResponse.text || 'Summary unavailable.');
    } catch (error) {
      console.error('Gemini Error:', error);
      setHistory('Failed to fetch history. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, [location]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div className="bg-pure-white/85 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-burgundy/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-burgundy/10" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-burgundy" />
                <h2 className="text-2xl font-serif font-bold text-burgundy italic">Chronicle of {location}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSummarized(!isSummarized)}
                  className="px-4 py-1.5 bg-burgundy/5 border border-burgundy/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-burgundy hover:bg-burgundy hover:text-cream transition-all"
                >
                  {isSummarized ? 'Show Full History' : 'Summarize'}
                </button>
                <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-burgundy/40 bg-burgundy/5 px-3 py-1 rounded-full">
                  Archival Source: Gemini-3
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
                <p className="text-sm font-bold text-burgundy/40 uppercase tracking-widest">Consulting the archives...</p>
              </div>
            ) : (
              <div className="prose prose-burgundy max-w-none">
                <div className="text-burgundy/80 font-serif leading-relaxed space-y-6 text-lg whitespace-pre-wrap">
                  {isSummarized ? summary : history}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-72 space-y-6">
          <CatMascot 
            mood={loading ? 'curious' : 'happy'} 
            message={loading ? "Digging through the archives for the real tea..." : "Yo, this block has some serious history. Respect."} 
          />
          
          <div className="bg-burgundy/5 p-6 rounded-2xl border border-burgundy/10">
            <h4 className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest mb-4">Historical Markers</h4>
            <ul className="space-y-3">
              {['1890s Tenements', '1920s Jazz Era', '1970s Urban Decay', '2000s Gentrification'].map((marker, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-burgundy/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-burgundy/20" />
                  {marker}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
