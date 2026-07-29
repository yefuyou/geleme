import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shovel, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface HoeBranchProps {
  onComplete: (success: boolean, title: string) => void;
  onGoToScrew: () => void;
}

export const HoeBranch: React.FC<HoeBranchProps> = ({ onComplete, onGoToScrew }) => {
  const [holdingProgress, setHoldingProgress] = useState<number>(0);
  const [status, setStatus] = useState<'IDLE' | 'HOLDING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    if (status === 'SUCCESS') return;
    setStatus('HOLDING');
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / 3000) * 100);
      setHoldingProgress(progress);

      if (elapsed >= 3000) {
        clearInterval(timerRef.current!);
        setStatus('SUCCESS');
      }
    }, 30);
  };

  const endHold = () => {
    if (status === 'SUCCESS') return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (holdingProgress < 100) {
      setStatus('FAILED');
      setHoldingProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-950/80 border border-amber-700/60 flex items-center justify-center mb-3 text-amber-400">
          <Shovel className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60 px-3 py-0.5 rounded-full">
          实业赛道 · 耕地考核
        </span>

        <h3 className="text-xl font-black text-white mt-3 mb-1">
          股票拿不住，锄头总拿得住吧？
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-3">
          长按下方【握紧锄头】按钮连续 3 秒，中途不可松手！
        </p>

        {/* Circular / Bar Progress Display */}
        <div className="my-3 py-3 px-4 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 bottom-0 bg-amber-600/20 transition-all duration-75"
            style={{ width: `${holdingProgress}%` }}
          ></div>
          <div className="relative z-10 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">握持定力进度:</span>
            <span className="text-amber-400 font-bold text-sm">
              {((holdingProgress / 100) * 3).toFixed(1)}s / 3.0s
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Interaction Area */}
      <div className="my-4 flex-1 flex flex-col items-center justify-center">
        {status === 'IDLE' && (
          <div className="text-xs text-slate-400">
            👇 准备好了就按住下方大按钮
          </div>
        )}

        {status === 'HOLDING' && (
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-amber-400 font-bold text-sm"
          >
            💪 正在发力握紧中，千万不要松手！
          </motion.div>
        )}

        {status === 'FAILED' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-center"
          >
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-red-300">
              锄头也没拿住！
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              建议直接进入【拧螺丝赛道】继续磨练。
            </p>
          </motion.div>
        )}

        {status === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-amber-950/80 border-2 border-amber-500 rounded-xl text-center shadow-lg"
          >
            <CheckCircle className="w-9 h-9 text-amber-400 mx-auto mb-2" />
            <h4 className="text-base font-black text-amber-300">
              耕地资格认证成功！
            </h4>
            <p className="text-xs text-amber-100/90 mt-1">
              今日预计收益：<strong>两筐新鲜土豆 🥔🥔</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Controls */}
      <div className="space-y-3 mb-2">
        {status !== 'SUCCESS' && (
          <motion.button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-5 px-6 rounded-2xl font-black text-lg shadow-xl border cursor-pointer select-none transition-all ${
              status === 'HOLDING'
                ? 'bg-amber-600 text-white border-amber-300 shadow-amber-900/60 scale-105'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-amber-400/40 shadow-amber-950/50'
            }`}
          >
            {status === 'HOLDING' ? '🔨 发力握紧中...' : '✊ 长按 3 秒握紧锄头'}
          </motion.button>
        )}

        {status === 'FAILED' && (
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setStatus('IDLE')}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重新握一次锄头</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onGoToScrew}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-900/80 text-blue-200 font-bold text-sm border border-blue-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>放弃耕地，转战螺丝赛道 🔧</span>
            </motion.button>
          </div>
        )}

        {status === 'SUCCESS' && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onComplete(true, '锄头体验官')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-base shadow-lg border border-amber-400/30 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>领土豆结账 & 查看评估报告</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
