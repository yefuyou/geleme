import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, AlertOctagon, RefreshCcw, ArrowRight } from 'lucide-react';
import type { JobType } from '../types';

interface SettlementScreenProps {
  jobChosen: JobType | null;
  screwHits?: number;
  deliveryOrders?: number;
  deliveryPenalty?: number;
  onGoToReport: (earnedIncome: number, finalBalance: number) => void;
}

export const SettlementScreen: React.FC<SettlementScreenProps> = ({
  jobChosen,
  screwHits = 15,
  deliveryOrders = 8,
  deliveryPenalty = 0,
  onGoToReport,
}) => {
  const [stage, setStage] = useState<'PAYOUT' | 'LIE_DETECTED'>('PAYOUT');
  const [escapePos, setEscapePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [clickAttempts, setClickAttempts] = useState<number>(0);
  const [promptNotice, setPromptNotice] = useState<string>('');

  // Calculate dynamic earned income
  const getIncome = (): number => {
    switch (jobChosen) {
      case 'CUT_LOSS':
        return 1200;
      case 'HOE':
        return 3800;
      case 'SCREW':
        return Math.min(8600, Math.max(4500, 4500 + (screwHits - 18) * 350));
      case 'DELIVERY':
        return Math.min(7200, Math.max(3200, deliveryOrders * 650 - deliveryPenalty * 100));
      default:
        return 3800;
    }
  };

  const income = getIncome();
  // 50% Drop Math: income * 0.5 (e.g. 5800 -> 2900)
  const finalBalance = Math.round(income * 0.5);

  const handleAllIn = () => {
    onGoToReport(income, finalBalance);
  };

  const handleBankClick = () => {
    if (clickAttempts === 0) {
      setClickAttempts(1);
      setEscapePos({ x: 0, y: 8 });
      setPromptNotice('⚠️ 系统警示：请再认真考虑一下你的真实散户人格。');
    } else {
      setStage('LIE_DETECTED');
    }
  };

  const getJobDesc = () => {
    switch (jobChosen) {
      case 'CUT_LOSS':
        return '市场流动性贡献补贴收入';
      case 'HOE':
        return '有机土豆批发出售所得';
      case 'SCREW':
        return '流水线月度基础+绩效工资';
      case 'DELIVERY':
        return '同城急送月度劳务所得';
      default:
        return '打工积累所得';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center select-none">
      <AnimatePresence mode="wait">
        {stage === 'PAYOUT' && (
          <motion.div 
            key="payout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center mb-3 text-emerald-400">
                <span className="text-2xl font-black">￥</span>
              </div>

              <span className="text-[11px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 px-3 py-0.5 rounded-full">
                打工薪酬核算中心
              </span>

              <h3 className="text-xl font-black text-white mt-3 mb-1">
                经过辛苦劳动，你重新拥有了数千元本金！
              </h3>

              <div className="py-4 my-3 bg-slate-950/90 rounded-xl border border-emerald-950/50">
                <div className="text-xs text-slate-400 mb-1">{getJobDesc()}</div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  ￥{income.toLocaleString('zh-CN')}.00
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-xl text-xs text-slate-300">
                <strong className="text-amber-400 block mb-1">关键抉择时刻：</strong>
                手握刚刚挣来的血汗钱 ￥{income.toLocaleString('zh-CN')}，炒股软件图标又在向你眨眼...
              </div>
            </div>

            <div className="my-3">
              <h4 className="text-lg font-black text-white mb-1">
                是否把劳动所得全部买入？
              </h4>
              {promptNotice && (
                <p className="text-xs text-amber-400 font-mono animate-bounce mt-1">
                  {promptNotice}
                </p>
              )}
            </div>

            {/* Action Choice Buttons */}
            <div className="space-y-3 mb-2 relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAllIn}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Flame className="w-5 h-5 text-amber-300" />
                <span>全部抄底 (梭哈) 🔥</span>
              </motion.button>

              <motion.button
                animate={{ y: escapePos.y }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                onClick={handleBankClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>我已经成熟了 (存银行)</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {stage === 'LIE_DETECTED' && (
          <motion.div 
            key="lie"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between p-4 text-center"
          >
            <div className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-950 border-4 border-red-500 flex items-center justify-center mb-3 text-red-500 shadow-2xl animate-bounce">
                <AlertOctagon className="w-12 h-12" />
              </div>

              <h3 className="text-2xl font-black text-red-500 tracking-tight mb-2">
                🚨 警告：系统检测到您正在撒谎！
              </h3>

              <div className="p-4 bg-slate-950 border border-red-900/60 rounded-xl my-3 text-left space-y-2">
                <blockquote className="text-xs text-amber-300 font-mono italic leading-relaxed">
                  “真正的散户，账户里留不下一分闲钱。你说存银行，全网韭菜都不信。”
                </blockquote>
                <div className="text-xs text-slate-300 leading-relaxed font-mono pt-2 border-t border-slate-800">
                  系统已强行将打工收入 <strong>￥{income.toLocaleString('zh-CN')}</strong> 全额挂单抄底！
                </div>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs font-mono text-red-400 font-bold animate-pulse">
                💥 抄底后开盘直接 -50.00% 腰斩！剩余本金：￥{finalBalance.toLocaleString('zh-CN')}.00
              </div>
            </div>

            <div className="my-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAllIn}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>认罚抄底 & 查看最终评估报告</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
