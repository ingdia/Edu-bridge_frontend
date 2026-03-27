'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Users, Calendar, X } from 'lucide-react';
import {
  fetchAdminOpportunities, createOpportunity, updateOpportunity, deleteOpportunity,
  type AdminOpportunity,
} from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type TypeFilter = 'ALL' | 'SCHOLARSHIP' | 'INTERNSHIP' | 'JOB' | 'UNIVERSITY' | 'TRAINING';

const typeConfig: Record<string, { label: string; className: string }> = {
  SCHOLARSHIP: { label: 'Scholarship', className: 'bg-emerald-100 text-emerald-700' },
  INTERNSHIP:  { label: 'Internship',  className: 'bg-amber-100 text-amber-700' },
  JOB:         { label: 'Job',         className: 'bg-gray-100 text-gray-700' },
  UNIVERSITY:  { label: 'University',  className: 'bg-blue-100 text-blue-700' },
  TRAINING:    { label: 'Training',    className: 'bg-purple-100 text-purple-700' },
};

const TYPES = ['SCHOLARSHIP', 'INTERNSHIP', 'JOB', 'UNIVERSITY', 'TRAINING'];

const emptyForm = { title: '', organization: '', type: 'SCHOLARSHIP', description: '', deadline: '', location: '', minGrade: '' };

function formatDeadline(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpired(iso: string | null) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

export default function AdminOpportunitiesPage() {
  const [opps, setOpps]         = useState<AdminOpportunity[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<TypeFilter>('ALL');
  const [showAdd, setShowAdd]   = useState(false);
  const [editOpp, setEditOpp]   = useState<AdminOpportunity | null>(null);
  const [saving, setSaving]     = useState(false);
  const [newOpp, setNewOpp]     = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOpportunities();
      setOpps(data);
    } catch {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createOpportunity({
        ...newOpp,
        deadline: newOpp.deadline || undefined,
        location: newOpp.location || undefined,
        minGrade: newOpp.minGrade || undefined,
      });
      setOpps((prev) => [created, ...prev]);
      toast.success(`Opportunity "${created.title}" added`);
      setShowAdd(false);
      setNewOpp(emptyForm);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOpp) return;
    setSaving(true);
    try {
      const updated = await updateOpportunity(editOpp.id, {
        title: editOpp.title,
        organization: editOpp.organization,
        deadline: editOpp.deadline ?? undefined,
      });
      setOpps((prev) => prev.map((o) => o.id === updated.id ? updated : o));
      toast.success('Opportunity updated');
      setEditOpp(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteOpportunity(id);
      setOpps((prev) => prev.filter((o) => o.id !== id));
      toast.success('Opportunity deleted');
    } catch {
      toast.error('Failed to delete opportunity');
    }
  };

  const filtered = opps.filter((o) => filter === 'ALL' || o.type === filter);

  const counts: Record<string, number> = { ALL: opps.length };
  TYPES.forEach((t) => { counts[t] = opps.filter((o) => o.type === t).length; });

  return (
    <div className="space-y-6">

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Add Opportunity</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              {([['Title', 'title', 'text'], ['Organisation', 'organization', 'text'], ['Description', 'description', 'text'], ['Deadline', 'deadline', 'date'], ['Location', 'location', 'text'], ['Min Grade (%)', 'minGrade', 'text']] as [string, keyof typeof newOpp, string][]).map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input type={type} required={['title', 'organization', 'description'].includes(key)} value={newOpp[key]}
                    onChange={(e) => setNewOpp((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                <select value={newOpp.type} onChange={(e) => setNewOpp((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  {TYPES.map((t) => <option key={t} value={t}>{typeConfig[t].label}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                  {saving ? 'Adding…' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Edit Opportunity</h2>
              <button onClick={() => setEditOpp(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              {([['Title', 'title'], ['Organisation', 'organization']] as [string, keyof AdminOpportunity][]).map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input value={String(editOpp[key] ?? '')} onChange={(e) => setEditOpp((p) => p ? { ...p, [key]: e.target.value } : p)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Deadline</label>
                <input type="date" value={editOpp.deadline ? editOpp.deadline.slice(0, 10) : ''}
                  onChange={(e) => setEditOpp((p) => p ? { ...p, deadline: e.target.value } : p)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditOpp(null)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
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
          <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage scholarships, internships, and job listings for students.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[{ label: 'Total', key: 'ALL' }, ...TYPES.map((t) => ({ label: typeConfig[t].label, key: t }))].map(({ label, key }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-gray-900">{counts[key] ?? 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ALL', ...TYPES] as TypeFilter[]).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              filter === t ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300')}>
            {t === 'ALL' ? 'All' : typeConfig[t]?.label ?? t} ({counts[t] ?? 0})
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-36 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">No opportunities found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((opp) => {
            const type    = typeConfig[opp.type] ?? { label: opp.type, className: 'bg-gray-100 text-gray-600' };
            const expired = isExpired(opp.deadline);
            return (
              <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.className}`}>{type.label}</span>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    !opp.isActive || expired ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-700')}>
                    {!opp.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">{opp.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{opp.organization}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDeadline(opp.deadline)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{opp.applyCount} applied</span>
                  <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => setEditOpp(opp)} className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(opp.id, opp.title)} className="text-red-400 font-semibold hover:text-red-600 transition-colors">Delete</button>
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
