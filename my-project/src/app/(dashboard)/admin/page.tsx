'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, BookOpen, TrendingUp, Briefcase, Activity,
  ChevronRight, UserPlus, CalendarDays, FileText, Star,
} from 'lucide-react';
import {
  fetchAdminOverview, fetchTopPerformers, fetchSystemActivity,
  type AdminOverview, type TopPerformer, type ActivityItem,
} from '@/lib/api/admin';

const roleColors: Record<string, string> = {
  STUDENT: 'bg-emerald-100 text-emerald-700',
  MENTOR:  'bg-amber-100 text-amber-700',
  ADMIN:   'bg-gray-100 text-gray-700',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminOverview() {
  const [overview, setOverview]       = useState<AdminOverview | null>(null);
  const [performers, setPerformers]   = useState<TopPerformer[]>([]);
  const [activity, setActivity]       = useState<ActivityItem[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminOverview(), fetchTopPerformers(5), fetchSystemActivity()])
      .then(([ov, perf, act]) => {
        setOverview(ov);
        setPerformers(perf);
        setActivity(act.recentLogins);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = overview ? [
    { label: 'Total Students',    value: overview.totalStudents,     icon: Users,       color: 'text-emerald-700', bg: 'bg-emerald-50', href: '/admin/users' },
    { label: 'Active Mentors',    value: overview.totalMentors,      icon: UserPlus,    color: 'text-amber-600',   bg: 'bg-amber-50',   href: '/admin/users' },
    { label: 'Active Modules',    value: overview.totalModules,      icon: BookOpen,    color: 'text-emerald-700', bg: 'bg-emerald-50', href: '/admin/modules' },
    { label: 'Total Sessions',    value: overview.totalSessions,     icon: CalendarDays,color: 'text-amber-600',   bg: 'bg-amber-50',   href: '/admin/analytics' },
    { label: 'Active Students',   value: overview.activeStudents,    icon: Activity,    color: 'text-emerald-700', bg: 'bg-emerald-50', href: '/admin/users' },
    { label: 'Completed Sessions',value: overview.completedSessions, icon: TrendingUp,  color: 'text-amber-600',   bg: 'bg-amber-50',   href: '/admin/analytics' },
    { label: 'Pending Reviews',   value: overview.pendingSubmissions,icon: FileText,    color: 'text-emerald-700', bg: 'bg-emerald-50', href: '/admin/analytics' },
    { label: 'Opportunities',     value: '—',                        icon: Briefcase,   color: 'text-amber-600',   bg: 'bg-amber-50',   href: '/admin/opportunities' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform-wide summary for EDU-Bridge at GS Ruyenzi.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-emerald-200 hover:shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Top Performers</h2>
            <Link href="/admin/analytics" className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {performers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No student data yet.</p>
          ) : (
            <div className="space-y-3">
              {performers.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                    <p className="text-xs text-gray-500">{s.completedModules} modules completed</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{Math.round(s.averageScore ?? 0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-emerald-900 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Manage Users',        href: '/admin/users',         icon: Users },
              { label: 'Manage Modules',       href: '/admin/modules',       icon: BookOpen },
              { label: 'View Analytics',       href: '/admin/analytics',     icon: TrendingUp },
              { label: 'Manage Opportunities', href: '/admin/opportunities', icon: Briefcase },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
              >
                <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-sm text-white font-medium flex-1">{label}</span>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Logins */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Platform Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${roleColors[a.role] ?? 'bg-gray-100 text-gray-600'}`}>
                  {a.role}
                </span>
                <p className="text-sm text-gray-700 flex-1 truncate">
                  <span className="font-medium">{a.email}</span> — logged in
                </p>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(a.lastLogin)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
