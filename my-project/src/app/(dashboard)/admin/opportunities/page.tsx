'use client';

import { useState } from 'react';
import { Plus, Users, Calendar, X } from 'lucide-react';
import { mockAdminOpportunities } from '@/lib/api/mockData';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type TypeFilter = 'ALL' | 'SCHOLARSHIP' | 'INTERNSHIP' | 'JOB';

const typeConfig = {
  SCHOLARSHIP: { label: 'Scholarship', className: 'bg-emerald-100 text-emerald-700' },
  INTERNSHIP:  { label: 'Internship',  className: 'bg-amber-100 text-amber-700' },
  JOB:         { label: 'Job',         className: 'bg-gray-100 text-gray-700' },
};

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpired(iso: string) {
  return new Date(iso) < new Date();
}

export default function AdminOpportunitiesPage() {
  const [filter, setFilter]   = useState<TypeFilter>('ALL');
  const [showAdd, setShowAdd] = useState(false);
  const [editOpp, setEditOpp] = useState<typeof mockAdminOpportunities[0] | null>(null);
  const [newOpp, setNewOpp]   = useState({ title: '', organization: '', type: 'SCHOLARSHIP', deadline: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Opportunity "${newOpp.title}" added`);
    setShowAdd(false);
    setNewOpp({ title: '', organization: '', type: 'SCHOLARSHIP', deadline: '' });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Opportunity updated');
    setEditOpp(null);
  };

  const filtered = mockAdminOpportunities.filter((o) => filter === 'ALL' || o.type === filter);

  const counts = {
    ALL:        mockAdminOpportunities.length,
    SCHOLARSHIP: mockAdminOpportunities.filter((o) => o.type === 'SCHOLARSHIP').length,
    INTERNSHIP:  mockAdminOpportunities.filter((o) => o.type === 'INTERNSHIP').length,
    JOB:         mockAdminOpportunities.filter((o) => o.type === 'JOB').length,
  };

  return (
    <div className="space-y-6">

      {/* Add Opportunity Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Add Opportunity</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              {([['Title','title','text'],['Organisation','organization','text'],['Deadline','deadline','date']] as [string,keyof typeof newOpp,string][]).map(([label,key,type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input type={type} required value={newOpp[key]} onChange={(e) => setNewOpp((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                <select value={newOpp.type} onChange={(e) => setNewOpp((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option value="SCHOLARSHIP">Scholarship</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="JOB">Job</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editOpp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Edit Opportunity</h2>
              <button onClick={() => setEditOpp(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-3">
              {([['Title','title'],['Organisation','organization']] as [string, keyof typeof editOpp][]).map(([label,key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input value={String(editOpp[key])} onChange={(e) => setEditOpp((p) => p ? { ...p, [key]: e.target.value } : p)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditOpp(null)} className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl">Save</button>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',       value: counts.ALL,        className: 'bg-gray-50 border-gray-100' },
          { label: 'Scholarships',value: counts.SCHOLARSHIP, className: 'bg-emerald-50 border-emerald-100' },
          { label: 'Internships', value: counts.INTERNSHIP,  className: 'bg-amber-50 border-amber-100' },
          { label: 'Jobs',        value: counts.JOB,         className: 'bg-gray-50 border-gray-100' },
        ].map(({ label, value, className }) => (
          <div key={label} className={`rounded-2xl border p-4 ${className}`}>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ALL', 'SCHOLARSHIP', 'INTERNSHIP', 'JOB'] as TypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              filter === t
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            )}
          >
            {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()} ({counts[t]})
          </button>
        ))}
      </div>

      {/* Opportunity cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((opp) => {
          const type    = typeConfig[opp.type];
          const expired = isExpired(opp.deadline);

          return (
            <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-sm transition-all flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.className}`}>
                  {type.label}
                </span>
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                  !opp.isActive || expired
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-emerald-100 text-emerald-700'
                )}>
                  {!opp.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{opp.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{opp.organization}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDeadline(opp.deadline)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {opp.applicants} applicants
                </span>
                <span onClick={() => setEditOpp(opp)} className="ml-auto text-emerald-700 font-semibold hover:text-emerald-900 cursor-pointer transition-colors">
                  Edit
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
