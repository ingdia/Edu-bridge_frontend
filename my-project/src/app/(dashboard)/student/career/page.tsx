'use client';

import { useState } from 'react';
import {
  Briefcase, GraduationCap, Globe, MapPin, Calendar,
  CheckCircle, FileText, ArrowRight, Search, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/lib/api/mockData';
import type { OpportunityType } from '@/lib/types/api';

const typeConfig: Record<OpportunityType, { label: string; bg: string; text: string; icon: typeof Briefcase }> = {
  SCHOLARSHIP: { label: 'Scholarship', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: GraduationCap },
  INTERNSHIP:  { label: 'Internship',  bg: 'bg-amber-100',   text: 'text-amber-700',   icon: Briefcase },
  JOB:         { label: 'Job',         bg: 'bg-gray-100',    text: 'text-gray-700',    icon: Briefcase },
};

const cvSteps = [
  { label: 'Personal Info', done: true },
  { label: 'Education', done: true },
  { label: 'Skills', done: false },
  { label: 'Experience', done: false },
  { label: 'References', done: false },
];

const applications = [
  { title: 'ALU Scholarship', org: 'African Leadership University', status: 'Submitted', date: 'Mar 10', color: 'bg-blue-100 text-blue-700' },
  { title: 'Tech Hub Internship', org: 'Tech Hub Rwanda', status: 'Under Review', date: 'Mar 15', color: 'bg-amber-100 text-amber-700' },
];

export default function CareerPage() {
  const [filter, setFilter] = useState<'ALL' | OpportunityType>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockOpportunities.filter((o) => {
    const matchType = filter === 'ALL' || o.type === filter;
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.organization.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch && o.isActive;
  });

  const cvProgress = Math.round((cvSteps.filter((s) => s.done).length / cvSteps.length) * 100);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Career Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Build your CV, track applications, and discover opportunities matched to your skills.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Opportunities */}
        <div className="lg:col-span-2 space-y-4">

          {/* Search + filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Type tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'SCHOLARSHIP', 'INTERNSHIP', 'JOB'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === t
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {t === 'ALL' ? 'All' : typeConfig[t].label}
              </button>
            ))}
          </div>

          {/* Opportunity cards */}
          <div className="space-y-4">
            {filtered.map((opp) => {
              const cfg = typeConfig[opp.type];
              const Icon = cfg.icon;
              return (
                <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 leading-snug">{opp.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{opp.organization}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{opp.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          {opp.isRemote ? <Globe className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Deadline: {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>Min grade: {opp.minGrade}%</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {opp.requiredSkills.map((skill) => (
                          <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>

                      <Button variant="primary" size="sm">
                        Apply Now <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No opportunities match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* CV Builder */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">CV Builder</h2>
                <p className="text-xs text-gray-400">{cvProgress}% complete</p>
              </div>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${cvProgress}%` }} />
            </div>

            <div className="space-y-2 mb-4">
              {cvSteps.map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 shrink-0 ${done ? 'text-emerald-600' : 'text-gray-200'}`} />
                  <span className={`text-sm ${done ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="sm" className="w-full">
              Continue Building CV
            </Button>
          </div>

          {/* Application tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">My Applications</h2>
            {applications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.title} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 leading-snug">{app.title}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${app.color}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{app.org} · Applied {app.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-emerald-900 rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">💡 Career Tip</h3>
            <p className="text-emerald-200 text-xs leading-relaxed">
              Complete your CV before applying. Opportunities with a complete CV get 3x more responses from organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
