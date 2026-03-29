import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import CatMascot from './CatMascot';

interface HistorySectionProps {
  location: string;
  historyContent: string;
  historySummary: string;
  loading: boolean;
}

function renderLine(line: string, i: number) {
  const clean = (s: string) => s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

  if (line.startsWith('### ')) return (
    <h4 key={i} className="text-base font-bold text-burgundy mt-5 mb-1 not-italic tracking-tight">
      {clean(line.slice(4))}
    </h4>
  );
  if (line.startsWith('## ')) return (
    <h3 key={i} className="text-lg font-bold text-burgundy mt-7 mb-2 not-italic tracking-tight border-b border-burgundy/10 pb-1">
      {clean(line.slice(3))}
    </h3>
  );
  if (line.startsWith('# ')) return (
    <h2 key={i} className="text-xl font-bold text-burgundy mt-8 mb-3 not-italic tracking-tight">
      {clean(line.slice(2))}
    </h2>
  );
  if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) return (
    <li key={i} className="ml-5 list-disc text-burgundy/75 leading-relaxed">
      {clean(line.replace(/^[•\-*] /, ''))}
    </li>
  );
  return (
    <p key={i} className="text-burgundy/75 leading-relaxed">
      {clean(line)}
    </p>
  );
}

export default function HistorySection({ location, historyContent, historySummary, loading }: HistorySectionProps) {
  const [isSummarized, setIsSummarized] = React.useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div className="bg-pure-white/85 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-burgundy/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-burgundy/10" />

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-burgundy flex-shrink-0" />
                <h2 className="text-2xl font-serif font-bold text-burgundy italic">Chronicle of {location}</h2>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setIsSummarized(!isSummarized)}
                  disabled={loading}
                  className="px-4 py-1.5 bg-burgundy/5 border border-burgundy/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-burgundy hover:bg-burgundy hover:text-cream transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSummarized ? 'Show Full' : 'Summarize'}
                </button>
                <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-burgundy/5 border border-burgundy/10 text-[10px] font-bold uppercase tracking-widest text-burgundy/40 whitespace-nowrap">
                  Archival Source: Gemini-2.5
                </span>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
                <p className="text-sm font-bold text-burgundy/40 uppercase tracking-widest">Consulting the archives...</p>
              </div>
            ) : (
              <div className="font-serif text-base space-y-1">
                {(isSummarized ? historySummary : historyContent)
                  .split('\n')
                  .filter(line => line.trim())
                  .map((line, i) => renderLine(line, i))
                }
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
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
