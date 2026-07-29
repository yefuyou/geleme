import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-0 sm:p-4 md:p-6 select-none font-sans text-slate-100">
      {/* Desktop Container Framing */}
      <div className="w-full max-w-md sm:max-w-[420px] sm:h-[880px] h-screen bg-slate-900 sm:rounded-[44px] sm:shadow-2xl sm:shadow-red-950/20 sm:border-[10px] sm:border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Phone Notch & Speaker (Visible on Desktop) */}
        <div className="hidden sm:flex justify-center items-center pt-2 pb-1 bg-slate-900 border-b border-slate-800/40 relative z-30">
          <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="w-full bg-slate-900 px-5 pt-2 pb-1 flex justify-between items-center text-xs font-medium text-slate-400 border-b border-slate-800/30 relative z-20">
          <span className="font-semibold text-slate-200 tracking-wider">{time || '09:41'}</span>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono bg-slate-800 px-1 py-0.5 rounded text-red-400 font-bold">割了么5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-slate-300" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-slate-950 scrollbar-none">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="w-full bg-slate-950 pt-1 pb-2 flex justify-center items-center relative z-20">
          <div className="w-32 h-1 bg-slate-700 rounded-full opacity-60"></div>
        </div>

      </div>
    </div>
  );
};
