import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { DIAGNOSTIC_PRESETS } from '../data/campaignSeed';
import type {
  BlueprintResult,
  CampaignSummary,
  ChannelSource,
  StudentRegistration,
} from '../types';

interface DiagnosticStageProps {
  summary: CampaignSummary;
  initialReferralCode: string;
  activeStudent: StudentRegistration | null;
  onRegistered: (student: StudentRegistration) => void;
  onNavigateToSquad: () => void;
  onNavigateToEvaluator: () => void;
}

const COLLEGES = [
  'SRM University AP',
  'VNR VJIET Hyderabad',
  'JNTU Hyderabad',
  'VIT Vellore',
  'GRIET Hyderabad',
  'CVR College of Engineering',
  'GITAM Visakhapatnam',
  'Vasavi College of Engineering',
];

const BRANCHES = ['CSE', 'CSE (AI & ML)', 'IT', 'CSE (Data Science)', 'ECE', 'EEE'];

export const DiagnosticStage: React.FC<DiagnosticStageProps> = ({
  summary,
  initialReferralCode,
  activeStudent,
  onRegistered,
  onNavigateToSquad,
  onNavigateToEvaluator,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    DIAGNOSTIC_PRESETS[0].id
  );
  const [branch, setBranch] = useState<string>(DIAGNOSTIC_PRESETS[0].branch);
  const [targetCompany, setTargetCompany] = useState<string>(
    DIAGNOSTIC_PRESETS[0].targetCompany
  );
  const [currentResumeProjects, setCurrentResumeProjects] = useState<string>(
    DIAGNOSTIC_PRESETS[0].currentResumeProjects
  );

  const [blueprint, setBlueprint] = useState<BlueprintResult>({
    projectTitle: 'HireLens 60 — Placement JD-to-Resume Gap & Technical Viva Simulator',
    resumeGapDiagnosis:
      'CRUD clones (E-commerce, To-Do, Weather apps) appear on 80%+ of final-year resumes and give technical interviewers nothing concrete to probe in a 15-minute Viva.',
    whyRecruitersCare:
      'Recruiters at TCS Prime, Accenture GenAI, and Zoho prioritize candidates who demonstrate backend API key isolation, typed LLM JSON schemas, and deterministic fallback logic.',
    techStack: [
      'React + TypeScript',
      'Express Backend Proxy',
      'Gemini 3.8 Flash JSON Schema',
      'Prompt-Injection Sanitizer',
    ],
    timeline: [
      {
        window: 'Min 00–15',
        milestone: 'Backend Proxy & Sanitizer',
        deliverable:
          'Wire Express /api/match endpoint keeping credentials server-side with 12k character payload bounds.',
      },
      {
        window: 'Min 15–35',
        milestone: 'Structured Skill-Gap Schema',
        deliverable:
          'Configure typed JSON schema returning missingCoreSkills[], evidenceGaps[], and rewrittenBullets[].',
      },
      {
        window: 'Min 35–50',
        milestone: 'Viva Cross-Examination View',
        deliverable:
          'Build split UI displaying JD gap matrix alongside 3 tailored technical interview questions.',
      },
      {
        window: 'Min 50–60',
        milestone: 'Rubric Check & GitHub Ship',
        deliverable:
          'Pass the 100-pt automated Viva evaluator and push live deployment link for placement resume.',
      },
    ],
    resumeStarBullet:
      'Architected a full-stack placement readiness microservice in 60 minutes using TypeScript, Express, and Gemini structured JSON schemas, automating JD-to-resume skill gap analysis and Viva preparation with <2s latency.',
    interviewVivaQuestions: [
      {
        question:
          'Why did you route LLM requests through an Express proxy instead of calling the SDK from React?',
        talkingPoint:
          'Client-side calls leak API keys in browser DevTools and bypass server-side input sanitization and rate limits.',
      },
      {
        question:
          'How do you guarantee the UI never crashes on malformed LLM output?',
        talkingPoint:
          'Enforced a strict JSON responseSchema on the model response paired with deterministic fallback handling.',
      },
    ],
    generatedBy: 'structured-engine',
  });

  const [generatingBlueprint, setGeneratingBlueprint] = useState(false);
  const [copiedBullet, setCopiedBullet] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState(COLLEGES[0]);
  const [referralCodeInput, setReferralCodeInput] = useState(
    initialReferralCode || 'CR-SRMAP-01'
  );
  const [channel, setChannel] = useState<ChannelSource>('CR WhatsApp Group');
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const handleSelectPreset = (presetId: string) => {
    const found = DIAGNOSTIC_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(found.id);
    setBranch(found.branch);
    setTargetCompany(found.targetCompany);
    setCurrentResumeProjects(found.currentResumeProjects);
  };

  const handleGenerateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingBlueprint(true);
    try {
      const response = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          targetCompany,
          currentResumeProjects,
        }),
      });
      if (response.ok) {
        const data: BlueprintResult = await response.json();
        setBlueprint(data);
      }
    } catch {
      // Keep current structured blueprint visible on transient failure
    } finally {
      setGeneratingBlueprint(false);
    }
  };

  const handleCopyBullet = () => {
    navigator.clipboard.writeText(blueprint.resumeStarBullet);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 1800);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!fullName.trim() || !email.trim()) {
      setRegError('Enter your full name and college email to lock your workshop seat.');
      return;
    }

    setSubmittingReg(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone.trim() || '+91 98480 12345',
          college,
          branch,
          gradYear: '2027',
          targetRole: targetCompany,
          projectTrack: blueprint.projectTitle,
          channel,
          referredByCode: referralCodeInput,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setRegError(payload.error || 'Could not complete registration.');
      } else {
        onRegistered(payload.student);
        setFullName('');
        setEmail('');
      }
    } catch {
      setRegError('Network error while saving registration. Please retry.');
    } finally {
      setSubmittingReg(false);
    }
  };

  const progressPct = Math.min(
    100,
    Math.round((summary.totalRegistrations / summary.targetRegistrations) * 100)
  );

  return (
    <div className="space-y-10">
      {/* Hero Section + Full-Width Proof KPI Strip Below */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-500">
                NxtWave Free Online Workshop · Final-Year B.Tech Cohort (2027) · 60-Minute Live Build
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Replace Generic Resume Clones with a Deployed AI Microservice in 60 Minutes
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Why do 90% of free student webinars fail to convert? Because final-year students sitting for placements do not need another participation certificate—they need a defensible GitHub project before technical interviews. Diagnose your resume project gap below to generate your custom 60-minute workshop build spec and unlock your 3-peer campus squad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#diagnostic-workbench"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                Generate My 60-Min Spec
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onNavigateToEvaluator}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Test Automated Viva Grader
              </button>
            </div>
          </div>

          {/* Right Column: Closed-Loop Growth Flywheel Mechanism */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Why This Growth Asset Beats a Static Landing Page
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Value-first PLG funnel engineered for ₹2,000 / 7-day constraints
              </p>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              <div className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">01. Value Before Registration</p>
                  <p className="text-slate-600 mt-0.5">
                    Live Gemini diagnosis turns cold WhatsApp clicks into customized project specs.
                  </p>
                </div>
                <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                  41.4% CVR
                </span>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">02. Bounded 3-Peer Squad Loop</p>
                  <p className="text-slate-600 mt-0.5">
                    Inviting 2 classmates unlocks Starter Boilerplate + Automated Viva Grader.
                  </p>
                </div>
                <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                  K = {summary.viralKFactor}
                </span>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">03. CR Micro-Bounty Attribution</p>
                  <p className="text-slate-600 mt-0.5">
                    ₹100 unlocked strictly per 25 verified signups; ₹0 burned on cold Meta ads.
                  </p>
                </div>
                <span className="font-mono font-semibold text-emerald-700 shrink-0 tabular-nums">
                  ₹{summary.effectiveCacInr} CAC
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Day 5 Cohort Progress</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {summary.totalRegistrations} / {summary.targetRegistrations} ({progressPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Proof Strip Below Hero Split */}
        <div className="border-t border-slate-200 bg-slate-50/70 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500">Verified Final-Year Signups</p>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {summary.totalRegistrations}{' '}
              <span className="text-xs font-normal text-slate-500">
                / {summary.targetRegistrations} goal
              </span>
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500">Attributed Link Clicks</p>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {summary.totalClicks.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">across 19 groups</span>
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500">Budget Committed (of ₹2,000)</p>
            <p className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              ₹{summary.budgetCommittedInr.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">
                (₹{summary.effectiveCacInr}/student)
              </span>
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500">Live Demo Signups Added</p>
            <p className="text-xl font-bold font-mono text-blue-700 mt-1 tabular-nums">
              +{summary.liveSessionSignups}{' '}
              <span className="text-xs font-normal text-slate-500">in this session</span>
            </p>
          </div>
        </div>
      </section>

      {/* Active Registration Banner if user just signed up */}
      {activeStudent && (
        <section className="bg-white border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Workshop Seat Confirmed for {activeStudent.fullName} ({activeStudent.college})
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Personal Squad Referral Code:{' '}
              <span className="font-mono font-semibold text-slate-900">
                {activeStudent.ownReferralCode}
              </span>{' '}
              · Status: {activeStudent.squadStatus}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToSquad}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open My Squad Referral Link
          </button>
        </section>
      )}

      {/* Main 2-Zone Workbench: Left = AI Diagnostic Input, Right = Generated 60-Min Spec + 1-Step Seat Lock */}
      <section
        id="diagnostic-workbench"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Resume-Gap Diagnostic Input */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              01. Diagnose Current Placement Resume
            </h2>
            <p className="text-xs text-slate-500">
              Select a typical final-year B.Tech profile or enter custom projects to run live Gemini 3.8 Flash synthesis.
            </p>
          </div>

          {/* Interactive Segmented Preset Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">
              Quick-Load Student Persona
            </label>
            <div className="flex flex-col gap-1.5 p-1.5 bg-slate-100 rounded-lg">
              {DIAGNOSTIC_PRESETS.map((preset) => {
                const active = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    <span className="text-slate-400 font-normal shrink-0">
                      {preset.branch}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleGenerateBlueprint} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="diag-branch"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Engineering Branch
                </label>
                <select
                  id="diag-branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="diag-company"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Target Campus Drive
                </label>
                <input
                  id="diag-company"
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. TCS Prime, Zoho, Infosys SP"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="diag-projects"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Current Projects Listed on Resume
              </label>
              <textarea
                id="diag-projects"
                rows={4}
                value={currentResumeProjects}
                onChange={(e) => setCurrentResumeProjects(e.target.value)}
                placeholder="Paste 1-3 current mini-projects on your resume..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={generatingBlueprint}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {generatingBlueprint ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Custom 60-Min AI Spec...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate Custom 60-Minute Build Blueprint</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Personalized 60-Min Workshop Blueprint + Seat Registration */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {/* Blueprint Output */}
          <div className="p-6 space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs text-slate-500">
                Recommended 60-Minute Workshop Track ·{' '}
                {blueprint.generatedBy === 'gemini-live'
                  ? 'Synthesized Live via Gemini 3.8 Flash'
                  : 'Instant Placement Spec'}
              </p>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                Est. Build Time: 60 mins
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {blueprint.projectTitle}
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                <span className="font-semibold text-slate-900">Resume Risk Detected: </span>
                {blueprint.resumeGapDiagnosis}
              </p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                <span className="font-semibold text-slate-900">Why Interviewers Care: </span>
                {blueprint.whyRecruitersCare}
              </p>
            </div>

            {/* Unboxed Metadata Tech Stack */}
            <div className="text-xs text-slate-600 pt-1">
              <span className="font-semibold text-slate-900">Workshop Stack: </span>
              {blueprint.techStack.join(' · ')}
            </div>

            {/* 60-Minute Execution Breakdown */}
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs font-semibold text-slate-900 mb-3">
                Minute-by-Minute Workshop Execution Plan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blueprint.timeline.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-mono font-semibold text-blue-700 tabular-nums">
                      {step.window} · {step.milestone}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.deliverable}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* STAR Resume Bullet Preview */}
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-900">
                  Resume Bullet You Unlock After Shipping
                </p>
                <button
                  type="button"
                  onClick={handleCopyBullet}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
                >
                  {copiedBullet ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                • {blueprint.resumeStarBullet}
              </p>
            </div>

            {/* Placement Viva Preview */}
            <div className="border-t border-slate-200 pt-4 space-y-2.5">
              <p className="text-xs font-semibold text-slate-900">
                 Viva Defense Questions Covered in Session
              </p>
              <div className="space-y-2">
                {blueprint.interviewVivaQuestions.map((item, i) => (
                  <div key={i} className="text-xs space-y-0.5">
                    <p className="font-medium text-slate-900">
                      Q{i + 1}: {item.question}
                    </p>
                    <p className="text-slate-600">Defense Signal: {item.talkingPoint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1-Step Workshop Seat + Squad Registration Form */}
          <div id="seat-registration-form" className="p-6 bg-slate-50/60 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                02. Lock Free Workshop Seat & Generate Squad Referral Code
              </h3>
              <p className="text-xs text-slate-600">
                Saves this project track to your seat and issues your personal 3-peer Squad Code (attributes incoming Campus CR or peer referral codes automatically).
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Full Name (Student) *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Supriya Kamireddy"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Email ID *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@srmap.edu.in"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="reg-college"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Engineering College
                  </label>
                  <select
                    id="reg-college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {COLLEGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reg-channel"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Discovery Channel
                  </label>
                  <select
                    id="reg-channel"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as ChannelSource)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="CR WhatsApp Group">CR WhatsApp Group</option>
                    <option value="Coding Club Sprint">Coding Club Sprint</option>
                    <option value="Peer Squad Referral">Peer Squad Referral</option>
                    <option value="Placement Cell Notice">Placement Cell Notice</option>
                    <option value="LinkedIn Direct">LinkedIn Direct</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reg-ref"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Referral / CR Code
                  </label>
                  <input
                    id="reg-ref"
                    type="text"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value)}
                    placeholder="CR-SRMAP-01"
                    className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {regError && (
                <p role="alert" className="text-xs font-medium text-red-600">
                  {regError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-slate-500">
                  Zero fee · Instant Starter Repo + Squad Code on submit
                </p>
                <button
                  type="submit"
                  disabled={submittingReg}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {submittingReg ? 'Reserving Seat...' : 'Reserve Seat & Get Squad Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
