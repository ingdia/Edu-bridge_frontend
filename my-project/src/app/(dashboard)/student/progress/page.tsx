'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Laptop, Headphones, Mic, PenLine, CheckCircle, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { fetchStudentProgress, type ProgressRecord, type ProgressSummary } from '@/lib/api/student';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';

const typeIcons: Record<string, typeof BookOpen> = {
  LISTENING: Headphones,
  SPEAKING: Mic,
  READING: BookOpen,
  WRITING: PenLine,
  DIGITAL_LITERACY: Laptop,
};

const statusConfig = {
  completed:   { label: 'Completed',   bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  in_progress: { label: 'In Progress', bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700' },
};

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useAuthContext();
  const [progress, setProgress]   = useState<ProgressRecord[]>([]);
  const [summary, setSummary]     = useState<ProgressSummary | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchStudentProgress()
      .then(({ progress: p, summary: s }) => { setProgress(p); setSummary(s); })
      .catch((err) => {
        const msg = err?.message || '';
        if (msg.includes('profile not found')) {
          toast.error('Complete your profile to track progress');
        } else {
          toast.error('Failed to load progress');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6 max-w-5xl"><Skeleton /></div>;

  const summaryCards = [
    { label: 'Overall Score',   value: summary?.averageScore != null ? `${summary.averageScore}%` : '—', icon: Award,       color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
    { label: 'Modules Done',    value: `${summary?.completed ?? 0}/${summary?.totalModules ?? 0}`,        icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
    { label: 'In Progress',     value: `${summary?.inProgress ?? 0}`,                                     icon: Target,      color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
    { label: 'Time Spent (min)',value: `${summary?.totalTimeSpent ?? 0}`,                                  icon: TrendingUp,  color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Progress</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.fullName}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 leading-none">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {progress.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No progress yet. Start a module to track your learning!</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Completion rate */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-1">Completion Rate</h2>
            <p className="text-xs text-gray-400 mb-6">Modules completed vs in progress</p>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${summary?.completionRate ?? 0} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">{summary?.completionRate ?? 0}%</span>
                  <span className="text-xs text-gray-400">complete</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />{summary?.completed} done</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />{summary?.inProgress} in progress</span>
            </div>
          </div>

          {/* Module breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-1">Module Breakdown</h2>
            <p className="text-xs text-gray-400 mb-5">Score and status per module</p>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {progress.map((p) => {
                const cfg  = statusConfig[p.status];
                const Icon = typeIcons[p.module.type] ?? BookOpen;
                return (
                  <div key={p.id}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-7 h-7 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">{p.module.title}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0 ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-10">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${cfg.bar}`}
                          style={{ width: p.status === 'completed' ? '100%' : '50%' }} />
                      </div>
                      {p.score != null && (
                        <span className="text-xs text-emerald-700 font-medium shrink-0">{p.score}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Achievement banner */}
      {summary && summary.averageScore != null && summary.averageScore >= 70 && (
        <div className="bg-emerald-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center shrink-0">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-white text-lg">Great work, {user?.fullName?.split(' ')[0]}!</h3>
            <p className="text-emerald-300 text-sm mt-1">
              Your {summary.averageScore}% average score shows strong progress. Keep it up!
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-3xl font-black text-amber-400">{summary.averageScore}%</div>
            <div className="text-xs text-emerald-400 mt-0.5">Avg Score</div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {progress.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {progress.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                {p.status === 'completed'
                  ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  : <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                }
                <span className="text-sm text-gray-700 flex-1">
                  {p.status === 'completed' ? 'Completed' : 'Started'}: {p.module.title}
                  {p.score != null && ` · ${p.score}%`}
                </span>
                {p.completedAt && (
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(p.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
