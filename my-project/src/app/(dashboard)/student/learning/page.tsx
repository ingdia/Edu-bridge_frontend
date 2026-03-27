'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BookOpen, Laptop, Headphones, Mic, PenLine, FileText,
  Lock, CheckCircle, PlayCircle, ChevronRight, Search, X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fetchStudentModules, submitProgress, type StudentModule } from '@/lib/api/student';
import { EmailSimulator, defaultEmailScenario } from '@/components/features/learning/EmailSimulator';
import { SpeakingExercise } from '@/components/features/learning/SpeakingExercise';
import toast from 'react-hot-toast';

function ListeningPlayer({ src }: { src: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Audio</p>
      {error ? (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
          <Headphones className="w-4 h-4 shrink-0" />
          Audio file not available in demo mode.
        </div>
      ) : (
        <audio controls src={src} className="w-full" onError={() => setError(true)} />
      )}
      <p className="text-xs text-gray-400">Listen carefully, then answer the questions below.</p>
    </div>
  );
}

const exerciseTypeIcons: Record<string, typeof BookOpen> = {
  LISTENING: Headphones,
  SPEAKING: Mic,
  READING: BookOpen,
  WRITING: PenLine,
  DIGITAL_LITERACY: FileText,
};

const moduleTypeConfig: Record<string, { bg: string; text: string; icon: typeof BookOpen; label: string }> = {
  LISTENING:        { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Headphones, label: 'Listening' },
  SPEAKING:         { bg: 'bg-blue-50',    text: 'text-blue-700',    icon: Mic,        label: 'Speaking' },
  READING:          { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: BookOpen,   label: 'Reading' },
  WRITING:          { bg: 'bg-purple-50',  text: 'text-purple-700',  icon: PenLine,    label: 'Writing' },
  DIGITAL_LITERACY: { bg: 'bg-gray-50',    text: 'text-gray-700',    icon: Laptop,     label: 'Digital' },
};

const difficultyConfig: Record<string, string> = {
  beginner:     'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced:     'bg-gray-100 text-gray-600',
  BEGINNER:     'bg-emerald-100 text-emerald-700',
  INTERMEDIATE: 'bg-amber-100 text-amber-700',
  ADVANCED:     'bg-gray-100 text-gray-600',
};

export default function LearningPage() {
  const [modules, setModules]             = useState<StudentModule[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeModule, setActiveModule]   = useState<string | null>(null);
  const [filter, setFilter]               = useState('ALL');
  const [search, setSearch]               = useState('');
  const [submitting, setSubmitting]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentModules();
      setModules(data);
    } catch {
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = modules.filter((m) => {
    const matchType   = filter === 'ALL' || m.type === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const selected = modules.find((m) => m.id === activeModule);

  const handleComplete = async (score: number) => {
    if (!activeModule) return;
    setSubmitting(true);
    try {
      await submitProgress({
        moduleId: activeModule,
        score,
        completedAt: new Date().toISOString(),
        timeSpent: selected?.estimatedDuration ?? 30,
      });
      toast.success(`Module completed! Score: ${score}%`);
      await load();
      setActiveModule(null);
    } catch {
      toast.error('Failed to save progress');
    } finally {
      setSubmitting(false);
    }
  };

  const types = ['ALL', ...Array.from(new Set(modules.map((m) => m.type)))];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Learning Modules</h1>
        <p className="text-gray-500 text-sm mt-1">Work through modules at your own pace. Progress is saved automatically.</p>
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

          <div className="flex gap-2 flex-wrap">
            {types.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {f === 'ALL' ? 'All' : (moduleTypeConfig[f]?.label ?? f)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((mod) => {
                const cfg  = moduleTypeConfig[mod.type] ?? moduleTypeConfig.READING;
                const Icon = cfg.icon;
                const prog = mod.progress;
                const pct  = prog?.isCompleted ? 100 : prog ? 50 : 0;
                const isActive = activeModule === mod.id;

                return (
                  <button key={mod.id}
                    onClick={() => { setActiveModule(mod.id); }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      isActive ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 truncate block mb-1">{mod.title}</span>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyConfig[mod.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                            {mod.difficulty.charAt(0).toUpperCase() + mod.difficulty.slice(1).toLowerCase()}
                          </span>
                          {mod.estimatedDuration && (
                            <span className="text-xs text-gray-400">{mod.estimatedDuration} min</span>
                          )}
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        {prog?.score != null && (
                          <p className="text-xs text-emerald-700 font-medium mt-1">Score: {prog.score}%</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && !loading && (
                <div className="text-center py-10 text-sm text-gray-400">
                  <BookOpen className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  No modules found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Module detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 h-full flex flex-col items-center justify-center py-24 text-center px-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Select a module to begin</h3>
              <p className="text-sm text-gray-400 max-w-xs">Choose a module from the list to start learning.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div className="flex items-start gap-4">
                {(() => {
                  const cfg  = moduleTypeConfig[selected.type] ?? moduleTypeConfig.READING;
                  const Icon = cfg.icon;
                  return (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                  {selected.description && (
                    <p className="text-sm text-gray-500 mt-1">{selected.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyConfig[selected.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                      {selected.difficulty.charAt(0).toUpperCase() + selected.difficulty.slice(1).toLowerCase()}
                    </span>
                    {selected.estimatedDuration && (
                      <span className="text-xs text-gray-400">{selected.estimatedDuration} min</span>
                    )}
                    {selected.progress?.isCompleted && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setActiveModule(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              {selected.progress && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Your Progress</span>
                    {selected.progress.score != null && (
                      <span className="text-sm font-bold text-emerald-700">{selected.progress.score}%</span>
                    )}
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: selected.progress.isCompleted ? '100%' : '50%' }} />
                  </div>
                  {selected.progress.completedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Completed {new Date(selected.progress.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              )}

              {/* Module type specific content */}
              <div className="space-y-4">
                {selected.type === 'SPEAKING' ? (
                  <SpeakingExercise
                    prompt="Speak clearly about the topic presented in this module."
                    maxDuration={60}
                    onComplete={(score) => handleComplete(score)}
                  />
                ) : selected.type === 'DIGITAL_LITERACY' ? (
                  <EmailSimulator
                    scenario={defaultEmailScenario}
                    onComplete={(score) => handleComplete(score)}
                  />
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Module Content</p>
                    <p className="text-sm text-gray-600">
                      This is a {selected.type.toLowerCase().replace('_', ' ')} module.
                      Complete the exercises to track your progress.
                    </p>
                  </div>
                )}

                {selected.type !== 'SPEAKING' && selected.type !== 'DIGITAL_LITERACY' && (
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={submitting || selected.progress?.isCompleted}
                    onClick={() => handleComplete(80)}
                  >
                    {selected.progress?.isCompleted ? (
                      <><CheckCircle className="mr-2 w-4 h-4" /> Completed</>
                    ) : submitting ? 'Saving…' : (
                      <><PlayCircle className="mr-2 w-4 h-4" /> Mark as Complete</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
