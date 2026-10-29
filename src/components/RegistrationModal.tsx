import React, { useState } from 'react';
import { X, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';
import type { ChannelSource, StudentRegistration } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (student: StudentRegistration) => void;
  defaultReferralCode?: string;
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
  'CBIT Hyderabad',
  'Other Engineering College',
];

const BRANCHES = [
  'CSE',
  'CSE (AI & ML)',
  'IT',
  'CSE (Data Science)',
  'ECE',
  'EEE',
  'Mechanical / Civil',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
  defaultReferralCode = 'CR-SRMAP-01',
}) => {
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState(COLLEGES[0]);
  const [customCollege, setCustomCollege] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gradYear, setGradYear] = useState('2027');
  const [targetRole, setTargetRole] = useState('TCS Prime / Campus SDE');
  const [channel, setChannel] = useState<ChannelSource>('CR WhatsApp Group');
  const [referralCode, setReferralCode] = useState(defaultReferralCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successStudent, setSuccessStudent] = useState<StudentRegistration | null>(null);
  const [attributionInfo, setAttributionInfo] = useState<{
    creditedReferrer: string | null;
    referrerName: string;
    warning: string | null;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleQuickFill = () => {
    const samples = [
      { name: 'Aditya Varma', email: 'aditya.varma@srmap.edu.in', phone: '+91 98491 55210', branch: 'CSE', college: 'SRM University AP' },
      { name: 'Pooja Hegde', email: 'pooja.h@vnrvjiet.in', phone: '+91 94402 88192', branch: 'CSE (AI & ML)', college: 'VNR VJIET Hyderabad' },
      { name: 'Kiran Teja', email: 'kiran.teja@jntuh.ac.in', phone: '+91 97011 32490', branch: 'IT', college: 'JNTU Hyderabad' },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setFullName(picked.name);
    setEmail(picked.email);
    setPhone(picked.phone);
    setBranch(picked.branch);
    setCollege(picked.college);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please provide name, email and phone/WhatsApp contact number.');
      return;
    }

    setIsSubmitting(true);
    const resolvedCollege = college === 'Other Engineering College' && customCollege.trim() ? customCollege.trim() : college;

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          college: resolvedCollege,
          branch,
          gradYear,
          targetRole,
          projectTrack: 'HireLens 60 — Placement JD-to-Resume Gap Analyzer',
          channel,
          referredByCode: referralCode.trim() || null,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setErrorMsg(payload.error || 'Registration failed.');
      } else {
        setSuccessStudent(payload.student);
        setAttributionInfo({
          creditedReferrer: payload.creditedReferrer || null,
          referrerName: payload.referrerName || '',
          warning: payload.warning || null,
        });
        onRegistered(payload.student);
      }
    } catch {
      setErrorMsg('Network error while saving registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-200" />
            <div>
              <h2 className="text-base font-bold">Register Student for Workshop</h2>
              <p className="text-xs text-purple-200">
                &quot;Build Your First AI Project in 60 Minutes&quot; · 500-Target Tracker
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successStudent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Registration Verified & Saved!</h3>
                <p className="text-xs text-slate-600">
                  Seat reserved for <strong className="text-slate-800">{successStudent.fullName}</strong> ({successStudent.college} · {successStudent.branch})
                </p>
              </div>

              {/* Attribution Proof Box */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-left space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Referral Attribution Proof:</span>
                </div>
                {attributionInfo?.referrerName ? (
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Successfully credited <strong>+1 verified registration</strong> to Ambassador{' '}
                    <strong>{attributionInfo.referrerName}</strong> ({referralCode}). The live Leaderboard rankings and ScoutPoints have updated!
                  </p>
                ) : (
                  <p className="text-slate-600 text-[11px]">
                    Registered as Direct Campus Registration (No referral code attached).
                  </p>
                )}
                {attributionInfo?.warning && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 text-[11px] font-medium">
                    ⚠️ {attributionInfo.warning}
                  </p>
                )}
              </div>

              {/* Generated Squad Code */}
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-left space-y-2 text-xs">
                <p className="font-semibold text-purple-900">Generated Squad Referral Code for Student:</p>
                <div className="flex items-center justify-between font-mono font-bold text-sm text-purple-700 bg-white px-3 py-2 rounded-lg border border-purple-200">
                  <span>{successStudent.ownReferralCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(successStudent.ownReferralCode)}
                    className="px-2 py-1 text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-sans font-semibold cursor-pointer"
                  >
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <p className="text-[11px] text-purple-700">
                  Share this code with 2 classmates to unlock the Starter Boilerplate Repo and Automated AI Project Evaluator!
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessStudent(null);
                    setAttributionInfo(null);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Register Another Student
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
                >
                  View on Live Leaderboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center pb-1">
                <span className="text-xs text-slate-500 font-medium">Student & Contact Details</span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Fill Sample B.Tech Student</span>
                </button>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Supriya Kamireddy"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* College & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {COLLEGES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Engineering Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {college === 'Other Engineering College' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specify College Name
                  </label>
                  <input
                    type="text"
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    placeholder="Enter engineering college name"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Contact Details: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@srmap.edu.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Channel & Referral Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="2027">2027 (Final Year)</option>
                    <option value="2028">2028 (3rd Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discovery Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as ChannelSource)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="CR WhatsApp Group">CR WhatsApp Group</option>
                    <option value="Coding Club Sprint">Coding Club Sprint</option>
                    <option value="Peer Squad Referral">Peer Squad Referral</option>
                    <option value="Placement Cell Notice">Placement Cell Notice</option>
                    <option value="LinkedIn Direct">LinkedIn Direct</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ambassador Code
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="CR-SRMAP-01"
                    className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMsg}
                </p>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Instant free seat + Squad Code on submit
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 rounded-lg transition-colors shadow-sm shadow-purple-600/30 cursor-pointer"
                  >
                    {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
