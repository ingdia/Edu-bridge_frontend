'use client';

import { useState } from 'react';
import {
  BookOpen, Laptop, Headphones, Mic, PenLine, FileText,
  Lock, CheckCircle, PlayCircle, ChevronRight, Search, X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockModules, mockProgress } from '@/lib/api/mockData';
import { EmailSimulator, defaultEmailScenario } from '@/components/features/learning/EmailSimulator';
import { logAction } from '@/lib/utils/auditLogger';

const exerciseTypeIcons: Record<string, typeof BookOpen> = {
  LISTENING:     Headphones,
  SPEAKING:      Mic,
  READING:       BookOpen,
  WRITING:       PenLine,
  DIGITAL_SKILL: FileText,
};

const moduleTypeConfig: Record<string, { bg: string; text: string; border: string; icon: typeof BookOpen; label: string }> = {
  ENGLISH:          { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: BookOpen, label: 'English' },
  DIGITAL_LITERACY: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100',   icon: Laptop,   label: 'Digital' },
};

const difficultyConfig: Record<string, string> = {
  BEGINNER:     'bg-emerald-100 text-emerald-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED:     'bg-gray-100 text-gray-600',
};

export default function LearningPage() {
  const [activeModule, setActiveModule]   = useState<string | null>(null);
  const [filter, setFilter]               = useState<'ALL' | 'ENGLISH' | 'DIGITAL_LITERACY'>('ALL');
  const [search, setSearch]               = useState('');
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [completedEx, setCompletedEx]     = useState<Set<string>>(new Set());

  const progressMap = Object.fromEntries(mockProgress.modules.map((m) => [m.moduleId, m]));

  const filtered = mockModules.filter((m) => {
    const matchType   = filter === 'ALL' || m.type === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const selected         = mockModules.find((m) => m.id === activeModule);
  const selectedProgress = activeModule ? progressMap[activeModule] : null;
  const activeEx         = selected?.exercises.find((e) => e.id === activeExercise);

  const handleStartExercise = (exId: string) => {
    setActiveExercise(exId);
    logAction('usr_123', 'STUDENT', 'EXERCISE_STARTED', `Started exercise ${exId}`);
  };

  const handleExerciseComplete = (exId: string, score: number) => {
    setCompletedEx((prev) => new Set([...prev, exId]));
    setActiveExercise(null);
    logAction('usr_123', 'STUDENT', 'EXERCISE_COMPLETED', `Completed exercise ${exId} with score ${score}%`);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Learning Modules</h1>
        <p className="text-gray-500 text-sm mt-1">Work through exercises at your own pace. Your progress is saved automatically.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Module list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {(['ALL', 'ENGLISH', 'DIGITAL_LITERACY'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'ENGLISH' ? 'English' : 'Digital'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((mod) => {
              const cfg  = moduleTypeConfig[mod.type] ?? moduleTypeConfig.ENGLISH;
              const Icon = cfg.icon;
              const prog = progressMap[mod.id];
              const pct  = prog ? Math.round((prog.completedExercises / prog.totalExercises) * 100) : 0;
              const isActive = activeModule === mod.id;

              return (
                <button
                  key={mod.id}
                  onClick={() => { setActiveModule(mod.id); setActiveExercise(null); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    isActive ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate block mb-1">{mod.title}</span>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyConfig[mod.difficulty]}`}>
                          {mod.difficulty.charAt(0) + mod.difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs text-gray-400">{mod.exercises.length} exercises</span>
                      </div>
                      {prog && (
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercise detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col items-center justify-center py-24 text-center px-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Select a module to begin</h3>
              <p className="text-sm text-gray-400 max-w-xs">Choose a module from the list to see its exercises and start learning.</p>
            </div>
          ) : activeEx ? (
            /* ── ACTIVE EXERCISE VIEW ── */
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{activeEx.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{activeEx.type.toLowerCase().replace('_', ' ')} exercise</p>
                </div>
                <button onClick={() => setActiveExercise(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{activeEx.instructions}</p>

              {/* NFR12 — Email simulator for DIGITAL_SKILL exercises */}
              {activeEx.type === 'DIGITAL_SKILL' ? (
                <EmailSimulator
                  scenario={defaultEmailScenario}
                  onComplete={(score) => handleExerciseComplete(activeEx.id, score)}
                />
              ) : (
                /* Generic exercise placeholder for other types */
                <div className="space-y-4">
                  {'prompt' in activeEx.content && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-sm font-semibold text-amber-700 mb-1">Prompt</p>
                      <p className="text-sm text-gray-700">{String(activeEx.content.prompt)}</p>
                    </div>
                  )}
                  {'passage' in activeEx.content && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700 leading-relaxed">{String(activeEx.content.passage)}</p>
                    </div>
                  )}
                  {'questions' in activeEx.content && Array.isArray(activeEx.content.questions) && (
                    <div className="space-y-3">
                      {(activeEx.content.questions as { id: string; question: string; options?: string[] }[]).map((q) => (
                        <div key={q.id} className="p-4 bg-white border border-gray-100 rounded-xl">
                          <p className="text-sm font-medium text-gray-900 mb-2">{q.question}</p>
                          {q.options && (
                            <div className="space-y-1.5">
                              {q.options.map((opt) => (
                                <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                  <input type="radio" name={q.id} className="accent-emerald-700" />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleExerciseComplete(activeEx.id, 80)}
                  >
                    Submit Exercise <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* ── MODULE OVERVIEW ── */
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${moduleTypeConfig[selected.type]?.bg} ${moduleTypeConfig[selected.type]?.text}`}>
                  {(() => { const Icon = moduleTypeConfig[selected.type]?.icon ?? BookOpen; return <Icon className="w-6 h-6" />; })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selected.description}</p>
                  {selectedProgress && (
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.round((selectedProgress.completedExercises / selectedProgress.totalExercises) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {selectedProgress.completedExercises}/{selectedProgress.totalExercises} done
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Exercises</h3>
                <div className="space-y-3">
                  {selected.exercises.map((ex, index) => {
                    const ExIcon  = exerciseTypeIcons[ex.type] ?? BookOpen;
                    const isDone  = completedEx.has(ex.id) || (selectedProgress ? index < selectedProgress.completedExercises : false);
                    const isLocked = selectedProgress ? index > selectedProgress.completedExercises : index > 0;

                    return (
                      <div
                        key={ex.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          isDone ? 'border-emerald-100 bg-emerald-50' : isLocked ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-amber-100 bg-amber-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-emerald-100 text-emerald-700' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <ExIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{ex.title}</span>
                            <span className="text-xs text-gray-400 capitalize">{ex.type.toLowerCase().replace('_', ' ')}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{ex.instructions}</p>
                        </div>
                        <div className="shrink-0">
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => handleStartExercise(ex.id)}>
                              Start <PlayCircle className="ml-1 w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedProgress && selectedProgress.averageScore > 0 && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 font-medium">Average Score</span>
                  <span className="text-lg font-extrabold text-emerald-700">{selectedProgress.averageScore}%</span>
                </div>
              )}

              <Button variant="primary" className="w-full">
                {selectedProgress?.status === 'COMPLETED' ? 'Review Module' : 'Continue Module'}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
