import React from 'react';

export default function PMarcomLogo({ className = "w-9 h-9", showText = false, textClassName = "text-lg font-black tracking-wider text-white" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* SVG Icon matching P MARCOM paper plane logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
        >
          <defs>
            <linearGradient id="pMarcomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Background Badge circle */}
          <rect x="2" y="2" width="96" height="96" rx="24" fill="#071711" stroke="url(#pMarcomGrad)" strokeWidth="3" />
          
          {/* Main P Body */}
          <path 
            d="M 28 80 V 24 C 28 24 55 20 72 32 C 86 42 78 62 60 62 H 44 V 80 Z" 
            fill="url(#pMarcomGrad)" 
          />

          {/* Inner P cutout */}
          <path 
            d="M 44 36 H 56 C 62 36 66 42 60 50 H 44 Z" 
            fill="#071711" 
          />

          {/* Paper Airplane inside the P */}
          <path 
            d="M 42 54 L 68 34 L 54 58 L 50 49 Z" 
            fill="url(#goldGrad)" 
          />
          <path 
            d="M 50 49 L 68 34 L 54 44 Z" 
            fill="#fef08a" 
            opacity="0.8" 
          />
        </svg>
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
