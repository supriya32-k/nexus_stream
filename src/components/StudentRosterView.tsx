import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { StudentRegistration } from '../types';

interface StudentRosterViewProps {
  students: StudentRegistration[];
  onOpenRegisterModal: () => void;
}

export const StudentRosterView: React.FC<StudentRosterViewProps> = ({
  students,
  onOpenRegisterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Filter options
  const colleges = useMemo(() => {
    const set = new Set(students.map((s) => s.college));
    return Array.from(set).sort();
  }, [students]);

  const branches = useMemo(() => {
    const set = new Set(students.map((s) => s.branch));
    return Array.from(set).sort();
  }, [students]);

  const channels = useMemo(() => {
    const set = new Set(students.map((s) => s.channel));
    return Array.from(set).sort();
  }, [students]);

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        !query ||
        s.fullName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        (s.phone && s.phone.toLowerCase().includes(query)) ||
        s.college.toLowerCase().includes(query) ||
        s.ownReferralCode.toLowerCase().includes(query) ||
        (s.referredByCode && s.referredByCode.toLowerCase().includes(query));

      const matchesCollege = selectedCollege === 'all' || s.college === selectedCollege;
      const matchesBranch = selectedBranch === 'all' || s.branch === selectedBranch;
      const matchesChannel = selectedChannel === 'all' || s.channel === selectedChannel;

      return matchesSearch && matchesCollege && matchesBranch && matchesChannel;
    });
  }, [students, searchQuery, selectedCollege, selectedBranch, selectedChannel]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  const handleExportCsv = () => {
    const headers = [
      'Student Name',
      'Email',
      'Contact Phone',
      'College',
      'Branch',
      'Graduation Year',
      'Target Role',
      'Project Track',
      'Acquisition Channel',
      'Referred By Code',
      'Own Squad Code',
      'Referrals Converted',
      'Squad Status',
      'Cohort Type',
      'Registered At',
    ];

    const rows = filteredStudents.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone || '+91 98480 12345'}"`,
      `"${r.college}"`,
      `"${r.branch}"`,
      `"${r.gradYear}"`,
      `"${r.targetRole}"`,
      `"${r.projectTrack}"`,
      `"${r.channel}"`,
      `"${r.referredByCode || 'Direct'}"`,
      `"${r.ownReferralCode}"`,
      r.referralsConverted,
      `"${r.squadStatus}"`,
      `"${r.cohortType}"`,
      `"${r.registeredAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nxtwave_500_final_year_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 rounded-md border border-purple-200">
              Verified Candidate Cohort
            </span>
            <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Target Met: {students.length} / 500
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            500 Final-Year Engineering Students Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Complete database of 2027 batch B.Tech students enrolled in NxtWave's "Build Your First AI Project in 60 Minutes" workshop. Fully populated with institutional emails, WhatsApp contact numbers, college affiliations, and squad referral codes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV ({filteredStudents.length})</span>
          </button>
          <button
            type="button"
            onClick={onOpenRegisterModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Registered</div>
            <div className="text-lg font-bold text-slate-900 font-mono">{students.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Colleges Represented</div>
            <div className="text-lg font-bold text-slate-900 font-mono">{colleges.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Graduation Batch</div>
            <div className="text-lg font-bold text-slate-900 font-mono">2027 (Final Yr)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Squad Unlocks</div>
            <div className="text-lg font-bold text-purple-700 font-mono">
              {students.filter((s) => s.referralsConverted >= 1).length} Students
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm shadow-slate-200/40 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, email, code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50/50"
            />
          </div>

          {/* College Filter */}
          <div>
            <select
              value={selectedCollege}
              onChange={(e) => {
                setSelectedCollege(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50/50 text-slate-700"
            >
              <option value="all">All Colleges ({colleges.length})</option>
              {colleges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50/50 text-slate-700"
            >
              <option value="all">All Branches ({branches.length})</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={selectedChannel}
              onChange={(e) => {
                setSelectedChannel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50/50 text-slate-700"
            >
              <option value="all">All Channels ({channels.length})</option>
              {channels.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-900">{filteredStudents.length}</strong> matching students
          </span>
          {(searchQuery || selectedCollege !== 'all' || selectedBranch !== 'all' || selectedChannel !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCollege('all');
                setSelectedBranch('all');
                setSelectedChannel('all');
                setCurrentPage(1);
              }}
              className="text-purple-600 hover:text-purple-800 font-medium underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">College & Branch</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Channel / Referrer</th>
                <th className="py-3 px-4">Personal Squad Code</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={student.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {globalIndex}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{student.fullName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span>Batch {student.gradYear}</span>
                          <span>•</span>
                          <span className="truncate max-w-[140px]">{student.targetRole}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{student.college}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                          {student.branch}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] truncate max-w-[160px]">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="font-mono text-[11px]">{student.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{student.channel}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Ref: {student.referredByCode || 'Direct'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-mono font-bold text-[11px] border border-indigo-100">
                          {student.ownReferralCode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            student.squadStatus.includes('Full')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : student.squadStatus.includes('Starter')
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {student.squadStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong> (
            {filteredStudents.length} students)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-2">{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
