import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Play,
  XCircle,
} from 'lucide-react';
import { SAMPLE_SUBMISSIONS } from '../data/campaignSeed';
import type { EvaluationResult } from '../types';

export const ProjectEvaluatorStage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    SAMPLE_SUBMISSIONS[0].id
  );
  const [studentName, setStudentName] = useState<string>(
    SAMPLE_SUBMISSIONS[0].studentName
  );
  const [projectTitle, setProjectTitle] = useState<string>(
    SAMPLE_SUBMISSIONS[0].projectTitle
  );
  const [stackSummary, setStackSummary] = useState<string>(
    SAMPLE_SUBMISSIONS[0].stackSummary
  );
  const [architectureAndCode, setArchitectureAndCode] = useState<string>(
    SAMPLE_SUBMISSIONS[0].architectureAndCode
  );

  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [openVivaIdx, setOpenVivaIdx] = useState<number | null>(0);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);

  const [result, setResult] = useState<EvaluationResult>({
    overallScore: 89,
    verdict: 'Placement-Ready Pass',
    executiveSummary:
      'Strong 60-minute engineering execution: server-side API isolation, typed JSON schema contract, explicit payload guardrails, and clear placement utility.',
    rubric: [
      {
        criterion: 'Problem Framing & Campus Utility',
        score: 24,
        maxScore: 25,
        observation:
          'Directly solves final-year JD-to-resume mismatch with immediately actionable output.',
      },
      {
        criterion: 'LLM Pipeline & Backend Architecture',
        score: 23,
        maxScore: 25,
        observation:
          'Clean Express proxy with structured JSON schema prevents UI parsing failures.',
      },
      {
        criterion: 'Guardrails, Security & Edge Cases',
        score: 21,
        maxScore: 25,
        observation:
          'Includes 12k char cap, injection stripping, and HTTP 429 fallback; could add per-IP rate limiting.',
      },
      {
        criterion: 'Placement Viva Defensibility',
        score: 21,
        maxScore: 25,
        observation:
          'Benchmarked on 5 campus JDs with latency metrics—ready for technical panel walkthrough.',
      },
    ],
    wrapperCheck: {
      isThinWrapper: false,
      reason:
        'Combines dual-document comparison, server-side sanitization, typed JSON schema contracts, and fallback resilience.',
    },
    fifteenMinuteFixes: [
      'Add an in-memory per-IP rate limiter (10 requests/min) on /api/analyze to protect live demo quota.',
      'Log p50/p95 latency and schema validation pass rates to display concrete reliability proof in your README.',
      'Add a side-by-side diff view comparing original vs rewritten STAR resume bullets.',
    ],
    vivaQuestions: [
      {
        question:
          'Walk me through what happens in your Express route when the upstream model returns HTTP 429.',
        expectedAnswerSignal:
          'Catches error cleanly, logs status code without leaking stack traces, and returns deterministic keyword-diff fallback.',
      },
      {
        question:
          'Why did you cap payload size at 12,000 characters instead of accepting arbitrary PDFs?',
        expectedAnswerSignal:
          'Bounds token cost and p95 latency (<2s) while comfortably fitting a 2-page resume plus a standard campus JD.',
      },
      {
        question:
          'How do you verify rewritten resume bullets remain truthful to the student’s actual work?',
        expectedAnswerSignal:
          'Require every rewritten bullet in the JSON schema to cite an explicit source project string from the input resume.',
      },
    ],
    generatedBy: 'structured-engine',
  });

  const handleLoadSample = (id: string) => {
    const sample = SAMPLE_SUBMISSIONS.find((s) => s.id === id);
    if (!sample) return;
    setSelectedPresetId(sample.id);
    setStudentName(sample.studentName);
    setProjectTitle(sample.projectTitle);
    setStackSummary(sample.stackSummary);
    setArchitectureAndCode(sample.architectureAndCode);
    setEvalError(null);
  };

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalError(null);
    if (!architectureAndCode.trim()) {
      setEvalError('Paste architecture notes or code summary to run rubric grading.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          stackSummary,
          architectureAndCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEvalError(data.error || 'Evaluation request failed.');
      } else {
        setResult(data);
        setOpenVivaIdx(0);
      }
    } catch {
      setEvalError('Network error while contacting evaluator endpoint.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleCopyReceipt = () => {
    const receipt = [
      `NxtWave Build60 — Automated Project Verification Receipt`,
      `Builder: ${studentName}`,
      `Project: ${projectTitle}`,
      `Score: ${result.overallScore}/100 (${result.verdict})`,
      `Summary: ${result.executiveSummary}`,
      `Top Next Upgrade: ${result.fifteenMinuteFixes[0] || 'N/A'}`,
    ].join('\n');
    navigator.clipboard.writeText(receipt);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 1800);
  };

  const renderVerdictIndicator = (verdict: EvaluationResult['verdict']) => {
    if (verdict === 'Placement-Ready Pass') {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{verdict}</span>
        </span>
      );
    }
    if (verdict === 'Conditional Pass — Needs Hardening') {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{verdict}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700">
        <XCircle className="w-4 h-4 shrink-0" />
        <span>{verdict}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Explanation */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-medium text-slate-500">
            Workshop Minute-60 Automation · Solves Mentor Grading Bottleneck & Drives 64% Live Show-Up
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Automated 60-Minute AI Project Rubric & Viva Evaluator
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            When 500 students register and 320+ ship live at Minute 60, human mentors cannot manually review 320 repositories. This server-side Gemini 3.8 Flash evaluator audits architecture, detects exposed client keys or hardcoded mocks, scores 4 rubric axes, and generates custom technical interview Viva questions in 2 seconds.
          </p>
        </div>

        <div className="shrink-0 text-left lg:text-right space-y-1">
          <p className="text-xs text-slate-500">Squad Grant Qualification Threshold</p>
          <p className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            75 / 100 pts
          </p>
          <p className="text-xs text-slate-500">Zero client-key exposure required</p>
        </div>
      </section>

      {/* 2-Zone Evaluation Workbench */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Submission Input & Sample Switcher */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              01. Student Minute-60 Submission
            </h2>
            <p className="text-xs text-slate-500">
              Test how the rubric distinguishes genuine backend engineering from thin prompt wrappers or static mocks.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Load Realistic Workshop Submission
            </label>
            <div className="flex flex-col gap-1.5 p-1.5 bg-slate-100 rounded-lg">
              {SAMPLE_SUBMISSIONS.map((sample) => {
                const active = selectedPresetId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleLoadSample(sample.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sample.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleRunEvaluation} className="space-y-4">
            <div>
              <label
                htmlFor="eval-student"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Student & Campus
              </label>
              <input
                id="eval-student"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="eval-title"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Project Title
              </label>
              <input
                id="eval-title"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="eval-stack"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Declared Stack
              </label>
              <input
                id="eval-stack"
                type="text"
                value={stackSummary}
                onChange={(e) => setStackSummary(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="eval-code"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                README Architecture & Core Pipeline Code Summary
              </label>
              <textarea
                id="eval-code"
                rows={8}
                value={architectureAndCode}
                onChange={(e) => setArchitectureAndCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono leading-relaxed bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {evalError && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {evalError}
              </p>
            )}

            <button
              type="submit"
              disabled={evaluating}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running 4-Axis Rubric Audit...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Evaluate Project & Generate Viva Questions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Zone: Structured Rubric Scorecard + Thin-Wrapper Detector + Viva Drill */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
          {/* Top Verdict Header */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">
                Evaluation Report ·{' '}
                {result.generatedBy === 'gemini-live'
                  ? 'Graded Live via Gemini 3.8 Flash'
                  : 'Deterministic Engineering Rubric'}
              </p>
              <div className="pt-0.5">{renderVerdictIndicator(result.verdict)}</div>
              <p className="text-xs text-slate-600 pt-1 max-w-xl leading-relaxed">
                {result.executiveSummary}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <p className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {result.overallScore}
                <span className="text-base font-normal text-slate-400">/100</span>
              </p>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
              >
                {copiedReceipt ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Receipt Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Verification Receipt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Axis Engineering Rubric Breakdown */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                02. Criterion-Level Breakdown
              </h3>
              <span className="text-xs text-slate-500">4 × 25 pts max</span>
            </div>

            <div className="space-y-4">
              {result.rubric.map((row, idx) => {
                const pct = Math.min(
                  100,
                  Math.round((row.score / Math.max(1, row.maxScore)) * 100)
                );
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-900">
                        {row.criterion}
                      </span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {row.score} / {row.maxScore}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-opacity duration-150 ${
                          pct >= 75
                            ? 'bg-emerald-600'
                            : pct >= 50
                              ? 'bg-amber-500'
                              : 'bg-red-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600">{row.observation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wrapper Audit + 15-Minute Actionable Hardening Steps */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                Thin-Wrapper & Security Check
              </h3>
              <p className="text-xs font-semibold text-slate-800">
                {result.wrapperCheck.isThinWrapper
                  ? 'Flagged: Wrapper / Mock Vulnerability Detected'
                  : 'Cleared: Genuine Multi-Step Pipeline'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.wrapperCheck.reason}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">
                Prescribed 15-Minute Upgrades
              </h3>
              <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                {result.fifteenMinuteFixes.map((fix, idx) => (
                  <li key={idx}>{fix}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Interactive Placement Viva Cross-Examination */}
          <div className="p-6 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                03. Generated Technical Interview Viva Questions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click each question to inspect the target engineering signal recruiters listen for.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {result.vivaQuestions.map((vq, idx) => {
                const isOpen = openVivaIdx === idx;
                return (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenVivaIdx(isOpen ? null : idx)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-slate-900">
                        Viva Q{idx + 1}: {vq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 text-xs text-slate-600 bg-slate-50/60 leading-relaxed">
                        <span className="font-semibold text-slate-900">
                          Expected Strong Signal:{' '}
                        </span>
                        {vq.expectedAnswerSignal}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
