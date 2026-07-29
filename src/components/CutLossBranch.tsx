import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scissors, TrendingUp, ArrowRight, RefreshCcw } from 'lucide-react';

interface CutLossBranchProps {
  onComplete: (stats: {
    waitAttempts: number;
    durationSeconds: number;
    firstTry: boolean;
    title: string;
  }) => void;
}

export const CutLossBranch: React.FC<CutLossBranchProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'CONFIRM' | 'SOLD'>('CONFIRM');
  const [waitAttempts, setWaitAttempts] = useState<number>(0);
  const [escapeBtnPos, setEscapeBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [escapeBtnText, setEscapeBtnText] = useState<string>('我再等等 (观望)');
  const [isEscapedMax, setIsEscapedMax] = useState<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEscapeNear = () => {
    if (isEscapedMax) return;

    setWaitAttempts((prev) => {
      const next = prev + 1;
      if (next === 1) {
        setEscapeBtnPos({ x: Math.random() > 0.5 ? 40 : -40, y: Math.random() > 0.5 ? 30 : -30 });
      } else if (next === 2) {
        setEscapeBtnPos({ x: Math.random() > 0.5 ? 100 : -100, y: Math.random() > 0.5 ? 80 : -80 });
      } else if (next === 3) {
        setEscapeBtnText('再等就归零了！');
        setEscapeBtnPos({ x: Math.random() > 0.5 ? 60 : -60, y: Math.random() > 0.5 ? 50 : -50 });
      } else if (next >= 4) {
        setIsEscapedMax(true);
        setEscapeBtnPos({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleSell = () => {
    setStep('SOLD');
  };

  const handleFinish = () => {
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const firstTry = waitAttempts === 0;
    const title = firstTry ? '最低点狙击手' : '流动性提供者';

    onComplete({
      waitAttempts,
      durationSeconds: elapsed,
      firstTry,
      title,
    });
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col justify-between p-5 text-center relative overflow-hidden">
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
              割肉黄金窗口
            </span>

            <h3 className="text-xl font-black text-white mt-3 mb-2">
              是否确认以今日最低价卖出？
            </h3>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs space-y-1.5 font-mono my-3">
              <div className="flex justify-between text-slate-400">
                <span>当前挂单价:</span>
                <span className="text-emerald-400 font-bold">￥4.72</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>今日跌幅:</span>
                <span className="text-emerald-400 font-bold">-19.98%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>系统评价:</span>
                <span className="text-amber-400 font-bold">流动性极其充沛</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 my-4 relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSell}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer z-10"
            >
              <Scissors className="w-5 h-5" />
              <span>确认割肉</span>
            </motion.button>

            {!isEscapedMax && waitAttempts >= 4 ? null : (
              <motion.button
                animate={{ x: escapeBtnPos.x, y: escapeBtnPos.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={handleEscapeNear}
                onTouchStart={handleEscapeNear}
                onClick={handleEscapeNear}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>{escapeBtnText}</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {step === 'SOLD' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="bg-red-600 text-white text-xs font-bold py-1 px-4 -mx-5 -mt-5 mb-4 animate-pulse">
              🎉 卖出成功！奇迹拉升发生了！
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mb-3 text-red-400 shadow-lg shadow-red-950/50">
              <TrendingUp className="w-9 h-9 animate-bounce" />
            </div>

            <h3 className="text-3xl font-black text-red-500 tracking-tight mb-1">
              +19.98% 🚀
            </h3>
            <p className="text-xs text-slate-300 font-bold mb-3">
              在你按下卖出后 0.5 秒，股票直接封死涨停！
            </p>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl my-2 text-left">
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                <strong className="text-red-400 block mb-1">官方弹窗感谢词：</strong>
                “感谢您为市场提供流动性。”
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400 font-mono">
                <span>观望犹豫次数: {waitAttempts} 次</span>
                <span>获得称号: <strong className="text-amber-400">{waitAttempts === 0 ? '最低点狙击手' : '流动性提供者'}</strong></span>
              </div>
            </div>
          </div>

          <div className="my-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleFinish}
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
