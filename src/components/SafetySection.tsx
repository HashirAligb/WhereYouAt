import React from 'react';
import { ShieldAlert, UserX, ShieldCheck, Loader2, AlertTriangle, Info } from 'lucide-react';
import CatMascot from './CatMascot';

interface SafetySectionProps {
  location: string;
}

interface Offender {
  firstName?: string;
  lastName?: string;
  age?: number;
  riskLevel?: string;
  risk?: string;
  tier?: string;
  city?: string;
  state?: string;
  crimes?: string[];
  offense?: string;
  offenseDescription?: string;
  lat?: number;
  lng?: number;
}

interface SafetyData {
  offenders: Offender[];
  total: number;
  high: number;
  medium: number;
  low: number;
}

async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(location);
    const res = await fetch(`/api/geocode/search?q=${query}&format=json&limit=1`);
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchOffenders(lat: number, lng: number): Promise<SafetyData> {
  const key = import.meta.env.VITE_OFFENDERS_API_KEY;
  const res = await fetch(
    `/api/offenders/sexoffender?lat=${lat}&lng=${lng}&radius=1&key=${key}`
  );
  const data = await res.json();

  const offenders: Offender[] = data?.offenders ?? data?.results ?? data ?? [];

  const getRisk = (o: Offender) =>
    (o.riskLevel ?? o.risk ?? o.tier ?? '').toString().toLowerCase();

  const high   = offenders.filter(o => getRisk(o).includes('high') || getRisk(o).includes('3')).length;
  const medium = offenders.filter(o => getRisk(o).includes('med') || getRisk(o).includes('2')).length;
  const low    = offenders.filter(o => getRisk(o).includes('low') || getRisk(o).includes('1')).length;

  return { offenders, total: offenders.length, high, medium, low };
}

function getRiskColor(risk: string) {
  const r = risk.toLowerCase();
  if (r.includes('high') || r.includes('3')) return 'text-alert-red bg-alert-red/10';
  if (r.includes('med') || r.includes('2')) return 'text-orange-600 bg-orange-50';
  if (r.includes('low') || r.includes('1')) return 'text-safety-green bg-safety-green/10';
  return 'text-gray-500 bg-gray-100';
}

function getRiskLabel(o: Offender) {
  return (o.riskLevel ?? o.risk ?? o.tier ?? 'Unknown').toString();
}

function getOffense(o: Offender) {
  if (Array.isArray(o.crimes) && o.crimes.length > 0) return o.crimes[0];
  return o.offenseDescription ?? o.offense ?? 'Sex Offense';
}

export default function SafetySection({ location }: SafetySectionProps) {
  const [safetyData, setSafetyData] = React.useState<SafetyData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setSafetyData(null);
      try {
        const coords = await geocodeLocation(location);
        if (!coords) throw new Error('Could not geocode location');
        const data = await fetchOffenders(coords.lat, coords.lng);
        if (!cancelled) setSafetyData(data);
      } catch (e) {
        if (!cancelled) setError('Could not load safety data for this location.');
        console.error('[SafetySection]', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [location]);

  const catMood = !safetyData ? 'curious'
    : safetyData.high > 5 ? 'angry'
    : safetyData.total > 10 ? 'shocked'
    : 'happy';

  const catMessage = !safetyData
    ? 'Let me check the safety data for this area...'
    : safetyData.high > 5
    ? `Ayo, ${safetyData.high} high-risk offenders within a mile. Keep your head on a swivel.`
    : safetyData.total > 10
    ? `${safetyData.total} registered offenders nearby. Stay alert out there.`
    : safetyData.total > 0
    ? `${safetyData.total} registered offenders in the area. Stay aware.`
    : 'Area looks relatively clear. Stay safe out there.';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">

          {/* Main Card */}
          <div className="bg-pure-white/85 backdrop-blur-md p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soot-black rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-soot-black">Safety Report: {location}</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-alert-red bg-alert-red/5 px-3 py-1 rounded-full">
                <Info className="w-3 h-3" />
                Offenders.io • 1mi Radius
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-soot-black animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pulling safety data...</p>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
                <p className="text-sm font-bold text-gray-500">{error}</p>
              </div>
            )}

            {safetyData && !loading && (
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-5 bg-gray-50/60 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Within 1mi</p>
                    <p className="text-3xl font-bold text-soot-black">{safetyData.total}</p>
                    <p className="text-[10px] text-gray-400 mt-1">registered offenders</p>
                  </div>
                  <div className="p-5 bg-alert-red/5 rounded-2xl border border-alert-red/10 text-center">
                    <p className="text-[10px] font-bold text-alert-red/60 uppercase tracking-widest mb-1">High Risk</p>
                    <p className="text-3xl font-bold text-alert-red">{safetyData.high}</p>
                    <p className="text-[10px] text-alert-red/50 mt-1">offenders</p>
                  </div>
                  <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest mb-1">Medium Risk</p>
                    <p className="text-3xl font-bold text-orange-500">{safetyData.medium}</p>
                    <p className="text-[10px] text-orange-400/60 mt-1">offenders</p>
                  </div>
                </div>

                {/* Offender List */}
                {safetyData.offenders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <UserX className="w-3 h-3" />
                      Nearest Registered Offenders
                    </h3>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {safetyData.offenders.slice(0, 10).map((o, i) => {
                        const risk = getRiskLabel(o);
                        const riskColor = getRiskColor(risk);
                        const offense = getOffense(o);
                        return (
                          <div key={i} className="flex items-center justify-between p-4 bg-gray-50/60 rounded-xl border border-gray-100">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-soot-black">
                                {o.firstName ? `${o.firstName} ${o.lastName ?? ''}`.trim() : `Offender #${i + 1}`}
                                {o.age ? <span className="font-normal text-gray-400 ml-2">Age {o.age}</span> : null}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">{offense}</p>
                              {o.city && <p className="text-[10px] text-gray-300">{o.city}{o.state ? `, ${o.state}` : ''}</p>}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex-shrink-0 ${riskColor}`}>
                              {risk || 'Unknown'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {safetyData.total > 10 && (
                      <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
                        + {safetyData.total - 10} more in the area
                      </p>
                    )}
                  </div>
                )}

                {safetyData.total === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <ShieldCheck className="w-10 h-10 text-safety-green" />
                    <p className="text-sm font-bold text-safety-green">No registered offenders found within 1 mile</p>
                    <p className="text-xs text-gray-400">Data sourced from Offenders.io registry</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              <span className="font-bold text-gray-500">Data Notice:</span> Offender data is sourced from public sex offender registries via Offenders.io. Information may not be fully up to date. This tool is for awareness only — always verify with local authorities.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 space-y-6">
          <CatMascot mood={catMood} message={catMessage} />

          <div className="bg-safety-green/5 p-6 rounded-2xl border border-safety-green/10">
            <h4 className="text-[10px] font-bold text-safety-green uppercase tracking-widest mb-4">Safety Tips</h4>
            <ul className="space-y-3">
              {[
                'Stick to well-lit main streets',
                'Keep your phone charged',
                'Share your location with friends',
                'Trust your instincts',
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-safety-green/80">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
