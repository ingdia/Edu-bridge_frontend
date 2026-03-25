'use client';

import { useState } from 'react';
import { BookOpen, Laptop, Briefcase, Plus, Users } from 'lucide-react';
import { mockAdminModules } from '@/lib/api/mockData';
import { cn } from '@/lib/utils';

type TypeFilter = 'ALL' | 'ENGLISH' | 'DIGITAL_LITERACY' | 'CAREER';

const typeConfig = {
  ENGLISH:          { label: 'English',          className: 'bg-emerald-100 text-emerald-700', icon: BookOpen },
  DIGITAL_LITERACY: { label: 'Digital Literacy', className: 'bg-blue-100 text-blue-700',       icon: Laptop },
  CAREER:           { label: 'Career',           className: 'bg-amber-100 text-amber-700',     icon: Briefcase },
};

const diffConfig = {
  BEGINNER:     'bg-emerald-50 text-emerald-600',
  INTERMEDIATE: 'bg-amber-50 text-amber-600',
  ADVANCED:     'bg-red-50 text-red-600',
};

export default function AdminModulesPage() {
  const [filter, setFilter] = useState<TypeFilter>('ALL');

  const filtered = mockAdminModules.filter((m) => filter === 'ALL' || m.type === filter);

  const counts = {
    ALL:              mockAdminModules.length,
    ENGLISH:          mockAdminModules.filter((m) => m.type === 'ENGLISH').length,
    DIGITAL_LITERACY: mockAdminModules.filter((m) => m.type === 'DIGITAL_LITERACY').length,
    CAREER:           mockAdminModules.filter((m) => m.type === 'CAREER').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Module Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage English, digital literacy, and career modules.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          <Plus className="w-4 h-4" /> Add Module
        </button>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ALL', 'ENGLISH', 'DIGITAL_LITERACY', 'CAREER'] as TypeFilter[]).map((t) => (
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
            {t === 'ALL' ? 'All' : t === 'DIGITAL_LITERACY' ? 'Digital Literacy' : t.charAt(0) + t.slice(1).toLowerCase()} ({counts[t]})
          </button>
        ))}
      </div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => {
          const type = typeConfig[mod.type as keyof typeof typeConfig];
          const diff = diffConfig[mod.difficulty as keyof typeof diffConfig];
          const Icon = type.icon;

          return (
            <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-sm transition-all flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type.className}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{mod.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${type.className}`}>
                        {type.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff}`}>
                        {mod.difficulty}
                      </span>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Completion rate</span>
                  <span className="font-semibold text-gray-900">{mod.completionRate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${mod.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {mod.enrolledStudents} enrolled
                </span>
                <span>{mod.exercises} exercise{mod.exercises !== 1 ? 's' : ''}</span>
                <button className="text-violet-700 font-semibold hover:text-violet-900 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
