import React, { useState } from 'react';
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

const INITIAL_STATS: UserStats = {
  initialPrincipal: 100000,
  currentPrincipal: 100000,
  totalLoss: 52750,
  holdAttempts: 0,
  diamondHandScore: 0,
  hoeSuccess: false,
  hoeDuration: 0,
  screwCount: 0,
  screwSuccess: false,
  deliveryCompleted: false,
  deliveryEventsTriggered: 0,
  cutLossTriggered: false,
  jobChosen: null,
  titles: [],
  primaryTitle: '钻石手受害者',
};

export const App: React.FC = () => {
  const [step, setStep] = useState<GameStep>('HOME');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  const addTitle = (newTitle: string) => {
    setStats((prev) => ({
      ...prev,
      primaryTitle: newTitle,
      titles: Array.from(newSet(prev.titles, newTitle)),
    }));
  };

  const newSet = (arr: string[], val: string) => {
    return arr.includes(val) ? arr : [...arr, val];
  };

  // Navigations
  const handleStartHold = () => {
    setStep('HOLD_1');
    setStats((prev) => ({ ...prev, holdAttempts: prev.holdAttempts + 1, diamondHandScore: 80 }));
  };

  const handleGiveUpToJob = () => {
    setStep('JOB_SELECT');
  };

  const handleHoldCertComplete = (finalPrincipal: number, diamondScore: number) => {
    setStats((prev) => ({
      ...prev,
      currentPrincipal: finalPrincipal,
      diamondHandScore: diamondScore,
      primaryTitle: '钻石手受害者',
    }));
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

  const handleCutLossComplete = (title: string) => {
    addTitle(title);
    setStats((prev) => ({ ...prev, cutLossTriggered: true }));
    setStep('SETTLEMENT');
  };

  const handleHoeComplete = (success: boolean, title: string) => {
    setStats((prev) => ({ ...prev, hoeSuccess: success }));
    if (success) addTitle(title);
    setStep('SETTLEMENT');
  };

  const handleScrewComplete = (screwCount: number, success: boolean, title: string) => {
    setStats((prev) => ({ ...prev, screwCount, screwSuccess: success }));
    if (success) addTitle(title);
    setStep('SETTLEMENT');
  };

  const handleDeliveryComplete = (title: string) => {
    setStats((prev) => ({ ...prev, deliveryCompleted: true }));
    addTitle(title);
    setStep('SETTLEMENT');
  };

  const handleGoToReport = (finalLoss: number) => {
    setStats((prev) => ({
      ...prev,
      totalLoss: finalLoss,
      currentPrincipal: 12.8,
    }));
    setStep('REPORT');
  };

  const handleRestart = () => {
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

        {(step === 'HOLD_1' || step === 'HOLD_2' || step === 'HOLD_CERT') && (
          <HoldChallenge 
            onGiveUp={handleGiveUpToJob} 
            onCompleteCert={handleHoldCertComplete} 
          />
        )}

        {step === 'JOB_SELECT' && (
          <JobSelect 
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
            onGoToReport={handleGoToReport} 
          />
        )}

        {step === 'REPORT' && (
          <FinalReport 
            stats={stats} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      <Footer />
    </MobileShell>
  );
};

export default App;
