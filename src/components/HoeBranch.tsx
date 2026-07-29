import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shovel, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface HoeBranchProps {
  onComplete: (stats: {
    holdDurationSeconds: number;
    retryCount: number;
    success: boolean;
    title: string;
  }) => void;
  onGoToScrew: () => void;
}

export const HoeBranch: React.FC<HoeBranchProps> = ({ onComplete, onGoToScrew }) => {
  const [holdingProgress, setHoldingProgress] = useState<number>(0);
  const [status, setStatus] = useState<'IDLE' | 'HOLDING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [phaseText, setPhaseText] = useState<string>('✊ 长按 3 秒握紧锄头');
  const [isVibrating, setIsVibrating] = useState<boolean>(false);
  const [driftOffset, setDriftOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [failedTitle, setFailedTitle] = useState<string>('纸手农业体验员');
  const [retryCount, setRetryCount] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isPointerDownRef = useRef<boolean>(false);

  const updateProgress = () => {
    if (!isPointerDownRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(100, (elapsed / 3000) * 100);
    setHoldingProgress(progress);

    if (elapsed < 1000) {
      setPhaseText('握紧，别松手。');
      setIsVibrating(false);
      setDriftOffset({ x: 0, y: 0 });
    } else if (elapsed < 2000) {
      setPhaseText('股票已经拿不住了，锄头可别再松！');
      setIsVibrating(true);
      setDriftOffset({ x: 0, y: 0 });
    } else if (elapsed < 3000) {
      setPhaseText('还差一点，你的两筐土豆正在加载... 🥔');
      setIsVibrating(true);
      // Safe tiny drift (within 6px) to avoid releasing pointer
      const driftX = Math.sin(elapsed / 100) * 5;
      const driftY = Math.cos(elapsed / 100) * 4;
      setDriftOffset({ x: driftX, y: driftY });
    } else {
      // Completed 3s
      isPointerDownRef.current = false;
      setIsVibrating(false);
      setDriftOffset({ x: 0, y: 0 });
      setStatus('SUCCESS');
      return;
    }

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (status === 'SUCCESS') return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    isPointerDownRef.current = true;
    startTimeRef.current = Date.now();
    setStatus('HOLDING');

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const handlePointerUpOrCancel = () => {
    if (!isPointerDownRef.current && status !== 'HOLDING') return;

    isPointerDownRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsVibrating(false);
    setDriftOffset({ x: 0, y: 0 });

    if (status !== 'SUCCESS') {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < 3000) {
        setStatus('FAILED');
        setHoldingProgress(0);

        if (elapsed < 1000) {
          setFailedTitle('纸手农业体验员');
        } else if (elapsed < 2000) {
          setFailedTitle('半自动松手专家');
        } else {
          setFailedTitle('差一点土豆就熟了');
        }
      }
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setStatus('IDLE');
    setHoldingProgress(0);
    setPhaseText('✊ 长按 3 秒握紧锄头');
  };

  const handleFinish = () => {
    onComplete({
      holdDurationSeconds: 3.0,
      retryCount,
      success: true,
      title: '锄头体验官',
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-950/80 border border-amber-700/60 flex items-center justify-center mb-3 text-amber-400">
          <Shovel className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/60 px-3 py-0.5 rounded-full">
          实业赛道 · 耕地考核
        </span>

        <h3 className="text-xl font-black text-white mt-3 mb-1">
          按住 3 秒，证明你拿得住锄头
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-3">
          股票拿不住，锄头总得试试！长按下方大按钮不要松手。
        </p>

        {/* Progress Bar */}
        <div className="my-3 py-3 px-4 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 bottom-0 bg-amber-600/25 transition-all duration-75"
            style={{ width: `${holdingProgress}%` }}
          ></div>
          <div className="relative z-10 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">握持时间:</span>
            <span className="text-amber-400 font-bold text-sm">
              {((holdingProgress / 100) * 3).toFixed(1)}s / 3.0s
            </span>
          </div>
        </div>
      </div>

      {/* Main Interaction State */}
      <div className="my-4 flex-1 flex flex-col items-center justify-center">
        {status === 'IDLE' && (
          <div className="text-xs text-slate-400 font-mono">
            👇 按住下方大按钮并保持 3 秒
          </div>
        )}

        {status === 'HOLDING' && (
          <motion.div 
            animate={{ scale: [1, 1.03, 1] }} 
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="text-amber-400 font-bold text-sm bg-amber-950/60 border border-amber-800/60 px-4 py-2 rounded-xl"
          >
            {phaseText}
          </motion.div>
        )}

        {status === 'FAILED' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-center w-full"
          >
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-red-300">
              锄头也没拿住！
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              获得评价称号：<strong className="text-amber-400">{failedTitle}</strong>
            </p>
          </motion.div>
        )}

        {status === 'SUCCESS' && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="p-4 bg-amber-950/80 border-2 border-amber-500 rounded-xl text-center shadow-lg w-full"
          >
            <CheckCircle className="w-9 h-9 text-amber-400 mx-auto mb-2" />
            <h4 className="text-base font-black text-amber-300">
              耕地资格认证成功！
            </h4>
            <p className="text-xs text-amber-100/90 mt-1">
              劳动总结：成功获得 <strong>两筐热乎土豆 🥔🥔</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Controls */}
      <div className="space-y-3 mb-2">
        {status !== 'SUCCESS' && (
          <motion.button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrCancel}
            onPointerCancel={handlePointerUpOrCancel}
            onPointerLeave={handlePointerUpOrCancel}
            style={{
              transform: `translate(${driftOffset.x}px, ${driftOffset.y}px)`,
            }}
            className={`w-full py-5 px-6 rounded-2xl font-black text-base shadow-xl border cursor-pointer select-none transition-colors touch-none ${
              isVibrating ? 'animate-vibrate' : ''
            } ${
              status === 'HOLDING'
                ? 'bg-amber-600 text-white border-amber-300 shadow-amber-900/60'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400/40'
            }`}
          >
            {status === 'HOLDING' ? phaseText : '✊ 长按 3 秒握紧锄头'}
          </motion.button>
        )}

        {status === 'FAILED' && (
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleRetry}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再试一次 (重握锄头)</span>
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
            onClick={handleFinish}
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
