import React from 'react';
import { TrendingDown, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 flex flex-col z-10 sticky top-0 shadow-md">
      {/* Main Brand Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-black tracking-tight text-white font-sans">割了么</h1>
              <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800/60 px-1.5 py-0.2 rounded font-mono font-bold">
                PRO 极速版
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">专注解决拿不住问题</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-full text-slate-300 text-xs">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-medium text-amber-200/90">无痛割肉认证</span>
        </div>
      </div>

      {/* Financial Ticker Bar (Red/Green stock indicators) */}
      <div className="bg-slate-950/80 border-t border-slate-800/60 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center space-x-1">
          <span className="text-slate-400">上证全割:</span>
          <span className="text-emerald-400 font-bold">2750.84</span>
          <span className="text-emerald-400 text-[10px]">(-1.41%)</span>
        </div>
        <div className="w-px h-3 bg-slate-800 mx-1"></div>
        <div className="flex items-center space-x-1">
          <span className="text-slate-400">深割成指:</span>
          <span className="text-emerald-400 font-bold">8120.50</span>
          <span className="text-emerald-400 text-[10px]">(-2.71%)</span>
        </div>
        <div className="w-px h-3 bg-slate-800 mx-1"></div>
        <div className="flex items-center space-x-1">
          <span className="text-slate-400">韭菜成指:</span>
          <span className="text-emerald-400 font-bold">472.50</span>
          <span className="text-emerald-400 text-[10px]">(-52.75%)</span>
        </div>
      </div>
    </header>
  );
};
