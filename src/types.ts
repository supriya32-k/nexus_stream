export type WorkspaceTab =
  | 'diagnostic'
  | 'squad'
  | 'evaluator'
  | 'analytics'
  | 'brief';

export type ChannelSource =
  | 'CR WhatsApp Group'
  | 'Coding Club Sprint'
  | 'Peer Squad Referral'
  | 'Placement Cell Notice'
  | 'LinkedIn Direct';

export interface BlueprintTimelineStep {
  window: string;
  milestone: string;
  deliverable: string;
}

export interface VivaQuestionItem {
  question: string;
  talkingPoint: string;
}

export interface BlueprintResult {
  projectTitle: string;
  resumeGapDiagnosis: string;
  whyRecruitersCare: string;
  techStack: string[];
  timeline: BlueprintTimelineStep[];
  resumeStarBullet: string;
  interviewVivaQuestions: VivaQuestionItem[];
  generatedBy: 'gemini-live' | 'structured-engine';
}

export interface StudentRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  gradYear: string;
  targetRole: string;
  projectTrack: string;
  channel: ChannelSource;
  referredByCode: string | null;
  ownReferralCode: string;
  referralClicks: number;
  referralsConverted: number;
  squadStatus:
    | 'Seat Reserved (0/2)'
    | 'Starter Repo Unlocked (1/2)'
    | 'Full Squad + Evaluator Unlocked (2/2)';
  cohortType: 'Simulated Baseline' | 'Live Demo Signup';
  registeredAt: string;
}

export interface AmbassadorNode {
  code: string;
  name: string;
  role: string;
  college: string;
  channel: ChannelSource;
  groupsSeeded: number;
  clicks: number;
  signups: number;
  verifiedSquads: number;
  bountyEarnedInr: number;
}

export interface RubricCriterionScore {
  criterion: string;
  score: number;
  maxScore: number;
  observation: string;
}

export interface EvaluationVivaItem {
  question: string;
  expectedAnswerSignal: string;
}

export interface EvaluationResult {
  overallScore: number;
  verdict:
    | 'Placement-Ready Pass'
    | 'Conditional Pass — Needs Hardening'
    | 'Thin Wrapper — Rebuild Required';
  executiveSummary: string;
  rubric: RubricCriterionScore[];
  wrapperCheck: {
    isThinWrapper: boolean;
    reason: string;
  };
  fifteenMinuteFixes: string[];
  vivaQuestions: EvaluationVivaItem[];
  generatedBy: 'gemini-live' | 'structured-engine';
}

export interface CampaignSummary {
  totalRegistrations: number;
  targetRegistrations: number;
  liveSessionSignups: number;
  totalClicks: number;
  budgetTotalInr: number;
  budgetCommittedInr: number;
  effectiveCacInr: number;
  viralKFactor: number;
}

export interface CampaignStateResponse {
  registrations: StudentRegistration[];
  ambassadors: AmbassadorNode[];
  summary: CampaignSummary;
}
