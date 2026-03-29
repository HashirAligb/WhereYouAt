import React from 'react';
import { ShieldAlert, AlertTriangle, MapPin, UserX, Info, ShieldCheck } from 'lucide-react';
import CatMascot from './CatMascot';

interface SafetySectionProps {
  location: string;
}

export default function SafetySection({ location }: SafetySectionProps) {
  const [isSummarized, setIsSummarized] = React.useState(false);
  // Mock data for safety/crime
  const stats = [
    { label: "Crime Rate", value: "Moderate", status: "warning" },
    { label: "Sex Offenders", value: "12 in 1mi", status: "danger" },
    { label: "Patrol Frequency", value: "High", status: "safe" }
  ];

  const incidents = [
    { type: "Petty Theft", location: "Orchard St", time: "2h ago", severity: "low" },
    { type: "Vandalism", location: "Delancey St", time: "5h ago", severity: "low" },
    { type: "Assault", location: "Allen St", time: "1d ago", severity: "high" }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div className="bg-pure-white/85 backdrop-blur-md p-8 rounded-[2rem] border border-burgundy/10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soot-black rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-soot-black">Safety Report: {location}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSummarized(!isSummarized)}
                  className="px-4 py-1.5 bg-burgundy/5 border border-burgundy/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-burgundy hover:bg-burgundy hover:text-cream transition-all"
                >
                  {isSummarized ? 'Show Full Report' : 'Summarize'}
                </button>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-alert-red bg-alert-red/5 px-3 py-1 rounded-full">
                  <Info className="w-3 h-3" />
                  Last Updated • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {!isSummarized && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${
                      stat.status === 'danger' ? 'text-alert-red' : 
                      stat.status === 'warning' ? 'text-orange-600' : 'text-safety-green'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-soot-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                {isSummarized ? 'Critical Incidents' : 'Recent Incidents'}
              </h3>
              <div className="space-y-3">
                {incidents
                  .filter(inc => !isSummarized || inc.severity === 'high')
                  .map((incident, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        incident.severity === 'high' ? 'bg-alert-red/10 text-alert-red' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-soot-black">{incident.type}</p>
                        <p className="text-[10px] font-bold text-gray-400">{incident.location} • {incident.time}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      incident.severity === 'high' ? 'bg-alert-red text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-alert-red/5 p-8 rounded-3xl border border-alert-red/10">
            <div className="flex items-center gap-3 mb-6">
              <UserX className="w-6 h-6 text-alert-red" />
              <h3 className="text-lg font-bold text-soot-black">Registered Offender Alert</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              There are <span className="font-bold text-alert-red">12 registered sex offenders</span> within a 1-mile radius of your current location. 
              Exercise caution in poorly lit areas and during late hours.
            </p>
            <button className="w-full py-3 bg-soot-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
              VIEW DETAILED OFFENDER MAP
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-6">
          <CatMascot 
            mood="angry" 
            message="Ayo, keep your head on a swivel. This block can get a bit rowdy after dark. Stay alert." 
          />
          
          <div className="bg-safety-green/5 p-6 rounded-2xl border border-safety-green/10">
            <h4 className="text-[10px] font-bold text-safety-green uppercase tracking-widest mb-4">Safety Tips</h4>
            <ul className="space-y-3">
              {[
                'Stick to main streets',
                'Keep phone charged',
                'Avoid dark alleys',
                'Share location with friends'
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-safety-green/80">
                  <ShieldCheck className="w-4 h-4" />
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
