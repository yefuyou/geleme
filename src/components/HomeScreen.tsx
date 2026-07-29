import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, TrendingDown, HelpCircle } from 'lucide-react';

interface HomeScreenProps {
  onHold: () => void;
  onGiveUp: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onHold, onGiveUp }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col justify-between p-5 text-center"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="inline-flex items-center space-x-1.5 bg-red-950/60 border border-red-800/40 px-3 py-1 rounded-full text-red-400 text-xs font-semibold mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>散户再就业救援中心</span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          割了么 <span className="text-red-500 font-extrabold text-sm ml-1">v3.0</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          仓位拿不住？进厂、耕地、送外卖赛道全天候待命！
        </p>
      </div>

      {/* Main Prompt */}
      <div className="my-6 py-4 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-red-950/50 border-2 border-red-500/40 flex items-center justify-center mb-4 text-red-400 shadow-lg shadow-red-950/40"
        >
          <HelpCircle className="w-9 h-9 text-red-400" />
        </motion.div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
          拿不住了吗？
        </h3>
        <p className="text-xs text-slate-400 px-4 max-w-xs mx-auto">
          系统将根据你的表现，重新分配一份稳定职业。
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3.5 mb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onHold}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-red-200" />
          <span>我拿得住</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onGiveUp}
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-base border border-slate-700 shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <span>拿不住了，安排工作</span>
        </motion.button>

        <p className="text-[11px] text-slate-500 pt-1">
          💡 一轮约 30 秒，无须登录，纯属娱乐。
        </p>
      </div>
    </motion.div>
  );
};
