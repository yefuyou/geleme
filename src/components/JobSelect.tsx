import React from 'react';
import { motion } from 'framer-motion';
import type { JobType, JobCardInfo } from '../types';
import { Scissors, Shovel, Wrench, Bike, ArrowRight } from 'lucide-react';

interface JobSelectProps {
  onSelectJob: (job: JobType) => void;
}

const JOBS: JobCardInfo[] = [
  {
    id: 'CUT_LOSS',
    title: '1. 立即割肉',
    badge: '市场流动性天使',
    description: '精准抄底卖在最低点，为主力资金提供高尚流动性。',
    iconName: 'Scissors',
    tagline: '长痛不如短痛，一刀切平所有烦恼',
    difficulty: '难度: ⭐'
  },
  {
    id: 'HOE',
    title: '2. 拿锄头',
    badge: '实体农业回归',
    description: '股票拿不住，锄头总拿得住吧？长按 3 秒考验握持定力。',
    iconName: 'Shovel',
    tagline: '收益预估：今日两筐热乎土豆',
    difficulty: '难度: ⭐⭐'
  },
  {
    id: 'SCREW',
    title: '3. 进厂拧螺丝',
    badge: '流水线霸主',
    description: '10秒内狂点30次螺丝！用实业汗水抵扣股票亏损。',
    iconName: 'Wrench',
    tagline: '日薪 86 元，回本工期 100 天',
    difficulty: '难度: ⭐⭐⭐'
  },
  {
    id: 'DELIVERY',
    title: '4. 送外卖',
    badge: '同城竞速之王',
    description: '28分钟挑战6单！电梯故障爬28楼，外卖箱比手更稳。',
    iconName: 'Bike',
    tagline: '风里雨里，外卖箱拿得挺稳',
    difficulty: '难度: ⭐⭐⭐⭐'
  }
];

export const JobSelect: React.FC<JobSelectProps> = ({ onSelectJob }) => {
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
            请重新规划职业路径
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            股市跌跌不休，下方四条平稳赛道总有一条适合你：
          </p>
        </div>

        <div className="space-y-3">
          {JOBS.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectJob(job.id)}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-md flex items-center justify-between cursor-pointer group transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(job.id)}
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {job.title}
                    </h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      {job.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {job.description}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-mono">
                    <span>{job.tagline}</span>
                    <span className="text-amber-500">{job.difficulty}</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-500">
          💡 提示：按顺顺序挑战各项能力，可解锁【全能打工人】勋章！
        </p>
      </div>
    </motion.div>
  );
};
