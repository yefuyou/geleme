import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import type { UserStats } from '../types';
import { Award, Download, RefreshCw, Sparkles, Share2, ArrowRight } from 'lucide-react';

interface FinalReportProps {
  stats: UserStats;
  onSelectAnotherJob: () => void;
  onRestart: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ stats, onSelectAnotherJob, onRestart }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  }, []);

  const handleSaveImage = async () => {
    if (!reportRef.current) return;
    setIsSaving(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `割了么_再就业评估报告_${Date.now()}.png`;
      link.click();
      setSaveSuccessMsg('✅ 已成功保存报告截图！');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Commentary (判词) per job / scenario
  const getCommentary = (): string => {
    if (stats.isAllStar) {
      return '你已经证明，无论在哪个行业，都能稳定地把工资送回股市。';
    }

    switch (stats.jobChosen) {
      case 'SCREW':
        return `你能在十秒内拧紧 ${stats.screwHits} 颗螺丝，却无法锁住自己抄底的手。`;
      case 'DELIVERY':
        return '你追上了所有订单，却依然没有追上涨停板。';
      case 'HOE':
        return '你握得住地里的锄头，却握不住盘里的红柱。';
      case 'CUT_LOSS':
        return '你精准为主力提供了流动性，也为韭菜社区奉献了笑料。';
      default:
        return '只要你不卖，主力就休想割到你分毫（因为本金没了）。';
    }
  };

  const getJobName = (): string => {
    if (stats.isAllStar) return '全能打工人';
    switch (stats.jobChosen) {
      case 'SCREW': return '流水线螺丝工';
      case 'DELIVERY': return '同城配送员';
      case 'HOE': return '耕地农业员';
      case 'CUT_LOSS': return '流动性提供者';
      default: return '钻石手受害者';
    }
  };

  const getShareText = (): string => {
    return `我刚才在「割了么」完成了【${getJobName()}】挑战，获得称号【${stats.primaryTitle}】，劳动所得 ${stats.earnedIncome.toLocaleString('zh-CN')} 元秒被抄底扣光！敢不敢来试试？`;
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(getShareText());
    setSaveSuccessMsg('📋 群聊文案已复制，快去发群聊吧！');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-between p-4 text-center"
    >
      {/* Printable Report Card */}
      <div 
        ref={reportRef}
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-left"
      >
        <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded-full">
              ★ 割了么 · 官方评估 ★
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              再就业能力评估报告
            </h2>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-500">
            <div>NO: GLM-{Math.floor(100000 + Math.random() * 900000)}</div>
            <div>{new Date().toLocaleDateString('zh-CN')}</div>
          </div>
        </div>

        {/* Primary Badge Section */}
        <div className="my-3 p-3.5 bg-slate-950 rounded-xl border border-amber-900/40 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">本轮职业: {getJobName()}</div>
            <div className="text-lg font-black text-amber-300 tracking-tight">
              {stats.primaryTitle}
            </div>
          </div>
        </div>

        {/* Real Stats Breakdown */}
        <div className="my-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs text-slate-300">
          {stats.jobChosen === 'SCREW' && (
            <>
              <div className="flex justify-between"><span>命中螺丝:</span><span className="text-blue-400 font-bold">{stats.screwHits} 颗</span></div>
              <div className="flex justify-between"><span>误伤老板:</span><span className="text-red-400 font-bold">{stats.screwBossHits} 次</span></div>
              <div className="flex justify-between"><span>偷看涨停:</span><span className="text-amber-400 font-bold">{stats.screwStockPeeks} 次</span></div>
            </>
          )}

          {stats.jobChosen === 'DELIVERY' && (
            <>
              <div className="flex justify-between"><span>完成订单:</span><span className="text-yellow-400 font-bold">{stats.deliveryCompletedOrders} / 6 单</span></div>
              <div className="flex justify-between"><span>客户反悔:</span><span className="text-red-400 font-bold">{stats.deliveryRejectedCount} 次</span></div>
              <div className="flex justify-between"><span>超时扣款:</span><span className="text-amber-400 font-bold">￥{stats.deliveryPenaltyFee}.00</span></div>
            </>
          )}

          {stats.jobChosen === 'HOE' && (
            <>
              <div className="flex justify-between"><span>握持定力:</span><span className="text-amber-400 font-bold">{stats.hoeHoldDurationSeconds.toFixed(1)}s (满分3s)</span></div>
              <div className="flex justify-between"><span>松手重试:</span><span className="text-slate-400 font-bold">{stats.hoeRetryCount} 次</span></div>
              <div className="flex justify-between"><span>获得奖励:</span><span className="text-amber-300 font-bold">两筐热乎土豆 🥔</span></div>
            </>
          )}

          {stats.jobChosen === 'CUT_LOSS' && (
            <>
              <div className="flex justify-between"><span>观望犹豫:</span><span className="text-amber-400 font-bold">{stats.cutLossWaitAttempts} 次</span></div>
              <div className="flex justify-between"><span>割肉耗时:</span><span className="text-slate-300 font-bold">{stats.cutLossDurationSeconds} 秒</span></div>
              <div className="flex justify-between"><span>拉升反转:</span><span className="text-red-400 font-bold">+19.98% 🚀</span></div>
            </>
          )}

          {!stats.jobChosen && (
            <>
              <div className="flex justify-between"><span>持仓坚持:</span><span className="text-amber-400 font-bold">5.0 秒</span></div>
              <div className="flex justify-between"><span>浮动跌幅:</span><span className="text-emerald-400 font-bold">-52.75%</span></div>
            </>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
            <span>劳动所得收入:</span>
            <span className="text-emerald-400 font-bold">￥{stats.earnedIncome.toLocaleString('zh-CN')}.00</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>强制抄底后余额:</span>
            <span className="text-red-400 font-bold">￥{stats.finalBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Dynamic Commentary (判词) */}
        <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl my-2">
          <div className="text-[10px] text-amber-400 font-bold font-mono mb-1">【终极判词】</div>
          <p className="text-xs text-amber-200 leading-relaxed italic">
            “{getCommentary()}”
          </p>
        </div>

        <div className="mt-3 text-center text-[10px] text-slate-500 font-mono">
          纯属娱乐，不构成投资建议 · 割了么 App 宣
        </div>
      </div>

      {saveSuccessMsg && (
        <p className="text-xs text-emerald-400 font-mono my-1 font-bold animate-fade-in">
          {saveSuccessMsg}
        </p>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mt-3">
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSaveImage}
            disabled={isSaving}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isSaving ? '生成中...' : '保存报告卡片'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyShare}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>复制群聊文案</span>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSelectAnotherJob}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-sm shadow-md border border-amber-400/30 flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>再换个职业 (保留成就)</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="w-full py-3 px-6 rounded-2xl bg-slate-900 text-slate-400 font-semibold text-xs border border-slate-800 flex items-center justify-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重新开始 (重置所有)</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
