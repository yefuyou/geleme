import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import type { UserStats } from '../types';
import { Download, RefreshCw, Sparkles, CheckCircle2, Copy } from 'lucide-react';

interface FinalReportProps {
  stats: UserStats;
  onRestart: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ stats, onRestart }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Fire confetti on report launch!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleDownloadScreenshot = async () => {
    if (!reportRef.current) return;
    try {
      setIsSaving(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        onclone: (clonedDoc) => {
          // Replace any unsupported CSS v4 oklch color functions with standard hex/rgb fallbacks
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            if (tag.innerHTML.includes('oklch')) {
              tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#94a3b8');
            }
          });
        }
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `割了么职业评估报告-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Save screenshot error:', err);
      alert('截图保存失败，您可以直接使用手机自带截图功能哦！');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-between p-4"
    >
      {/* CAPTURABLE REPORT CARD */}
      <div 
        ref={reportRef}
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-red-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Badge */}
        <div className="flex justify-between items-start mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              割
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-white leading-tight">割了么 · 职业评估报告</h2>
              <span className="text-[10px] text-slate-400 font-mono">档案号: GLM-2026-CHAMPION</span>
            </div>
          </div>
          <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono font-bold">
            官方权威鉴定
          </span>
        </div>

        {/* Dynamic Main Title Badge */}
        <div className="my-3 py-3 px-4 bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-800/60 rounded-xl text-center shadow-inner">
          <div className="text-[10px] text-slate-400 mb-1 font-mono">经综合评定，您荣获尊贵称号：</div>
          <div className="text-2xl font-black text-amber-300 tracking-tight flex items-center justify-center space-x-1.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{stats.primaryTitle || '钻石手受害者'}</span>
          </div>
        </div>

        {/* Evaluation Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3 text-left">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">股票承受能力</div>
            <div className="text-sm font-bold text-red-400 font-mono mt-0.5">
              {stats.diamondHandScore > 50 ? '钻石级 (死握)' : '玻璃心 (一跌就哭)'}
            </div>
          </div>
          
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">锄头握持能力</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
              {stats.hoeSuccess ? '稳定 (获2筐土豆)' : '松塌 (建议做螺丝)'}
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">螺丝完成率</div>
            <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
              {stats.screwCount >= 30 ? '100% (达标)' : `${Math.round((stats.screwCount/30)*100)}% (未达标)`}
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 font-mono">外卖准时率</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {stats.deliveryCompleted ? '83.3% (爬28楼)' : '未挑战'}
            </div>
          </div>
        </div>

        {/* Financial Loss Highlight */}
        <div className="bg-slate-950 p-3 rounded-xl border border-red-950 text-left my-3 font-mono">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">本轮累计亏损金额:</span>
            <span className="text-lg font-black text-emerald-400">
              -￥{stats.totalLoss.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            (注：所有资金均为前端虚构娱乐数据，不涉及真实财产)
          </div>
        </div>

        {/* Report Commentary */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
          <div className="text-[10px] text-slate-400 font-bold mb-1">【专家诊断评语】</div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            你虽然股票拿不住、抄底抄在半山腰，但在实业打工赛道展现出了不屈不挠的自修精神！建议继续保持良好心态，多拧螺丝少看大盘。
          </p>
        </div>

        {/* Footer Stamp */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>割了么评委会 · 盖章认证</span>
          <span>纯属娱乐，不构成投资建议</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownloadScreenshot}
            disabled={isSaving}
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer border border-red-400/30"
          >
            <Download className="w-4 h-4" />
            <span>{isSaving ? '正在生成...' : '保存报告截图'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCopyLink}
            className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '已复制链接！' : '分享给群友'}</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRestart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-base shadow-lg border border-amber-400/30 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>再割一次 (重置本金 10 万)</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
