import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import CatMascot from './CatMascot';

interface HistorySectionProps {
  location: string;
  historyContent: string;
  historySummary: string;
  loading: boolean;
}

export default function HistorySection({ location, historyContent, historySummary, loading }: HistorySectionProps) {
  const [isSummarized, setIsSummarized] = React.useState(false);

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
                  disabled={loading}
                  className="px-4 py-1.5 bg-burgundy/5 border border-burgundy/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-burgundy hover:bg-burgundy hover:text-cream transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSummarized ? 'Show Full History' : 'Summarize'}
                </button>
                <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-burgundy/40 bg-burgundy/5 px-3 py-1 rounded-full">
                  Archival Source: Gemini-2.5
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
                <div className="text-burgundy/80 font-serif leading-relaxed space-y-4 text-lg">
                  {(isSummarized ? historySummary : historyContent)
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, i) => {
                      if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-bold text-burgundy mt-4 mb-1 not-italic">{line.replace('### ', '')}</h4>;
                      if (line.startsWith('## '))  return <h3 key={i} className="text-xl font-bold text-burgundy mt-6 mb-2 not-italic">{line.replace('## ', '')}</h3>;
                      if (line.startsWith('# '))   return <h2 key={i} className="text-2xl font-bold text-burgundy mt-8 mb-3 not-italic">{line.replace('# ', '')}</h2>;
                      if (line.startsWith('• ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc">{line.replace(/^[•*] /, '')}</li>;
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
                      return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    })
                  }
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
