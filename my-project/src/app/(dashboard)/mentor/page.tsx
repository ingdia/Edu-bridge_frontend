'use client';

import { Users, CalendarDays, ClipboardCheck, TrendingUp, Clock, Star } from 'lucide-react';
import { mockMentorStats, mockSessions } from '@/lib/api/mockData';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const stats = [
  { label: 'Students Assigned', value: mockMentorStats.totalStudents, icon: Users,         color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Sessions This Week', value: 3,                             icon: CalendarDays,  color: 'text-amber-600',   bg: 'bg-amber-50' },
  { label: 'Pending Reviews',    value: 7,                             icon: ClipboardCheck,color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Avg Student Score',  value: `${mockMentorStats.completionRate}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function MentorOverview() {
  const { user } = useAuthContext();
  const firstName = user?.fullName.split(' ')[0] ?? 'Mentor';
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your students today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-3">
            {mockSessions.map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(s.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
                    {new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.studentIds.length} student{s.studentIds.length > 1 ? 's' : ''}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {mockMentorStats.topPerformers.map((s, i) => (
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
                  <span className="text-sm font-semibold text-gray-900">{s.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {mockMentorStats.recentActivity.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-sm text-gray-700 flex-1">{a.action}</p>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
