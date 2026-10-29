import React, { useState } from 'react';
import type { AmbassadorNode } from '../types';

interface ReferStrikeLeaderboardProps {
  ambassadors: AmbassadorNode[];
  onSelectAmbassador?: (code: string) => void;
  selectedCode?: string;
}

const AVATAR_PALETTES = [
  { bg: '#fed7aa', skin: '#fcd34d', hair: '#78350f', shirt: '#ea580c' },
  { bg: '#bfdbfe', skin: '#fed7aa', hair: '#1e293b', shirt: '#2563eb' },
  { bg: '#fbcfe8', skin: '#fed7aa', hair: '#831843', shirt: '#db2777' },
  { bg: '#e9d5ff', skin: '#fde047', hair: '#4c1d95', shirt: '#7c3aed' },
  { bg: '#bbf7d0', skin: '#fbcfe8', hair: '#064e3b', shirt: '#059669' },
  { bg: '#fed7aa', skin: '#fef08a', hair: '#9a3412', shirt: '#d97706' },
  { bg: '#c7d2fe', skin: '#fed7aa', hair: '#312e81', shirt: '#4f46e5' },
  { bg: '#fecdd3', skin: '#fed7aa', hair: '#881337', shirt: '#e11d48' },
  { bg: '#e2e8f0', skin: '#fde047', hair: '#334155', shirt: '#475569' },
  { bg: '#fef08a', skin: '#fed7aa', hair: '#713f12', shirt: '#ca8a04' },
];

const BADGE_COLORS = [
  'bg-rose-100 text-rose-600',
  'bg-amber-100 text-amber-600',
  'bg-purple-100 text-purple-600',
  'bg-orange-100 text-orange-600',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-600',
  'bg-blue-100 text-blue-600',
  'bg-indigo-100 text-indigo-600',
  'bg-teal-100 text-teal-700',
  'bg-emerald-100 text-emerald-700',
];

export const ReferStrikeLeaderboard: React.FC<ReferStrikeLeaderboardProps> = ({
  ambassadors,
  onSelectAmbassador,
  selectedCode,
}) => {
  const [activeLeaderboardType, setActiveLeaderboardType] = useState<'ambassadors' | 'colleges'>('ambassadors');

  // Dynamic ranking of ambassadors based on live verified signups
  const sortedAmbassadors = [...ambassadors].sort((a, b) => b.signups - a.signups);

  const leaderboardAmbassadors = sortedAmbassadors.map((amb, index) => {
    const rank = index + 1;
    const points = (amb.signups * 250 + amb.clicks * 12).toLocaleString();
    return {
      rank,
      name: amb.name,
      college: amb.college,
      code: amb.code,
      signups: amb.signups,
      points,
      badgeColor: BADGE_COLORS[index % BADGE_COLORS.length],
      medal: rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : undefined,
    };
  });

  // Dynamic college rankings calculated from active ambassadors
  const collegeMap: Record<string, { signups: number; crCount: number; state: string }> = {
    'SRM University AP': { signups: 0, crCount: 4, state: 'Andhra Pradesh' },
    'VNR VJIET Hyderabad': { signups: 0, crCount: 3, state: 'Telangana' },
    'JNTU Hyderabad': { signups: 0, crCount: 3, state: 'Telangana' },
    'VIT Vellore': { signups: 0, crCount: 3, state: 'Tamil Nadu' },
    'GRIET Hyderabad': { signups: 0, crCount: 2, state: 'Telangana' },
    'CVR College of Engineering': { signups: 0, crCount: 2, state: 'Telangana' },
    'GITAM Visakhapatnam': { signups: 0, crCount: 2, state: 'Andhra Pradesh' },
    'Vasavi College of Engineering': { signups: 0, crCount: 1, state: 'Telangana' },
    'CBIT Hyderabad': { signups: 0, crCount: 2, state: 'Telangana' },
    'BVRIT Hyderabad': { signups: 0, crCount: 2, state: 'Telangana' },
  };

  ambassadors.forEach((a) => {
    if (collegeMap[a.college]) {
      collegeMap[a.college].signups += a.signups;
    } else {
      collegeMap[a.college] = { signups: a.signups, crCount: 1, state: 'Engineering' };
    }
  });

  const sortedColleges = Object.entries(collegeMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.signups - a.signups);

  const totalCollegeSignups = sortedColleges.reduce((acc, c) => acc + c.signups, 0) || 1;

  const collegeLeaderboard = sortedColleges.map((c, idx) => {
    const rank = idx + 1;
    return {
      rank,
      name: c.name,
      state: c.state,
      signups: c.signups,
      crCount: c.crCount,
      sharePct: `${((c.signups / totalCollegeSignups) * 100).toFixed(1)}%`,
      medal: rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : undefined,
      badgeColor: BADGE_COLORS[idx % BADGE_COLORS.length],
    };
  });

  return (
    <div className="w-72 xl:w-80 shrink-0 bg-white border-l border-slate-100 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Leaderboard</h2>
            <p className="text-[10px] text-slate-400 font-medium">Live Campus Performance</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Live Reactive
          </span>
        </div>

        {/* Tab Toggle: Top Ambassadors vs Top Colleges */}
        <div className="flex p-0.5 bg-slate-100 rounded-lg mb-3">
          <button
            type="button"
            onClick={() => setActiveLeaderboardType('ambassadors')}
            className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              activeLeaderboardType === 'ambassadors'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ambassadors
          </button>
          <button
            type="button"
            onClick={() => setActiveLeaderboardType('colleges')}
            className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              activeLeaderboardType === 'colleges'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Top Colleges
          </button>
        </div>

        {activeLeaderboardType === 'ambassadors' ? (
          <>
            {/* Column Headers */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-400 pb-2 px-1 border-b border-slate-50">
              <span className="col-span-2">Rank</span>
              <span className="col-span-5">Ambassador</span>
              <span className="col-span-2 text-right">Signups</span>
              <span className="col-span-3 text-right">ScoutPoints</span>
            </div>

            {/* Ambassador Rows */}
            <div className="divide-y divide-slate-50 mt-1 max-h-[580px] overflow-y-auto">
              {leaderboardAmbassadors.map((row, idx) => {
                const p = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
                const isSelected = selectedCode && row.code.toUpperCase() === selectedCode.toUpperCase();
                return (
                  <div
                    key={row.code}
                    onClick={() => onSelectAmbassador?.(row.code)}
                    className={`grid grid-cols-12 items-center py-2 px-1 text-xs transition-colors rounded-lg cursor-pointer ${
                      isSelected ? 'bg-indigo-50/80 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="col-span-2 flex items-center">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${row.badgeColor}`}
                      >
                        {row.rank}
                      </span>
                    </div>

                    <div className="col-span-5 flex items-center gap-2 min-w-0 pr-1">
                      <div
                        className="w-7 h-7 rounded-full shrink-0 overflow-hidden flex items-center justify-center shadow-2xs"
                        style={{ backgroundColor: p.bg }}
                      >
                        <svg viewBox="0 0 40 40" className="w-full h-full">
                          <circle cx="20" cy="16" r="8" fill={p.skin} />
                          <path d="M12 12 Q20 4 28 12 Q26 8 20 8 Q14 8 12 12" fill={p.hair} />
                          <path d="M8 36 C8 26, 14 24, 20 24 C26 24, 32 26, 32 36 Z" fill={p.shirt} />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight flex items-center gap-1">
                          <span>{row.name}</span>
                          {row.medal && <span className="text-[10px]">{row.medal}</span>}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">{row.college}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {row.signups}
                      </span>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="font-mono text-[11px] font-bold text-purple-700 tabular-nums">
                        {row.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Column Headers */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-slate-400 pb-2 px-1 border-b border-slate-50">
              <span className="col-span-2">Rank</span>
              <span className="col-span-6">Campus</span>
              <span className="col-span-2 text-right">Signups</span>
              <span className="col-span-2 text-right">Share</span>
            </div>

            {/* College Rows */}
            <div className="divide-y divide-slate-50 mt-1 max-h-[580px] overflow-y-auto">
              {collegeLeaderboard.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-12 items-center py-2.5 px-1 text-xs hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${row.badgeColor}`}
                    >
                      {row.rank}
                    </span>
                  </div>

                  <div className="col-span-6 min-w-0 pr-1">
                    <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight flex items-center gap-1">
                      <span>{row.name}</span>
                      {row.medal && <span className="text-[10px]">{row.medal}</span>}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {row.state} · {row.crCount} CR{row.crCount > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {row.signups}
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="font-mono text-[11px] font-semibold text-indigo-700 tabular-nums">
                      {row.sharePct}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Privacy Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400">
          Privacy Protected: Public leaderboard shows ambassador totals only. Student contact info is restricted to authorized coordinators.
        </p>
      </div>
    </div>
  );
};
