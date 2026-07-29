import React from 'react';
import { motion } from 'framer-motion';
import type { JobType, JobCardInfo } from '../types';
import { Scissors, Shovel, Wrench, Bike, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JobSelectProps {
  completedJobs: JobType[];
  onSelectJob: (job: JobType) => void;
}

const JOBS: JobCardInfo[] = [
  {
    id: 'CUT_LOSS',
    title: '1. 立即割肉',
    badge: '流动性天使',
    description: '精准卖在最低点，为主力资金提供充沛流动性。',
    tagline: '长痛不如短痛，一刀切平烦恼',
  },
  {
    id: 'HOE',
    title: '2. 回家拿锄头',
    badge: '实体农业',
    description: '股票拿不住，锄头总得试试。考验握持定力。',
    tagline: '收益预估：两筐热乎土豆 🥔',
  },
  {
    id: 'SCREW',
    title: '3. 进厂拧螺丝',
    badge: '流水线打地鼠',
    description: '在流水线上打地鼠拧螺丝，用汗水抵扣炒股损失。',
    tagline: '注意避开老板与偷看涨停板 👨‍💼',
  },
  {
    id: 'DELIVERY',
    title: '4. 送外卖',
    badge: '同城竞速避障',
    description: '追不上上涨的股票，那就追同城外卖订单。',
    tagline: '躲避大货车与交警，疯狂抢单 🛵',
  }
];

export const JobSelect: React.FC<JobSelectProps> = ({ completedJobs, onSelectJob }) => {
  const getIcon = (id: JobType) => {
    switch (id) {
      case 'CUT_LOSS': return <Scissors className="w-6 h-6 text-red-400" />;
      case 'HOE': return <Shovel className="w-6 h-6 text-amber-400" />;
      case 'SCREW': return <Wrench className="w-6 h-6 text-blue-400" />;
      case 'DELIVERY': return <Bike className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col justify-between p-4"
    >
      <div>
        <div className="text-center mb-4">
          <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
            ⚠️ 仓位告急 · 转向实业救援
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            请选择一份稳定职业
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            一轮体验一个职业，生成专属评估报告
          </p>
        </div>

        <div className="space-y-3">
          {JOBS.map((job, idx) => {
            const isDone = completedJobs.includes(job.id);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectJob(job.id)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-md flex items-center justify-between cursor-pointer group transition-all relative overflow-hidden"
              >
                <div className="flex items-start space-x-3 w-full pr-6">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(job.id)}
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {job.title}
                      </h3>
                      {isDone ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>已就业</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                          {job.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {job.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-slate-500">
                      💡 {job.tagline}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-500">
          💡 完成所有 4 个职业可解锁隐藏称号【全能打工人】！
        </p>
      </div>
    </motion.div>
  );
};
