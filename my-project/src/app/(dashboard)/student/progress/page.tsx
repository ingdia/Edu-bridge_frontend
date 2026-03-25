'use client';

import { BookOpen, Laptop, CheckCircle, Clock, TrendingUp, Award, Target } from 'lucide-react';
import { mockProgress, mockUser } from '@/lib/api/mockData';

const statusConfig = {
  COMPLETED:   { label: 'Completed',   bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  IN_PROGRESS: { label: 'In Progress', bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700' },
  NOT_STARTED: { label: 'Not Started', bar: 'bg-gray-200',    badge: 'bg-gray-100 text-gray-500' },
};

const moduleIcons: Record<string, typeof BookOpen> = {
  mod_001: BookOpen,
  mod_002: Laptop,
  mod_003: BookOpen,
};

// Simulated weekly score history
const weeklyScores = [
  { week: 'Week 1', score: 62 },
  { week: 'Week 2', score: 70 },
  { week: 'Week 3', score: 75 },
  { week: 'Week 4', score: 80 },
  { week: 'Week 5', score: 85 },
  { week: 'Week 6', score: 88 },
];

const maxScore = Math.max(...weeklyScores.map((w) => w.score));

export default function ProgressPage() {
  const completed = mockProgress.modules.filter((m) => m.status === 'COMPLETED').length;
  const total = mockProgress.modules.length;
  const avgScore = mockProgress.overallScore;

  const summaryCards = [
    { label: 'Overall Score', value: `${avgScore}%`, icon: Award, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { label: 'Modules Done', value: `${completed}/${total}`, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
    { label: 'Exercises Done', value: `${mockProgress.modules.reduce((a, m) => a + m.completedExercises, 0)}`, icon: Target, color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-100' },
    { label: 'Streak', value: '6 weeks', icon: TrendingUp, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          {mockUser.fullName} · Last updated {new Date(mockProgress.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
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

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Score trend chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1">Score Trend</h2>
          <p className="text-xs text-gray-400 mb-6">Your average score over the past 6 weeks</p>

          <div className="flex items-end gap-3 h-40">
            {weeklyScores.map(({ week, score }) => (
              <div key={week} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-700">{score}%</span>
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '100px' }}>
                  <div
                    className="w-full bg-emerald-500 rounded-t-lg transition-all duration-700"
                    style={{ height: `${(score / maxScore) * 100}%`, marginTop: `${100 - (score / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{week.replace('Week ', 'W')}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Starting score: <strong>62%</strong></span>
            <span className="text-xs text-emerald-700 font-semibold">+26% improvement 🎉</span>
          </div>
        </div>

        {/* Module breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1">Module Breakdown</h2>
          <p className="text-xs text-gray-400 mb-5">Completion and scores per module</p>

          <div className="space-y-5">
            {mockProgress.modules.map((mod) => {
              const pct = mod.totalExercises > 0
                ? Math.round((mod.completedExercises / mod.totalExercises) * 100)
                : 0;
              const cfg = statusConfig[mod.status];
              const Icon = moduleIcons[mod.moduleId] ?? BookOpen;

              return (
                <div key={mod.moduleId}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">{mod.moduleTitle}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0 ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-11">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                  </div>
                  <div className="pl-11 mt-1 flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                      {mod.completedExercises}/{mod.totalExercises} exercises
                    </span>
                    {mod.averageScore > 0 && (
                      <span className="text-xs text-emerald-700 font-medium">Score: {mod.averageScore}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievement banner */}
      <div className="bg-emerald-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center shrink-0">
          <Award className="w-8 h-8 text-amber-400" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-white text-lg">You&apos;re in the top 15% of students!</h3>
          <p className="text-emerald-300 text-sm mt-1">
            Your {avgScore}% average score puts you ahead of most students at {mockUser.school}.
            Keep going — you&apos;re on track for a strong university application.
          </p>
        </div>
        <div className="shrink-0 text-center">
          <div className="text-3xl font-black text-amber-400">{avgScore}%</div>
          <div className="text-xs text-emerald-400 mt-0.5">Overall Score</div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Completed exercise: Email Essentials', time: '2 hours ago', icon: CheckCircle, color: 'text-emerald-600' },
            { action: 'Started module: Reading Comprehension', time: 'Yesterday', icon: Clock, color: 'text-amber-600' },
            { action: 'Scored 85% on Listening Basics', time: '2 days ago', icon: Award, color: 'text-amber-500' },
            { action: 'Joined mentorship session', time: '3 days ago', icon: TrendingUp, color: 'text-emerald-600' },
          ].map(({ action, time, icon: Icon, color }) => (
            <div key={action} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <Icon className={`w-4 h-4 shrink-0 ${color}`} />
              <span className="text-sm text-gray-700 flex-1">{action}</span>
              <span className="text-xs text-gray-400 shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
