'use client';

import { TrendingUp, Users, BookOpen, Star, Activity } from 'lucide-react';
import { mockAdminStats, mockMentorStats, mockAdminModules, mockAdminActivity } from '@/lib/api/mockData';

const roleColors: Record<string, string> = {
  STUDENT: 'bg-emerald-100 text-emerald-700',
  MENTOR:  'bg-amber-100 text-amber-700',
  ADMIN:   'bg-violet-100 text-violet-700',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminAnalyticsPage() {
  const overallStats = [
    { label: 'Total Students',    value: mockAdminStats.totalStudents,          icon: Users,      color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Platform Completion', value: `${mockAdminStats.platformCompletionRate}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Active Modules',    value: mockAdminStats.activeModules,           icon: BookOpen,   color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Sessions This Week',value: mockAdminStats.sessionsThisWeek,        icon: Activity,   color: 'text-amber-600',   bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform-wide performance and engagement metrics.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map(({ label, value, icon: Icon, color, bg }) => (
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

        {/* Module performance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Module Completion Rates</h2>
          <div className="space-y-4">
            {mockAdminModules.filter((m) => m.isActive).map((mod) => (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700 truncate pr-2">{mod.title}</span>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">{mod.completionRate}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${mod.completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 w-16 text-right">{mod.enrolledStudents} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Performing Students</h2>
          <div className="space-y-3">
            {mockMentorStats.topPerformers.map((s, i) => (
              <div key={s.studentId} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                  <p className="text-xs text-gray-500">{s.completedModules} modules completed</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{s.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Avg score bar */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Platform Average Score</span>
              <span className="text-sm font-bold text-violet-700">{mockAdminStats.platformCompletionRate}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                style={{ width: `${mockAdminStats.platformCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full activity log */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Full Activity Log</h2>
        <div className="space-y-2">
          {mockAdminActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${roleColors[a.role]}`}>
                {a.role}
              </span>
              <p className="text-sm text-gray-700 flex-1 truncate">
                <span className="font-medium">{a.user}</span> — {a.action}
              </p>
              <span className="text-xs text-gray-400 shrink-0">{timeAgo(a.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
