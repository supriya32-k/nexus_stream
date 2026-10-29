import React, { useMemo, useState } from 'react';
import { Download, RotateCcw, Search } from 'lucide-react';
import type { CampaignStateResponse, ChannelSource } from '../types';

interface CampaignAnalyticsStageProps {
  campaignState: CampaignStateResponse;
  onResetDemoState: () => void;
}

const CHANNEL_FILTERS: ('All Channels' | ChannelSource)[] = [
  'All Channels',
  'CR WhatsApp Group',
  'Coding Club Sprint',
  'Peer Squad Referral',
  'Placement Cell Notice',
  'LinkedIn Direct',
];

export const CampaignAnalyticsStage: React.FC<CampaignAnalyticsStageProps> = ({
  campaignState,
  onResetDemoState,
}) => {
  // Interactive 7-Day Growth Model Sliders (all labeled with units)
  const [seededCrs, setSeededCrs] = useState<number>(15);
  const [groupReachPerCr, setGroupReachPerCr] = useState<number>(140);
  const [whatsappCtrPct, setWhatsappCtrPct] = useState<number>(28);
  const [diagnosticToSignupPct, setDiagnosticToSignupPct] = useState<number>(56);
  const [peerKFactor, setPeerKFactor] = useState<number>(0.65);

  // Attribution Ledger Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChannelFilter, setActiveChannelFilter] =
    useState<'All Channels' | ChannelSource>('All Channels');

  const simulationMath = useMemo(() => {
    const totalImpressions = seededCrs * groupReachPerCr;
    const directClicks = Math.round(totalImpressions * (whatsappCtrPct / 100));
    const seedSignups = Math.round(directClicks * (diagnosticToSignupPct / 100));
    // Viral peer squad expansion (1 cycle bounded within 7 days)
    const viralSignups = Math.round(seedSignups * peerKFactor);
    const totalProjected = seedSignups + viralSignups;

    // Performance-gated CR bounty: ₹100 per 25 verified signups, capped at ₹1,200 + ₹500 squad prize pool + ₹300 reserve if needed
    const crBountyCost = Math.min(1200, Math.floor(seedSignups / 25) * 100);
    const squadPoolCost = 500;
    const reserveUsed = totalProjected < 500 ? 300 : 0;
    const totalBudgetSpent = Math.min(2000, crBountyCost + squadPoolCost + reserveUsed);
    const projectedCac = (totalBudgetSpent / Math.max(1, totalProjected)).toFixed(2);

    // 7-day S-curve weights summing to 1.0
    const dailyWeights = [0.07, 0.18, 0.21, 0.16, 0.14, 0.13, 0.11];
    let running = 0;
    const dailySeries = dailyWeights.map((w, idx) => {
      const added =
        idx === 6
          ? Math.max(0, totalProjected - running)
          : Math.round(totalProjected * w);
      running += added;
      return {
        dayLabel: `D${idx + 1}`,
        added,
        cumulative: running,
      };
    });

    return {
      totalImpressions,
      directClicks,
      seedSignups,
      viralSignups,
      totalProjected,
      totalBudgetSpent,
      projectedCac,
      dailySeries,
    };
  }, [seededCrs, groupReachPerCr, whatsappCtrPct, diagnosticToSignupPct, peerKFactor]);

  const filteredRegistrations = useMemo(() => {
    return campaignState.registrations.filter((reg) => {
      const matchesChannel =
        activeChannelFilter === 'All Channels' ||
        reg.channel === activeChannelFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesChannel;
      const haystack = `${reg.fullName} ${reg.college} ${reg.branch} ${reg.ownReferralCode} ${reg.referredByCode || ''} ${reg.projectTrack}`.toLowerCase();
      return matchesChannel && haystack.includes(q);
    });
  }, [campaignState.registrations, activeChannelFilter, searchQuery]);

  const handleDownloadCsv = () => {
    const headers = [
      'Student Name',
      'Email',
      'College',
      'Branch',
      'Channel',
      'Referred By',
      'Own Squad Code',
      'Referrals Converted',
      'Squad Status',
      'Cohort Type',
    ];
    const rows = filteredRegistrations.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.college}"`,
      `"${r.branch}"`,
      `"${r.channel}"`,
      `"${r.referredByCode || 'Direct'}"`,
      `"${r.ownReferralCode}"`,
      r.referralsConverted,
      `"${r.squadStatus}"`,
      `"${r.cohortType}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nxtwave-build60-attribution-ledger.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const maxChartY = Math.max(600, simulationMath.totalProjected + 60);

  return (
    <div className="space-y-8">
      {/* Section 1: Interactive 7-Day Unit Economics & K-Factor Simulator */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-xs font-medium text-slate-500">
              Quantitative Growth Model · Stress-Test Assumptions Under ₹2,000 Cap
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              7-Day Registration & Viral K-Factor Simulator
            </h1>
            <p className="text-sm text-slate-600">
              Adjust CR seeding count, WhatsApp click-through rate, diagnostic conversion, and squad referral factor to inspect how the 500-student goal holds up even under conservative campus assumptions.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <p className="text-xs text-slate-500">Projected 7-Day Signups</p>
              <p
                className={`text-2xl font-bold font-mono tabular-nums ${
                  simulationMath.totalProjected >= 500
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {simulationMath.totalProjected.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({simulationMath.totalProjected >= 500 ? 'Clears 500 Goal' : 'Below 500 Goal'})
                </span>
              </p>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <p className="text-xs text-slate-500">Simulated CAC</p>
              <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                ₹{simulationMath.projectedCac}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left: Labeled Sliders with Explicit Units */}
          <div className="lg:col-span-5 p-6 space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sl-crs" className="font-medium text-slate-700">
                  Seeded Class Reps & Club Leads
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {seededCrs} nodes
                </span>
              </div>
              <input
                id="sl-crs"
                type="range"
                min={6}
                max={25}
                step={1}
                value={seededCrs}
                onChange={(e) => setSeededCrs(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sl-reach" className="font-medium text-slate-700">
                  Avg Final-Year Reach per WhatsApp Group
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {groupReachPerCr} students
                </span>
              </div>
              <input
                id="sl-reach"
                type="range"
                min={80}
                max={220}
                step={10}
                value={groupReachPerCr}
                onChange={(e) => setGroupReachPerCr(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sl-ctr" className="font-medium text-slate-700">
                  Group-to-Diagnostic Click Rate (CTR)
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {whatsappCtrPct}%
                </span>
              </div>
              <input
                id="sl-ctr"
                type="range"
                min={12}
                max={45}
                step={1}
                value={whatsappCtrPct}
                onChange={(e) => setWhatsappCtrPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sl-cvr" className="font-medium text-slate-700">
                  Blueprint-to-Seat Signup Rate
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {diagnosticToSignupPct}%
                </span>
              </div>
              <input
                id="sl-cvr"
                type="range"
                min={25}
                max={75}
                step={1}
                value={diagnosticToSignupPct}
                onChange={(e) => setDiagnosticToSignupPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="sl-k" className="font-medium text-slate-700">
                  3-Peer Squad Viral Multiplier (K-Factor)
                </label>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {peerKFactor.toFixed(2)} peers / signup
                </span>
              </div>
              <input
                id="sl-k"
                type="range"
                min={0.15}
                max={1.1}
                step={0.05}
                value={peerKFactor}
                onChange={(e) => setPeerKFactor(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">Reach</p>
                <p className="font-mono font-semibold text-slate-900 tabular-nums">
                  {simulationMath.totalImpressions.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Direct Signups</p>
                <p className="font-mono font-semibold text-slate-900 tabular-nums">
                  {simulationMath.seedSignups}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Squad Viral</p>
                <p className="font-mono font-semibold text-blue-700 tabular-nums">
                  +{simulationMath.viralSignups}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live SVG Cumulative Trajectory Chart */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Cumulative 7-Day Registration Trajectory vs 500 Target
                </h2>
                <p className="text-xs text-slate-500">
                  Budget Spent: ₹{simulationMath.totalBudgetSpent.toLocaleString()} of ₹2,000 cap · Remaining Reserve: ₹
                  {(2000 - simulationMath.totalBudgetSpent).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Dashed line = 500 Target
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 560 220"
                className="w-full h-56 overflow-visible"
                role="img"
                aria-label="7-day cumulative registration trajectory chart"
              >
                {/* Horizontal gridlines */}
                {[0, 250, 500].map((val) => {
                  const y = 185 - (val / maxChartY) * 155;
                  const isGoal = val === 500;
                  return (
                    <g key={val}>
                      <line
                        x1={44}
                        x2={536}
                        y1={y}
                        y2={y}
                        stroke={isGoal ? '#2563eb' : '#e2e8f0'}
                        strokeWidth={isGoal ? 1.5 : 1}
                        strokeDasharray={isGoal ? '5 4' : undefined}
                      />
                      <text
                        x={36}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-slate-500 text-[10px] font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Polyline connecting Day 1..Day 7 */}
                <polyline
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  points={simulationMath.dailySeries
                    .map((pt, idx) => {
                      const x = 68 + idx * 74;
                      const y = 185 - (pt.cumulative / maxChartY) * 155;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Data nodes and labels */}
                {simulationMath.dailySeries.map((pt, idx) => {
                  const x = 68 + idx * 74;
                  const y = 185 - (pt.cumulative / maxChartY) * 155;
                  return (
                    <g key={pt.dayLabel}>
                      <circle
                        cx={x}
                        cy={y}
                        r={4.5}
                        className={
                          pt.cumulative >= 500 ? 'fill-emerald-600' : 'fill-blue-600'
                        }
                      />
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="fill-slate-900 text-[11px] font-mono font-semibold"
                      >
                        {pt.cumulative}
                      </text>
                      <text
                        x={x}
                        y={204}
                        textAnchor="middle"
                        className="fill-slate-600 text-[11px] font-medium"
                      >
                        {pt.dayLabel}
                      </text>
                      <text
                        x={x}
                        y={216}
                        textAnchor="middle"
                        className="fill-slate-400 text-[9px] font-mono"
                      >
                        +{pt.added}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Filterable & Searchable Student Registration Attribution Ledger */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Student Attribution & Squad Status Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every new seat reservation or simulated peer signup appears immediately at the top with full referral lineage.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
              <button
                type="button"
                onClick={onResetDemoState}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cohort</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Segmented Channel Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {CHANNEL_FILTERS.map((ch) => {
                const active = activeChannelFilter === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setActiveChannelFilter(ch)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, college, code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-900">
              No student records match your current filter
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Clear the search query or switch back to All Channels to inspect attributed student registrations.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveChannelFilter('All Channels');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-6">Student & Campus</th>
                  <th className="py-3 px-4">60-Min Build Track</th>
                  <th className="py-3 px-4">Channel & Source Code</th>
                  <th className="py-3 px-4">Own Squad Code</th>
                  <th className="py-3 px-6 text-right">Squad Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6">
                      <p className="font-semibold text-slate-900">{reg.fullName}</p>
                      <p className="text-slate-500">
                        {reg.branch} · {reg.gradYear} · {reg.college}
                      </p>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-800 truncate">{reg.projectTrack}</p>
                      <p className="text-slate-500">
                        {reg.cohortType} · {reg.registeredAt}
                      </p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-slate-800">{reg.channel}</p>
                      <p className="font-mono text-slate-500">
                        via {reg.referredByCode || 'Direct'}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {reg.ownReferralCode}
                    </td>
                    <td className="py-3 px-6 text-right font-mono tabular-nums whitespace-nowrap">
                      <span
                        className={
                          reg.referralsConverted >= 2
                            ? 'font-semibold text-emerald-700'
                            : reg.referralsConverted === 1
                              ? 'font-semibold text-blue-700'
                              : 'text-slate-600'
                        }
                      >
                        {reg.squadStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
