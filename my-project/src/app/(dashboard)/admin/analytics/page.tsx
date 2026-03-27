'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, Star, Activity } from 'lucide-react';
import {
  fetchAdminOverview, fetchTopPerformers, fetchModuleEngagement,
  type AdminOverview, type TopPerformer, type ModuleEngagementItem,
} from '@/lib/api/admin';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview]     = useState<AdminOverview | null>(null);
  const [performers, setPerformers] = useState<TopPerformer[]>([]);
  const [modules, setModules]       = useState<ModuleEngagementItem[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminOverview(), fetchTopPerformers(10), fetchModuleEngagement()])
      .then(([ov, perf, eng]) => {
        setOverview(ov);
        setPerformers(perf);
        setModules(eng ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const overallStats = overview ? [
    { label: 'Total Students',     value: overview.totalStudents,     icon: Users,      color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Active Students',    value: overview.activeStudents,    icon: Activity,   color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Active Modules',     value: overview.totalModules,      icon: BookOpen,   color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Completed Sessions', value: overview.completedSessions, icon: TrendingUp, color: 'text-amber-600',   bg: 'bg-amber-50' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-20 animate-pulse" />)}
        </div>
      </div>
    );
  }

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

        {/* Module engagement */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Module Completion Rates</h2>
          {modules.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No module data yet.</p>
          ) : (
            <div className="space-y-4">
              {modules.map((mod) => (
                <div key={mod.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700 truncate pr-2">{mod.title}</span>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">{mod.completionRate}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${mod.completionRate}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 w-20 text-right">{mod.totalAttempts} students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Performing Students</h2>
          {performers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No student data yet.</p>
          ) : (
            <div className="space-y-3">
              {performers.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                    <p className="text-xs text-gray-500">{s.completedModules} modules · {s.gradeLevel}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{Math.round(s.averageScore ?? 0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {overview && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Pending Submissions</span>
                <span className="text-sm font-bold text-emerald-700">{overview.pendingSubmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Total Sessions</span>
                <span className="text-sm font-bold text-emerald-700">{overview.totalSessions}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
