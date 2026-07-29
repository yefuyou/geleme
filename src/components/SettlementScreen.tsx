import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Flame, AlertOctagon } from 'lucide-react';

interface SettlementScreenProps {
  onGoToReport: (finalLoss: number) => void;
}

export const SettlementScreen: React.FC<SettlementScreenProps> = ({ onGoToReport }) => {
  const [stage, setStage] = useState<'PAYOUT' | 'LIE_DETECTED' | 'ALL_IN_PLUNGE'>('PAYOUT');

  const handleAllIn = () => {
    executePlunge();
  };

  const handleMatureLie = () => {
    setStage('LIE_DETECTED');
    setTimeout(() => {
      executePlunge();
    }, 1800);
  };

  const executePlunge = () => {
    setStage('ALL_IN_PLUNGE');
    setTimeout(() => {
      onGoToReport(61350);
    }, 2800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center">
      <AnimatePresence mode="wait">
        {stage === 'PAYOUT' && (
          <motion.div
            key="payout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Salary Payout Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center mb-3 text-emerald-400">
                <DollarSign className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 px-3 py-0.5 rounded-full">
                月度打工劳动所得
              </span>

              <div className="my-4 py-4 bg-slate-950 rounded-xl border border-emerald-900/50">
                <div className="text-xs text-slate-400 mb-1">本月到账工资总额</div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  ￥3,842.00
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  (耕地土豆折算 + 螺丝工时 + 外卖配送费)
                </div>
              </div>

              <p className="text-xs text-slate-300">
                经过一个月的辛勤汗水，你的口袋里终于重新有了流动资金！
              </p>
            </div>

            {/* Central Temptation Question */}
            <div className="my-6">
              <div className="inline-flex items-center space-x-1 text-red-400 text-xs font-bold mb-2">
                <Flame className="w-4 h-4" />
                <span>散户基因大考研</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                是否全部买入？
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                隔壁【韭菜精选股】今日放量回调，主力正在热切呼唤你！
              </p>
            </div>

            {/* Choice Buttons */}
            <div className="space-y-3 mb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAllIn}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Flame className="w-5 h-5 text-amber-300" />
                <span>梭哈！抄底大阳线 🚀</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleMatureLie}
                className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>我已经成熟了 (存银行) 🛡️</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* LIE DETECTED POPUP */}
        {stage === 'LIE_DETECTED' && (
          <motion.div
            key="lie"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="p-6 bg-red-950/90 border-2 border-red-500 rounded-2xl shadow-2xl text-center w-full max-w-xs animate-vibrate">
              <AlertOctagon className="w-14 h-14 text-red-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-xl font-black text-white mb-2">
                系统检测到您正在撒谎！
              </h3>
              <p className="text-xs text-red-200 leading-relaxed font-mono">
                基因测试显示：你的散户血液中 99.8% 充满了梭哈因子。
                <br />
                正在强制帮您全部买入...
              </p>
            </div>
          </motion.div>
        )}

        {/* ALL-IN MARKET PLUNGE ANIMATION */}
        {stage === 'ALL_IN_PLUNGE' && (
          <motion.div
            key="plunge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-slate-900 border-2 border-emerald-600 rounded-2xl p-5 shadow-2xl animate-flash-green">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
                <span>代码: 600韭菜</span>
                <span className="text-emerald-400 font-bold">天地板跌停中 📉</span>
              </div>

              <div className="py-6 my-2 bg-slate-950 rounded-xl border border-emerald-900">
                <div className="text-xs text-slate-400 mb-1">梭哈后最新总本金</div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight animate-bounce">
                  ￥12.80
                </div>
                <div className="text-xs text-emerald-500 mt-2 font-bold font-mono">
                  本轮亏损率: -99.98% 💀
                </div>
              </div>

              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-left text-xs text-slate-300 font-mono">
                <p>
                  <strong className="text-red-400">成交反馈：</strong>
                  买入 3842 元瞬间遇到主力巨量封跌停板！
                </p>
              </div>
            </div>

            <div className="my-6">
              <h3 className="text-lg font-black text-white mb-1">
                熟悉的配方，熟悉的味...
              </h3>
              <p className="text-xs text-slate-400">
                正在为您生成【割了么职业评估报告】...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
