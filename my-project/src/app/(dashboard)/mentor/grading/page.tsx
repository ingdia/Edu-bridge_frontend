'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClipboardCheck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

interface Submission {
  id: string;
  status: 'PENDING' | 'EVALUATED' | 'GRADED';
  score: number | null;
  maxScore: number;
  feedback: string | null;
  submittedAt: string;
  textAnswer: string | null;
  student: { fullName: string; gradeLevel: string };
  exercise: { title: string; type: string; maxScore: number; module: { title: string } };
}

export default function MentorGrading() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState<Submission | null>(null);
  const [score, setScore]             = useState('');
  const [feedback, setFeedback]       = useState('');
  const [filter, setFilter]           = useState<'ALL' | 'PENDING' | 'EVALUATED'>('ALL');
  const [submitting, setSubmitting]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: Submission[] }>('/api/exercises/mentor/submissions');
      setSubmissions(res.data ?? []);
      if (res.data?.length > 0) setSelected(res.data[0]);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmitGrade = async () => {
    if (!score || !selected) return;
    setSubmitting(true);
    try {
      await apiFetch(`/api/exercises/${selected.id}/evaluate`, {
        method: 'PATCH',
        body: JSON.stringify({ score: parseInt(score), feedback }),
      });
      toast.success('Grade submitted!');
      setScore('');
      setFeedback('');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit grade');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return s.status === 'PENDING';
    return s.status === 'EVALUATED' || s.status === 'GRADED';
  });

  const pending = submissions.filter((s) => s.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="lg:col-span-3 h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grading</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pending} submission{pending !== 1 ? 's' : ''} pending review</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['ALL', 'PENDING', 'EVALUATED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <ClipboardCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No submissions to review yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Submission Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setScore(''); setFeedback(''); }}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl ${
                  selected?.id === s.id ? 'bg-emerald-50' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  s.status !== 'PENDING' ? 'bg-gray-100' : 'bg-amber-50'
                }`}>
                  {s.status !== 'PENDING'
                    ? <CheckCircle className="w-4 h-4 text-gray-400" />
                    : <Clock className="w-4 h-4 text-amber-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.student.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{s.exercise.title}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {s.status !== 'PENDING' && s.score != null && (
                    <span className="text-xs font-semibold text-emerald-700">{s.score}/{s.exercise.maxScore}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))}
          </div>

          {/* Grading Panel */}
          {selected && (
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{selected.exercise.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.student.fullName} · {selected.exercise.module.title}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  selected.status !== 'PENDING' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selected.status}
                </span>
              </div>

              {selected.textAnswer && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Student Submission</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.textAnswer}</p>
                </div>
              )}

              {selected.status === 'PENDING' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Score <span className="text-gray-400">(out of {selected.exercise.maxScore})</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={selected.exercise.maxScore}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                      placeholder={`0–${selected.exercise.maxScore}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Feedback</label>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none"
                      placeholder="Write constructive feedback for the student..."
                    />
                  </div>
                  <button
                    onClick={handleSubmitGrade}
                    disabled={!score || submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  >
                    <ClipboardCheck className="w-4 h-4" /> {submitting ? 'Submitting…' : 'Submit Grade'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Graded: {selected.score}/{selected.exercise.maxScore}
                    </p>
                    <p className="text-xs text-emerald-600">Submitted {new Date(selected.submittedAt).toLocaleDateString()}</p>
                    {selected.feedback && (
                      <p className="text-xs text-emerald-700 mt-1 italic">"{selected.feedback}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
