import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface ScrewBranchProps {
  onComplete: (stats: {
    screwCount: number;
    bossHits: number;
    stockPeeks: number;
    accuracy: number;
    success: boolean;
    title: string;
  }) => void;
}

type CellType = 'SCREW' | 'RUSTY' | 'BOSS' | 'LIMIT_UP';

interface ActiveTarget {
  cellIdx: number;
  type: CellType;
  id: number;
}

export const ScrewBranch: React.FC<ScrewBranchProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [screwScore, setScrewScore] = useState<number>(0);
  const [bossHits, setBossHits] = useState<number>(0);
  const [stockPeeks, setStockPeeks] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [activeTargets, setActiveTargets] = useState<ActiveTarget[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('用实业汗水抵扣股票亏损！');
  const [hitPopups, setHitPopups] = useState<{ id: number; cellIdx: number; text: string; color: string }[]>([]);

  const timerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const targetIdRef = useRef<number>(0);
  const activeTargetsRef = useRef<ActiveTarget[]>([]);
  const popupIdRef = useRef<number>(0);

  const updateTargets = (newTargets: ActiveTarget[] | ((prev: ActiveTarget[]) => ActiveTarget[])) => {
    setActiveTargets((prev) => {
      const next = typeof newTargets === 'function' ? newTargets(prev) : newTargets;
      activeTargetsRef.current = next;
      return next;
    });
  };

  const startGame = () => {
    setScrewScore(0);
    setBossHits(0);
    setStockPeeks(0);
    setTotalClicks(0);
    setTimeLeft(10);
    updateTargets([]);
    setHitPopups([]);
    setFeedbackMsg('⚡ 高难上工：10秒内狂点目标，拧满 18 颗螺丝！');
    setGameState('PLAYING');
  };

  // Main 10s countdown
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle game end when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'PLAYING') {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      setGameState(screwScore >= 18 ? 'SUCCESS' : 'FAILED');
    }
  }, [timeLeft, gameState, screwScore]);

  // Faster Spawning loop & shorter stay duration (High difficulty!)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const spawnTarget = () => {
      const cellIdx = Math.floor(Math.random() * 9);
      const rand = Math.random();
      let type: CellType = 'SCREW';

      if (rand < 0.50) {
        type = 'SCREW'; // 50% Normal screw
      } else if (rand < 0.70) {
        type = 'RUSTY'; // 20% Rusty screw
      } else if (rand < 0.86) {
        type = 'BOSS'; // 16% Boss head
      } else {
        type = 'LIMIT_UP'; // 14% Limit-up peek
      }

      const newId = ++targetIdRef.current;
      updateTargets((prev) => {
        const filtered = prev.filter((t) => t.cellIdx !== cellIdx);
        return [...filtered, { cellIdx, type, id: newId }];
      });

      // Target stays on screen for only 750ms - 950ms (Short time!)
      const stayDuration = 750 + Math.random() * 200;
      setTimeout(() => {
        updateTargets((prev) => prev.filter((t) => t.id !== newId));
      }, stayDuration);

      // Schedule next spawn in 280ms - 420ms
      const nextSpawn = 280 + Math.random() * 140;
      spawnTimerRef.current = window.setTimeout(spawnTarget, nextSpawn);
    };

    spawnTimerRef.current = window.setTimeout(spawnTarget, 150);

    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [gameState]);

  const handleCellClick = (cellIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (gameState !== 'PLAYING') return;

    setTotalClicks((prev) => prev + 1);

    const target = activeTargetsRef.current.find((t) => t.cellIdx === cellIdx);
    const popId = ++popupIdRef.current;

    if (!target) {
      // Empty cell click penalty
      setScrewScore((prev) => Math.max(0, prev - 1));
      setFeedbackMsg('⚠️ 打滑空按！积分 -1');
      setHitPopups((prev) => [...prev, { id: popId, cellIdx, text: '打滑 -1', color: 'text-slate-400' }]);
      setTimeout(() => {
        setHitPopups((prev) => prev.filter((p) => p.id !== popId));
      }, 500);
      return;
    }

    // Immediately remove hit target
    updateTargets((prev) => prev.filter((t) => t.id !== target.id));

    if (target.type === 'SCREW') {
      setScrewScore((prev) => prev + 1);
      setFeedbackMsg('🔩 螺丝 +1 (拧紧)');
      setHitPopups((prev) => [...prev, { id: popId, cellIdx, text: '+1 🔩', color: 'text-blue-400 font-black' }]);
    } else if (target.type === 'RUSTY') {
      setScrewScore((prev) => prev + 2);
      setFeedbackMsg('🪛 锈迹螺丝 +2 (老设备考验职业素养)');
      setHitPopups((prev) => [...prev, { id: popId, cellIdx, text: '+2 🪛', color: 'text-amber-400 font-black' }]);
    } else if (target.type === 'BOSS') {
      setBossHits((prev) => prev + 1);
      setScrewScore((prev) => Math.max(0, prev - 2));
      setFeedbackMsg('👨‍💼 你拧到老板了！扣 2 分');
      setHitPopups((prev) => [...prev, { id: popId, cellIdx, text: '-2 👨‍💼', color: 'text-red-400 font-black' }]);
    } else if (target.type === 'LIMIT_UP') {
      setStockPeeks((prev) => prev + 1);
      setFeedbackMsg('📈 上班偷看股票！流水线停工 1 秒');
      setHitPopups((prev) => [...prev, { id: popId, cellIdx, text: '停工 1s 📈', color: 'text-red-500 font-black' }]);
      setGameState('PAUSED');
      setTimeout(() => setGameState('PLAYING'), 1000);
    }

    setTimeout(() => {
      setHitPopups((prev) => prev.filter((p) => p.id !== popId));
    }, 550);
  };

  const getTitle = (score: number, success: boolean): string => {
    if (success) {
      if (score >= 26) return '流水线永动机';
      if (score >= 22) return '螺丝成精者';
      return '合格螺丝工';
    } else {
      if (score <= 8) return '流水线观光游客';
      if (score <= 14) return '摸鱼型技术人才';
      return '差一颗转正';
    }
  };

  const handleFinish = () => {
    const success = screwScore >= 18;
    const title = getTitle(screwScore, success);
    const accuracy = totalClicks > 0 ? Math.round((screwScore / totalClicks) * 100) : 0;

    onComplete({
      screwCount: screwScore,
      bossHits,
      stockPeeks,
      accuracy,
      success,
      title,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 text-center select-none">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-blue-400 font-bold bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded flex items-center space-x-1">
            <Wrench className="w-3.5 h-3.5 inline mr-1" />
            流水线九宫格 (高难目标: 18颗)
          </span>
          <span className="text-slate-300 font-bold">
            倒计时: <strong className="text-amber-400 text-sm">{timeLeft}s</strong>
          </span>
        </div>

        <div className="flex justify-around items-center bg-slate-950 rounded-xl p-2.5 border border-slate-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-500">已拧螺丝</div>
            <div className="text-lg font-black text-blue-400">{screwScore} / 18</div>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-500">误伤老板</div>
            <div className="text-base font-bold text-red-400">{bossHits} 次</div>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-500">偷看涨停</div>
            <div className="text-base font-bold text-amber-400">{stockPeeks} 次</div>
          </div>
        </div>

        {/* Rule Banner */}
        <div className="mt-2 p-1.5 bg-slate-950 border border-blue-900/50 rounded-lg text-[10px] font-mono text-slate-300 flex justify-around flex-wrap gap-1">
          <span>🔩螺丝+1</span>
          <span className="text-amber-400">🪛锈螺丝+2</span>
          <span className="text-red-400">👨‍💼老板扣2分</span>
          <span className="text-red-500">📈涨停停工1s</span>
          <span className="text-slate-400">空按扣1分</span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 font-mono truncate">
          {feedbackMsg}
        </p>
      </div>

      {/* 3x3 Whack-A-Mole Grid */}
      <div className="my-3 flex-1 flex flex-col items-center justify-center">
        {gameState === 'IDLE' && (
          <div className="space-y-3 py-6">
            <Wrench className="w-12 h-12 text-blue-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white">进厂拧螺丝 (高强打地鼠)</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              在 10 秒内迅速击中出现的螺丝！挑战 18 颗高分！避开老板👨‍💼、涨停板📈与打滑！
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg border border-blue-400/30 cursor-pointer"
            >
              开始高强上工 🛠️
            </motion.button>
          </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px] aspect-square bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner relative">
            {Array.from({ length: 9 }).map((_, idx) => {
              const target = activeTargets.find((t) => t.cellIdx === idx);
              const popup = hitPopups.find((p) => p.cellIdx === idx);

              return (
                <div
                  key={idx}
                  onPointerDown={(e) => handleCellClick(idx, e as unknown as React.MouseEvent)}
                  onClick={(e) => handleCellClick(idx, e)}
                  className="bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden active:bg-slate-800 cursor-pointer select-none touch-none transition-transform"
                >
                  <AnimatePresence>
                    {target && (
                      <motion.div
                        key={target.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="text-3xl flex items-center justify-center w-full h-full pointer-events-none select-none"
                      >
                        {target.type === 'SCREW' && <span>🔩</span>}
                        {target.type === 'RUSTY' && <span>🪛</span>}
                        {target.type === 'BOSS' && <span>👨‍💼</span>}
                        {target.type === 'LIMIT_UP' && <span>📈</span>}
                      </motion.div>
                    )}

                    {popup && (
                      <motion.div
                        key={`pop-${popup.id}`}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -20 }}
                        className={`absolute font-black text-sm ${popup.color} pointer-events-none z-20`}
                      >
                        {popup.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {gameState === 'FAILED' && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-center w-full">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-red-300">
              未达到 18 颗螺丝目标！
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              得分: {screwScore} 颗 | 称号: <strong className="text-amber-400">{getTitle(screwScore, false)}</strong>
            </p>
          </motion.div>
        )}

        {gameState === 'SUCCESS' && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-blue-950/80 border-2 border-blue-500 rounded-xl text-center shadow-lg w-full">
            <CheckCircle className="w-9 h-9 text-blue-400 mx-auto mb-2" />
            <h4 className="text-base font-black text-blue-300">
              流水线打卡成功！
            </h4>
            <p className="text-xs text-blue-100/90 mt-1">
              得分: {screwScore} 颗螺丝 | 获得称号: <strong className="text-amber-300">{getTitle(screwScore, true)}</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      <div className="space-y-2 mb-2">
        {gameState === 'FAILED' && (
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重新挑战拧螺丝</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-900/80 text-blue-200 font-bold text-sm border border-blue-700 cursor-pointer"
            >
              <span>查看结算报告</span>
            </motion.button>
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleFinish}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg border border-blue-400/30 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>领取工资 & 查看评估报告</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
