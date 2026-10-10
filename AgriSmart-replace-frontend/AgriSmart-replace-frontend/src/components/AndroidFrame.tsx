import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeRole?: 'farmer' | 'officer';
  onSwitchRole?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeRole,
  onSwitchRole
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'expanded'>('expanded');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 select-none">
      {/* Top Floating Control Bar for Demo / Multi-device View */}
      <div className="w-full max-w-5xl mb-2 sm:mb-4 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-white z-30 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
            A
          </div>
          <span className="font-extrabold text-sm tracking-tight">
            Agri<span className="text-emerald-400">Smart</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/50 text-[10px]">
            {activeRole === 'officer' ? '🏛️ Officer Mobile App' : '🌾 Farmer Mobile App'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Phone Frame vs Expanded View */}
          <div className="bg-slate-800 p-0.5 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Android Phone Mockup"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('expanded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                deviceMode === 'expanded'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expanded Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full App View</span>
            </button>
          </div>

          {/* Switch Role shortcut */}
          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full transition-all duration-300 ${
        deviceMode === 'mobile'
          ? 'max-w-[420px] rounded-[44px] p-2 bg-slate-900 border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 relative overflow-hidden my-auto'
          : 'max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-[#f4f7f5]'
      }`}>
        {/* Android Punch Hole Camera in Phone Frame Mode */}
        {deviceMode === 'mobile' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-slate-800/80 z-40 pointer-events-none flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>
        )}

        <div className="w-full h-full overflow-hidden flex flex-col bg-[#f4f7f5]">
          {children}
        </div>
      </div>
    </div>
  );
};
