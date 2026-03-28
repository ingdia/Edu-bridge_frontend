'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, TrendingUp, BookOpen, MessageSquare, Lock, Plus, CheckCircle } from 'lucide-react';
import { fetchAdminUsers, type AdminUser } from '@/lib/api/admin';
import { fetchMentorDashboard, type MentorDashboardStudent } from '@/lib/api/mentorship';
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

const statusColors: Record<string, string> = {
  Excellent:  'bg-emerald-100 text-emerald-700',
  'On Track': 'bg-emerald-50 text-emerald-700',
  'Needs Help':'bg-amber-100 text-amber-700',
};

function getStatus(score: number | null) {
  if (score == null) return 'On Track';
  if (score >= 85) return 'Excellent';
  if (score >= 60) return 'On Track';
  return 'Needs Help';
}

type DetailTab = 'progress' | 'notes';

export default function MentorStudents() {
  const [students, setStudents]     = useState<MentorDashboardStudent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<MentorDashboardStudent | null>(null);
  const [detailTab, setDetailTab]   = useState<DetailTab>('progress');
  const [notes, setNotes]           = useState<Record<string, { id: string; text: string; date: string }[]>>({});
  const [newNote, setNewNote]       = useState('');
  const [noteSaved, setNoteSaved]   = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dashboard = await fetchMentorDashboard();
      setStudents(dashboard.students);
      if (dashboard.students.length > 0) setSelected(dashboard.students[0]);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.schoolName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = async () => {
    if (!newNote.trim() || !selected) return;
    setSavingNote(true);
    try {
      await apiFetch(`/api/profile/student/${selected.studentId}/notes`, {
        method: 'PUT',
        body: JSON.stringify({ notes: newNote.trim() }),
      });
      const note = { id: `n_${Date.now()}`, text: newNote.trim(), date: new Date().toISOString().split('T')[0] };
      setNotes((prev) => ({ ...prev, [selected.studentId]: [note, ...(prev[selected.studentId] ?? [])] }));
      setNewNote('');
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

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
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No students found.</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((s) => {
                const status = getStatus(s.averageScore);
                return (
                  <button
                    key={s.studentId}
                    onClick={() => { setSelected(s); setDetailTab('progress'); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                      selected?.studentId === s.studentId ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {s.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{s.schoolName}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Student detail */}
        {selected ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-lg font-bold">
                  {selected.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900">{selected.fullName}</h2>
                  <p className="text-sm text-gray-500">{selected.schoolName} · {selected.gradeLevel}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[getStatus(selected.averageScore)]}`}>
                    {getStatus(selected.averageScore)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Score',        value: selected.averageScore != null ? `${Math.round(selected.averageScore)}%` : '—' },
                  { label: 'Modules Done',     value: selected.completedModules },
                  { label: 'In Progress',      value: selected.inProgressModules },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1">
              {([
                { id: 'progress', label: 'Module Progress', icon: BookOpen },
                { id: 'notes',    label: 'Confidential Notes', icon: Lock },
              ] as { id: DetailTab; label: string; icon: typeof BookOpen }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDetailTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    detailTab === id ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {detailTab === 'progress' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Module Progress</h3>
                {selected.progressRecords.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No module progress yet.</p>
                ) : (
                  selected.progressRecords.map((m) => (
                    <div key={m.moduleId}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="font-medium">{m.moduleTitle}</span>
                        <span>{m.isCompleted ? 'Completed' : 'In Progress'}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: m.isCompleted ? '100%' : '50%' }}
                        />
                      </div>
                      {m.score != null && (
                        <p className="text-xs text-gray-400 mt-0.5">Score: {m.score}%</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {detailTab === 'notes' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Confidential Notes</h3>
                  <span className="text-xs text-gray-400 ml-auto">Visible to mentors and admins only</span>
                </div>
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
                      disabled={!newNote.trim() || savingNote}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> {savingNote ? 'Saving…' : 'Add Note'}
                    </button>
                    {noteSaved && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Note saved
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {(notes[selected.studentId] ?? []).length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No notes yet for this student.</p>
                  ) : (
                    (notes[selected.studentId] ?? []).map((n) => (
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
        ) : (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex items-center justify-center py-24">
            <p className="text-sm text-gray-400">Select a student to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
