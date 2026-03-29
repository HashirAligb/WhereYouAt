import React from 'react';
import { MessageSquare, TrendingUp, Users, ExternalLink, Loader2 } from 'lucide-react';
import CatMascot from './CatMascot';

interface RedditSectionProps {
  location: string;
}

export default function RedditSection({ location }: RedditSectionProps) {
  const [loading, setLoading] = React.useState(false);
  const [isSummarized, setIsSummarized] = React.useState(false);
  
  // Mock data for now, as real Reddit API requires OAuth/API keys
  const threads = [
    { title: "Is the Lower East Side safe at night?", author: "urban_explorer", upvotes: 142, comments: 56, time: "2h ago", summary: "Discussion on night safety in LES." },
    { title: "Best hidden gems for coffee in LES?", author: "caffeine_addict", upvotes: 89, comments: 34, time: "5h ago", summary: "Top coffee spot recommendations." },
    { title: "The gentrification of Clinton St is getting wild", author: "local_legend", upvotes: 210, comments: 120, time: "12h ago", summary: "Concerns over rapid gentrification." },
    { title: "Anyone know what happened on Delancey today?", author: "news_junkie", upvotes: 45, comments: 12, time: "1d ago", summary: "Inquiry about a recent local event." }
  ];

  const displayedThreads = isSummarized ? threads.slice(0, 2) : threads;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div className="bg-pure-white/85 backdrop-blur-md p-8 rounded-[2rem] border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-soot-black">Community Pulse: {location}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSummarized(!isSummarized)}
                  className="px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                >
                  {isSummarized ? 'Show All Threads' : 'Summarize'}
                </button>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  Last Updated • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {displayedThreads.map((thread, i) => (
                <div key={i} className="group p-6 bg-gray-50/50 rounded-2xl border border-transparent hover:border-orange-200 hover:bg-white transition-all cursor-pointer">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-soot-black leading-tight group-hover:text-orange-600 transition-colors">
                        {isSummarized ? thread.summary : thread.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          u/{thread.author}
                        </span>
                        <span>•</span>
                        <span>{thread.time}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      {thread.upvotes} Upvotes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      {thread.comments} Comments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-6">
          <CatMascot 
            mood="shocked" 
            message="Reddit's wildin' today. The locals got a lot to say about this spot. It's gettin' spicy." 
          />
          
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-4">Hot Topics</h4>
            <div className="flex flex-wrap gap-2">
              {['Rent Prices', 'Nightlife', 'Safety', 'Subway', 'Food', 'Parks'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
