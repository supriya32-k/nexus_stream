export interface DiagnosticPreset {
  id: string;
  label: string;
  personaTag: string;
  branch: string;
  targetCompany: string;
  currentResumeProjects: string;
}

export const DIAGNOSTIC_PRESETS: DiagnosticPreset[] = [
  {
    id: 'cse-clone',
    label: 'CSE · Generic MERN Clones',
    personaTag: '8th Sem CSE · Mass Placement Risk',
    branch: 'CSE',
    targetCompany: 'TCS Prime / Accenture GenAI / Zoho SDE',
    currentResumeProjects:
      '1. E-commerce Shopping Cart Clone (React + MongoDB CRUD)\n2. Weather Dashboard using OpenWeather REST API\n3. To-Do List App with LocalStorage',
  },
  {
    id: 'aiml-kaggle',
    label: 'AIML · Static CSV Notebooks',
    personaTag: 'Final-Year CSE (AI & ML) · No Deployed App',
    branch: 'CSE (AI & ML)',
    targetCompany: 'Infosys Specialist Programmer / Cognizant GenC Next',
    currentResumeProjects:
      '1. Titanic Survival Prediction in Jupyter Notebook (Logistic Regression)\n2. Iris Flower Classification using scikit-learn\n3. Movie Recommendation CSV script without API or UI',
  },
  {
    id: 'ece-pivot',
    label: 'ECE · Core-to-IT Pivot',
    personaTag: 'Final-Year ECE · Needs Fast Software Proof',
    branch: 'ECE',
    targetCompany: 'Capgemini Exceller / Tech Mahindra / Campus SDE',
    currentResumeProjects:
      '1. Arduino Ultrasonic Obstacle Detector\n2. Basic Python Calculator & Attendance Tracker CSV\nNo deployed web or AI API project on GitHub yet.',
  },
];

export interface SampleSubmissionPreset {
  id: string;
  label: string;
  studentName: string;
  college: string;
  projectTitle: string;
  stackSummary: string;
  architectureAndCode: string;
}

export const SAMPLE_SUBMISSIONS: SampleSubmissionPreset[] = [
  {
    id: 'strong-rag',
    label: 'Strong Build: Placement JD Gap Analyzer',
    studentName: 'Karthikeya Reddy (SRM University AP · CSE)',
    college: 'SRM University AP',
    projectTitle: 'HireLens 60 — Placement JD-to-Resume Gap & Viva Drill Engine',
    stackSummary: 'Node.js, Express, Gemini Structured JSON Schema, PDF Text Parser, Rate-Limit Middleware',
    architectureAndCode: `Problem: Final-year students submit identical resumes to 15 campus drives without matching JD keywords or preparing Viva answers for listed skills.

Pipeline Built in 60 Mins:
1. Parses uploaded resume text + pasted campus Job Description (e.g. TCS Digital).
2. Server-side /api/analyze endpoint calls Gemini with strict JSON schema (missingSkills[], matchedEvidence[], rewrittenBullets[], vivaQuestions[]).
3. Input Guardrails: Rejects payloads > 12,000 chars, strips prompt-injection strings ("ignore previous instructions"), and falls back cleanly on HTTP 429/timeout.
4. Evaluation Check: Tested against 5 real campus JDs; latency 1.9s; zero client API key exposure.`,
  },
  {
    id: 'thin-wrapper',
    label: 'Borderline: Single-Prompt Chat Wrapper',
    studentName: 'Rohan Sharma (VIT Vellore · IT)',
    college: 'VIT Vellore',
    projectTitle: 'AI Study Buddy Chatbot',
    stackSummary: 'React Frontend calling LLM directly with hardcoded API key',
    architectureAndCode: `Problem: Students want to ask questions before semester exams.

Code Summary:
- Single text input box in App.jsx that sends user text directly to generateContent("Answer this student question: " + input).
- API key stored in frontend .env VITE_API_KEY.
- Output rendered as plain unformatted string. No schema validation, no domain grounding, no document upload or citation check, and no error handling when input is empty.`,
  },
  {
    id: 'incomplete-crud',
    label: 'Weak: Unfinished Static Mockup',
    studentName: 'Ananya Verma (JNTU Hyderabad · ECE)',
    college: 'JNTU Hyderabad',
    projectTitle: 'Smart Resume Scorer UI',
    stackSummary: 'HTML, Tailwind CSS, hardcoded Math.random() score',
    architectureAndCode: `Problem: Score student resumes automatically.

Code Summary:
- Built landing form where user pastes resume text.
- On submit, setTimeout waits 1000ms and displays Math.floor(Math.random() * 30 + 70) as "ATS Score" with 3 static hardcoded tips.
- Did not wire backend API route or structured LLM evaluation yet due to CORS issue at minute 42.`,
  },
];

export interface DayExecutionPlan {
  day: string;
  phase: string;
  primaryAction: string;
  channelFocus: string;
  dailyTarget: number;
  cumulativeTarget: number;
  budgetUsedInr: number;
}

export const SEVEN_DAY_PLAN: DayExecutionPlan[] = [
  {
    day: 'Day 1',
    phase: 'Asset Lock & CR Seeding',
    primaryAction:
      'Deploy Build60 Diagnostic + Squad Referral Tracker. Recruit 15 final-year Class Representatives (CRs) and 4 Coding Club Leads across 8 target engineering colleges.',
    channelFocus: 'Direct WhatsApp + LinkedIn DM to CRs',
    dailyTarget: 35,
    cumulativeTarget: 35,
    budgetUsedInr: 0,
  },
  {
    day: 'Day 2',
    phase: 'Trusted Section Group Drops',
    primaryAction:
      '15 CRs post peer-written "Resume Gap Check + 60-Min Build" invite into official 7th/8th-sem CSE/IT/ECE WhatsApp groups during 8:30 PM hostel peak window.',
    channelFocus: 'CR WhatsApp Groups (Wave 1)',
    dailyTarget: 75,
    cumulativeTarget: 110,
    budgetUsedInr: 300,
  },
  {
    day: 'Day 3',
    phase: 'Coding Club Co-Hosted Sprints',
    primaryAction:
      'Announce co-branded Participation + Verified Repo Portfolio Review with 4 college GDSC / Coding Clubs; activate 3-member Squad Unlock loop.',
    channelFocus: 'Coding Club Sprints + Squad Loop',
    dailyTarget: 90,
    cumulativeTarget: 200,
    budgetUsedInr: 400,
  },
  {
    day: 'Day 4',
    phase: 'Mid-Campaign Funnel Audit',
    primaryAction:
      'Audit channel velocity; double down on "TCS/Infosys Resume Project Gap" hook. Release mid-week Campus Leaderboard update to spark inter-college rivalry.',
    channelFocus: 'Peer Squad Referrals (K=0.68)',
    dailyTarget: 85,
    cumulativeTarget: 285,
    budgetUsedInr: 300,
  },
  {
    day: 'Day 5',
    phase: 'Incomplete Squad Nudge',
    primaryAction:
      'Trigger targeted WhatsApp follow-up to 1/2 Squad leads ("1 peer away from unlocking Starter Boilerplate + Automated Project Evaluator"). Deploy ₹300 airtime reserve.',
    channelFocus: 'Squad Completion Loop (1/2 -> 2/2)',
    dailyTarget: 80,
    cumulativeTarget: 365,
    budgetUsedInr: 300,
  },
  {
    day: 'Day 6',
    phase: '48-Hour Seat Lock Push',
    primaryAction:
      'Share 45-second demo screen recording of a real 60-minute AI project passing the Viva Evaluator across CR groups and campus networks.',
    channelFocus: 'CR WhatsApp Groups (Wave 2)',
    dailyTarget: 75,
    cumulativeTarget: 440,
    budgetUsedInr: 400,
  },
  {
    day: 'Day 7',
    phase: 'Final Cohort Close & Target Met',
    primaryAction:
      'Close final batch registrations to hit exact 500 final-year B.Tech target, distribute Starter Repos, and verify student environment setup.',
    channelFocus: 'Direct Peer DMs + Squad Finalization',
    dailyTarget: 60,
    cumulativeTarget: 500,
    budgetUsedInr: 300,
  },
];

export interface BudgetLineItem {
  allocation: string;
  amountInr: number;
  sharePct: string;
  eligibilityCondition: string;
  maxCapInr: number;
  mechanism: string;
  expectedYield: string;
}

export const BUDGET_ALLOCATION: BudgetLineItem[] = [
  {
    allocation: 'Verified Class-Rep Milestone Micro-Bounties',
    amountInr: 1200,
    sharePct: '60%',
    eligibilityCondition: 'Paid strictly AFTER ambassador reaches 25 verified final-year signups. ₹100 per 25-signup milestone.',
    maxCapInr: 1200,
    mechanism:
      'Performance-gated milestone payouts (max 12 milestone unlocks × ₹100 = ₹1,200 hard cap). Zero upfront fixed advance.',
    expectedYield: '300 verified registrations (₹4.00 CAC)',
  },
  {
    allocation: 'Top-3 Campus Build Squad Prize / API Credits',
    amountInr: 500,
    sharePct: '25%',
    eligibilityCondition: 'Awarded to top 3 student squads whose 60-min projects score highest on automated 100-pt rubric (1st: ₹250, 2nd: ₹150, 3rd: ₹100).',
    maxCapInr: 500,
    mechanism:
      'Cloud/API micro-grants disbursed live at minute 60 of the workshop. Fixed non-negotiable prize pool.',
    expectedYield: '165 peer squad referrals (viral K-factor 0.68)',
  },
  {
    allocation: 'High-Engagement CR Airtime / Emergency Reserve',
    amountInr: 300,
    sharePct: '15%',
    eligibilityCondition: '6 × ₹50 mobile 5G data recharges for verified CRs running live drops during 8:30 PM hostel peak hours.',
    maxCapInr: 300,
    mechanism:
      'Disbursed as mobile recharges only to active CRs in high-density sections to guarantee zero drop-off.',
    expectedYield: '35 registrations (smooths Day 5 bottleneck)',
  },
  {
    allocation: 'Paid Instagram / Meta Cold Ads',
    amountInr: 0,
    sharePct: '0%',
    eligibilityCondition: 'Excluded by design — zero allocation.',
    maxCapInr: 0,
    mechanism:
      'Deliberately ₹0. Cold ads burn budget at ₹90–₹140 CAC (exhausting ₹2,000 at ~18 signups) with zero peer trust.',
    expectedYield: 'Guaranteed zero budget overrun',
  },
];

export interface AiDecisionNote {
  step: string;
  whatIAsked: string;
  whatAiSuggested: string;
  whatIChangedAndWhy: string;
}

export const AI_DECISION_NOTES: AiDecisionNote[] = [
  {
    step: '01. Asset Selection & Differentiation',
    whatIAsked:
      'Asked ChatGPT & Claude which working asset I should build to stand out in the NxtWave Growth Intern challenge.',
    whatAiSuggested:
      'ChatGPT suggested building a standard workshop landing page or a standalone referral code leaderboard table. Claude suggested a generic email drip sequence.',
    whatIChangedAndWhy:
      'Rejected both standalone options. The brief explicitly notes "Everyone might build a landing page," and a bare referral code gives students zero intrinsic reason to register or share. Instead, I built a closed-loop PLG Growth Engine combining (1) a pre-signup AI Resume-Gap Blueprint generator (value before ask), (2) a 3-student Squad Referral unlocker, and (3) an Automated 60-Min AI Project Evaluator.',
  },
  {
    step: '02. ₹2,000 Budget & Channel Allocation',
    whatIAsked:
      'Asked AI how to split ₹2,000 across 7 days to acquire 500 final-year B.Tech engineering students.',
    whatAiSuggested:
      'Suggested spending ₹1,200 on Instagram/Facebook boosted reels targeting ages 20–22 in India, ₹500 on Canva Pro/tools, and posting across 12+ channels (Reddit, Quora, Twitter, Telegram, Discord, cold email).',
    whatIChangedAndWhy:
      'Rejected paid social ads and multi-channel spray-and-pray completely. At realistic Indian EdTech CACs (₹95–₹150/lead on cold Meta ads), ₹1,200 buys ~10 signups and zero trust. Final-year B.Tech students act on high-trust peer signals inside official section CR WhatsApp groups during placement season. Reallocated 100% of ₹2,000 into performance-gated CR micro-bounties (₹100 per 25 verified signups = ₹4 CAC) and squad completion incentives.',
  },
  {
    step: '03. Referral Incentive Design',
    whatIAsked:
      'Asked AI how to gamify referrals so registered students invite classmates.',
    whatAiSuggested:
      'Suggested an open-ended points leaderboard ("Refer 20 friends to win an Amazon voucher") plus generic "Participation Certificate" messaging.',
    whatIChangedAndWhy:
      'Rejected high-threshold leaderboards because 95% of students quit when the top spot has 40 referrals, and final-year students ignore "Participation Certificates" because recruiters do not value them. Replaced it with a bounded 2-peer "Build Squad" unlock: inviting just 2 classmates unlocks the Starter Repo + Automated AI Viva Evaluator—turning referrals into a collaborative placement prep behavior.',
  },
];
