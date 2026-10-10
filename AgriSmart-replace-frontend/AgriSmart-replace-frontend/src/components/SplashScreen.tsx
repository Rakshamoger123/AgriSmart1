import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div
      id="screen-splash"
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Centered White Card (Image 3 match) */}
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[36px] shadow-2xl p-8 sm:p-12 text-center flex flex-col items-center border border-white/40 animate-in fade-in zoom-in-95 duration-500">
        {/* Leaf Icon Circle */}
        <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white shadow-sm mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-inner">
            <Leaf className="w-8 h-8 fill-white text-emerald-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Climate-Smart <span className="text-emerald-700">Crop</span>
          <br />
          <span className="text-emerald-700">Recommendation</span> System
        </h1>

        {/* Subtitle in quotes */}
        <p className="mt-4 text-base sm:text-lg font-semibold text-emerald-700">
          "AI-Powered Crop Recommendations Using Soil and Climate Data"
        </p>

        {/* Slogan */}
        <p className="mt-2 text-xs sm:text-sm font-bold text-slate-500 tracking-widest uppercase">
          SMART FARMING STARTS WITH SMART DECISIONS
        </p>

        {/* Action Button */}
        <button
          id="btn-splash-get-started"
          onClick={onGetStarted}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer Text Matching Image 3 */}
      <footer className="mt-8 text-center text-white space-y-1">
        <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-200 drop-shadow">
          DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
        </p>
        <p className="text-xs sm:text-sm font-medium text-slate-100 drop-shadow">
          Srinivas Institute of Technology
        </p>
        <p className="text-[11px] text-slate-300 drop-shadow">
          © 2026 AgriSmart. All rights reserved for sustainable agriculture research.
        </p>
      </footer>
    </div>
  );
};
