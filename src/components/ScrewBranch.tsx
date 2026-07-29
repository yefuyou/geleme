import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Zap, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

interface ScrewBranchProps {
  onComplete: (screwCount: number, success: boolean, title: string) => void;
}

export const ScrewBranch: React.FC<ScrewBranchProps> = ({ onComplete }) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const timerRef = useRef<number | null>(null);

  const startGame = () => {
    setClickCount(0);
    setTimeLeft(10);
    setGameState('PLAYING');

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleScrewClick = () => {
    if (gameState !== 'PLAYING') return;

    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 30) {
        clearInterval(timerRef.current!);
        setGameState('SUCCESS');
      }
      return next;
    });
  };

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'PLAYING') {
      if (clickCount < 30) {
        setGameState('FAILED');
      }
    }
  }, [timeLeft, gameState, clickCount]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-950/80 border border-blue-700/60 flex items-center justify-center mb-3 text-blue-400">
          <Wrench className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-mono font-bold bg-blue-950/70 text-blue-400 border border-blue-800/60 px-3 py-0.5 rounded-full">
          富士康风向标 · 拧螺丝车间
        </span>

        <h3 className="text-xl font-black text-white mt-3 mb-1">
          10 秒内猛戳 30 次螺丝！
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          手速决定日薪，每一颗螺丝都是你拯救亏损股票的坚实基石！
        </p>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">剩余倒计时</div>
            <div className="text-2xl font-black font-mono text-amber-400">
              {timeLeft}s
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">完成螺丝数</div>
            <div className="text-2xl font-black font-mono text-blue-400">
              {clickCount} / 30
            </div>
          </div>
        </div>
      </div>

      {/* Conveyor Belt Visual & Main Button */}
      <div className="my-4 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Conveyor animation background */}
        <div className="w-full h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-around overflow-hidden relative mb-4">
          <motion.div 
            animate={gameState === 'PLAYING' ? { x: [-100, 100] } : {}}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="flex space-x-6 text-slate-600 font-mono text-xs opacity-50"
          >
            <span>🔩 螺丝-01</span>
            <span>🔩 螺丝-02</span>
            <span>🔩 螺丝-03</span>
            <span>🔩 螺丝-04</span>
          </motion.div>
        </div>

        {gameState === 'IDLE' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-lg shadow-xl border border-blue-400/40 cursor-pointer"
          >
            🚀 开始拧螺丝挑战
          </motion.button>
        )}

        {gameState === 'PLAYING' && (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleScrewClick}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black text-2xl shadow-2xl shadow-blue-900/60 border-4 border-blue-300 flex flex-col items-center justify-center cursor-pointer select-none active:brightness-125"
          >
            <Wrench className="w-10 h-10 mb-1 animate-spin" style={{ animationDuration: '3s' }} />
            <span>拧紧!</span>
            <span className="text-xs font-mono text-blue-200 mt-1">({clickCount}/30)</span>
          </motion.button>
        )}

        {gameState === 'FAILED' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-center w-full"
          >
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-red-300">
              螺丝未达标！
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              “经检测，你不仅拿不住股票，扳手也拿不住。”
            </p>
          </motion.div>
        )}

        {gameState === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-slate-900 border-2 border-blue-500 rounded-xl text-left w-full shadow-2xl"
          >
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-3 border-b border-slate-800 pb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>今日流水线打卡成功！</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>今日工资:</span>
                <span className="text-emerald-400 font-bold">86 元</span>
              </div>
              <div className="flex justify-between">
                <span>昨日股票亏损:</span>
                <span className="text-red-400 font-bold">8,600 元</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span>预计回本工期:</span>
                <span className="text-amber-400 font-bold">100 天 (不吃不喝)</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Controls */}
      <div className="space-y-2 mb-2">
        {gameState === 'FAILED' && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={startGame}
            className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重新挑战拧螺丝</span>
          </motion.button>
        )}

        {gameState === 'SUCCESS' && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onComplete(clickCount, true, '螺丝成精者')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg border border-blue-400/30 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>领取 86 元工资 & 结账</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
