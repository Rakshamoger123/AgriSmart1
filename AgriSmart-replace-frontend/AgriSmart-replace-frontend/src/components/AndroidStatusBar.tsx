import React from 'react';
import { Wifi, Signal, BatteryMedium, ShieldCheck, Sparkles } from 'lucide-react';

interface AndroidStatusBarProps {
  theme?: 'light' | 'dark' | 'emerald';
  title?: string;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  theme = 'light',
  title
}) => {
  const isDark = theme === 'dark';
  const isEmerald = theme === 'emerald';

  const textColor = isEmerald ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-800';
  const bgClass = isEmerald ? 'bg-emerald-800' : isDark ? 'bg-slate-900' : 'bg-white/80 backdrop-blur-md';

  return (
    <div className={`w-full px-5 py-2 flex items-center justify-between text-xs font-semibold select-none ${bgClass} ${textColor} transition-colors border-b border-black/5 z-20`}>
      {/* Time */}
      <div className="flex items-center gap-1.5 font-bold tracking-tight">
        <span>10:30</span>
        <span className="text-[10px] opacity-75">AM</span>
      </div>

      {/* Camera Punch Hole center placeholder in phone frame */}
      <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider opacity-90">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="hidden sm:inline">AGRISMART 5G</span>
      </div>

      {/* Android Status Icons */}
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold">98%</span>
          <BatteryMedium className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
  );
};
