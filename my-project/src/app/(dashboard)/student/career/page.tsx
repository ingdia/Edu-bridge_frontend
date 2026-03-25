'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Globe, MapPin, Calendar,
  CheckCircle, FileText, ArrowRight, Search, Filter, X, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/lib/api/mockData';
import { logAction } from '@/lib/utils/auditLogger';
import type { OpportunityType } from '@/lib/types/api';
import type { Opportunity } from '@/lib/types/api';

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

type Application = { id: string; title: string; org: string; status: string; date: string; color: string };

const initialApplications: Application[] = [
  { id: 'app_1', title: 'ALU Scholarship', org: 'African Leadership University', status: 'Submitted', date: 'Mar 10', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'app_2', title: 'Tech Hub Internship', org: 'Tech Hub Rwanda', status: 'Under Review', date: 'Mar 15', color: 'bg-amber-100 text-amber-700' },
];

export default function CareerPage() {
  const [filter, setFilter]       = useState<'ALL' | OpportunityType>('ALL');
  const [search, setSearch]         = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [applying, setApplying]     = useState<Opportunity | null>(null);
  const [appNote, setAppNote]       = useState('');
  const [submitted, setSubmitted]   = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [appSuccess, setAppSuccess] = useState(false);

  const handleApply = (opp: Opportunity) => { setApplying(opp); setAppNote(''); };

  const submitApplication = () => {
    if (!applying) return;
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    setSubmitted((p) => [...p, applying.id]);
    setApplications((p) => [
      { id: applying.id, title: applying.title, org: applying.organization, status: 'Submitted', date: now, color: 'bg-emerald-100 text-emerald-700' },
      ...p,
    ]);
    logAction('usr_123', 'STUDENT', 'APPLICATION_SUBMITTED', `Applied to ${applying.title}`);
    setApplying(null);
    setAppSuccess(true);
    setTimeout(() => setAppSuccess(false), 3000);
  };

  const filtered = mockOpportunities.filter((o) => {
    const matchType   = filter === 'ALL' || o.type === filter;
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.organization.toLowerCase().includes(search.toLowerCase());
    const matchRemote = !remoteOnly || o.isRemote;
    return matchType && matchSearch && matchRemote && o.isActive;
  });

  const cvProgress = Math.round((cvSteps.filter((s) => s.done).length / cvSteps.length) * 100);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Apply modal */}
      {applying && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-900">{applying.title}</h2>
                <p className="text-sm text-gray-500">{applying.organization}</p>
              </div>
              <button onClick={() => setApplying(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Why are you applying? (optional)</label>
              <textarea rows={4} value={appNote} onChange={(e) => setAppNote(e.target.value)}
                placeholder="Briefly explain why you are a good fit for this opportunity..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setApplying(null)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={submitApplication}
                className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors">
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        {appSuccess && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Application submitted successfully!
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Career Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Build your CV, track applications, and discover opportunities matched to your skills.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Opportunities */}
        <div className="lg:col-span-2 space-y-4">

          {/* Search + filter */}
          <div className="flex gap-3 relative">
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
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  remoteOnly ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter{remoteOnly ? ' (1)' : ''}
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Filters</p>
                  <label className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => { setRemoteOnly(e.target.checked); setFilterOpen(false); }}
                      className="accent-emerald-700"
                    />
                    <span className="text-sm text-gray-700">Remote only</span>
                  </label>
                </div>
              )}
            </div>
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

                      {submitted.includes(opp.id) ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                          <CheckCircle className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleApply(opp)}>
                          Apply Now <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                        </Button>
                      )}
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

            <Link href="/student/career/cv-builder">
              <Button variant="primary" size="sm" className="w-full mb-2">
                Continue Building CV
              </Button>
            </Link>
            <Link href="/student/career/cover-letter">
              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors">
                <Mail className="w-3.5 h-3.5" /> Write Cover Letter
              </button>
            </Link>
          </div>

          {/* Application tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">My Applications</h2>
            {applications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-xl">
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
