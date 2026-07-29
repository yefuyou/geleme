import React, { useState, useEffect } from 'react';
import type { GameStep, UserStats, JobType } from './types';
import { MobileShell } from './components/MobileShell';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { HoldChallenge } from './components/HoldChallenge';
import { JobSelect } from './components/JobSelect';
import { CutLossBranch } from './components/CutLossBranch';
import { HoeBranch } from './components/HoeBranch';
import { ScrewBranch } from './components/ScrewBranch';
import { DeliveryBranch } from './components/DeliveryBranch';
import { SettlementScreen } from './components/SettlementScreen';
import { FinalReport } from './components/FinalReport';

const STORAGE_KEY = 'geleme_completed_jobs_v3';

const INITIAL_STATS: UserStats = {
  initialPrincipal: 100000,
  currentPrincipal: 100000,
  totalLoss: 52750,
  jobChosen: null,
  completedJobs: [],

  cutLossWaitAttempts: 0,
  cutLossDurationSeconds: 0,
  cutLossFirstTry: true,

  hoeHoldDurationSeconds: 0,
  hoeRetryCount: 0,
  hoeSuccess: false,

  screwHits: 0,
  screwBossHits: 0,
  screwStockPeeks: 0,
  screwAccuracy: 0,
  screwSuccess: false,

  deliveryCompletedOrders: 0,
  deliveryClickCount: 0,
  deliveryRejectedCount: 0,
  deliveryPenaltyFee: 0,
  deliveryPunctualRate: 0,
  deliverySuccess: false,

  earnedIncome: 0,
  finalBalance: 12.8,

  primaryTitle: '散户投资者',
  titles: [],
  isAllStar: false,
};

export const App: React.FC = () => {
  const [step, setStep] = useState<GameStep>('HOME');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  // Load completed jobs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as JobType[];
        if (Array.isArray(parsed)) {
          setStats((prev) => ({
            ...prev,
            completedJobs: parsed,
            isAllStar: parsed.length >= 4,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCompletedJob = (job: JobType) => {
    setStats((prev) => {
      const nextJobs = prev.completedJobs.includes(job)
        ? prev.completedJobs
        : [...prev.completedJobs, job];
      
      const allStar = nextJobs.length >= 4;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextJobs));
      } catch (e) {
        console.error(e);
      }

      return {
        ...prev,
        completedJobs: nextJobs,
        isAllStar: allStar,
        primaryTitle: allStar ? '全能打工人' : prev.primaryTitle,
      };
    });
  };

  const addTitle = (newTitle: string) => {
    setStats((prev) => ({
      ...prev,
      primaryTitle: newTitle,
      titles: prev.titles.includes(newTitle) ? prev.titles : [...prev.titles, newTitle],
    }));
  };

  // Navigations & Handlers
  const handleStartHold = () => {
    setStep('HOLD_CHALLENGE');
  };

  const handleGiveUpToJob = () => {
    setStep('JOB_SELECT');
  };

  const handleHoldCertComplete = (finalPrincipal: number) => {
    setStats((prev) => ({
      ...prev,
      currentPrincipal: finalPrincipal,
      earnedIncome: finalPrincipal,
      finalBalance: Math.round(finalPrincipal * 0.5),
    }));
    addTitle('钻石手受害者');
    setStep('SETTLEMENT');
  };

  const handleSelectJob = (job: JobType) => {
    setStats((prev) => ({ ...prev, jobChosen: job }));
    switch (job) {
      case 'CUT_LOSS':
        setStep('JOB_CUT_LOSS');
        break;
      case 'HOE':
        setStep('JOB_HOE');
        break;
      case 'SCREW':
        setStep('JOB_SCREW');
        break;
      case 'DELIVERY':
        setStep('JOB_DELIVERY');
        break;
    }
  };

  const handleCutLossComplete = (resStats: {
    waitAttempts: number;
    durationSeconds: number;
    firstTry: boolean;
    title: string;
  }) => {
    setStats((prev) => ({
      ...prev,
      cutLossWaitAttempts: resStats.waitAttempts,
      cutLossDurationSeconds: resStats.durationSeconds,
      cutLossFirstTry: resStats.firstTry,
    }));
    addTitle(resStats.title);
    if (stats.jobChosen) saveCompletedJob(stats.jobChosen);
    setStep('SETTLEMENT');
  };

  const handleHoeComplete = (resStats: {
    holdDurationSeconds: number;
    retryCount: number;
    success: boolean;
    title: string;
  }) => {
    setStats((prev) => ({
      ...prev,
      hoeHoldDurationSeconds: resStats.holdDurationSeconds,
      hoeRetryCount: resStats.retryCount,
      hoeSuccess: resStats.success,
    }));
    addTitle(resStats.title);
    if (stats.jobChosen) saveCompletedJob(stats.jobChosen);
    setStep('SETTLEMENT');
  };

  const handleScrewComplete = (resStats: {
    screwCount: number;
    bossHits: number;
    stockPeeks: number;
    accuracy: number;
    success: boolean;
    title: string;
  }) => {
    setStats((prev) => ({
      ...prev,
      screwHits: resStats.screwCount,
      screwBossHits: resStats.bossHits,
      screwStockPeeks: resStats.stockPeeks,
      screwAccuracy: resStats.accuracy,
      screwSuccess: resStats.success,
    }));
    addTitle(resStats.title);
    if (stats.jobChosen) saveCompletedJob(stats.jobChosen);
    setStep('SETTLEMENT');
  };

  const handleDeliveryComplete = (resStats: {
    completedOrders: number;
    clickCount: number;
    rejectedCount: number;
    penaltyFee: number;
    punctualRate: number;
    success: boolean;
    title: string;
  }) => {
    setStats((prev) => ({
      ...prev,
      deliveryCompletedOrders: resStats.completedOrders,
      deliveryClickCount: resStats.clickCount,
      deliveryRejectedCount: resStats.rejectedCount,
      deliveryPenaltyFee: resStats.penaltyFee,
      deliveryPunctualRate: resStats.punctualRate,
      deliverySuccess: resStats.success,
    }));
    addTitle(resStats.title);
    if (stats.jobChosen) saveCompletedJob(stats.jobChosen);
    setStep('SETTLEMENT');
  };

  const handleGoToReport = (earnedIncome: number, finalBalance: number) => {
    setStats((prev) => ({
      ...prev,
      earnedIncome,
      finalBalance,
    }));
    setStep('REPORT');
  };

  const handleSelectAnotherJob = () => {
    setStep('JOB_SELECT');
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setStats(INITIAL_STATS);
    setStep('HOME');
  };

  return (
    <MobileShell>
      <Header />

      <main className="flex-1 flex flex-col justify-between overflow-y-auto">
        {step === 'HOME' && (
          <HomeScreen 
            onHold={handleStartHold} 
            onGiveUp={handleGiveUpToJob} 
          />
        )}

        {step === 'HOLD_CHALLENGE' && (
          <HoldChallenge 
            onGiveUp={handleGiveUpToJob} 
            onCompleteCert={handleHoldCertComplete} 
          />
        )}

        {step === 'JOB_SELECT' && (
          <JobSelect 
            completedJobs={stats.completedJobs}
            onSelectJob={handleSelectJob} 
          />
        )}

        {step === 'JOB_CUT_LOSS' && (
          <CutLossBranch 
            onComplete={handleCutLossComplete} 
          />
        )}

        {step === 'JOB_HOE' && (
          <HoeBranch 
            onComplete={handleHoeComplete} 
            onGoToScrew={() => handleSelectJob('SCREW')} 
          />
        )}

        {step === 'JOB_SCREW' && (
          <ScrewBranch 
            onComplete={handleScrewComplete} 
          />
        )}

        {step === 'JOB_DELIVERY' && (
          <DeliveryBranch 
            onComplete={handleDeliveryComplete} 
          />
        )}

        {step === 'SETTLEMENT' && (
          <SettlementScreen 
            jobChosen={stats.jobChosen}
            screwHits={stats.screwHits}
            deliveryOrders={stats.deliveryCompletedOrders}
            deliveryPenalty={stats.deliveryPenaltyFee}
            onGoToReport={handleGoToReport} 
          />
        )}

        {step === 'REPORT' && (
          <FinalReport 
            stats={stats} 
            onSelectAnotherJob={handleSelectAnotherJob}
            onRestart={handleRestart} 
          />
        )}
      </main>

      <Footer />
    </MobileShell>
  );
};

export default App;
