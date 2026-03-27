'use client';

import { useEffect, useState, useCallback } from 'react';
import { Upload, PenLine, FileText, Trash2, Plus } from 'lucide-react';
import {
  fetchAllReports, submitManualReport, deleteReport as apiDeleteReport,
  fetchAdminUsers, type AcademicReport, type AdminUser,
} from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type EntryMode = 'manual' | 'upload';

const subjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'ICT'];

const TERMS = ['Term 1 2026', 'Term 2 2026', 'Term 3 2026', 'Term 1 2025', 'Term 2 2025'];

function termToYearParts(term: string): { term: string; year: number } {
  const parts = term.split(' ');
  return { term: parts.slice(0, 2).join(' '), year: parseInt(parts[2]) || new Date().getFullYear() };
}

function calcAvg(subjects: Record<string, any> | null): number | null {
  if (!subjects) return null;
  const vals = Object.values(subjects).map(Number).filter((v) => !isNaN(v));
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export default function AdminReportsPage() {
  const [reports, setReports]     = useState<AcademicReport[]>([]);
  const [students, setStudents]   = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [mode, setMode]           = useState<EntryMode>('manual');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [term, setTerm]           = useState('Term 1 2026');
  const [grades, setGrades]       = useState<Record<string, string>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragOver, setDragOver]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [reps, users] = await Promise.all([fetchAllReports(), fetchAdminUsers('STUDENT')]);
      setReports(reps);
      setStudents(users);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleGrade = (subject: string, value: string) => {
    setGrades((prev) => ({ ...prev, [subject]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) { toast.error('Select a student'); return; }

    if (mode === 'upload') {
      toast('File upload requires Cloudinary setup — use manual entry for now.', { icon: 'ℹ️' });
      return;
    }

    const filledGrades: Record<string, number> = {};
    subjects.forEach((s) => { if (grades[s]) filledGrades[s] = Number(grades[s]); });

    if (Object.keys(filledGrades).length === 0) {
      toast.error('Enter at least one subject grade');
      return;
    }

    const avg = Math.round(Object.values(filledGrades).reduce((a, b) => a + b, 0) / Object.values(filledGrades).length);
    const { term: termStr, year } = termToYearParts(term);

    setSaving(true);
    try {
      const created = await submitManualReport({
        studentId: selectedStudent,
        term: termStr,
        year,
        subjects: filledGrades,
        overallGrade: `${avg}%`,
      });
      setReports((prev) => [created, ...prev]);
      toast.success('Report saved successfully');
      setGrades({});
      setSelectedStudent('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await apiDeleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success('Report deleted');
    } catch {
      toast.error('Failed to delete report');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Academic Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Enter student grades manually or upload scanned report cards.</p>
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
                  <option key={s.id} value={s.id}>{s.fullName || s.email}</option>
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
                {TERMS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Manual grade entry */}
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

            {/* Upload scan */}
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
                      <button type="button" onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
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
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Report'}
            </button>
          </form>
        </div>

        {/* Reports table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Submitted Reports</h2>
              <span className="text-xs text-gray-400">{reports.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Term</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Year</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}><td colSpan={6} className="px-5 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  ) : reports.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">No reports yet.</td></tr>
                  ) : (
                    reports.map((r) => {
                      const avg = calcAvg(r.subjects);
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-gray-900">{r.student?.fullName ?? '—'}</td>
                          <td className="px-5 py-3.5 text-gray-500">{r.term}</td>
                          <td className="px-5 py-3.5 text-gray-500">{r.year}</td>
                          <td className="px-5 py-3.5">
                            {avg !== null ? (
                              <span className={cn('text-sm font-bold',
                                avg >= 80 ? 'text-emerald-700' : avg >= 60 ? 'text-amber-600' : 'text-gray-500')}>
                                {avg}%
                              </span>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">{r.overallGrade ?? '—'}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
