export type GameStep = 
  | 'HOME'
  | 'HOLD_CHALLENGE'
  | 'JOB_SELECT'
  | 'JOB_CUT_LOSS'
  | 'JOB_HOE'
  | 'JOB_SCREW'
  | 'JOB_DELIVERY'
  | 'SETTLEMENT'
  | 'REPORT';

export type JobType = 'CUT_LOSS' | 'HOE' | 'SCREW' | 'DELIVERY';

export interface UserStats {
  initialPrincipal: number;
  currentPrincipal: number;
  totalLoss: number;
  jobChosen: JobType | null;
  completedJobs: JobType[];

  // Cut Loss Stats
  cutLossWaitAttempts: number;
  cutLossDurationSeconds: number;
  cutLossFirstTry: boolean;

  // Hoe Stats
  hoeHoldDurationSeconds: number;
  hoeRetryCount: number;
  hoeSuccess: boolean;

  // Screw Stats
  screwHits: number;
  screwBossHits: number;
  screwStockPeeks: number;
  screwAccuracy: number;
  screwSuccess: boolean;

  // Delivery Stats
  deliveryCompletedOrders: number;
  deliveryClickCount: number;
  deliveryRejectedCount: number;
  deliveryPenaltyFee: number;
  deliveryPunctualRate: number;
  deliverySuccess: boolean;

  // Settlement Stats
  earnedIncome: number;
  finalBalance: number;

  // Titles
  primaryTitle: string;
  titles: string[];
  isAllStar: boolean;
}

export interface JobCardInfo {
  id: JobType;
  title: string;
  badge: string;
  description: string;
  tagline: string;
}
