import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, TrendingUp, ArrowRight, RefreshCcw } from 'lucide-react';

interface CutLossBranchProps {
  onComplete: (title: string) => void;
}

export const CutLossBranch: React.FC<CutLossBranchProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'CONFIRM' | 'SOLD'>('CONFIRM');

  const handleSell = () => {
    setStep('SOLD');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      {step === 'CONFIRM' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center mb-3 text-red-400">
              <Scissors className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono font-bold bg-red-950/70 text-red-400 border border-red-800/60 px-3 py-0.5 rounded-full">
              二次高能确认
            </span>

            <h3 className="text-xl font-black text-white mt-3 mb-2">
              确定以最低点精准卖出吗？
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-4">
              系统根据大数据预测，您按下按钮的一瞬间，可能就是大牛市的起点。
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>当前挂单价:</span>
                <span className="text-emerald-400 font-bold">￥4.72 (今日最低)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>主力监控状态:</span>
                <span className="text-amber-400 font-bold">手握筹码等待大阳线</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 my-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSell}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Scissors className="w-5 h-5" />
              <span>确认割肉！手起刀落</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => alert("系统提示：再跌一点就归零了！您还是割了吧。")}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>再跌一点再割 (观望)</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'SOLD' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Surge Banner */}
            <div className="bg-red-600 text-white text-xs font-bold py-1 px-4 -mx-5 -mt-5 mb-4 animate-pulse">
              🎉 卖出成功！市场奇迹发生了！
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mb-3 text-red-400 shadow-lg shadow-red-950/50">
              <TrendingUp className="w-9 h-9 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-red-500 tracking-tight mb-1">
              +19.98% 🚀
            </h3>
            <p className="text-xs text-slate-300 font-bold mb-4">
              股票就在您卖出后第 0.5 秒直接拉出 20cm 涨停！
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl my-2 text-left">
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                <strong className="text-red-400 block mb-1">官方颁奖词：</strong>
                “您已成功为市场提供流动性。”
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                主力在背后为你鼓掌，韭菜社区铭记你为牛市作出的无私奉献。
              </p>
            </div>
          </div>

          <div className="my-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onComplete('流动性提供者')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>打工结账 & 查看评估报告</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
