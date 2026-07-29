import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900/90 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-center space-x-1.5 text-slate-400 text-xs z-10 sticky bottom-0 backdrop-blur-sm">
      <AlertCircle className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
      <p className="text-[11px] font-medium tracking-wide text-slate-400">
        纯属娱乐，不构成投资建议。
      </p>
    </footer>
  );
};
