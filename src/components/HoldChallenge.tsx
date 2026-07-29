import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gem, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface HoldChallengeProps {
  onGiveUp: () => void;
  onCompleteCert: (finalPrincipal: number, diamondScore: number) => void;
}

const DROPS = [
  { rate: '-2.71%', text: '我还能拿', price: '￥97,290' },
  { rate: '-8.43%', text: '这才哪到哪', price: '￥91,570' },
  { rate: '-19.98%', text: '不卖就不算亏', price: '￥80,020' },
  { rate: '-35.60%', text: '主力在洗盘', price: '￥64,400' },
  { rate: '-52.75%', text: '最后一跌 (即将归零)', price: '￥47,250' },
];

export const HoldChallenge: React.FC<HoldChallengeProps> = ({ onGiveUp, onCompleteCert }) => {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= DROPS.length - 1) {
          clearInterval(timer);
          setIsFinished(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const currentDrop = DROPS[stepIdx];

  return (
    <div className="flex-1 flex flex-col justify-between p-5 text-center animate-vibrate">
      {!isFinished ? (
        <motion.div 
          key={stepIdx}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between"
        >
          {/* Main Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-mono">
              <span>代码: 600XXX (虚构重仓)</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                自由落体中 📉
              </span>
            </div>

            <div className="py-5 bg-slate-950/90 rounded-xl border border-emerald-950/50 my-2">
              <div className="text-xs text-slate-400 mb-1">今日浮动跌幅</div>
              <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight animate-pulse">
                {currentDrop.rate}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                预估剩余资产: <span className="text-slate-200 font-bold">{currentDrop.price}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-left flex items-start space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">
                <strong className="text-red-400">系统提示：</strong>
                屏幕正在剧烈震动，主力挂单撤退，散户热情接盘... 倒计时 5 秒！
              </p>
            </div>
          </div>

          <div className="my-4">
            <h3 className="text-lg font-black text-white mb-1">
              硬撑持仓挑战 ({stepIdx + 1}/5 秒)
            </h3>
            <p className="text-xs text-slate-400">
              心跳加速，手汗打湿了手机屏幕...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-2">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-base shadow-lg shadow-red-900/40 border border-red-400/30 flex items-center justify-center space-x-2 select-none"
            >
              <Gem className="w-5 h-5 text-amber-300 animate-spin" />
              <span>{currentDrop.text}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onGiveUp}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm border border-slate-700 cursor-pointer"
            >
              <span>我拿不住了 (选职业) 🏳️</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Diamond Hand Cert Success */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 text-amber-300">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-mono font-bold bg-amber-900/60 text-amber-300 border border-amber-700/50 px-3 py-0.5 rounded-full">
              ★ 割了么·钻石手荣誉勋章 ★
            </span>

            <h3 className="text-xl font-black text-white mt-3 mb-2">
              获得称号：钻石手受害者
            </h3>

            <div className="p-4 bg-slate-950/90 border border-amber-900/50 rounded-xl my-2 text-left">
              <blockquote className="text-sm font-medium text-amber-200 leading-relaxed italic">
                “本人于今日成功拿住了一只连主力都不要的股票。”
              </blockquote>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>认证编号: DS-888888</span>
                <span className="text-emerald-400 font-bold">损失: -52.75%</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              恭喜你！你的心智坚如磐石，本金成功腰斩。
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
          </div>
        </motion.div>
      )}
    </div>
  );
};
