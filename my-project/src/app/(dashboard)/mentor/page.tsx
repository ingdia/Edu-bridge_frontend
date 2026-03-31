'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CalendarDays, ClipboardCheck, TrendingUp, Clock, Star, AlertCircle } from 'lucide-react';
import { fetchMentorDashboard, fetchMentorSessions, type MentorDashboard, type MentorSession } from '@/lib/api/mentorship';
import { fetchStudentRequests } from '@/lib/api/studentRequest';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export default function MentorOverview() {
  const { user } = useAuthContext();
  const [dashboard, setDashboard] = useState<MentorDashboard | null>(null);
  const [sessions, setSessions]   = useState<MentorSession[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.allSettled([fetchMentorDashboard(), fetchMentorSessions('SCHEDULED'), fetchStudentRequests()])
      .then(([dashRes, sessRes, reqRes]) => {
        if (dashRes.status === 'fulfilled') setDashboard(dashRes.value);
        if (sessRes.status === 'fulfilled') setSessions(sessRes.value.slice(0, 3));
        if (reqRes.status === 'fulfilled') setPendingRequests(reqRes.value.filter((r) => r.status === 'PENDING').length);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(' ')[0] ?? 'Mentor';

  const stats = [
    { label: 'Students Assigned',  value: dashboard?.summary.totalStudents ?? '—',                                                    icon: Users,          color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Sessions Upcoming',  value: sessions.length,                                                                             icon: CalendarDays,   color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Modules Completed',  value: dashboard?.summary.totalCompletedModules ?? '—',                                             icon: ClipboardCheck, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Avg Student Score',  value: dashboard?.summary.averageScore != null ? `${Math.round(dashboard.summary.averageScore)}%` : '—', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const topPerformers = (dashboard?.students ?? [])
    .filter((s) => s.averageScore != null)
    .sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your students today.</p>
      </div>

      {/* Pending student requests banner */}
      {pendingRequests > 0 && (
        <Link href="/mentor/requests"
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {pendingRequests} student{pendingRequests > 1 ? 's' : ''} waiting for your approval
            </p>
            <p className="text-xs text-amber-600">Review and approve student access requests</p>
          </div>
          <span className="text-xs font-semibold text-amber-700 hover:text-amber-900">Review →</span>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {loading ? <span className="inline-block w-8 h-5 bg-gray-100 rounded animate-pulse" /> : value}
              </div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No upcoming sessions.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {s.student?.fullName ?? 'Mentorship Session'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(s.scheduledFor).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
                      {new Date(s.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Performers</h2>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : topPerformers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No student data yet.</p>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((s, i) => (
                <div key={s.studentId} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                    <p className="text-xs text-gray-500">{s.completedModules} modules completed</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{Math.round(s.averageScore ?? 0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
