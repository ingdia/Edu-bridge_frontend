'use client';

import { useEffect, useState, useCallback } from 'react';
import { CalendarDays, Clock, Users, Video, Plus } from 'lucide-react';
import {
  fetchMentorSessions, createMentorSession, cancelSession, fetchMentorDashboard,
  type MentorSession, type MentorDashboardStudent,
} from '@/lib/api/mentorship';
import toast from 'react-hot-toast';

const tabs = ['Upcoming', 'Past'];

export default function MentorSessions() {
  const [sessions, setSessions]       = useState<MentorSession[]>([]);
  const [students, setStudents]       = useState<MentorDashboardStudent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('Upcoming');
  const [showForm, setShowForm]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const [form, setForm] = useState({
    studentId: '',
    scheduledFor: '',
    duration: '60',
    meetingLink: '',
    notes: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sess, dashboard] = await Promise.all([
        fetchMentorSessions().catch(() => [] as MentorSession[]),
        fetchMentorDashboard().catch(() => ({ students: [], summary: { totalStudents: 0, averageScore: null, totalCompletedModules: 0 } })),
      ]);
      setSessions(sess);
      setStudents(dashboard.students);
      if (dashboard.students.length > 0) {
        setForm((f) => ({ ...f, studentId: dashboard.students[0].studentId }));
      }
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const upcoming = sessions.filter((s) => s.status === 'SCHEDULED' && new Date(s.scheduledFor) >= now);
  const past     = sessions.filter((s) => s.status !== 'SCHEDULED' || new Date(s.scheduledFor) < now);
  const displayed = activeTab === 'Upcoming' ? upcoming : past;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.scheduledFor) return;
    setSubmitting(true);
    try {
      await createMentorSession({
        studentId: form.studentId,
        scheduledFor: new Date(form.scheduledFor).toISOString(),
        duration: parseInt(form.duration),
        meetingLink: form.meetingLink || undefined,
        notes: form.notes || undefined,
      });
      toast.success('Session scheduled!');
      setShowForm(false);
      setForm((f) => ({ ...f, scheduledFor: '', meetingLink: '', notes: '' }));
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this session?')) return;
    try {
      await cancelSession(id);
      toast.success('Session cancelled');
      await load();
    } catch {
      toast.error('Failed to cancel session');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your mentorship sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSchedule} className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Schedule New Session</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Student</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              >
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>{s.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Date & Time</label>
              <input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Duration (minutes)</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Meeting Link (optional)</label>
              <input
                value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Notes (optional)</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                placeholder="Session topic or agenda..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 disabled:bg-gray-200 transition-colors">
              {submitting ? 'Scheduling…' : 'Schedule Session'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : displayed.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No {activeTab.toLowerCase()} sessions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {s.student?.fullName ?? 'Mentorship Session'}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    s.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
                {s.notes && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.notes}</p>}
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(s.scheduledFor).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
                    {new Date(s.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    {s.duration && ` · ${s.duration} min`}
                  </span>
                  {s.meetingLink && s.status === 'SCHEDULED' && (
                    <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-emerald-700 hover:underline">
                      <Video className="w-3.5 h-3.5" /> Join Meeting
                    </a>
                  )}
                </div>
              </div>
              {s.status === 'SCHEDULED' && (
                <button
                  onClick={() => handleCancel(s.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium shrink-0"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
