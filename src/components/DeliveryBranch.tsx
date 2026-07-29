import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Navigation, Clock, ArrowRight, MapPin, CheckCircle } from 'lucide-react';

interface DeliveryBranchProps {
  onComplete: (title: string) => void;
}

const EVENTS = [
  { id: 1, text: '🍳 商家还有 15 分钟出餐', detail: '厨师正在悠闲抽烟，你的剩余配送时间已被蚕食过半。' },
  { id: 2, text: '🏢 顾客要求送上 28 楼', detail: '订单备注：“帮带包烟上楼，顺便把垃圾带下楼”。' },
  { id: 3, text: '🛗 电梯正在维修中', detail: '物业贴出告示：28楼需步行爬梯。腿双腿发抖中...'} ,
  { id: 4, text: '🤫 顾客备注：到了不要打电话', detail: '猫眼后面有人悄悄观察你，请轻声放下外卖。' },
  { id: 5, text: '⚠️ 系统提示：预计超时 7 分钟', detail: '同城急送超时扣费 5 元，心痛程度堪比持仓跳水。' },
];

export const DeliveryBranch: React.FC<DeliveryBranchProps> = ({ onComplete }) => {
  const [currentEventIdx, setCurrentEventIdx] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const handleNextEvent = () => {
    if (currentEventIdx < EVENTS.length - 1) {
      setCurrentEventIdx(currentEventIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      {/* Map Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-2">
          <div className="flex items-center space-x-1 text-yellow-400 font-bold">
            <Bike className="w-4 h-4" />
            <span>美团/饿了么 极速派单</span>
          </div>
          <span className="bg-yellow-950/80 text-yellow-400 border border-yellow-800/60 px-2 py-0.5 rounded text-[10px]">
            超时扣费模式
          </span>
        </div>

        {/* Mock City Map Grid */}
        <div className="h-28 bg-slate-950 rounded-xl border border-slate-800 p-3 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:12px_12px]"></div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 relative z-10 font-mono">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>韭菜家园·A栋</span>
            </span>
            <span className="flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-yellow-400" />
              <span>剩余 28 分钟 / 6 单</span>
            </span>
          </div>

          {/* Animated Delivery Bike Icon */}
          <div className="relative z-10 my-auto flex items-center justify-between px-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
            <motion.div 
              animate={{ x: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-1.5 bg-yellow-500 rounded-full text-slate-950 shadow-md"
            >
              <Bike className="w-4 h-4" />
            </motion.div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono relative z-10 flex justify-between">
            <span>商家: 炒股票爆炒花甲</span>
            <span>目的: 2802室 (爬梯)</span>
          </div>
        </div>
      </div>

      {/* Main Event Stream Area */}
      <div className="my-4 flex-1 flex flex-col items-center justify-center">
        {currentEventIdx === -1 && !isFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-xl font-black text-white mb-2">
              外卖抢单成功！
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
              任务要求：请在 28 分钟内完成 6 单同城配送，中途充满未知挑战！
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNextEvent}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-black text-base shadow-lg shadow-yellow-900/30 border border-yellow-300 cursor-pointer"
            >
              🛵 开始接单配送
            </motion.button>
          </motion.div>
        )}

        {currentEventIdx >= 0 && !isFinished && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEventIdx}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="w-full bg-slate-900 border border-yellow-600/40 rounded-2xl p-4 shadow-xl text-left"
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-yellow-400 mb-2">
                <span>突发事件 ({currentEventIdx + 1} / {EVENTS.length})</span>
                <Clock className="w-3.5 h-3.5 animate-spin" />
              </div>

              <h4 className="text-base font-black text-white mb-1">
                {EVENTS[currentEventIdx].text}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {EVENTS[currentEventIdx].detail}
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNextEvent}
                className="w-full py-3 px-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>咬牙处理此单 (继续)</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

        {isFinished && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-slate-900 border-2 border-yellow-500 rounded-2xl text-center w-full shadow-2xl"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center mb-3 text-yellow-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-yellow-400 mb-2">
              配送任务全部完成！
            </h3>
            <p className="text-sm font-bold text-slate-200 mb-3 italic">
              “股票拿不住，外卖箱拿得挺稳。”
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs space-y-1 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>准时送达率:</span>
                <span className="text-emerald-400 font-bold">83.3%</span>
              </div>
              <div className="flex justify-between">
                <span>爬楼梯层数:</span>
                <span className="text-amber-400 font-bold">28 楼</span>
              </div>
              <div className="flex justify-between">
                <span>今日配送收入:</span>
                <span className="text-yellow-400 font-bold">￥42.00</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      {isFinished && (
        <div className="mb-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onComplete('外卖稳健王')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-black text-base shadow-lg border border-yellow-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>同城结账 & 查看评估报告</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
};
