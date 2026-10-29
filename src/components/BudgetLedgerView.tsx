import React from 'react';
import {
  ShieldCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Gift,
  PhoneCall,
  Lock,
} from 'lucide-react';
import type { AmbassadorNode } from '../types';

interface BudgetLedgerViewProps {
  ambassadors: AmbassadorNode[];
  totalRegistrations: number;
}

export const BudgetLedgerView: React.FC<BudgetLedgerViewProps> = ({
  ambassadors,
  totalRegistrations,
}) => {
  const totalBountiesEarned = ambassadors.reduce(
    (acc, a) => acc + Math.floor(a.signups / 25) * 100,
    0
  );
  const prizePoolFixed = 500;
  const airtimeCommitted = 200; // 4 active hostel CR recharges disbursed so far
  const totalCommitted = Math.min(2000, totalBountiesEarned + prizePoolFixed + airtimeCommitted);
  const remainingReserve = Math.max(0, 2000 - totalCommitted);
  const effectiveCac = Number((totalCommitted / Math.max(1, totalRegistrations)).toFixed(2));

  const budgetRules = [
    {
      id: 'cr-bounties',
      category: 'Campus Ambassador Milestone Bounties',
      maxCapInr: 1200,
      sharePct: '60%',
      currentAllocated: totalBountiesEarned,
      icon: Award,
      color: 'indigo',
      eligibilityCondition:
        'Pay ₹100 UPI/voucher strictly AFTER an ambassador delivers 25 verified final-year registrations from their institutional domain. (Max 12 milestone unlocks × ₹100 = ₹1,200 hard cap).',
      disbursementMethod: 'Post-verification UPI transfer or Amazon Gift Voucher within 24h of milestone audit.',
      currentStatus: `${Math.floor(totalBountiesEarned / 100)} of 12 Milestones Unlocked (₹${totalBountiesEarned} earned)`,
    },
    {
      id: 'squad-prize',
      category: 'Top-3 Campus Build Squad Prize Pool',
      maxCapInr: 500,
      sharePct: '25%',
      currentAllocated: prizePoolFixed,
      icon: Gift,
      color: 'purple',
      eligibilityCondition:
        'Awarded live at Minute 60 of the workshop to the top 3 student squads whose deployed 60-minute AI projects score highest on the automated 100-pt rubric (1st: ₹250, 2nd: ₹150, 3rd: ₹100).',
      disbursementMethod: 'Instant API credits or gift cards delivered to squad leads immediately after rubric evaluation.',
      currentStatus: 'Locked in escrow for live workshop showcase (100% committed)',
    },
    {
      id: 'cr-airtime',
      category: 'High-Density Hostel CR Airtime Booster',
      maxCapInr: 300,
      sharePct: '15%',
      currentAllocated: airtimeCommitted,
      icon: PhoneCall,
      color: 'emerald',
      eligibilityCondition:
        'Up to 6 micro-recharges (₹50 mobile 5G data voucher) for active Class Reps actively executing live WhatsApp group drops and answering classmate queries during 8:30 PM hostel peak hours.',
      disbursementMethod: 'Direct mobile data pack top-up to verified CR phone numbers.',
      currentStatus: `4 of 6 Recharges Disbursed (₹${airtimeCommitted} utilized, ₹100 reserve remaining)`,
    },
    {
      id: 'paid-ads',
      category: 'Paid Instagram / Meta Cold Ads',
      maxCapInr: 0,
      sharePct: '0%',
      currentAllocated: 0,
      icon: TrendingDown,
      color: 'slate',
      eligibilityCondition:
        'Deliberately ₹0 allocation. Engineering student cold traffic costs ₹90–₹140 CAC on Meta ads, exhausting the entire ₹2,000 budget on fewer than 20 non-vetted leads with zero peer trust.',
      disbursementMethod: 'Not applicable — 100% peer organic execution.',
      currentStatus: 'Excluded by design — Zero capital waste',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audited Financial Ledger
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 rounded-md border border-indigo-200">
              Hard Ceiling: ₹2,000.00
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            ₹2,000 Budget Transparency Ledger & Incentive Rules
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Every rupee is performance-gated and strictly capped. Zero upfront spend; incentives are unlocked only upon verified final-year registrations and live project submissions.
          </p>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shrink-0 text-right min-w-[200px]">
          <span className="text-[10px] text-slate-400 font-medium block">Total Spend / Ceiling</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ₹{totalCommitted.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ ₹2,000</span>
          </span>
          <span className="text-[10px] text-slate-300 block mt-1">
            Remaining Buffer: <strong className="text-white">₹{remainingReserve}</strong>
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Campaign Budget</span>
          <div className="text-2xl font-bold font-mono text-slate-900">₹2,000.00</div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> Non-negotiable ceiling
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Committed & Disbursed</span>
          <div className="text-2xl font-bold font-mono text-purple-700">₹{totalCommitted.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500">
            {Math.round((totalCommitted / 2000) * 100)}% of ceiling deployed
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Remaining Liquidity Buffer</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">₹{remainingReserve}</div>
          <span className="text-[11px] text-slate-500">Day 6–7 emergency reserve</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-medium">Effective Blended CAC</span>
          <div className="text-2xl font-bold font-mono text-indigo-700">₹{effectiveCac}</div>
          <span className="text-[11px] text-slate-500">
            Per verified registration ({totalRegistrations} students)
          </span>
        </div>
      </div>

      {/* Incentive Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Incentive Line Items & Eligibility Protocol</h3>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Budget Overrun Verified
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {budgetRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div key={rule.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{rule.category}</h4>
                      <span className="text-[11px] text-slate-400">
                        Allocation Share: {rule.sharePct} of ₹2,000 Total Capital
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <div className="text-base font-bold font-mono text-slate-900">
                      Cap: ₹{rule.maxCapInr.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-purple-700 font-semibold font-mono">
                      Spent: ₹{rule.currentAllocated.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs border-t border-slate-50">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700 block">Eligibility Condition:</span>
                    <p className="text-slate-600 leading-relaxed">{rule.eligibilityCondition}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700 block">Disbursement & Verification:</span>
                    <p className="text-slate-600 leading-relaxed">{rule.disbursementMethod}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700 block">Current Cohort Status:</span>
                    <p className="text-emerald-700 font-medium leading-relaxed">{rule.currentStatus}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ambassador Live Bounty Audit */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Ambassador Milestone Audit (₹100 per 25 Signups)</h3>
            <p className="text-[11px] text-slate-500">Real-time bounty accrual based on verified institutional registrations</p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-700">₹{totalBountiesEarned} Total Earned</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ambassadors.map((amb) => {
            const milestones = Math.floor(amb.signups / 25);
            const bounty = milestones * 100;
            const nextMilestoneNeeded = 25 - (amb.signups % 25);
            return (
              <div key={amb.code} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{amb.name}</span>
                  <span className="font-mono font-bold text-emerald-700">₹{bounty}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{amb.college}</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="font-mono text-slate-600">{amb.signups} signups</span>
                  <span className="text-[10px] text-indigo-600 font-medium">
                    {nextMilestoneNeeded} to +₹100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
