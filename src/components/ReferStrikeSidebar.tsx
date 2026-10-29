import React from 'react';
import {
  LayoutDashboard,
  Users,
  Bell,
  Briefcase,
  Share2,
  Award,
  Sparkles,
  FileText,
  LogOut,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';

export type ReferStrikeTab =
  | 'dashboard'
  | 'roster'
  | 'referrals'
  | 'budget'
  | 'diagnostic'
  | 'evaluator'
  | 'brief';

interface ReferStrikeSidebarProps {
  activeTab: ReferStrikeTab;
  onSelectTab: (tab: ReferStrikeTab) => void;
  onResetSimulation: () => void;
  onOpenRegistrationModal?: () => void;
}

const NAV_ITEMS: { id: ReferStrikeTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Growth Dashboard', icon: LayoutDashboard },
  { id: 'roster', label: '500 Final-Yr Students', icon: GraduationCap },
  { id: 'referrals', label: 'Ambassador & Squads', icon: Share2 },
  { id: 'budget', label: '₹2,000 Budget Ledger', icon: Award },
  { id: 'diagnostic', label: 'Pre-Signup Hook', icon: FileText },
  { id: 'evaluator', label: 'Squad Unlock Reward', icon: Sparkles },
  { id: 'brief', label: 'Growth Plan & Brief', icon: FileText },
];

export const ReferStrikeSidebar: React.FC<ReferStrikeSidebarProps> = ({
  activeTab,
  onSelectTab,
  onResetSimulation,
  onOpenRegistrationModal,
}) => {
  return (
    <aside className="w-56 xl:w-60 shrink-0 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4">
      <div className="space-y-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <span className="font-bold text-sm tracking-tighter">RS</span>
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Refer<span className="text-indigo-600">Strike</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">NxtWave Growth</span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="text-center py-2 px-1">
          <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200">
              <circle cx="50" cy="40" r="22" fill="#d1d5db" />
              <path d="M22 88 C 22 66, 36 60, 50 60 C 64 60, 78 66, 78 88 Z" fill="#9ca3af" />
              <circle cx="50" cy="40" r="16" fill="#f3f4f6" />
              <path d="M38 32 C 44 26, 56 26, 62 32 C 60 25, 40 25, 38 32" fill="#374151" />
            </svg>
          </div>
          <h3 className="mt-2.5 text-xs font-bold text-slate-900">
            Datta Supriya
          </h3>
          <p className="text-[10px] text-slate-400 truncate max-w-[180px] mx-auto">
            dattasupriya@srmap.edu.in
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold text-indigo-700 bg-indigo-50 rounded-full">
            Lead Campus Ambassador
          </span>
        </div>

        {/* Quick Registration Button */}
        {onOpenRegistrationModal && (
          <button
            type="button"
            onClick={onOpenRegistrationModal}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
          >
            <span>+ Register Student</span>
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f0ebff] text-[#7c3aed] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7c3aed]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          type="button"
          onClick={onResetSimulation}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Cohort</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('brief')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span>Challenge Brief</span>
        </button>
      </div>
    </aside>
  );
};
