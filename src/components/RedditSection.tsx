import React from 'react';
import { MessageSquare, TrendingUp, Flame, Loader2, Zap } from 'lucide-react';
import CatMascot from './CatMascot';
import { RedditData } from '../lib/supabase';

interface RedditSectionProps {
  location: string;
  redditData: RedditData | null;
  loading: boolean;
}

const sentimentConfig = {
  positive: { label: 'Positive Vibes', color: 'text-safety-green', bg: 'bg-safety-green/10', border: 'border-safety-green/20' },
  negative: { label: 'Negative Vibes', color: 'text-alert-red', bg: 'bg-alert-red/10', border: 'border-alert-red/20' },
  mixed:    { label: 'Mixed Feelings', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  neutral:  { label: 'Neutral', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
};

export default function RedditSection({ location, redditData, loading }: RedditSectionProps) {
  const sentiment = redditData?.sentiment ?? 'neutral';
  const sentimentStyle = sentimentConfig[sentiment] ?? sentimentConfig.neutral;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div className="bg-pure-white/85 backdrop-blur-md p-8 rounded-[2rem] border border-orange-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-soot-black">Reddit Says: {location}</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                AI Summary • Gemini-2.5
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scanning the subreddits...</p>
              </div>
            ) : redditData ? (
              <div className="space-y-6">
                {/* AI Summary Block */}
                <div className="p-6 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-3">Community Overview</p>
                  <p className="text-base font-serif text-soot-black leading-relaxed">{redditData.summary}</p>
                </div>

                {/* Sentiment Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${sentimentStyle.bg} ${sentimentStyle.border} ${sentimentStyle.color}`}>
                  <Zap className="w-3 h-3" />
                  Overall Sentiment: {sentimentStyle.label}
                </div>

                {/* Themes */}
                {redditData.themes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What People Are Talking About</p>
                    <div className="space-y-3">
                      {redditData.themes.map((theme, i) => (
                        <div key={i} className="p-4 bg-gray-50/60 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-white transition-all">
                          <p className="text-sm font-bold text-soot-black mb-1">{theme.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{theme.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hot Takes */}
                {redditData.hot_takes && redditData.hot_takes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Flame className="w-3 h-3 text-orange-600" />
                      Hot Takes
                    </p>
                    <div className="space-y-2">
                      {redditData.hot_takes.map((take, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-orange-50/40 rounded-xl border border-orange-100">
                          <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-soot-black leading-relaxed">{take}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <p className="text-sm font-bold text-gray-400">No Reddit data available yet.</p>
                <p className="text-xs text-gray-300">Search a location to load community insights.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 space-y-6">
          <CatMascot
            mood={loading ? 'curious' : redditData?.sentiment === 'negative' ? 'angry' : 'shocked'}
            message={
              loading
                ? "Let me check what Reddit's saying about this spot..."
                : redditData?.sentiment === 'positive'
                ? "Yo the people actually love this area. Good vibes on the feed."
                : redditData?.sentiment === 'negative'
                ? "Reddit is NOT happy about this place rn. It's getting spicy."
                : "Reddit's got a lot to say. It's... complicated."
            }
          />

          {!loading && redditData?.themes && redditData.themes.length > 0 && (
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
              <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-4">Hot Topics</h4>
              <div className="flex flex-wrap gap-2">
                {redditData.themes.map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                    #{theme.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
