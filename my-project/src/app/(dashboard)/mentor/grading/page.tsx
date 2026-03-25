'use client';

import { useState } from 'react';
import { ClipboardCheck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { logAction } from '@/lib/utils/auditLogger';

const submissions = [
  { id: 'sub_001', student: 'Jean Pierre Niyonzima', module: 'English: Listening Basics', exercise: 'Practice Your Introduction', submittedAt: '2026-03-19T09:00:00Z', status: 'PENDING', maxScore: 15 },
  { id: 'sub_002', student: 'Marie Uwimana', module: 'English: Writing Practice', exercise: 'Write About Your Goals', submittedAt: '2026-03-18T14:30:00Z', status: 'PENDING', maxScore: 20 },
  { id: 'sub_003', student: 'Emmanuel Habimana', module: 'English: Listening Basics', exercise: 'Greetings & Introductions', submittedAt: '2026-03-17T11:00:00Z', status: 'GRADED', score: 8, maxScore: 10 },
  { id: 'sub_004', student: 'Claudine Mukamana', module: 'Digital: Email Essentials', exercise: 'Compose Your First Email', submittedAt: '2026-03-16T10:00:00Z', status: 'GRADED', score: 9, maxScore: 10 },
  { id: 'sub_005', student: 'Patrick Nzabonimpa', module: 'English: Reading Comprehension', exercise: 'The Importance of Education', submittedAt: '2026-03-19T08:00:00Z', status: 'PENDING', maxScore: 12 },
];

export default function MentorGrading() {
  const [selected, setSelected] = useState(submissions[0]);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');
  const [graded, setGraded] = useState<Record<string, { score: string; feedback: string }>>({});

  const handleSubmitGrade = () => {
    if (!score) return;
    setGraded((prev) => ({ ...prev, [selected.id]: { score, feedback } }));
    logAction('mnt_001', 'MENTOR', 'GRADE_SUBMITTED', `Graded ${selected.exercise} for ${selected.student} — score: ${score}/${selected.maxScore}`);
    setScore('');
    setFeedback('');
  };

  const filtered = submissions.filter((s) => filter === 'ALL' || s.status === filter);
  const pending = submissions.filter((s) => s.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grading</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pending} submission{pending !== 1 ? 's' : ''} pending review</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['ALL', 'PENDING', 'GRADED'] as const).map((f) => (
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

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Submission Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl ${
                selected.id === s.id ? 'bg-emerald-50' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                s.status === 'GRADED' ? 'bg-gray-100' : 'bg-amber-50'
              }`}>
                {s.status === 'GRADED'
                  ? <CheckCircle className="w-4 h-4 text-gray-400" />
                  : <Clock className="w-4 h-4 text-amber-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.student}</p>
                <p className="text-xs text-gray-500 truncate">{s.exercise}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {s.status === 'GRADED' && 'score' in s && (
                  <span className="text-xs font-semibold text-emerald-700">{s.score}/{s.maxScore}</span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Grading Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{selected.exercise}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{selected.student} · {selected.module}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              selected.status === 'GRADED' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
            }`}>
              {selected.status}
            </span>
          </div>

          {/* Simulated submission content */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Student Submission</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Hello, my name is {selected.student.split(' ')[0]}. I am a student at GS Ruyenzi. I am in Senior 4 and I enjoy learning English because it opens many doors for my future career in technology.
            </p>
          </div>

          {selected.status === 'PENDING' && !graded[selected.id] ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Score <span className="text-gray-400">(out of {selected.maxScore})</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={selected.maxScore}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  placeholder={`0–${selected.maxScore}`}
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
                disabled={!score}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" /> Submit Grade
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Graded: {graded[selected.id]?.score ?? ('score' in selected ? selected.score : '—')}/{selected.maxScore}
                  </p>
                  <p className="text-xs text-emerald-600">Submitted {new Date(selected.submittedAt).toLocaleDateString()}</p>
                  {graded[selected.id]?.feedback && (
                    <p className="text-xs text-emerald-700 mt-1 italic">"{graded[selected.id].feedback}"</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
