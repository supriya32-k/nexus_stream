import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { generate500Students } from './src/data/students500.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ChannelSource =
  | 'CR WhatsApp Group'
  | 'Coding Club Sprint'
  | 'Peer Squad Referral'
  | 'Placement Cell Notice'
  | 'LinkedIn Direct';

interface StudentRegistration {
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

interface AmbassadorNode {
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

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function computeSquadStatus(
  referralsConverted: number
): StudentRegistration['squadStatus'] {
  if (referralsConverted >= 2) {
    return 'Full Squad + Evaluator Unlocked (2/2)';
  }
  if (referralsConverted === 1) {
    return 'Starter Repo Unlocked (1/2)';
  }
  return 'Seat Reserved (0/2)';
}

function createInitialAmbassadors(): AmbassadorNode[] {
  return [
    {
      code: 'CR-SRMAP-01',
      name: 'Datta Supriya K.',
      role: 'Final-Year CSE Lead · Placement Coord',
      college: 'SRM University AP',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 4,
      clicks: 164,
      signups: 68,
      verifiedSquads: 19,
      bountyEarnedInr: 200,
    },
    {
      code: 'CLUB-VNR-02',
      name: 'Harsha Vardhan R.',
      role: 'AI/ML Club Secretary',
      college: 'VNR VJIET Hyderabad',
      channel: 'Coding Club Sprint',
      groupsSeeded: 3,
      clicks: 142,
      signups: 58,
      verifiedSquads: 16,
      bountyEarnedInr: 200,
    },
    {
      code: 'CR-JNTUH-03',
      name: 'Charan Teja M.',
      role: '8th Sem CSE-B Class Rep',
      college: 'JNTU Hyderabad',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 3,
      clicks: 129,
      signups: 54,
      verifiedSquads: 14,
      bountyEarnedInr: 200,
    },
    {
      code: 'CLUB-VIT-04',
      name: 'Meghana Nair',
      role: 'Coding Society Lead',
      college: 'VIT Vellore',
      channel: 'Coding Club Sprint',
      groupsSeeded: 3,
      clicks: 118,
      signups: 49,
      verifiedSquads: 13,
      bountyEarnedInr: 100,
    },
    {
      code: 'CR-GRIET-05',
      name: 'Sai Pranav G.',
      role: 'Final-Year IT Class Rep',
      college: 'GRIET Hyderabad',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 2,
      clicks: 96,
      signups: 41,
      verifiedSquads: 11,
      bountyEarnedInr: 100,
    },
    {
      code: 'TPO-CVR-06',
      name: 'Nikhil Reddy B.',
      role: 'Student Placement Coordinator',
      college: 'CVR College of Engineering',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 2,
      clicks: 88,
      signups: 37,
      verifiedSquads: 9,
      bountyEarnedInr: 100,
    },
    {
      code: 'CR-GITAM-07',
      name: 'Sneha Kulkarni',
      role: 'ECE-A Final-Year Rep',
      college: 'GITAM Visakhapatnam',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 2,
      clicks: 84,
      signups: 36,
      verifiedSquads: 8,
      bountyEarnedInr: 100,
    },
    {
      code: 'CR-VASAVI-08',
      name: 'Pradeep Varma',
      role: 'Final-Year CSE Rep',
      college: 'Vasavi College of Engineering',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 2,
      clicks: 76,
      signups: 31,
      verifiedSquads: 7,
      bountyEarnedInr: 100,
    },
    {
      code: 'CLUB-CBIT-09',
      name: 'Ananya Joshi',
      role: 'Developers Club Lead',
      college: 'CBIT Hyderabad',
      channel: 'Coding Club Sprint',
      groupsSeeded: 2,
      clicks: 68,
      signups: 28,
      verifiedSquads: 6,
      bountyEarnedInr: 100,
    },
    {
      code: 'CR-BVRIT-10',
      name: 'Rohith Sen',
      role: 'CSE Placement Volunteer',
      college: 'BVRIT Hyderabad',
      channel: 'CR WhatsApp Group',
      groupsSeeded: 2,
      clicks: 62,
      signups: 25,
      verifiedSquads: 5,
      bountyEarnedInr: 100,
    },
  ];
}

function createInitialRegistrations(): StudentRegistration[] {
  const sampleColleges = [
    {
      college: 'SRM University AP',
      code: 'CR-SRMAP-01',
      channel: 'CR WhatsApp Group' as ChannelSource,
    },
    {
      college: 'VNR VJIET Hyderabad',
      code: 'CLUB-VNR-02',
      channel: 'Coding Club Sprint' as ChannelSource,
    },
    {
      college: 'JNTU Hyderabad',
      code: 'CR-JNTUH-03',
      channel: 'CR WhatsApp Group' as ChannelSource,
    },
    {
      college: 'VIT Vellore',
      code: 'CLUB-VIT-04',
      channel: 'Coding Club Sprint' as ChannelSource,
    },
    {
      college: 'GRIET Hyderabad',
      code: 'CR-GRIET-05',
      channel: 'Peer Squad Referral' as ChannelSource,
    },
    {
      college: 'CVR College of Engineering',
      code: 'TPO-CVR-06',
      channel: 'Placement Cell Notice' as ChannelSource,
    },
    {
      college: 'GITAM Visakhapatnam',
      code: 'CR-GITAM-07',
      channel: 'LinkedIn Direct' as ChannelSource,
    },
  ];

  const featuredStudents: StudentRegistration[] = [
    {
      id: 'reg-101',
      fullName: 'Karthikeya Reddy',
      email: 'karthikeya.r27@srmap.edu.in',
      phone: '+91 98480 23145',
      college: 'SRM University AP',
      branch: 'CSE',
      gradYear: '2027',
      targetRole: 'TCS Prime / Backend + GenAI SDE',
      projectTrack: 'HireLens 60 — Placement JD-to-Resume Gap Analyzer',
      channel: 'CR WhatsApp Group',
      referredByCode: 'CR-SRMAP-01',
      ownReferralCode: 'SQ-KARTHIK-27',
      referralClicks: 9,
      referralsConverted: 2,
      squadStatus: 'Full Squad + Evaluator Unlocked (2/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 5 · 21:14 IST',
    },
    {
      id: 'reg-102',
      fullName: 'Aishwarya Deshmukh',
      email: 'aishwarya.d@vnrvjiet.in',
      phone: '+91 94401 58219',
      college: 'VNR VJIET Hyderabad',
      branch: 'CSE (AI & ML)',
      gradYear: '2027',
      targetRole: 'Infosys Specialist Programmer',
      projectTrack: 'CodeDiff Viva Coach — PR & Bug Explainer Agent',
      channel: 'Coding Club Sprint',
      referredByCode: 'CLUB-VNR-02',
      ownReferralCode: 'SQ-AISH-19',
      referralClicks: 6,
      referralsConverted: 1,
      squadStatus: 'Starter Repo Unlocked (1/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 5 · 20:48 IST',
    },
    {
      id: 'reg-103',
      fullName: 'Revanth Kumar P.',
      email: 'revanth.kp@jntuh.ac.in',
      phone: '+91 97012 44901',
      college: 'JNTU Hyderabad',
      branch: 'IT',
      gradYear: '2027',
      targetRole: 'Accenture GenAI Analyst',
      projectTrack: 'SQL-Guard 60 — Natural Language to Safe Analytics API',
      channel: 'Peer Squad Referral',
      referredByCode: 'SQ-KARTHIK-27',
      ownReferralCode: 'SQ-REVANTH-44',
      referralClicks: 5,
      referralsConverted: 2,
      squadStatus: 'Full Squad + Evaluator Unlocked (2/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 5 · 19:55 IST',
    },
    {
      id: 'reg-104',
      fullName: 'Divya Sree V.',
      email: 'divyasree.v@vitstudent.ac.in',
      phone: '+91 91772 38102',
      college: 'VIT Vellore',
      branch: 'ECE',
      gradYear: '2027',
      targetRole: 'Capgemini Exceller SDE',
      projectTrack: 'SpecCheck AI — Datasheet & API Anomaly Triage Tool',
      channel: 'Coding Club Sprint',
      referredByCode: 'CLUB-VIT-04',
      ownReferralCode: 'SQ-DIVYA-08',
      referralClicks: 4,
      referralsConverted: 1,
      squadStatus: 'Starter Repo Unlocked (1/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 4 · 22:10 IST',
    },
    {
      id: 'reg-105',
      fullName: 'Siddharth Rao',
      email: 'siddharth.rao@griet.ac.in',
      phone: '+91 99890 12894',
      college: 'GRIET Hyderabad',
      branch: 'CSE',
      gradYear: '2027',
      targetRole: 'Zoho Member Technical Staff',
      projectTrack: 'LogPulse 60 — Stack-Trace Root Cause Triage Microservice',
      channel: 'CR WhatsApp Group',
      referredByCode: 'CR-GRIET-05',
      ownReferralCode: 'SQ-SID-31',
      referralClicks: 3,
      referralsConverted: 0,
      squadStatus: 'Seat Reserved (0/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 4 · 21:02 IST',
    },
    {
      id: 'reg-106',
      fullName: 'Bhavya Sri Ch.',
      email: 'bhavyasri@cvr.ac.in',
      phone: '+91 96182 77019',
      college: 'CVR College of Engineering',
      branch: 'CSE (Data Science)',
      gradYear: '2027',
      targetRole: 'Cognizant GenC Next',
      projectTrack: 'CitationCheck — Hallucination-Guarded Study Notes API',
      channel: 'Placement Cell Notice',
      referredByCode: 'TPO-CVR-06',
      ownReferralCode: 'SQ-BHAVYA-62',
      referralClicks: 7,
      referralsConverted: 2,
      squadStatus: 'Full Squad + Evaluator Unlocked (2/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 4 · 18:35 IST',
    },
    {
      id: 'reg-107',
      fullName: 'Varun Aditya K.',
      email: 'varun.k@gitam.in',
      phone: '+91 98850 62118',
      college: 'GITAM Visakhapatnam',
      branch: 'ECE',
      gradYear: '2027',
      targetRole: 'Campus Full-Stack + AI Role',
      projectTrack: 'MockViva 60 — Resume Project Cross-Examiner',
      channel: 'LinkedIn Direct',
      referredByCode: 'CR-GITAM-07',
      ownReferralCode: 'SQ-VARUN-15',
      referralClicks: 2,
      referralsConverted: 0,
      squadStatus: 'Seat Reserved (0/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 3 · 23:11 IST',
    },
    {
      id: 'reg-108',
      fullName: 'Keerthana M.',
      email: 'keerthana.m27@srmap.edu.in',
      phone: '+91 94910 88204',
      college: 'SRM University AP',
      branch: 'CSE',
      gradYear: '2027',
      targetRole: 'TCS Digital / Product Intern',
      projectTrack: 'TicketRouter AI — Support Triage + SLA JSON Classifier',
      channel: 'Peer Squad Referral',
      referredByCode: 'SQ-KARTHIK-27',
      ownReferralCode: 'SQ-KEERTHANA-09',
      referralClicks: 4,
      referralsConverted: 1,
      squadStatus: 'Starter Repo Unlocked (1/2)',
      cohortType: 'Simulated Baseline',
      registeredAt: 'Day 3 · 20:19 IST',
    },
  ];

  // Fix capitalization in ambassador 3 cleanly
  void sampleColleges;
  return featuredStudents;
}

let ambassadorsState: AmbassadorNode[] = createInitialAmbassadors().map((a) =>
  a.code === 'CR-JNTUH-03' ? { ...a, name: 'Charan Teja M.' } : a
);
let registrationsState: StudentRegistration[] = generate500Students();

function buildStateResponse() {
  const liveSessionSignups = registrationsState.filter(
    (r) => r.cohortType === 'Live Demo Signup'
  ).length;
  const totalRegistrations = registrationsState.length;
  const totalClicks =
    ambassadorsState.reduce((acc, a) => acc + a.clicks, 0) +
    registrationsState.reduce((acc, r) => acc + r.referralClicks, 0);

  const ambassadorBounties = ambassadorsState.reduce(
    (acc, a) => acc + a.bountyEarnedInr,
    0
  );
  const prizePoolCommitted = 500; // Top-3 Squad Prize Pool
  const budgetCommittedInr = Math.min(2000, ambassadorBounties + prizePoolCommitted);
  const effectiveCacInr = Number(
    (budgetCommittedInr / Math.max(1, totalRegistrations)).toFixed(2)
  );

  // Viral K-Factor based on peer squad referrals
  const peerReferralsCount = registrationsState.filter(
    (r) => r.channel === 'Peer Squad Referral'
  ).length;
  const viralKFactor = Number(
    Math.min(0.95, peerReferralsCount / Math.max(1, totalRegistrations - peerReferralsCount)).toFixed(2)
  );

  return {
    registrations: registrationsState,
    ambassadors: ambassadorsState,
    summary: {
      totalRegistrations,
      targetRegistrations: 500,
      liveSessionSignups,
      totalClicks,
      budgetTotalInr: 2000,
      budgetCommittedInr,
      effectiveCacInr,
      viralKFactor,
    },
  };
}

function generateFallbackBlueprint(
  branch: string,
  targetCompany: string,
  currentResumeProjects: string
) {
  const lower = `${branch} ${currentResumeProjects}`.toLowerCase();
  const isHardwareOrEce = lower.includes('ece') || lower.includes('arduino') || lower.includes('iot');
  const isNotebookOnly = lower.includes('titanic') || lower.includes('iris') || lower.includes('csv') || lower.includes('notebook');

  if (isHardwareOrEce) {
    return {
      projectTitle: 'FaultSense 60 — Sensor & API Telemetry Anomaly Triage Microservice',
      resumeGapDiagnosis:
        'Your resume currently highlights hardware/microcontroller coursework without a deployed web API or structured LLM service, causing software placement filters to screen it out before technical rounds.',
      whyRecruitersCare: `Interviewers at ${targetCompany || 'campus IT recruiters'} value ECE candidates who bridge telemetry data with production REST endpoints, JSON schema validation, and deterministic fallback logic.`,
      techStack: ['TypeScript + Express API', 'Gemini Structured JSON Schema', 'CSV/JSON Telemetry Parser', 'React Live Diagnostic View'],
      timeline: [
        {
          window: 'Min 00–15',
          milestone: 'Ingest & Schema Contract',
          deliverable: 'Build /api/triage endpoint accepting batch voltage/latency logs with strict input validation.',
        },
        {
          window: 'Min 15–35',
          milestone: 'Structured AI Root-Cause Pipeline',
          deliverable: 'Configure Gemini responseSchema returning severity, probableFault, and recommendedCheck[].',
        },
        {
          window: 'Min 35–50',
          milestone: 'Guardrails & Frontend Dashboard',
          deliverable: 'Wire clean React inspection table with timeout fallback and tabular threshold alerts.',
        },
        {
          window: 'Min 50–60',
          milestone: 'Deploy & Viva Proof Check',
          deliverable: 'Run automated rubric check, push clean README with architecture diagram, and lock resume bullet.',
        },
      ],
      resumeStarBullet:
        'Engineered a full-stack telemetry anomaly triage service in 60 minutes using Node.js and structured LLM JSON schemas, automating root-cause classification across 200+ sensor log rows with <2.1s p95 latency and deterministic fallback guardrails.',
      interviewVivaQuestions: [
        {
          question: 'Why did you use structured JSON schema validation instead of parsing free-form LLM text?',
          talkingPoint: 'Free-form markdown breaks downstream UI tables and alert triggers; enforcing a strict typed responseSchema guarantees deterministic keys on every API call.',
        },
        {
          question: 'What happens if the LLM API times out during a live log burst?',
          talkingPoint: 'Implemented a z-score threshold pre-check on the Express route so critical threshold breaches still flag even if the AI enrichment layer returns HTTP 429/503.',
        },
      ],
      generatedBy: 'structured-engine' as const,
    };
  }

  if (isNotebookOnly) {
    return {
      projectTitle: 'ClaimVerify 60 — Hallucination-Guarded Document & Policy Q&A API',
      resumeGapDiagnosis:
        'Static Kaggle CSV notebooks (Titanic/Iris) sit on 70%+ of final-year resumes and demonstrate zero API engineering, deployment, or hallucination control.',
      whyRecruitersCare: `Hiring panels for ${targetCompany || 'specialist SDE/AI roles'} immediately ask how a model behaves in production when users upload messy, out-of-distribution text.`,
      techStack: ['Node.js + Express', 'Chunked Context Retrieval', 'Gemini JSON Citation Schema', 'React Verification Split-View'],
      timeline: [
        {
          window: 'Min 00–15',
          milestone: 'Document Chunker & API Route',
          deliverable: 'Replace static notebook with an Express POST route splitting pasted syllabus/policy docs into numbered passages.',
        },
        {
          window: 'Min 15–35',
          milestone: 'Citation-Locked LLM Prompting',
          deliverable: 'Enforce JSON schema requiring answer, confidenceLevel, and exact citedPassageIds[].',
        },
        {
          window: 'Min 35–50',
          milestone: 'Unanswerable Query Guardrail',
          deliverable: 'Add explicit abstention testing so off-topic questions return "Insufficient Evidence" instead of hallucinating.',
        },
        {
          window: 'Min 50–60',
          milestone: 'Live URL & Viva Readiness',
          deliverable: 'Benchmark 5 adversarial prompts, export evaluation scorecard, and publish GitHub repo.',
        },
      ],
      resumeStarBullet:
        'Built and deployed a citation-grounded document Q&A microservice using Express and Gemini structured outputs, eliminating unverified hallucinations across adversarial test queries by enforcing passage-ID attribution.',
      interviewVivaQuestions: [
        {
          question: 'How does your project prevent the LLM from inventing facts not present in the uploaded document?',
          talkingPoint: 'Every paragraph is indexed [P1..Pn] prior to inference, and the JSON schema mandates returning verbatim supporting quote spans alongside an explicit abstention boolean.',
        },
        {
          question: 'How is this different from a basic ChatGPT wrapper?',
          talkingPoint: 'It implements server-side chunk indexing, prompt-injection sanitization, schema enforcement, and automated abstention verification rather than forwarding raw user strings.',
        },
      ],
      generatedBy: 'structured-engine' as const,
    };
  }

  return {
    projectTitle: 'HireLens 60 — Placement JD-to-Resume Gap & Technical Viva Simulator',
    resumeGapDiagnosis:
      'CRUD clones (E-commerce, To-Do, Weather apps) look identical to tutorial copy-pastes and give technical interviewers nothing concrete to probe in a 15-minute Viva.',
    whyRecruitersCare: `Recruiters at ${targetCompany || 'top campus drives'} prioritize candidates who understand backend API security, structured LLM orchestration, input sanitization, and real user utility.`,
    techStack: ['React + TypeScript', 'Express Backend Proxy', 'Gemini 3.8 Flash JSON Schema', 'Prompt-Injection Sanitizer'],
    timeline: [
      {
        window: 'Min 00–15',
        milestone: 'Backend Proxy & Payload Sanitizer',
        deliverable: 'Set up server.ts /api/match route keeping API keys strictly server-side with character-limit validation.',
      },
      {
        window: 'Min 15–35',
        milestone: 'Structured Skill-Gap Engine',
        deliverable: 'Wire Gemini JSON schema extracting missingCoreSkills[], evidenceGaps[], and rewrittenResumeBullets[].',
      },
      {
        window: 'Min 35–50',
        milestone: 'Interactive Viva Drill UI',
        deliverable: 'Render side-by-side gap breakdown and 3 project-specific cross-examination questions.',
      },
      {
        window: 'Min 50–60',
        milestone: 'End-to-End Rubric Verification',
        deliverable: 'Test edge cases (empty JD, adversarial input), verify <2s response, and ship shareable portfolio URL.',
      },
    ],
    resumeStarBullet:
      'Architected a full-stack placement readiness analyzer in 60 minutes using TypeScript, Express, and structured Gemini schemas, benchmarking resume-to-JD alignment and generating targeted technical Viva drills with zero client-side key exposure.',
    interviewVivaQuestions: [
      {
        question: 'Why did you proxy the LLM call through Express instead of calling the SDK from React?',
        talkingPoint: 'Client-side calls expose secret API keys in browser network inspection and prevent server-side payload rate-limiting and schema sanitization.',
      },
      {
        question: 'How did you handle malformed or adversarial inputs pasted into the resume box?',
        talkingPoint: 'Added server-side length caps, stripped control/override phrases, and validated output against a typed JSON schema with graceful error states.',
      },
    ],
    generatedBy: 'structured-engine' as const,
  };
}

function generateFallbackEvaluation(projectTitle: string, stackSummary: string, architectureAndCode: string) {
  const combined = `${projectTitle} ${stackSummary} ${architectureAndCode}`.toLowerCase();
  const hasRandomMock = combined.includes('math.random') || combined.includes('hardcoded tips');
  const exposesClientKey = combined.includes('vite_api_key') || combined.includes('calling llm directly');

  if (hasRandomMock) {
    return {
      overallScore: 34,
      verdict: 'Thin Wrapper — Rebuild Required' as const,
      executiveSummary:
        'The submission currently renders a simulated random score on the frontend without a functional backend LLM pipeline, schema contract, or error boundary.',
      rubric: [
        {
          criterion: 'Problem Framing & Campus Utility',
          score: 14,
          maxScore: 25,
          observation: 'Clear target problem (resume scoring), but lacks specific rubric dimensions or JD comparison input.',
        },
        {
          criterion: 'LLM Pipeline & Backend Architecture',
          score: 5,
          maxScore: 25,
          observation: 'No server-side inference route wired; currently uses setTimeout and Math.random() placeholder.',
        },
        {
          criterion: 'Guardrails, Security & Edge Cases',
          score: 7,
          maxScore: 25,
          observation: 'Missing payload length limits, empty-input checks, and API error fallback handling.',
        },
        {
          criterion: 'Placement Viva Defensibility',
          score: 8,
          maxScore: 25,
          observation: 'An interviewer inspecting the network tab or repo will immediately spot mocked random scoring.',
        },
      ],
      wrapperCheck: {
        isThinWrapper: true,
        reason: 'No real inference or domain processing occurs yet; output is randomly generated on the client.',
      },
      fifteenMinuteFixes: [
        'Add an Express POST /api/score route in server.ts so Vite proxies requests without browser CORS failures.',
        'Replace Math.random() with a structured JSON responseSchema evaluating 3 concrete resume sections.',
        'Add input validation rejecting resumes shorter than 80 characters before calling the model.',
      ],
      vivaQuestions: [
        {
          question: 'Why did you hit a CORS error at minute 42, and how does a backend proxy solve it?',
          expectedAnswerSignal: 'Browsers block restricted cross-origin headers and expose keys; routing /api/* through Express executes server-to-server cleanly.',
        },
        {
          question: 'How would you make resume scores reproducible across two identical runs?',
          expectedAnswerSignal: 'Set low temperature (0.1–0.2), use criterion-level rubric sub-scores instead of a single arbitrary integer, and validate JSON types.',
        },
        {
          question: 'What minimum input validation prevents wasted API tokens?',
          expectedAnswerSignal: 'Trim whitespace, enforce min/max character bounds (e.g. 100 to 10,000 chars), and debounce duplicate clicks.',
        },
      ],
      generatedBy: 'structured-engine' as const,
    };
  }

  if (exposesClientKey) {
    return {
      overallScore: 58,
      verdict: 'Conditional Pass — Needs Hardening' as const,
      executiveSummary:
        'Functional prototype that completes an LLM round-trip, but exposes the API key in the client bundle and lacks structured output schemas or domain grounding.',
      rubric: [
        {
          criterion: 'Problem Framing & Campus Utility',
          score: 16,
          maxScore: 25,
          observation: 'Exam Q&A is relatable, though overly broad compared to syllabus-grounded or citation-checked tools.',
        },
        {
          criterion: 'LLM Pipeline & Backend Architecture',
          score: 14,
          maxScore: 25,
          observation: 'Direct string concatenation prompt works for demos but returns unstructured prose.',
        },
        {
          criterion: 'Guardrails, Security & Edge Cases',
          score: 11,
          maxScore: 25,
          observation: 'Critical gap: VITE_API_KEY exposes credentials in browser DevTools; no empty/injection guardrails.',
        },
        {
          criterion: 'Placement Viva Defensibility',
          score: 17,
          maxScore: 25,
          observation: 'Good starting point, but campus interviewers will challenge why this differs from opening ChatGPT directly.',
        },
      ],
      wrapperCheck: {
        isThinWrapper: true,
        reason: 'Forwards raw user input in a single string template directly from the browser without retrieval context or schema enforcement.',
      },
      fifteenMinuteFixes: [
        'Move the SDK call from App.jsx into an Express /api/ask endpoint reading process.env.GEMINI_API_KEY.',
        'Allow students to paste their unit syllabus/notes and restrict answers strictly to pasted context.',
        'Enforce a JSON schema returning { conciseAnswer, examKeyPoints[], practiceQuestion }.',
      ],
      vivaQuestions: [
        {
          question: 'What happens if a user opens Chrome DevTools -> Network on your current deployment?',
          expectedAnswerSignal: 'They can extract VITE_API_KEY and exhaust quota; secrets must stay on a server-side proxy.',
        },
        {
          question: 'How would you stop a student prompt from overriding your system instructions?',
          expectedAnswerSignal: 'Separate systemInstruction from user content parts, delimit untrusted context, and enforce structured output.',
        },
        {
          question: 'What makes your app meaningfully better for exam prep than a raw chat box?',
          expectedAnswerSignal: 'Grounding on specific university unit notes plus structured 5-mark/10-mark answer rubrics.',
        },
      ],
      generatedBy: 'structured-engine' as const,
    };
  }

  return {
    overallScore: 89,
    verdict: 'Placement-Ready Pass' as const,
    executiveSummary:
      'Strong 60-minute engineering execution: server-side API isolation, typed JSON schema contract, explicit payload guardrails, and clear placement utility.',
    rubric: [
      {
        criterion: 'Problem Framing & Campus Utility',
        score: 24,
        maxScore: 25,
        observation: 'Directly solves final-year JD-to-resume mismatch with immediately actionable output.',
      },
      {
        criterion: 'LLM Pipeline & Backend Architecture',
        score: 23,
        maxScore: 25,
        observation: 'Clean Express proxy with structured JSON schema prevents UI parsing failures.',
      },
      {
        criterion: 'Guardrails, Security & Edge Cases',
        score: 21,
        maxScore: 25,
        observation: 'Includes 12k char cap, injection stripping, and HTTP 429 fallback; could add request rate-limiting per IP.',
      },
      {
        criterion: 'Placement Viva Defensibility',
        score: 21,
        maxScore: 25,
        observation: 'Benchmarked on 5 campus JDs with latency metrics—ready for technical panel walkthrough.',
      },
    ],
    wrapperCheck: {
      isThinWrapper: false,
      reason: 'Combines dual-document comparison, server-side sanitization, typed JSON schema contracts, and fallback resilience.',
    },
    fifteenMinuteFixes: [
      'Add an in-memory per-IP rate limiter (e.g. 10 requests/min) on /api/analyze to protect workshop demo quota.',
      'Log p50/p95 latency and schema validation pass rates to display concrete reliability proof in your README.',
      'Add a one-click diff view comparing original vs rewritten STAR resume bullets.',
    ],
    vivaQuestions: [
      {
        question: 'Walk me through what happens in your Express route when the upstream model returns HTTP 429.',
        expectedAnswerSignal: 'Catches error cleanly, logs status code without leaking stack traces, and returns deterministic keyword-diff fallback or retry-after state.',
      },
      {
        question: 'Why did you cap payload size at 12,000 characters instead of accepting arbitrary PDFs?',
        expectedAnswerSignal: 'Bounds token cost and p95 latency (<2s) while comfortably fitting a 2-page resume plus a standard campus JD.',
      },
      {
        question: 'How would you evaluate whether rewritten resume bullets remain truthful to the student’s actual work?',
        expectedAnswerSignal: 'Require every rewritten bullet in the schema to reference an explicit source project string from the original resume.',
      },
    ],
    generatedBy: 'structured-engine' as const,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/state', (_req, res) => {
    res.json(buildStateResponse());
  });

  app.post('/api/state/reset', (_req, res) => {
    ambassadorsState = createInitialAmbassadors().map((a) =>
      a.code === 'CR-JNTUH-03' ? { ...a, name: 'Charan Teja M.' } : a
    );
    registrationsState = generate500Students();
    res.json(buildStateResponse());
  });

  app.post('/api/registrations', (req, res) => {
    const {
      fullName,
      email,
      phone,
      college,
      branch,
      gradYear,
      targetRole,
      projectTrack,
      channel,
      referredByCode,
    } = req.body ?? {};

    if (!fullName || !email || !college) {
      res.status(400).json({ error: 'Name, college email, and college name are required.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = registrationsState.find(
      (r) => r.email.trim().toLowerCase() === normalizedEmail
    );
    if (existing) {
      res.status(409).json({
        error: `Duplicate registration: Candidate ${existing.fullName} is already registered with email ${existing.email}.`,
        student: existing,
        isDuplicate: true,
      });
      return;
    }

    const cleanRef =
      typeof referredByCode === 'string' && referredByCode.trim().length > 0
        ? referredByCode.trim().toUpperCase()
        : null;

    let creditedReferrer: 'ambassador' | 'student' | null = null;
    let referrerName = '';
    let referralWarning: string | null = null;

    // Credit referrer if matches an ambassador or existing student squad code
    if (cleanRef) {
      const ambIdx = ambassadorsState.findIndex(
        (a) => a.code.toUpperCase() === cleanRef
      );
      const stuIdx = registrationsState.findIndex(
        (r) => r.ownReferralCode.toUpperCase() === cleanRef
      );

      if (ambIdx >= 0) {
        creditedReferrer = 'ambassador';
        referrerName = ambassadorsState[ambIdx].name;
        const updatedAmb = { ...ambassadorsState[ambIdx] };
        updatedAmb.signups += 1;
        updatedAmb.clicks = Math.max(updatedAmb.clicks, updatedAmb.signups + 8);
        if (updatedAmb.signups % 3 === 0) {
          updatedAmb.verifiedSquads += 1;
        }
        updatedAmb.bountyEarnedInr = Math.floor(updatedAmb.signups / 25) * 100;
        ambassadorsState[ambIdx] = updatedAmb;
      } else if (stuIdx >= 0) {
        creditedReferrer = 'student';
        referrerName = registrationsState[stuIdx].fullName;
        const updatedStu = { ...registrationsState[stuIdx] };
        updatedStu.referralsConverted += 1;
        updatedStu.referralClicks = Math.max(
          updatedStu.referralClicks,
          updatedStu.referralsConverted + 2
        );
        updatedStu.squadStatus = computeSquadStatus(updatedStu.referralsConverted);
        registrationsState[stuIdx] = updatedStu;
      } else {
        referralWarning = `Referral code "${cleanRef}" was not recognized. Registered as Direct.`;
      }
    }

    // Generate clean personal squad code
    const firstToken = String(fullName)
      .trim()
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 7) || 'BUILDER';
    const randomSuffix = Math.floor(10 + Math.random() * 89);
    const ownReferralCode = `SQ-${firstToken}-${randomSuffix}`;

    const validChannels: ChannelSource[] = [
      'CR WhatsApp Group',
      'Coding Club Sprint',
      'Peer Squad Referral',
      'Placement Cell Notice',
      'LinkedIn Direct',
    ];
    const resolvedChannel: ChannelSource = validChannels.includes(channel)
      ? channel
      : cleanRef?.startsWith('SQ-')
        ? 'Peer Squad Referral'
        : 'CR WhatsApp Group';

    const newStudent: StudentRegistration = {
      id: `reg-${Date.now()}`,
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: String(phone || '+91 98480 ' + Math.floor(10000 + Math.random() * 89999)).trim(),
      college: String(college).trim(),
      branch: String(branch || 'CSE').trim(),
      gradYear: String(gradYear || '2027').trim(),
      targetRole: String(targetRole || 'Campus SDE / GenAI Role').trim(),
      projectTrack: String(
        projectTrack || 'HireLens 60 — Placement JD-to-Resume Gap Analyzer'
      ).trim(),
      channel: resolvedChannel,
      referredByCode: cleanRef,
      ownReferralCode,
      referralClicks: 0,
      referralsConverted: 0,
      squadStatus: 'Seat Reserved (0/2)',
      cohortType: 'Live Demo Signup',
      registeredAt: 'Just now · Live Session',
    };

    registrationsState = [newStudent, ...registrationsState];

    res.status(201).json({
      student: newStudent,
      state: buildStateResponse(),
      creditedReferrer,
      referrerName,
      warning: referralWarning,
    });
  });

  app.post('/api/referrals/simulate', (req, res) => {
    const { code, action } = req.body ?? {};
    const targetCode = String(code || '').trim().toUpperCase();

    if (!targetCode) {
      res.status(400).json({ error: 'Referral code is required.' });
      return;
    }

    const ambIdx = ambassadorsState.findIndex(
      (a) => a.code.toUpperCase() === targetCode
    );
    const stuIdx = registrationsState.findIndex(
      (r) => r.ownReferralCode.toUpperCase() === targetCode
    );

    if (ambIdx < 0 && stuIdx < 0) {
      res.status(404).json({ error: `Code ${targetCode} not found in active tracker.` });
      return;
    }

    if (action === 'click') {
      if (ambIdx >= 0) {
        ambassadorsState[ambIdx] = {
          ...ambassadorsState[ambIdx],
          clicks: ambassadorsState[ambIdx].clicks + 1,
        };
      }
      if (stuIdx >= 0) {
        registrationsState[stuIdx] = {
          ...registrationsState[stuIdx],
          referralClicks: registrationsState[stuIdx].referralClicks + 1,
        };
      }
      res.json({
        message: `Tracked +1 WhatsApp link click on ${targetCode}`,
        state: buildStateResponse(),
      });
      return;
    }

    // Simulate a peer classmate converting via that referral code
    const peerNames = [
      'Praneeth Varma',
      'Sowmya Krishnan',
      'Abhishek Goud',
      'Niharika Chowdary',
      'Tarun Sai K.',
      'Rishitha Reddy',
      'Manoj Kumar T.',
    ];
    const pickedName = peerNames[Math.floor(Math.random() * peerNames.length)];
    const sourceCollege =
      stuIdx >= 0
        ? registrationsState[stuIdx].college
        : ambassadorsState[ambIdx].college;
    const sourceBranch =
      stuIdx >= 0 ? registrationsState[stuIdx].branch : 'CSE';

    if (ambIdx >= 0) {
      const updatedAmb = { ...ambassadorsState[ambIdx] };
      updatedAmb.clicks += 2;
      updatedAmb.signups += 1;
      if (updatedAmb.signups % 3 === 0) {
        updatedAmb.verifiedSquads += 1;
      }
      updatedAmb.bountyEarnedInr = Math.floor(updatedAmb.signups / 25) * 100;
      ambassadorsState[ambIdx] = updatedAmb;
    }

    if (stuIdx >= 0) {
      const updatedStu = { ...registrationsState[stuIdx] };
      updatedStu.referralClicks += 2;
      updatedStu.referralsConverted += 1;
      updatedStu.squadStatus = computeSquadStatus(updatedStu.referralsConverted);
      registrationsState[stuIdx] = updatedStu;
    }

    const token = pickedName.split(' ')[0].toUpperCase();
    const simulatedPeer: StudentRegistration = {
      id: `reg-${Date.now()}`,
      fullName: pickedName,
      email: `${token.toLowerCase()}.${Math.floor(10 + Math.random() * 89)}@campus.edu.in`,
      phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
      college: sourceCollege,
      branch: sourceBranch,
      gradYear: '2027',
      targetRole: 'Campus SDE / AI Engineer',
      projectTrack:
        stuIdx >= 0
          ? registrationsState[stuIdx].projectTrack
          : 'HireLens 60 — Placement JD-to-Resume Gap Analyzer',
      channel: stuIdx >= 0 ? 'Peer Squad Referral' : ambassadorsState[ambIdx].channel,
      referredByCode: targetCode,
      ownReferralCode: `SQ-${token}-${Math.floor(10 + Math.random() * 89)}`,
      referralClicks: 0,
      referralsConverted: 0,
      squadStatus: 'Seat Reserved (0/2)',
      cohortType: 'Live Demo Signup',
      registeredAt: 'Just now · Referral Conversion',
    };

    registrationsState = [simulatedPeer, ...registrationsState];

    res.json({
      message: `${pickedName} joined via ${targetCode}`,
      peer: simulatedPeer,
      state: buildStateResponse(),
    });
  });

  // Server-Side Gemini Endpoint 1: Resume-Gap to 60-Min AI Project Blueprint
  app.post('/api/ai/blueprint', async (req, res) => {
    const { branch, targetCompany, currentResumeProjects } = req.body ?? {};
    const safeBranch = String(branch || 'CSE').slice(0, 80);
    const safeTarget = String(targetCompany || 'Campus SDE / GenAI Role').slice(0, 140);
    const safeResume = String(currentResumeProjects || '').slice(0, 2500);

    const ai = getGenAIClient();
    if (!ai) {
      res.json(generateFallbackBlueprint(safeBranch, safeTarget, safeResume));
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Student Branch: ${safeBranch}
Target Placement Company / Role: ${safeTarget}
Current Resume Projects:
${safeResume || 'Basic CRUD college mini-projects'}

Design a realistic, concrete AI micro-product that this final-year Indian B.Tech engineering student can genuinely build in NxtWave's 60-minute hands-on online workshop ("Build Your First AI Project in 60 Minutes") to replace generic tutorial clones on their placement resume.`,
        config: {
          systemInstruction:
            'You are a principal engineering mentor at NxtWave preparing final-year B.Tech students for technical placement interviews. Avoid buzzwords. Prescribe a tightly scoped, genuine 60-minute buildable AI web/API project (4 intervals: Min 00-15, Min 15-35, Min 35-50, Min 50-60), diagnose concisely why their current resume projects look generic to campus recruiters, write 1 high-impact STAR resume bullet, and provide 2 realistic technical Viva questions with crisp talking points.',
          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectTitle: { type: Type.STRING },
              resumeGapDiagnosis: { type: Type.STRING },
              whyRecruitersCare: { type: Type.STRING },
              techStack: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    window: { type: Type.STRING },
                    milestone: { type: Type.STRING },
                    deliverable: { type: Type.STRING },
                  },
                  required: ['window', 'milestone', 'deliverable'],
                },
              },
              resumeStarBullet: { type: Type.STRING },
              interviewVivaQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    talkingPoint: { type: Type.STRING },
                  },
                  required: ['question', 'talkingPoint'],
                },
              },
            },
            required: [
              'projectTitle',
              'resumeGapDiagnosis',
              'whyRecruitersCare',
              'techStack',
              'timeline',
              'resumeStarBullet',
              'interviewVivaQuestions',
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.json(generateFallbackBlueprint(safeBranch, safeTarget, safeResume));
        return;
      }
      const parsed = JSON.parse(rawText.trim());
      res.json({
        ...parsed,
        generatedBy: 'gemini-live',
      });
    } catch (err) {
      console.error('Gemini blueprint fallback triggered:', err);
      res.json(generateFallbackBlueprint(safeBranch, safeTarget, safeResume));
    }
  });

  // Server-Side Gemini Endpoint 2: Automated 60-Minute AI Project Evaluator
  app.post('/api/ai/evaluate', async (req, res) => {
    const { projectTitle, stackSummary, architectureAndCode } = req.body ?? {};
    const safeTitle = String(projectTitle || 'Untitled Student Project').slice(0, 160);
    const safeStack = String(stackSummary || '').slice(0, 300);
    const safeCode = String(architectureAndCode || '').slice(0, 4000);

    if (!safeCode.trim()) {
      res.status(400).json({ error: 'Please provide project architecture or code details to evaluate.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json(generateFallbackEvaluation(safeTitle, safeStack, safeCode));
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Evaluate this final-year B.Tech student's submission from NxtWave's "Build Your First AI Project in 60 Minutes" workshop:

Project Title: ${safeTitle}
Tech Stack: ${safeStack}
Architecture & Code Summary:
${safeCode}`,
        config: {
          systemInstruction:
            'You are NxtWave’s Automated AI Project Rubric Evaluator. Grade rigorously and honestly across 4 criteria (maxScore 25 each, overallScore = sum out of 100): 1) Problem Framing & Campus Utility, 2) LLM Pipeline & Backend Architecture, 3) Guardrails, Security & Edge Cases (penalize exposed client API keys or Math.random mocks heavily!), 4) Placement Viva Defensibility. Set verdict to exact string "Placement-Ready Pass" (>=75), "Conditional Pass — Needs Hardening" (50-74), or "Thin Wrapper — Rebuild Required" (<50). Provide 3 concrete 15-minute fixes and 3 Viva cross-examination questions.',
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              verdict: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              rubric: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    criterion: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    observation: { type: Type.STRING },
                  },
                  required: ['criterion', 'score', 'maxScore', 'observation'],
                },
              },
              wrapperCheck: {
                type: Type.OBJECT,
                properties: {
                  isThinWrapper: { type: Type.BOOLEAN },
                  reason: { type: Type.STRING },
                },
                required: ['isThinWrapper', 'reason'],
              },
              fifteenMinuteFixes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              vivaQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    expectedAnswerSignal: { type: Type.STRING },
                  },
                  required: ['question', 'expectedAnswerSignal'],
                },
              },
            },
            required: [
              'overallScore',
              'verdict',
              'executiveSummary',
              'rubric',
              'wrapperCheck',
              'fifteenMinuteFixes',
              'vivaQuestions',
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.json(generateFallbackEvaluation(safeTitle, safeStack, safeCode));
        return;
      }
      const parsed = JSON.parse(rawText.trim());
      const normalizedVerdict =
        parsed.overallScore >= 75
          ? 'Placement-Ready Pass'
          : parsed.overallScore >= 50
            ? 'Conditional Pass — Needs Hardening'
            : 'Thin Wrapper — Rebuild Required';

      res.json({
        ...parsed,
        verdict: normalizedVerdict,
        generatedBy: 'gemini-live',
      });
    } catch (err) {
      console.error('Gemini evaluation fallback triggered:', err);
      res.json(generateFallbackEvaluation(safeTitle, safeStack, safeCode));
    }
  });

  // Server-Side Gemini Endpoint 3: Peer-Authentic Campus WhatsApp Copy Generator
  app.post('/api/ai/whatsapp', async (req, res) => {
    const { audienceType, referralCode, collegeName, projectTitle, appBaseUrl } = req.body ?? {};
    const code = String(referralCode || 'CR-SRMAP-01').trim();
    const college = String(collegeName || 'SRM University AP').trim();
    const project = String(projectTitle || 'Placement JD-to-Resume Gap Analyzer').trim();
    const shareUrl = `${String(appBaseUrl || 'https://nxtwave-build60.app').replace(/\/$/, '')}/?ref=${encodeURIComponent(code)}`;

    const fallbackMessages: Record<string, string> = {
      'Section CR Notice': `Quick heads-up for 4th-year ${college} folks sitting for upcoming drives:\n\nInstead of keeping generic MERN/To-Do clones on our resumes, a group of us are joining NxtWave's free hands-on sprint: *"Build Your First AI Project in 60 Minutes"*.\n\nYou paste your current resume first, get a custom 60-min build spec (e.g. *${project}*), and push a working repo + Viva prep before Sunday night.\n\nCheck your resume project gap & lock your seat with our section squad code *${code}*:\n${shareUrl}`,
      'Hostel Wing Peer Drop': `Bro if you still have that old CRUD/Titanic project on your placement resume, swap it this weekend. Found NxtWave's 60-min live AI build sprint—zero theory lectures, we actually ship *${project}* and test it on an automated Viva grader.\n\nNeed 2 more from ${college} on my squad code (*${code}*) so all 3 of us unlock the starter boilerplate repo free:\n${shareUrl}`,
      'Coding Club Sprint': `[${college} Builders] Co-hosting a 60-minute shipping challenge with NxtWave: *"Build Your First AI Project in 60 Minutes"*.\n\nGoal: Ship a schema-validated AI microservice (like *${project}*) + pass the automated 100-pt Viva Rubric.\n\nForm a 3-member squad using club tracking link *${code}* to unlock starter templates & compete for the Campus Build Grant:\n${shareUrl}`,
    };

    const defaultFallback =
      fallbackMessages[String(audienceType)] || fallbackMessages['Section CR Notice'];

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ message: defaultFallback, generatedBy: 'structured-engine' });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Write a short, high-trust WhatsApp message (under 95 words) for final-year B.Tech students at ${college}.
Context / Channel: ${audienceType || 'Section CR Notice'}
Workshop: NxtWave Free Live Online Workshop — "Build Your First AI Project in 60 Minutes"
Example project they build: ${project}
Squad Referral Code to include: ${code}
Exact Tracking Link to include at the end: ${shareUrl}`,
        config: {
          systemInstruction:
            'Write like a sharp final-year Indian B.Tech student / Class Rep texting classmates during placement season. Never use cringe marketing clichés, excessive emojis, or "Hurry up! Golden opportunity!". Focus on replacing generic CRUD resume projects with a deployable 60-minute AI build and forming a 3-person squad to unlock the starter repo + Viva grader. Return plain WhatsApp-formatted text only.',
          temperature: 0.5,
        },
      });

      const text = response.text?.trim();
      res.json({
        message: text || defaultFallback,
        generatedBy: text ? 'gemini-live' : 'structured-engine',
      });
    } catch (err) {
      console.error('Gemini WhatsApp copy fallback triggered:', err);
      res.json({ message: defaultFallback, generatedBy: 'structured-engine' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (typeof vite.ssrFixStacktrace === 'function') {
          vite.ssrFixStacktrace(e as Error);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NxtWave Build60 Growth Engine running at http://localhost:${PORT}`);
  });
}

startServer();
