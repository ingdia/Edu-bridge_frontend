'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, School, Pencil, Trash2, X, CheckCircle } from 'lucide-react';
import { fetchSchools, createSchool, updateSchool, deleteSchool, type School as SchoolType } from '@/lib/api/school';
import toast from 'react-hot-toast';

export default function AdminSchoolsPage() {
  const [schools, setSchools]   = useState<SchoolType[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [editSchool, setEdit]   = useState<SchoolType | null>(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ name: '', district: '', province: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSchools();
      setSchools(data);
    } catch { toast.error('Failed to load schools'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const s = await createSchool({ name: form.name, district: form.district || undefined, province: form.province || undefined });
      setSchools((p) => [...p, s]);
      toast.success(`School "${s.name}" registered`);
      setShowAdd(false);
      setForm({ name: '', district: '', province: '' });
    } catch (err: any) { toast.error(err.message || 'Failed to create school'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSchool) return;
    setSaving(true);
    try {
      const s = await updateSchool(editSchool.id, { name: editSchool.name, district: editSchool.district ?? undefined, province: editSchool.province ?? undefined });
      setSchools((p) => p.map((x) => x.id === s.id ? s : x));
      toast.success('School updated');
      setEdit(null);
    } catch (err: any) { toast.error(err.message || 'Failed to update school'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"?`)) return;
    try {
      await deleteSchool(id);
      setSchools((p) => p.filter((s) => s.id !== id));
      toast.success('School deactivated');
    } catch { toast.error('Failed to deactivate school'); }
  };

  return (
    <div className="space-y-6">

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Register School</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              {[['School Name *', 'name', true], ['District', 'district', false], ['Province', 'province', false]].map(([label, key, req]) => (
                <div key={key as string}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label as string}</label>
                  <input required={req as boolean} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [key as string]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                  {saving ? 'Saving…' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editSchool && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Edit School</h2>
              <button onClick={() => setEdit(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              {[['School Name', 'name'], ['District', 'district'], ['Province', 'province']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input value={(editSchool as any)[key] ?? ''}
                    onChange={(e) => setEdit((p) => p ? { ...p, [key]: e.target.value } : p)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEdit(null)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Schools</h1>
          <p className="text-sm text-gray-500 mt-0.5">{schools.length} registered school{schools.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Register School
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : schools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <School className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No schools registered yet.</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-emerald-700 font-semibold hover:text-emerald-800">Register the first school →</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <School className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => setEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-emerald-700 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{s.name}</h3>
              {(s.district || s.province) && (
                <p className="text-xs text-gray-400 mt-0.5">{[s.district, s.province].filter(Boolean).join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
