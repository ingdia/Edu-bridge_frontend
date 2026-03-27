'use client';

import { useEffect, useState, useCallback } from 'react';
import { CalendarDays, Clock, Video, Plus, CheckCircle, X } from 'lucide-react';
import { fetchStudentSessions, type StudentSession } from '@/lib/api/student';
import toast from 'react-hot-toast';

const statusConfig: Record<string, string> = {
  SCHEDULED:  'bg-emerald-100 text-emerald-700',
  COMPLETED:  'bg-gray-100 text-gray-600',
  CANCELLED:  'bg-red-100 text-red-600',
  RESCHEDULED:'bg-amber-100 text-amber-700',
};

const tabs = ['Upcoming', 'Past'];

export default function StudentSessionsPage() {
  const [sessions, setSessions]         = useState<StudentSession[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('Upcoming');
  const [showRequest, setShowRequest]   = useState(false);
  const [topic, setTopic]               = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitted, setSubmitted]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentSessions();
      setSessions(data);
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

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Session requests go through the mentor — just show confirmation
    setSubmitted(true);
    setShowRequest(false);
    setTopic('');
    setPreferredDate('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">View your mentorship sessions and request new ones.</p>
        </div>
        <button onClick={() => setShowRequest(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors">
          <Plus className="w-4 h-4" /> Request Session
        </button>
      </div>

      {/* Request modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Request a Session</h2>
              <button onClick={() => setShowRequest(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Topic / What do you need help with?</label>
                <textarea rows={3} required value={topic} onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. I need help with my writing exercises and CV..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Preferred date (optional)</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowRequest(false)}
                  className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submitted && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
          <CheckCircle className="w-4 h-4" /> Session request sent! Your mentor will confirm the time.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t}
            {t === 'Upcoming' && upcoming.length > 0 && (
              <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No {activeTab.toLowerCase()} sessions.</p>
          </div>
        ) : (
          displayed.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{s.title ?? 'Mentorship Session'}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusConfig[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
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
                      className="flex items-center gap-1 text-xs text-emerald-700 font-medium hover:underline">
                      <Video className="w-3.5 h-3.5" /> Join Meeting
                    </a>
                  )}
                  {s.mentor?.user?.email && (
                    <span className="text-xs text-gray-400">Mentor: {s.mentor.user.email}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
