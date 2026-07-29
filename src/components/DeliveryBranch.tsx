import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bike, ArrowRight, CheckCircle, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface DeliveryBranchProps {
  onComplete: (stats: {
    completedOrders: number;
    clickCount: number;
    rejectedCount: number;
    penaltyFee: number;
    punctualRate: number;
    success: boolean;
    title: string;
  }) => void;
}

type ItemType = 'ORDER' | 'TRUCK' | 'RIDER' | 'POLICE' | 'RESTAURANT';

interface RoadItem {
  id: number;
  lane: number; // 0: Left, 1: Middle, 2: Right
  y: number; // 0 to 100%
  type: ItemType;
}

export const DeliveryBranch: React.FC<DeliveryBranchProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [playerLane, setPlayerLane] = useState<number>(1);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [penaltyFee, setPenaltyFee] = useState<number>(0);
  const [collisionCount, setCollisionCount] = useState<number>(0);
  const [laneChangeCount, setLaneChangeCount] = useState<number>(0);
  const [items, setItems] = useState<RoadItem[]>([]);
  const [eventMsg, setEventMsg] = useState<string>('极速避障：躲避大货车与交警，抢满 8 单！');
  const [hitFeedback, setHitFeedback] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const itemsRef = useRef<RoadItem[]>([]);
  const playerLaneRef = useRef<number>(1);
  const itemIdRef = useRef<number>(0);

  useEffect(() => {
    playerLaneRef.current = playerLane;
  }, [playerLane]);

  const startGame = () => {
    setCompletedOrders(0);
    setPenaltyFee(0);
    setCollisionCount(0);
    setLaneChangeCount(0);
    setTimeLeft(15);
    setPlayerLane(1);
    itemsRef.current = [];
    setItems([]);
    setEventMsg('⚠️ 高难竞速：躲避大货车与交警，目标 8 单！');
    setHitFeedback(null);
    setGameState('PLAYING');
  };

  // 15s Countdown
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

  // Main game loop - Faster speed & high obstacle density!
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let spawnTimer = 0;

    const gameLoop = () => {
      spawnTimer += 1;

      // Spawn item every ~13 frames (High density / fast action!)
      if (spawnTimer % 13 === 0) {
        const lane = Math.floor(Math.random() * 3);
        const rand = Math.random();
        let type: ItemType = 'ORDER';

        if (rand < 0.40) {
          type = 'ORDER'; // 40% Food order 📦
        } else if (rand < 0.62) {
          type = 'TRUCK'; // 22% Big truck 🚚
        } else if (rand < 0.78) {
          type = 'POLICE'; // 16% Traffic police 👮
        } else if (rand < 0.90) {
          type = 'RIDER'; // 12% Enemy rider 🛵
        } else {
          type = 'RESTAURANT'; // 10% Golden order 🏪
        }

        const newItem: RoadItem = {
          id: ++itemIdRef.current,
          lane,
          y: 0,
          type,
        };

        itemsRef.current.push(newItem);
      }

      // Move items down faster
      const currentLane = playerLaneRef.current;
      const nextItems: RoadItem[] = [];

      for (const item of itemsRef.current) {
        item.y += 3.5; // High speed downward movement!

        // Collision Check
        if (item.y >= 72 && item.y <= 92 && item.lane === currentLane) {
          if (item.type === 'ORDER') {
            setCompletedOrders((prev) => prev + 1);
            triggerFeedback('+1 单 📦');
          } else if (item.type === 'RESTAURANT') {
            setCompletedOrders((prev) => prev + 2);
            triggerFeedback('爆单店抢单 +2 单！🏪');
          } else if (item.type === 'TRUCK') {
            setCollisionCount((prev) => prev + 1);
            setPenaltyFee((prev) => prev + 200);
            setCompletedOrders((prev) => Math.max(0, prev - 5));
            triggerFeedback('🚚 惨遭大货车撞倒！医药费扣 200 元，扣 5 单！');
          } else if (item.type === 'POLICE') {
            setCollisionCount((prev) => prev + 1);
            setPenaltyFee((prev) => prev + 10);
            triggerFeedback('👮 没戴头盔！交警开罚单 10 元');
          } else if (item.type === 'RIDER') {
            setCollisionCount((prev) => prev + 1);
            setCompletedOrders((prev) => Math.max(0, prev - 1));
            triggerFeedback('🛵 敌方骑手恶意别车！扣 1 单');
          }
          continue;
        }

        if (item.y < 100) {
          nextItems.push(item);
        }
      }

      itemsRef.current = nextItems;
      setItems([...nextItems]);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  // Handle Game End
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'PLAYING') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      setGameState(completedOrders >= 8 ? 'SUCCESS' : 'FAILED');
    }
  }, [timeLeft, gameState, completedOrders]);

  const triggerFeedback = (msg: string) => {
    setEventMsg(msg);
    setHitFeedback(msg);
    setTimeout(() => setHitFeedback(null), 550);
  };

  const moveLeft = () => {
    if (gameState !== 'PLAYING') return;
    setPlayerLane((prev) => Math.max(0, prev - 1));
    setLaneChangeCount((prev) => prev + 1);
  };

  const moveRight = () => {
    if (gameState !== 'PLAYING') return;
    setPlayerLane((prev) => Math.min(2, prev + 1));
    setLaneChangeCount((prev) => prev + 1);
  };

  const getTitle = (orders: number, collisions: number, success: boolean): string => {
    if (success) {
      if (collisions === 0) return '同城竞速神速手';
      if (orders >= 10) return '爆单抢单霸主';
      return '外卖稳健王';
    } else {
      if (collisions >= 3) return '交警熟客骑手';
      if (orders <= 3) return '同城迷路专家';
      return '订单追不上选手';
    }
  };

  const handleFinish = () => {
    const success = completedOrders >= 8;
    const title = getTitle(completedOrders, collisionCount, success);
    const punctualRate = Math.min(100, Math.round((completedOrders / 8) * 100));

    onComplete({
      completedOrders,
      clickCount: laneChangeCount,
      rejectedCount: collisionCount,
      penaltyFee,
      punctualRate,
      success,
      title,
    });
  };

  const income = completedOrders * 650 - penaltyFee * 100;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 text-center select-none">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-yellow-400 font-bold bg-yellow-950/60 border border-yellow-800/40 px-2 py-0.5 rounded flex items-center space-x-1">
            <Bike className="w-3.5 h-3.5 inline mr-1" />
            同城竞速避障 (目标: 8单)
          </span>
          <span className="text-slate-300 font-bold">
            倒计时: <strong className="text-amber-400 text-sm">{timeLeft}s</strong>
          </span>
        </div>

        <div className="flex justify-around items-center bg-slate-950 rounded-xl p-2.5 border border-slate-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-500">已抢订单</div>
            <div className="text-lg font-black text-yellow-400">{completedOrders} / 8 单</div>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-500">预估月收入</div>
            <div className="text-base font-bold text-emerald-400">￥{Math.max(0, income).toLocaleString('zh-CN')}.00</div>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-500">事故与罚单</div>
            <div className="text-base font-bold text-red-400">￥{penaltyFee}.00</div>
          </div>
        </div>

        {/* Clear Rules & Legend Banner */}
        <div className="mt-2 p-1.5 bg-slate-950 border border-yellow-900/50 rounded-lg text-[10px] font-mono text-slate-300 flex justify-around flex-wrap gap-1">
          <span>📦订单+1</span>
          <span>🏪爆单+2</span>
          <span className="text-red-400 font-bold">🚚大货车(-5单/医药费200)</span>
          <span className="text-red-400">👮交警-10元</span>
          <span className="text-amber-400">🛵别车扣1单</span>
        </div>

        <p className="text-[11px] text-slate-300 mt-2 font-mono truncate">
          {eventMsg}
        </p>
      </div>

      {/* Main Game Area */}
      <div className="my-2 flex-1 flex flex-col items-center justify-center">
        {gameState === 'IDLE' && (
          <div className="space-y-3 py-4">
            <Bike className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white">送外卖 (极速避障赛)</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              15 秒同城竞速：点击下方【变道】或点击车道，躲避大货车与交警，挑战 8 单！
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={startGame}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-black text-base shadow-lg border border-yellow-300 cursor-pointer"
            >
              骑上小黄车出击 🛵
            </motion.button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full max-w-[280px] h-[250px] bg-slate-950 rounded-2xl border-2 border-slate-800 relative overflow-hidden flex flex-col justify-between p-2 shadow-2xl">
            {/* 3 Lanes */}
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-slate-800/60 pointer-events-none">
              <div></div>
              <div></div>
              <div></div>
            </div>

            {/* Falling Items */}
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  left: `${item.lane * 33.33 + 4}%`,
                  top: `${item.y}%`,
                }}
                className="absolute text-2xl transition-all duration-75 pointer-events-none z-10"
              >
                {item.type === 'ORDER' && <span>📦</span>}
                {item.type === 'RESTAURANT' && <span>🏪</span>}
                {item.type === 'TRUCK' && <span>🚚</span>}
                {item.type === 'POLICE' && <span>👮</span>}
                {item.type === 'RIDER' && <span>🛵</span>}
              </div>
            ))}

            {/* Player Scooter */}
            <div className="absolute bottom-3 left-0 right-0 h-12 pointer-events-none z-20">
              <motion.div
                animate={{ left: `${playerLane * 33.33 + 6}%` }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="absolute text-3xl text-yellow-400 drop-shadow-lg"
              >
                🛵
              </motion.div>
            </div>

            {/* Hit Popup */}
            {hitFeedback && (
              <motion.div
                initial={{ opacity: 1, y: 100 }}
                animate={{ opacity: 0, y: 60 }}
                className="absolute top-12 left-0 right-0 text-center font-black text-sm text-yellow-300 z-30 pointer-events-none drop-shadow-md"
              >
                {hitFeedback}
              </motion.div>
            )}

            {/* Tap direct lane area */}
            <div className="absolute inset-0 grid grid-cols-3 z-30">
              <div onClick={() => setPlayerLane(0)} className="cursor-pointer"></div>
              <div onClick={() => setPlayerLane(1)} className="cursor-pointer"></div>
              <div onClick={() => setPlayerLane(2)} className="cursor-pointer"></div>
            </div>
          </div>
        )}

        {gameState === 'FAILED' && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-center w-full">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-red-300">
              未达到 8 单目标！路况太复杂了...
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              抢单: {completedOrders}/8 单 | 事故: {collisionCount} 次 | 称号: <strong className="text-amber-400">{getTitle(completedOrders, collisionCount, false)}</strong>
            </p>
          </motion.div>
        )}

        {gameState === 'SUCCESS' && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-yellow-950/80 border-2 border-yellow-500 rounded-xl text-center shadow-lg w-full">
            <CheckCircle className="w-9 h-9 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-base font-black text-yellow-300">
              极速挑战打卡成功！
            </h4>
            <p className="text-xs text-yellow-100/90 mt-1">
              抢单: {completedOrders} 单 | 罚单扣款: ￥{penaltyFee} | 称号: <strong className="text-amber-300">{getTitle(completedOrders, collisionCount, true)}</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Controls & Footer */}
      <div className="space-y-2 mb-2">
        {gameState === 'PLAYING' && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-[280px] mx-auto">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={moveLeft}
              disabled={playerLane === 0}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black text-sm border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>← 往左变道</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={moveRight}
              disabled={playerLane === 2}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-black text-sm border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>往右变道 →</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {gameState === 'FAILED' && (
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重新骑车抢单</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-yellow-900/80 text-yellow-200 font-bold text-sm border border-yellow-700 cursor-pointer"
            >
              <span>查看结算报告</span>
            </motion.button>
          </div>
        )}

        {gameState === 'SUCCESS' && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleFinish}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-black text-base shadow-lg border border-yellow-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>同城结账 & 查看评估报告</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
