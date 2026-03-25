'use client';

import { useState } from 'react';
import { Upload, PenLine, CheckCircle, FileText, Trash2, Plus } from 'lucide-react';
import { mockAllUsers } from '@/lib/api/mockData';
import { cn } from '@/lib/utils';
import { logAction } from '@/lib/utils/auditLogger';
import toast from 'react-hot-toast';

type EntryMode = 'manual' | 'upload';

const subjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'ICT'];

const mockReports = [
  { id: 'rep_001', student: 'Jean Pierre Niyonzima', term: 'Term 1 2026', enteredBy: 'Diane Ingabire', method: 'Manual', date: '2026-02-10', grades: { English: 78, Mathematics: 82, ICT: 90 } },
  { id: 'rep_002', student: 'Marie Uwimana',         term: 'Term 1 2026', enteredBy: 'Diane Ingabire', method: 'Upload', date: '2026-02-11', grades: { English: 85, Mathematics: 79, ICT: 88 } },
  { id: 'rep_003', student: 'Emmanuel Habimana',     term: 'Term 1 2026', enteredBy: 'Diane Ingabire', method: 'Manual', date: '2026-02-12', grades: { English: 62, Mathematics: 70, ICT: 75 } },
];

const students = mockAllUsers.filter((u) => u.role === 'STUDENT');

export default function AdminReportsPage() {
  const [mode, setMode]               = useState<EntryMode>('manual');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [term, setTerm]               = useState('Term 1 2026');
  const [grades, setGrades]           = useState<Record<string, string>>({});
  const [uploadFile, setUploadFile]   = useState<File | null>(null);
  const [dragOver, setDragOver]       = useState(false);

  const handleGrade = (subject: string, value: string) => {
    setGrades((prev) => ({ ...prev, [subject]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAction('adm_001', 'ADMIN', mode === 'upload' ? 'REPORT_UPLOADED' : 'REPORT_MANUAL_ENTRY', `Report saved for student: ${selectedStudent}, term: ${term}`);
    toast.success('Report saved successfully');
    setGrades({});
    setSelectedStudent('');
    setUploadFile(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Academic Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Enter student grades manually or upload scanned report cards.</p>
        </div>

      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Entry form */}
        <div className="lg:col-span-2 space-y-4">

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(['manual', 'upload'] as EntryMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all',
                  mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {m === 'manual' ? <PenLine className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                {m === 'manual' ? 'Manual Entry' : 'Upload Scan'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">

            {/* Student selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Student</label>
              <select
                required
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
              >
                <option value="">Select a student…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.fullName}</option>
                ))}
              </select>
            </div>

            {/* Term */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Term / Period</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
              >
                {['Term 1 2026', 'Term 2 2026', 'Term 3 2026', 'Term 1 2025', 'Term 2 2025'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* FR5.2 — Manual grade entry */}
            {mode === 'manual' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Subject Grades (out of 100)</label>
                <div className="space-y-2">
                  {subjects.map((sub) => (
                    <div key={sub} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-28 shrink-0">{sub}</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={grades[sub] ?? ''}
                        onChange={(e) => handleGrade(sub, e.target.value)}
                        placeholder="—"
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FR5.1 — Upload scan */}
            {mode === 'upload' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Upload Report Card (PDF, JPEG, PNG)</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
                    dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                  )}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  />
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-900">{uploadFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Drag & drop or <span className="text-emerald-700 font-semibold">browse</span></p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPEG, PNG — max 10MB</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Save Report
            </button>
          </form>
        </div>

        {/* Existing reports table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Submitted Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Term</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockReports.map((r) => {
                    const vals = Object.values(r.grades);
                    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{r.student}</td>
                        <td className="px-5 py-3.5 text-gray-500">{r.term}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            'text-xs font-semibold px-2 py-0.5 rounded-full',
                            r.method === 'Manual' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          )}>
                            {r.method}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            'text-sm font-bold',
                            avg >= 80 ? 'text-emerald-700' : avg >= 60 ? 'text-amber-600' : 'text-gray-500'
                          )}>
                            {avg}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">
                          {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
