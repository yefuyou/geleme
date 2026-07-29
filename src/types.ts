export type GameStep = 
  | 'HOME'
  | 'HOLD_1'
  | 'HOLD_2'
  | 'HOLD_CERT'
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
  holdAttempts: number;
  diamondHandScore: number;
  hoeSuccess: boolean;
  hoeDuration: number;
  screwCount: number;
  screwSuccess: boolean;
  deliveryCompleted: boolean;
  deliveryEventsTriggered: number;
  cutLossTriggered: boolean;
  jobChosen: JobType | null;
  titles: string[];
  primaryTitle: string;
}

export interface JobCardInfo {
  id: JobType;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  tagline: string;
  difficulty: string;
}
