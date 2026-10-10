import React from 'react';

interface AndroidNavBarProps {
  onBack?: () => void;
  onHome?: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({ onBack, onHome }) => {
  return (
    <div className="w-full py-2.5 bg-white/90 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-center select-none z-20">
      {/* Android Gesture Pill */}
      <button
        onClick={onHome}
        className="w-32 h-1.5 rounded-full bg-slate-400/80 hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer"
        title="Android Home Bar"
      />
    </div>
  );
};
