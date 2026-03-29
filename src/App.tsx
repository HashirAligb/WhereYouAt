import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History as HistoryIcon, MapPin, Search, Menu, X, MessageSquare, ShieldAlert } from 'lucide-react';
import HistorySection from './components/HistorySection';
import RedditSection from './components/RedditSection';
import SafetySection from './components/SafetySection';
import { cn } from './lib/utils';
import { getLocationData, LocationData, InvalidLocationError } from './lib/locationData';

type Tab = 'history' | 'reddit' | 'safety';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<Tab>('history');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [location, setLocation] = React.useState('Lower East Side, NYC');
  const [searchInput, setSearchInput] = React.useState('Lower East Side, NYC');
  const [locationData, setLocationData] = React.useState<LocationData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch both History + Reddit in parallel whenever location changes
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setLocationData(null);
      try {
        const data = await getLocationData(location);
        if (!cancelled) setLocationData(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof InvalidLocationError
            ? err.message
            : 'Failed to load location data. Please try again.'
          );
        }
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) setLocation(searchInput.trim());
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-cream">
      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 border-b",
        activeTab === 'history'
          ? "bg-cream/85 border-burgundy/10 backdrop-blur-md"
          : "bg-pure-white/85 border-gray-100 backdrop-blur-md"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500",
                activeTab === 'history' ? "bg-burgundy shadow-lg shadow-burgundy/20" : "bg-soot-black"
              )}>
                <MapPin className="w-5 h-5 text-cream" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight text-burgundy">Where you at</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-burgundy/60">Urban Layer Explorer</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center bg-burgundy/5 p-1 rounded-xl border border-burgundy/10">
              <button
                onClick={() => setActiveTab('history')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                  activeTab === 'history' ? "bg-burgundy text-cream shadow-md" : "text-burgundy/60 hover:bg-burgundy/10"
                )}
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </button>
              <button
                onClick={() => setActiveTab('reddit')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                  activeTab === 'reddit' ? "bg-orange-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                Reddit
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                  activeTab === 'safety' ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <ShieldAlert className="w-4 h-4" />
                Safety
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-burgundy hover:bg-burgundy/5 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button
                className="md:hidden p-2 text-burgundy"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-30 bg-cream border-b border-burgundy/10 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setActiveTab('history'); setIsMenuOpen(false); }}
                className={cn("flex items-center gap-3 p-4 rounded-xl font-bold transition-colors",
                  activeTab === 'history' ? "bg-burgundy text-cream" : "text-burgundy bg-burgundy/5")}
              >
                <HistoryIcon className="w-5 h-5" />History
              </button>
              <button
                onClick={() => { setActiveTab('reddit'); setIsMenuOpen(false); }}
                className={cn("flex items-center gap-3 p-4 rounded-xl font-bold transition-colors",
                  activeTab === 'reddit' ? "bg-orange-600 text-white" : "text-gray-500 bg-gray-100")}
              >
                <MessageSquare className="w-5 h-5" />Reddit
              </button>
              <button
                onClick={() => { setActiveTab('safety'); setIsMenuOpen(false); }}
                className={cn("flex items-center gap-3 p-4 rounded-xl font-bold transition-colors",
                  activeTab === 'safety' ? "bg-soot-black text-white" : "text-gray-500 bg-gray-100")}
              >
                <ShieldAlert className="w-5 h-5" />Safety
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Global Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="bg-pure-white/85 backdrop-blur-md p-4 rounded-3xl border border-burgundy/10 shadow-lg flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 px-4">
              <MapPin className="w-5 h-5 text-burgundy/40" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-serif text-lg font-bold w-full placeholder:text-burgundy/20 text-burgundy"
                placeholder="Enter an address, neighborhood, or city..."
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-burgundy text-cream rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
            >
              Explore
            </button>
          </form>
          <div className="mt-4 flex items-center gap-4 px-6">
            <p className="text-[10px] font-bold text-burgundy/40 uppercase tracking-widest">Currently Exploring:</p>
            <div className="flex items-center gap-2 px-3 py-1 bg-burgundy/5 rounded-full border border-burgundy/10">
              <span className="text-xs font-bold text-burgundy italic">{location}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-alert-red/5 border border-alert-red/20 rounded-2xl text-sm font-bold text-alert-red text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'history' && (
              <HistorySection
                location={location}
                historyContent={locationData?.historyContent ?? ''}
                historySummary={locationData?.historySummary ?? ''}
                loading={loading}
              />
            )}
            {activeTab === 'reddit' && (
              <RedditSection
                location={location}
                redditData={locationData?.redditData ?? null}
                loading={loading}
              />
            )}
            {activeTab === 'safety' && <SafetySection location={location} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={cn(
        "mt-20 py-12 border-t transition-colors duration-500",
        activeTab === 'history' ? "bg-burgundy/5 border-burgundy/10" : "bg-gray-50 border-gray-100"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-xl text-burgundy">Where you at</h2>
              <p className="text-xs text-burgundy/60 mt-1">© 2026 Urban Layer Explorer. All rights reserved.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-burgundy/60">
              <a href="#" className="hover:text-burgundy transition-colors">Archive Policy</a>
              <a href="#" className="hover:text-burgundy transition-colors">Data Sources</a>
              <a href="#" className="hover:text-burgundy transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
