import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Gem, Award, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface HoldChallengeProps {
  onGiveUp: () => void;
  onCompleteCert: (finalPrincipal: number, diamondScore: number) => void;
}

export const HoldChallenge: React.FC<HoldChallengeProps> = ({ onGiveUp, onCompleteCert }) => {
  const [stage, setStage] = useState<'DROP_1' | 'DROP_2' | 'CERT'>('DROP_1');
  const [isVibrating, setIsVibrating] = useState<boolean>(true);

  const handleHoldStage1 = () => {
    setIsVibrating(true);
    setStage('DROP_2');
    setTimeout(() => setIsVibrating(false), 800);
  };

  const handleHoldStage2 = () => {
    setStage('CERT');
  };

  return (
    <div className={`flex-1 flex flex-col justify-between p-5 text-center transition-all ${isVibrating ? 'animate-vibrate' : ''}`}>
      <AnimatePresence mode="wait">
        {/* STAGE 1: -2.71% -> -8.43% Drop */}
        {stage === 'DROP_1' && (
          <motion.div
            key="drop1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-mono">
                <span>代码: 600XXX (虚构深坑)</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  跳水竞速中 📉
                </span>
              </div>

              {/* Dynamic Drop Display */}
              <div className="py-4 my-2 bg-slate-950/90 rounded-xl border border-emerald-950/50">
                <div className="text-xs text-slate-400 mb-1">今日浮动收益 rate</div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight animate-pulse">
                  -8.43%
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-1 font-mono">
                  (前10分钟: -2.71% ⚡ 急速跳水)
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-left flex items-start space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  <strong className="text-red-400">主力资金提示：</strong>
                  主力挂单撤退，散户正在热情接盘。页面轻微震动代表你内心的焦虑抖动。
                </p>
              </div>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-black text-white mb-2">
                现在还拿得住吗？
              </h3>
              <p className="text-xs text-slate-400">
                你的手汗已经把手机屏幕打湿了...
              </p>
            </div>

            <div className="space-y-3 mb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleHoldStage1}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>这才哪到哪？(硬撑)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onGiveUp}
                className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm border border-slate-700 cursor-pointer"
              >
                <span>有一点点拿不住了...</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: 100,000 -> 47,250 Drop */}
        {stage === 'DROP_2' && (
          <motion.div
            key="drop2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-center items-center space-x-1.5 text-amber-400 text-xs font-bold mb-3">
                <Gem className="w-4 h-4" />
                <span>高能警告：本金正在剧烈蒸发</span>
              </div>

              {/* Principal Collapse */}
              <div className="py-5 bg-slate-950/90 rounded-xl border border-emerald-900/80 my-2">
                <div className="text-xs text-slate-400 mb-1">账户本金残余</div>
                <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                  ￥47,250
                </div>
                <div className="text-[11px] text-emerald-500 mt-1 font-mono">
                  初始本金: ￥100,000 | 累计亏损: -52.75%
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-center">
                <p className="text-sm font-bold text-amber-300">
                  💎 你的手正在钻石化 💎
                </p>
                <p className="text-xs text-amber-200/80 mt-1">
                  “只要我不卖，主力就休想割到我分毫！”
                </p>
              </div>
            </div>

            <div className="my-6">
              <h3 className="text-xl font-black text-white mb-2">
                主力都跑光了，你还在守守守？
              </h3>
              <p className="text-xs text-slate-400 px-2">
                再坚持最后一秒，即可领取全网认证的【钻石手终极荣耀】！
              </p>
            </div>

            <div className="space-y-3 mb-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleHoldStage2}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base shadow-lg shadow-amber-900/40 border border-amber-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-200" />
                <span>誓死拿住！生成钻石手认证</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onGiveUp}
                className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm border border-slate-700 cursor-pointer"
              >
                <span>算了我认输，带我去进厂</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: Diamond Hand Certification */}
        {stage === 'CERT' && (
          <motion.div
            key="cert"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-15">
                <Gem className="w-32 h-32 text-amber-400" />
              </div>

              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 text-amber-300">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-mono font-bold bg-amber-900/60 text-amber-300 border border-amber-700/50 px-3 py-0.5 rounded-full">
                ★ 割了么·钻石手荣誉勋章 ★
              </span>

              <h3 className="text-xl font-black text-white mt-3 mb-3">
                钻石手认证成功
              </h3>

              <div className="p-4 bg-slate-950/90 border border-amber-900/50 rounded-xl my-2 text-left">
                <blockquote className="text-sm font-medium text-amber-200 leading-relaxed italic">
                  “本人于今日成功拿住了一只连主力都不要的股票。”
                </blockquote>
                <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                  <span>认证编号: DS-888888</span>
                  <span className="text-amber-400 font-bold">损失: -52.75%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                恭喜！你的心智已被锤炼得坚如磐石（钱也没了）。
              </p>
            </div>

            <div className="space-y-3 my-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onCompleteCert(47250, 99)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>前往统一结算 & 领取报告</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onGiveUp}
                className="w-full py-3 px-6 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>换个赛道：看看打工选项</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
