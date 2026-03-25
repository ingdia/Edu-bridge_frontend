'use client';

import { useState } from 'react';
import { Search, TrendingUp, BookOpen, MessageSquare, Lock, Plus, CheckCircle } from 'lucide-react';
import { mockProgress } from '@/lib/api/mockData';

const students = [
  { id: 'usr_123', fullName: 'Jean Pierre Niyonzima', school: 'GS Ruyenzi', grade: 'Senior 4', score: 88, modules: 3, status: 'On Track' },
  { id: 'usr_124', fullName: 'Marie Uwimana',         school: 'GS Ruyenzi', grade: 'Senior 4', score: 85, modules: 4, status: 'On Track' },
  { id: 'usr_125', fullName: 'Emmanuel Habimana',     school: 'GS Ruyenzi', grade: 'Senior 4', score: 62, modules: 2, status: 'Needs Help' },
  { id: 'usr_126', fullName: 'Claudine Mukamana',     school: 'GS Ruyenzi', grade: 'Senior 4', score: 74, modules: 2, status: 'On Track' },
  { id: 'usr_127', fullName: 'Patrick Nzabonimpa',    school: 'GS Ruyenzi', grade: 'Senior 4', score: 91, modules: 5, status: 'Excellent' },
];

// FR6.2 — academic results per student
const academicGrades: Record<string, { subject: string; grade: number }[]> = {
  usr_123: [{ subject: 'English', grade: 78 }, { subject: 'Mathematics', grade: 82 }, { subject: 'ICT', grade: 90 }],
  usr_124: [{ subject: 'English', grade: 85 }, { subject: 'Mathematics', grade: 79 }, { subject: 'ICT', grade: 88 }],
  usr_125: [{ subject: 'English', grade: 62 }, { subject: 'Mathematics', grade: 70 }, { subject: 'ICT', grade: 75 }],
  usr_126: [{ subject: 'English', grade: 74 }, { subject: 'Mathematics', grade: 68 }, { subject: 'ICT', grade: 80 }],
  usr_127: [{ subject: 'English', grade: 91 }, { subject: 'Mathematics', grade: 88 }, { subject: 'ICT', grade: 95 }],
};

// FR2.5 — confidential notes per student
const initialNotes: Record<string, { id: string; text: string; date: string }[]> = {
  usr_123: [{ id: 'n1', text: 'Strong motivation. Needs extra support with writing structure.', date: '2026-03-15' }],
  usr_124: [],
  usr_125: [{ id: 'n2', text: 'Struggling with confidence. Recommend extra encouragement and simpler exercises first.', date: '2026-03-10' }],
  usr_126: [],
  usr_127: [{ id: 'n3', text: 'Top performer. Ready for advanced modules and scholarship applications.', date: '2026-03-12' }],
};

const statusColors: Record<string, string> = {
  'Excellent':  'bg-emerald-100 text-emerald-700',
  'On Track':   'bg-emerald-50 text-emerald-700',
  'Needs Help': 'bg-amber-100 text-amber-700',
};

type DetailTab = 'progress' | 'academic' | 'notes';

export default function MentorStudents() {
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(students[0]);
  const [detailTab, setDetailTab] = useState<DetailTab>('progress');
  const [notes, setNotes]       = useState(initialNotes);
  const [newNote, setNewNote]   = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.school.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = { id: `n_${Date.now()}`, text: newNote.trim(), date: new Date().toISOString().split('T')[0] };
    setNotes((prev) => ({ ...prev, [selected.id]: [note, ...(prev[selected.id] ?? [])] }));
    setNewNote('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const grades = academicGrades[selected.id] ?? [];
  const avgAcademic = grades.length ? Math.round(grades.reduce((a, g) => a + g.grade, 0) / grades.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">{students.length} students assigned to you</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Student list */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div className="space-y-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelected(s); setDetailTab('progress'); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  selected.id === s.id ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{s.school}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Student detail */}
        <div className="lg:col-span-2 space-y-4">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-lg font-bold">
                {selected.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900">{selected.fullName}</h2>
                <p className="text-sm text-gray-500">{selected.school} · {selected.grade}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Platform Score', value: `${selected.score}%`, icon: TrendingUp },
                { label: 'Modules Done',   value: selected.modules,     icon: BookOpen },
                { label: 'Academic Avg',   value: avgAcademic ? `${avgAcademic}%` : '—', icon: TrendingUp },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail tabs */}
          <div className="flex gap-1">
            {([
              { id: 'progress', label: 'Module Progress', icon: BookOpen },
              { id: 'academic', label: 'Academic Grades', icon: TrendingUp },
              { id: 'notes',    label: 'Confidential Notes', icon: Lock },
            ] as { id: DetailTab; label: string; icon: typeof BookOpen }[]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setDetailTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  detailTab === id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Module progress tab */}
          {detailTab === 'progress' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Module Progress</h3>
              {mockProgress.modules.map((m) => (
                <div key={m.moduleId}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{m.moduleTitle}</span>
                    <span>{m.completedExercises}/{m.totalExercises} exercises</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${m.totalExercises > 0 ? (m.completedExercises / m.totalExercises) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FR6.2 — Academic grades tab */}
          {detailTab === 'academic' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Academic Results — Term 1 2026</h3>
              {grades.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No academic results uploaded yet.</p>
              ) : (
                <div className="space-y-3">
                  {grades.map(({ subject, grade }) => (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{subject}</span>
                        <span className={`text-sm font-bold ${grade >= 80 ? 'text-emerald-700' : grade >= 60 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {grade}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${grade >= 80 ? 'bg-emerald-500' : grade >= 60 ? 'bg-amber-400' : 'bg-gray-300'}`}
                          style={{ width: `${grade}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Average</span>
                    <span className="text-sm font-bold text-emerald-700">{avgAcademic}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FR2.5 — Confidential notes tab */}
          {detailTab === 'notes' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Confidential Notes</h3>
                <span className="text-xs text-gray-400 ml-auto">Visible to mentors and admins only</span>
              </div>

              {/* Add note */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private note about this student..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Note
                  </button>
                  {noteSaved && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" /> Note saved
                    </span>
                  )}
                </div>
              </div>

              {/* Existing notes */}
              <div className="space-y-3">
                {(notes[selected.id] ?? []).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No notes yet for this student.</p>
                ) : (
                  (notes[selected.id] ?? []).map((n) => (
                    <div key={n.id} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-amber-700">You</span>
                        <span className="text-xs text-gray-400">{new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
