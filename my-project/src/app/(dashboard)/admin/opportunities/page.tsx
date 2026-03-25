'use client';

import { useState } from 'react';
import { Plus, Users, Calendar } from 'lucide-react';
import { mockAdminOpportunities } from '@/lib/api/mockData';
import { cn } from '@/lib/utils';

type TypeFilter = 'ALL' | 'SCHOLARSHIP' | 'INTERNSHIP' | 'JOB';

const typeConfig = {
  SCHOLARSHIP: { label: 'Scholarship', className: 'bg-emerald-100 text-emerald-700' },
  INTERNSHIP:  { label: 'Internship',  className: 'bg-amber-100 text-amber-700' },
  JOB:         { label: 'Job',         className: 'bg-blue-100 text-blue-700' },
};

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isExpired(iso: string) {
  return new Date(iso) < new Date();
}

export default function AdminOpportunitiesPage() {
  const [filter, setFilter] = useState<TypeFilter>('ALL');

  const filtered = mockAdminOpportunities.filter((o) => filter === 'ALL' || o.type === filter);

  const counts = {
    ALL:        mockAdminOpportunities.length,
    SCHOLARSHIP: mockAdminOpportunities.filter((o) => o.type === 'SCHOLARSHIP').length,
    INTERNSHIP:  mockAdminOpportunities.filter((o) => o.type === 'INTERNSHIP').length,
    JOB:         mockAdminOpportunities.filter((o) => o.type === 'JOB').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage scholarships, internships, and job listings for students.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Add Opportunity
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',       value: counts.ALL,        className: 'bg-gray-50 border-gray-100' },
          { label: 'Scholarships',value: counts.SCHOLARSHIP, className: 'bg-emerald-50 border-emerald-100' },
          { label: 'Internships', value: counts.INTERNSHIP,  className: 'bg-amber-50 border-amber-100' },
          { label: 'Jobs',        value: counts.JOB,         className: 'bg-blue-50 border-blue-100' },
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
                ? 'bg-violet-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
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
            <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-sm transition-all flex flex-col gap-3">
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
                <span className="ml-auto text-violet-700 font-semibold hover:text-violet-900 cursor-pointer transition-colors">
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
