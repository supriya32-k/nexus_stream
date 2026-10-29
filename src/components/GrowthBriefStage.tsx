import React from 'react';
import { FileText } from 'lucide-react';
import {
  AI_DECISION_NOTES,
  BUDGET_ALLOCATION,
  SEVEN_DAY_PLAN,
} from '../data/campaignSeed';

export const GrowthBriefStage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Executive Header + Original Challenge PDF Link */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-slate-500">
            NxtWave Growth Intern Challenge · Round 1 Executive Strategy & AI Decision Log
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            500 Final-Year B.Tech Registrations in 7 Days on ₹2,000
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Complete strategic breakdown covering target student psychology, prioritized campus distribution channels, ₹2,000 unit economics, what changed from initial brainstorm to shipped asset, and which AI suggestions were deliberately rejected.
          </p>
        </div>

        <a
          href="/assets/aistudio/NxtWave_Growth_Intern___Growth_Challenge_be8482f2.pdf"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <FileText className="w-4 h-4 text-slate-700" />
          <span>View Challenge Brief PDF</span>
        </a>
      </section>

      {/* Part 1: Understand the Student + Channel Math */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            01. Understand the Final-Year Student
          </h2>
          <div className="divide-y divide-slate-200 text-xs space-y-3">
            <div className="pt-1 space-y-1">
              <p className="font-semibold text-slate-900">Who Exactly Are We Targeting?</p>
              <p className="text-slate-600 leading-relaxed">
                7th & 8th semester B.Tech students (CSE, IT, AIML, Data Science, and IT-pivoting ECE) in Tier-2/Tier-3 engineering colleges sitting for campus drives (TCS Prime/Digital, Infosys SP, Accenture, Cognizant GenC Next, Zoho) within the next 30–90 days.
              </p>
            </div>
            <div className="pt-3 space-y-1">
              <p className="font-semibold text-slate-900">Why Would They Care?</p>
              <p className="text-slate-600 leading-relaxed">
                Their resumes currently list identical CRUD clones (To-Do apps, E-commerce carts, Titanic CSV notebooks). Technical interviewers now immediately ask for deployed GenAI/API architecture—causing high placement anxiety, yet 40-hour courses feel impossible to finish before drives.
              </p>
            </div>
            <div className="pt-3 space-y-1">
              <p className="font-semibold text-slate-900">What Actually Makes Them Register?</p>
              <p className="text-slate-600 leading-relaxed">
                Not "Free Webinar + Certificate." They register when they see a concrete 60-minute build spec tailored to their resume gap BEFORE signing up, paired with a GitHub repo + Viva defense questions they can put on their resume the same night.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            02. Prioritized 3-Channel Acquisition Stack (No 20-Idea Fluff)
          </h2>
          <div className="divide-y divide-slate-200 text-xs space-y-3">
            <div className="pt-1 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  Channel 1 · Class Representative (CR) Official Section WhatsApp Groups
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Recruit 15 final-year CRs across 8 colleges. Official class notice groups command 80%+ read rates vs 4% email open rates. Incentivized strictly at ₹100 per 25 verified signups.
                </p>
              </div>
              <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                235 signups (47%)
              </span>
            </div>

            <div className="pt-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  Channel 2 · Bounded 3-Student Placement Build Squad Loop
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Every registrant gets a Squad Code; inviting just 2 peers unlocks the Starter Boilerplate Repo + Automated Viva Evaluator. Converts individual signups into 3-person study pods.
                </p>
              </div>
              <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                165 signups (33%)
              </span>
            </div>

            <div className="pt-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  Channel 3 · College Coding / AI Club Co-Hosted Sprints
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Partner with 4 student coding clubs as "Campus Build Partners" with live college leaderboard recognition and Top-3 Squad API Grant eligibility—zero sponsorship fee required.
                </p>
              </div>
              <span className="font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                100 signups (20%)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: ₹2,000 Budget Allocation Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              03. ₹2,000 Capital Allocation & CAC Math
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero upfront spend; 100% tied to verified registration milestones and workshop completion.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
            Target Blended CAC: ₹4.00 / registration (₹2,000 / 500 verified final-year signups)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">Incentive Line Item</th>
                <th className="py-3 px-4 text-right">Max Payout Cap</th>
                <th className="py-3 px-4">Eligibility Condition</th>
                <th className="py-3 px-4">Disbursement Control</th>
                <th className="py-3 px-6 text-right">Expected Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {BUDGET_ALLOCATION.map((item) => (
                <tr key={item.allocation} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    <div>{item.allocation}</div>
                    <span className="text-[10px] text-slate-400 font-normal">Share: {item.sharePct} of ₹2,000</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ₹{item.amountInr.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-900 block mb-0.5">Eligibility:</span>
                    {item.eligibilityCondition}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed text-[11px]">
                    {item.mechanism}
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono text-slate-800 whitespace-nowrap">
                    {item.expectedYield}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 3: 7-Day Execution Schedule */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            04. Day-by-Day 7-Day Execution Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paced to front-load CR seeding on Days 1–3, audit bottlenecks on Day 4, and trigger incomplete-squad nudges on Days 5–7.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">Day & Phase</th>
                <th className="py-3 px-4">Operational Action</th>
                <th className="py-3 px-4">Primary Channel</th>
                <th className="py-3 px-4 text-right">Daily Signups</th>
                <th className="py-3 px-6 text-right">Cumulative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {SEVEN_DAY_PLAN.map((row) => (
                <tr key={row.day} className="hover:bg-slate-50/70">
                  <td className="py-3 px-6 whitespace-nowrap">
                    <p className="font-mono font-semibold text-slate-900">{row.day}</p>
                    <p className="text-slate-500">{row.phase}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md leading-relaxed">
                    {row.primaryAction}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {row.channelFocus}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                    +{row.dailyTarget}
                  </td>
                  <td className="py-3 px-6 text-right font-mono font-semibold text-blue-700 tabular-nums">
                    {row.cumulativeTarget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 4: Show Us How You Thought + AI Decision Log */}
      <section className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            05. Show Us How You Thought & AI Learning Notes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-900">
                Q1: What changed between your first idea and final solution?
              </p>
              <p className="text-slate-600 leading-relaxed">
                My first idea was building a clean referral code generator and leaderboard dashboard (as suggested in early AI brainstorming). When I pressure-tested it from a final-year B.Tech student’s perspective, I realized a referral code does not solve cold apathy—why would a student facing TCS/Infosys interviews next month care enough to register or share? I pivoted to a closed-loop PLG product that delivers a personalized Gemini Resume-Gap Project Spec BEFORE registration, bounds referrals into achievable 3-person squads, and automates Minute-60 project evaluation.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-semibold text-slate-900">
                Q2: If you had another 24 hours, what would you improve?
              </p>
              <p className="text-slate-600 leading-relaxed">
                1) Wire automated WhatsApp Cloud API / n8n webhook triggers at T-24h and T-1h that send each squad their custom pre-configured GitHub Codespace link so zero workshop minutes are lost to local Node/Python setup. 2) Add live GitHub repository URL fetching inside the Automated Evaluator to inspect actual commit history and file trees automatically rather than pasted code summaries.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-bold text-slate-900">
            Q3: What I Asked AI → What AI Suggested → What I Deliberately Rejected & Changed
          </p>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {AI_DECISION_NOTES.map((note) => (
              <div
                key={note.step}
                className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs"
              >
                <div className="lg:col-span-3 space-y-1">
                  <p className="font-semibold text-slate-900">{note.step}</p>
                  <p className="text-slate-600 leading-relaxed">{note.whatIAsked}</p>
                </div>
                <div className="lg:col-span-4 space-y-1">
                  <p className="font-semibold text-red-700">AI Suggestion (Rejected)</p>
                  <p className="text-slate-600 leading-relaxed">
                    {note.whatAiSuggested}
                  </p>
                </div>
                <div className="lg:col-span-5 space-y-1">
                  <p className="font-semibold text-emerald-700">
                    What Changed & Growth Judgment
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {note.whatIChangedAndWhy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
