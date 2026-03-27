'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Briefcase, TrendingUp, Calendar,
  ArrowRight, CheckCircle, Clock, Star, ChevronRight, Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  fetchStudentProgress, fetchStudentSessions, fetchMatchedOpportunities,
  type ProgressRecord, type ProgressSummary, type StudentSession, type Opportunity,
} from '@/lib/api/student';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  SCHOLARSHIP: { label: 'Scholarship', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  INTERNSHIP:  { label: 'Internship',  bg: 'bg-amber-100',   text: 'text-amber-700' },
  JOB:         { label: 'Job',         bg: 'bg-gray-100',    text: 'text-gray-700' },
};

export default function StudentOverviewPage() {
  const { user } = useAuthContext();
  const [progress, setProgress]     = useState<ProgressRecord[]>([]);
  const [summary, setSummary]       = useState<ProgressSummary | null>(null);
  const [sessions, setSessions]     = useState<StudentSession[]>([]);
  const [opportunities, setOpps]    = useState<Opportunity[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchStudentProgress(),
      fetchStudentSessions('SCHEDULED'),
      fetchMatchedOpportunities(),
    ]).then(([progRes, sessRes, oppsRes]) => {
      if (progRes.status === 'fulfilled') {
        setProgress(progRes.value.progress);
        setSummary(progRes.value.summary);
      }
      if (sessRes.status === 'fulfilled') setSessions(sessRes.value);
      if (oppsRes.status === 'fulfilled') setOpps(oppsRes.value.slice(0, 3));
      if (progRes.status === 'rejected') toast.error('Failed to load progress');
    }).finally(() => setLoading(false));
  }, []);

  const firstName = user?.fullName?.split(' ')[0] ?? 'Student';

  const stats = [
    { label: 'Overall Score',      value: summary?.averageScore != null ? `${summary.averageScore}%` : '—', icon: Star,        color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
    { label: 'Modules Completed',  value: `${summary?.completed ?? 0}`,                                      icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
    { label: 'In Progress',        value: `${summary?.inProgress ?? 0}`,                                     icon: Flame,       color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
    { label: 'Sessions Upcoming',  value: `${sessions.length}`,                                              icon: Calendar,    color: 'bg-blue-50 text-blue-600',     border: 'border-blue-100' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Good morning, {firstName} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.gradeLevel && `${user.gradeLevel} · `}Keep up the great work!
          </p>
        </div>
        <Link href="/student/learning">
          <Button variant="primary" size="sm">
            Continue Learning <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 leading-none">
                {loading ? <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" /> : value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Module Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Module Progress</h2>
            <Link href="/student/progress" className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : progress.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No modules started yet.</p>
              <Link href="/student/learning" className="text-xs text-emerald-700 font-semibold mt-2 inline-block">Start learning →</Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {progress.slice(0, 4).map((p) => {
                  const pct = p.status === 'completed' ? 100 : 50;
                  return (
                    <div key={p.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-900 truncate">{p.module.title}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                            p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 shrink-0 w-8 text-right">{pct}%</span>
                        </div>
                        {p.score != null && (
                          <div className="text-xs text-gray-400 mt-1">Score: {p.score}%</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {summary && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-emerald-700">{summary.completionRate}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700"
                      style={{ width: `${summary.completionRate}%` }} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Upcoming sessions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Upcoming Sessions</h2>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No sessions scheduled</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug truncate">{s.title ?? 'Mentorship Session'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(s.scheduledFor).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {s.meetingLink && (
                        <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-emerald-700 font-medium hover:underline mt-0.5 inline-block">
                          Join meeting →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-emerald-900 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Continue Learning',    href: '/student/learning',  icon: BookOpen },
                { label: 'View My Progress',     href: '/student/progress',  icon: TrendingUp },
                { label: 'Browse Opportunities', href: '/student/career',    icon: Briefcase },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group">
                  <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="text-sm text-white font-medium flex-1">{label}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Matched Opportunities</h2>
              <p className="text-xs text-gray-400 mt-0.5">Based on your skills and progress</p>
            </div>
            <Link href="/student/career" className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp) => {
              const cfg = typeConfig[opp.type] ?? typeConfig.JOB;
              return (
                <div key={opp.id} className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    {opp.matchScore != null && (
                      <span className="text-xs text-emerald-700 font-semibold">{opp.matchScore}% match</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{opp.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{opp.organization}</p>
                  <div className="flex items-center justify-between">
                    {opp.deadline && (
                      <span className="text-xs text-gray-400">
                        {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    <Link href="/student/career" className="text-xs text-emerald-700 font-semibold hover:text-emerald-800">
                      Apply →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
