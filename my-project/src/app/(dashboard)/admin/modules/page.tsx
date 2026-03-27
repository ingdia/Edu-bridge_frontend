'use client';

import { useEffect, useState, useCallback } from 'react';
import { BookOpen, Laptop, Briefcase, Plus, Users, X } from 'lucide-react';
import {
  fetchAdminModules, createModule, updateModule, toggleModuleStatus, deleteModule,
  type AdminModule,
} from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type TypeFilter = 'ALL' | 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING' | 'DIGITAL_LITERACY';

const typeConfig: Record<string, { label: string; className: string; icon: any }> = {
  LISTENING:        { label: 'Listening',        className: 'bg-emerald-100 text-emerald-700', icon: BookOpen },
  SPEAKING:         { label: 'Speaking',         className: 'bg-emerald-100 text-emerald-700', icon: BookOpen },
  READING:          { label: 'Reading',          className: 'bg-emerald-100 text-emerald-700', icon: BookOpen },
  WRITING:          { label: 'Writing',          className: 'bg-emerald-100 text-emerald-700', icon: BookOpen },
  DIGITAL_LITERACY: { label: 'Digital Literacy', className: 'bg-amber-100 text-amber-700',    icon: Laptop },
};

const diffConfig: Record<string, string> = {
  beginner:     'bg-emerald-50 text-emerald-600',
  intermediate: 'bg-amber-50 text-amber-600',
  advanced:     'bg-gray-100 text-gray-600',
  // uppercase fallbacks for any existing data
  BEGINNER:     'bg-emerald-50 text-emerald-600',
  INTERMEDIATE: 'bg-amber-50 text-amber-600',
  ADVANCED:     'bg-gray-100 text-gray-600',
};

const TYPES = ['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY'];

const emptyForm = { title: '', type: 'LISTENING', difficulty: 'beginner', contentUrl: '', description: '' };

export default function AdminModulesPage() {
  const [modules, setModules]   = useState<AdminModule[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<TypeFilter>('ALL');
  const [showAdd, setShowAdd]   = useState(false);
  const [editMod, setEditMod]   = useState<AdminModule | null>(null);
  const [saving, setSaving]     = useState(false);
  const [newMod, setNewMod]     = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminModules();
      setModules(data);
    } catch {
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createModule(newMod);
      setModules((prev) => [created, ...prev]);
      toast.success(`Module "${created.title}" added`);
      setShowAdd(false);
      setNewMod(emptyForm);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create module');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMod) return;
    setSaving(true);
    try {
      const updated = await updateModule(editMod.id, { title: editMod.title, description: editMod.description ?? undefined });
      setModules((prev) => prev.map((m) => m.id === updated.id ? updated : m));
      toast.success('Module updated');
      setEditMod(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update module');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleModuleStatus(id);
      setModules((prev) => prev.map((m) => m.id === id ? { ...m, isActive: updated.isActive } : m));
      toast.success(updated.isActive ? 'Module activated' : 'Module deactivated');
    } catch {
      toast.error('Failed to toggle module status');
    }
  };

  const filtered = modules.filter((m) => filter === 'ALL' || m.type === filter);

  return (
    <div className="space-y-6">

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Add Module</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input required value={newMod.title} onChange={(e) => setNewMod((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Content URL</label>
                <input required value={newMod.contentUrl} onChange={(e) => setNewMod((p) => ({ ...p, contentUrl: e.target.value }))}
                  placeholder="https://…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea value={newMod.description} onChange={(e) => setNewMod((p) => ({ ...p, description: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                  <select value={newMod.type} onChange={(e) => setNewMod((p) => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {TYPES.map((t) => <option key={t} value={t}>{typeConfig[t]?.label ?? t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Difficulty</label>
                  <select value={newMod.difficulty} onChange={(e) => setNewMod((p) => ({ ...p, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                  {saving ? 'Adding…' : 'Add Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMod && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Edit Module</h2>
              <button onClick={() => setEditMod(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input value={editMod.title} onChange={(e) => setEditMod((p) => p ? { ...p, title: e.target.value } : p)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea value={editMod.description ?? ''} onChange={(e) => setEditMod((p) => p ? { ...p, description: e.target.value } : p)} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditMod(null)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Module Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage English and digital literacy modules.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Add Module
        </button>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ALL', ...TYPES] as (TypeFilter | string)[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as TypeFilter)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              filter === t
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            )}
          >
            {t === 'ALL' ? `All (${modules.length})` : `${typeConfig[t]?.label ?? t} (${modules.filter((m) => m.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Module cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">No modules found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mod) => {
            const type = typeConfig[mod.type] ?? { label: mod.type, className: 'bg-gray-100 text-gray-600', icon: BookOpen };
            const diff = diffConfig[mod.difficulty] ?? 'bg-gray-100 text-gray-600';
            const Icon = type.icon;
            const enrolled = mod._count?.progress ?? 0;
            const submissions = mod._count?.exerciseSubmissions ?? 0;

            return (
              <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type.className}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{mod.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${type.className}`}>{type.label}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff}`}>{mod.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    mod.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  )}>
                    {mod.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {mod.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{mod.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {enrolled} enrolled</span>
                  <span>{submissions} submissions</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditMod(mod)} className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors">Edit</button>
                    <button onClick={() => handleToggle(mod.id)} className={cn('font-semibold transition-colors', mod.isActive ? 'text-gray-400 hover:text-gray-600' : 'text-emerald-600 hover:text-emerald-800')}>
                      {mod.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
