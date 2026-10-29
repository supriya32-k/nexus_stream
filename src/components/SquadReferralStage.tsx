import React, { useState, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Lock,
  MousePointerClick,
  RefreshCw,
  Unlock,
  UserPlus,
} from 'lucide-react';
import type {
  AmbassadorNode,
  CampaignStateResponse,
  StudentRegistration,
} from '../types';

interface SquadReferralStageProps {
  campaignState: CampaignStateResponse;
  activeStudent: StudentRegistration | null;
  onStateUpdated: (nextState: CampaignStateResponse, feedbackMsg?: string) => void;
}

const AUDIENCE_TEMPLATES = [
  'Section CR Notice',
  'Hostel Wing Peer Drop',
  'Coding Club Sprint',
] as const;

export const SquadReferralStage: React.FC<SquadReferralStageProps> = ({
  campaignState,
  activeStudent,
  onStateUpdated,
}) => {
  const featuredStudent =
    activeStudent ||
    campaignState.registrations.find((r) => r.cohortType === 'Live Demo Signup') ||
    campaignState.registrations[1] || // Aishwarya (1/2 unlocked — great for testing 1->2 unlock!)
    campaignState.registrations[0];

  const [selectedCode, setSelectedCode] = useState<string>(
    featuredStudent?.ownReferralCode || 'CR-SRMAP-01'
  );
  const [audienceType, setAudienceType] = useState<string>('Section CR Notice');
  const [whatsappCopy, setWhatsappCopy] = useState<string>('');
  const [generatingCopy, setGeneratingCopy] = useState<boolean>(false);
  const [copiedMsg, setCopiedMsg] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [simulatingAction, setSimulatingAction] = useState<'click' | 'signup' | null>(
    null
  );

  // Sync selectedCode when a new student registers in Diagnostic tab
  useEffect(() => {
    if (activeStudent?.ownReferralCode) {
      setSelectedCode(activeStudent.ownReferralCode);
    }
  }, [activeStudent?.ownReferralCode]);

  const matchedStudent = campaignState.registrations.find(
    (r) => r.ownReferralCode.toUpperCase() === selectedCode.toUpperCase()
  );
  const matchedAmbassador: AmbassadorNode | undefined =
    campaignState.ambassadors.find(
      (a) => a.code.toUpperCase() === selectedCode.toUpperCase()
    );

  const currentCollege =
    matchedStudent?.college || matchedAmbassador?.college || 'SRM University AP';
  const currentProject =
    matchedStudent?.projectTrack ||
    'HireLens 60 — Placement JD-to-Resume Gap Analyzer';

  const appOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://nxtwave-build60.app';
  const referralUrl = `${appOrigin}/?ref=${encodeURIComponent(selectedCode)}`;

  const fetchWhatsAppMessage = async (
    targetAudience: string,
    code: string,
    college: string,
    project: string
  ) => {
    setGeneratingCopy(true);
    try {
      const res = await fetch('/api/ai/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audienceType: targetAudience,
          referralCode: code,
          collegeName: college,
          projectTitle: project,
          appBaseUrl: appOrigin,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWhatsappCopy(data.message);
      }
    } catch {
      // Keep existing message if offline
    } finally {
      setGeneratingCopy(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppMessage(audienceType, selectedCode, currentCollege, currentProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audienceType, selectedCode]);

  const handleSimulateReferral = async (action: 'click' | 'signup') => {
    setSimulatingAction(action);
    try {
      const res = await fetch('/api/referrals/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedCode,
          action: action === 'click' ? 'click' : 'signup',
        }),
      });
      const payload = await res.json();
      if (res.ok && payload.state) {
        onStateUpdated(payload.state, payload.message);
      }
    } finally {
      setSimulatingAction(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1800);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappCopy);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 1800);
  };

  const referralsDone = matchedStudent
    ? matchedStudent.referralsConverted
    : matchedAmbassador
      ? matchedAmbassador.signups
      : 0;
  const clicksDone = matchedStudent
    ? matchedStudent.referralClicks
    : matchedAmbassador
      ? matchedAmbassador.clicks
      : 0;

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            Viral Distribution & Attribution Engine · Bounded 3-Student Squads + Verified CR Micro-Grants
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            WhatsApp Campus Seeding & Live Referral Loop
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Open-ended "Refer 25 friends" contests fail because 95% of students quit immediately. Instead, every registrant only needs 2 classmates to complete a 3-person Placement Build Squad, while Class Representatives unlock ₹100 micro-bounties strictly per 25 verified signups.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-left">
            <p className="text-xs text-slate-500">Active Tracking Code</p>
            <select
              aria-label="Select active tracking code to inspect or simulate"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="mt-1 text-sm font-mono font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              <optgroup label="Student Squad Codes (2-Peer Unlock)">
                {campaignState.registrations.slice(0, 8).map((stu) => (
                  <option key={stu.ownReferralCode} value={stu.ownReferralCode}>
                    {stu.ownReferralCode} — {stu.fullName} ({stu.referralsConverted}/2)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Campus CR & Club Codes (₹100 / 25 Signups)">
                {campaignState.ambassadors.map((amb) => (
                  <option key={amb.code} value={amb.code}>
                    {amb.code} — {amb.college} ({amb.signups} signups)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </section>

      {/* 2-Column Split: Left = Squad Milestone Unlocker + Live Simulator, Right = AI WhatsApp Message Studio */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Squad Milestone Ladder + Interactive Simulation Controls */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          <div className="p-6 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  01. Squad Unlock Progression
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspecting{' '}
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedCode}
                  </span>{' '}
                  · {currentCollege}
                </p>
              </div>
              <div className="text-right font-mono text-xs text-slate-600 tabular-nums">
                {clicksDone} clicks · {referralsDone} converted
              </div>
            </div>

            {/* Shareable Attribution URL Bar */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs font-mono text-slate-700 truncate">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* 3-Step Unlock Ladder (No nested card boxes — clean hairline list) */}
            <div className="divide-y divide-slate-200 pt-1">
              <div className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Tier 0 · Workshop Seat + Personalized 60-Min Blueprint
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Unlocked immediately upon completing Resume-Gap Diagnostic.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-700 shrink-0">
                  Unlocked
                </span>
              </div>

              <div className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {referralsDone >= 1 ? (
                    <Unlock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Tier 1 · Starter GitHub Boilerplate + Schema Prompt Pack
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Requires 1 classmate joining via your squad code so nobody starts from a blank repo.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-semibold shrink-0 tabular-nums ${
                    referralsDone >= 1 ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {referralsDone >= 1 ? 'Unlocked (1/1)' : 'Locked (0/1)'}
                </span>
              </div>

              <div className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {referralsDone >= 2 ? (
                    <Unlock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Tier 2 · Full 3-Peer Squad + Automated Viva Grader & ₹500 Grant Pool
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Requires 2 classmates registered. Squads of 3 show up live at 64% vs 22% solo signups.
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-semibold shrink-0 tabular-nums ${
                    referralsDone >= 2 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {referralsDone >= 2
                    ? 'Unlocked (2/2)'
                    : `${Math.min(2, referralsDone)}/2 Joined`}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Referral Event Simulator for Evaluators */}
          <div className="p-6 bg-slate-50/70 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-900">
                Interactive Attribution Tester (Try Live)
              </p>
              <p className="text-xs text-slate-600">
                Trigger a simulated WhatsApp click or classmate signup on{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {selectedCode}
                </span>{' '}
                to verify real-time Squad Unlocks, K-factor updates, and CR ₹100 milestone payouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={simulatingAction !== null}
                onClick={() => handleSimulateReferral('click')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MousePointerClick className="w-4 h-4 text-slate-600" />
                <span>
                  {simulatingAction === 'click'
                    ? 'Logging Click...'
                    : 'Simulate WhatsApp Link Click (+1)'}
                </span>
              </button>

              <button
                type="button"
                disabled={simulatingAction !== null}
                onClick={() => handleSimulateReferral('signup')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {simulatingAction === 'signup'
                    ? 'Converting Peer...'
                    : 'Simulate Classmate Signup (+1)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Peer WhatsApp Broadcast Composer */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                02. Peer-Authentic WhatsApp Drop Composer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Corporate posters get muted in 4th-year groups. Generate peer-native copy with deep-linked attribution.
              </p>
            </div>
          </div>

          {/* Segmented Channel Context Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {AUDIENCE_TEMPLATES.map((tmpl) => {
              const active = audienceType === tmpl;
              return (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => setAudienceType(tmpl)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tmpl}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Message Preview ({currentCollege})</span>
              <button
                type="button"
                disabled={generatingCopy}
                onClick={() =>
                  fetchWhatsAppMessage(
                    audienceType,
                    selectedCode,
                    currentCollege,
                    currentProject
                  )
                }
                className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 disabled:opacity-50 cursor-pointer"
              >
                {generatingCopy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Regenerate with Gemini</span>
              </button>
            </div>

            <textarea
              aria-label="Generated WhatsApp message copy"
              rows={7}
              value={whatsappCopy}
              onChange={(e) => setWhatsappCopy(e.target.value)}
              className="w-full p-3.5 text-xs leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500">
              Optimal send window: 8:30 PM – 10:15 PM IST (Hostel Wi-Fi peak)
            </p>
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedMsg ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied for WhatsApp</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy WhatsApp Drop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Campus CR & Club Micro-Bounty Leaderboard */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              03. Campus CR & Club Attribution Leaderboard (₹100 Milestone Micro-Grants)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bounty unlocks strictly per 25 verified final-year registrations. Click any row to load that code in the simulator above.
            </p>
          </div>
          <p className="text-xs font-mono text-slate-600 tabular-nums">
            Total CR Bounties Accrued: ₹
            {campaignState.ambassadors.reduce((acc, a) => acc + a.bountyEarnedInr, 0)}{' '}
            / ₹1,200 cap
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">Tracking Code</th>
                <th className="py-3 px-4">Campus Node & Role</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Clicks</th>
                <th className="py-3 px-4 text-right">Verified Signups</th>
                <th className="py-3 px-4 text-right">CVR</th>
                <th className="py-3 px-6 text-right">Bounty Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {campaignState.ambassadors.map((amb) => {
                const cvr = ((amb.signups / Math.max(1, amb.clicks)) * 100).toFixed(1);
                const isSelected =
                  amb.code.toUpperCase() === selectedCode.toUpperCase();
                return (
                  <tr
                    key={amb.code}
                    onClick={() => setSelectedCode(amb.code)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-6 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {amb.code}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{amb.name}</p>
                      <p className="text-slate-500">
                        {amb.college} · {amb.role}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {amb.channel}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                      {amb.clicks}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {amb.signups}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {cvr}%
                    </td>
                    <td className="py-3 px-6 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      ₹{amb.bountyEarnedInr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
