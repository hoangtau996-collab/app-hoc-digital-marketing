import React from 'react';

export default function PMarcomLogo({ className = "w-10 h-10", showText = false, textClassName = "text-lg font-black tracking-wider text-white" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Exact uploaded logo image */}
      <div className={`relative overflow-hidden rounded-xl border border-amber-500/50 shadow-lg shadow-amber-950/50 shrink-0 ${className}`}>
        <img 
          src="/pmarcom-logo.jpg" 
          alt="Học viện P Marcom Logo" 
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`leading-none flex items-center gap-1.5 ${textClassName}`}>
            <span className="text-emerald-400 font-extrabold">HỌC VIỆN</span>
            <span className="text-amber-400 font-black tracking-widest">P MARCOM</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            Digital Marketing Academy
          </span>
        </div>
      )}
    </div>
  );
}
