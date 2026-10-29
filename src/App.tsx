import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ReferStrikeSidebar, type ReferStrikeTab } from './components/ReferStrikeSidebar';
import { ReferStrikeLeaderboard } from './components/ReferStrikeLeaderboard';
import { ReferStrikeDashboard } from './components/ReferStrikeDashboard';
import { DiagnosticStage } from './components/DiagnosticStage';
import { SquadReferralStage } from './components/SquadReferralStage';
import { ProjectEvaluatorStage } from './components/ProjectEvaluatorStage';
import { GrowthBriefStage } from './components/GrowthBriefStage';
import { RegistrationModal } from './components/RegistrationModal';
import { StudentRosterView } from './components/StudentRosterView';
import { BudgetLedgerView } from './components/BudgetLedgerView';
import { generate500Students } from './data/students500';
import type {
  CampaignStateResponse,
  StudentRegistration,
} from './types';

const INITIAL_500_STUDENTS = generate500Students();

const FALLBACK_INITIAL_STATE: CampaignStateResponse = {
  registrations: INITIAL_500_STUDENTS,
  ambassadors: [],
  summary: {
    totalRegistrations: 500,
    targetRegistrations: 500,
    liveSessionSignups: 0,
    totalClicks: 3089,
    budgetTotalInr: 2000,
    budgetCommittedInr: 1500,
    effectiveCacInr: 3.00,
    viralKFactor: 0.25,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ReferStrikeTab>('dashboard');
  const [campaignState, setCampaignState] =
    useState<CampaignStateResponse>(FALLBACK_INITIAL_STATE);
  const [activeStudent, setActiveStudent] =
    useState<StudentRegistration | null>(null);
  const [incomingRefCode, setIncomingRefCode] = useState<string>('CR-SRMAP-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatingAction, setSimulatingAction] = useState<'click' | 'signup' | null>(
    null
  );
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam && refParam.trim()) {
        setIncomingRefCode(refParam.trim().toUpperCase());
      }
    }

    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CampaignStateResponse | null) => {
        if (data) setCampaignState(data);
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleSimulateQuickAction = async (action: 'click' | 'signup', overrideCode?: string) => {
    setSimulatingAction(action);
    const targetCode = overrideCode || activeStudent?.ownReferralCode || 'CR-SRMAP-01';
    try {
      const res = await fetch('/api/referrals/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: targetCode, action }),
      });
      const payload = await res.json();
      if (res.ok && payload.state) {
        setCampaignState(payload.state);
        showToast(payload.message || 'Simulated event logged successfully.');
      }
    } finally {
      setSimulatingAction(null);
    }
  };

  const handleStudentRegistered = (student: StudentRegistration) => {
    setActiveStudent(student);
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CampaignStateResponse | null) => {
        if (data) setCampaignState(data);
      })
      .catch(() => {});
    showToast(
      `Seat reserved for ${student.fullName}. Personal Squad Code ${student.ownReferralCode} is active.`
    );
  };

  const handleStateUpdated = (
    nextState: CampaignStateResponse,
    feedbackMsg?: string
  ) => {
    setCampaignState(nextState);
    if (activeStudent) {
      const refreshed = nextState.registrations.find(
        (r) => r.id === activeStudent.id
      );
      if (refreshed) setActiveStudent(refreshed);
    }
    if (feedbackMsg) showToast(feedbackMsg);
  };

  const handleResetDemoState = async () => {
    try {
      const res = await fetch('/api/state/reset', { method: 'POST' });
      if (res.ok) {
        const next: CampaignStateResponse = await res.json();
        setCampaignState(next);
        setActiveStudent(null);
        showToast('Cohort state reset to 500+ final-year student dataset.');
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#dbe4df] py-6 px-3 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      {/* Outer Floating Dashboard Card matching user reference screenshot */}
      <div className="w-full max-w-[1540px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(20,35,40,0.12)] border border-slate-200/70 overflow-hidden flex flex-col min-h-[92vh]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs z-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3-Column Architecture: Sidebar + Main Content Canvas + Leaderboard */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Sidebar */}
          <ReferStrikeSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onResetSimulation={handleResetDemoState}
            onOpenRegistrationModal={() => setIsRegModalOpen(true)}
          />

          {/* Middle Main Content Area */}
          <div className="flex-1 flex flex-col bg-[#fcfdfe] overflow-y-auto">
            {activeTab === 'dashboard' && (
              <ReferStrikeDashboard
                campaignState={campaignState}
                onSimulateAction={handleSimulateQuickAction}
                onNavigateToReferrals={() => setActiveTab('referrals')}
                onNavigateToEvaluator={() => setActiveTab('evaluator')}
                onNavigateToRoster={() => setActiveTab('roster')}
                onNavigateToBudget={() => setActiveTab('budget')}
                onOpenRegistrationModal={() => setIsRegModalOpen(true)}
                simulatingAction={simulatingAction}
              />
            )}

            {activeTab === 'roster' && (
              <div className="p-6 lg:p-8">
                <StudentRosterView
                  students={campaignState.registrations}
                  onOpenRegisterModal={() => setIsRegModalOpen(true)}
                />
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="p-6 lg:p-8">
                <SquadReferralStage
                  campaignState={campaignState}
                  activeStudent={activeStudent}
                  onStateUpdated={handleStateUpdated}
                />
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="p-6 lg:p-8">
                <BudgetLedgerView
                  ambassadors={campaignState.ambassadors}
                  totalRegistrations={campaignState.summary.totalRegistrations}
                />
              </div>
            )}

            {activeTab === 'diagnostic' && (
              <div className="p-6 lg:p-8">
                <DiagnosticStage
                  summary={campaignState.summary}
                  initialReferralCode={incomingRefCode}
                  activeStudent={activeStudent}
                  onRegistered={handleStudentRegistered}
                  onNavigateToSquad={() => setActiveTab('referrals')}
                  onNavigateToEvaluator={() => setActiveTab('evaluator')}
                />
              </div>
            )}

            {activeTab === 'evaluator' && (
              <div className="p-6 lg:p-8">
                <ProjectEvaluatorStage />
              </div>
            )}

            {activeTab === 'brief' && (
              <div className="p-6 lg:p-8">
                <GrowthBriefStage />
              </div>
            )}
          </div>

          {/* Right Leaderboard Panel (matches reference image) */}
          <ReferStrikeLeaderboard
            ambassadors={campaignState.ambassadors}
            selectedCode={activeStudent?.ownReferralCode || 'CR-SRMAP-01'}
            onSelectAmbassador={(code) => {
              showToast(`Selected referral code ${code} for live simulation.`);
            }}
          />
        </div>
      </div>

      {/* Student Registration Modal */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onRegistered={(student) => {
          handleStudentRegistered(student);
          setIsRegModalOpen(false);
        }}
        defaultReferralCode={incomingRefCode || activeStudent?.ownReferralCode || 'CR-SRMAP-01'}
      />
    </div>
  );
}
