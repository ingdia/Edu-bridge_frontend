'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, MapPin, Calendar,
  CheckCircle, FileText, ArrowRight, Search, X, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  fetchOpportunities, fetchMatchedOpportunities, applyToOpportunity,
  fetchMyApplications, createApplication,
  type Opportunity, type Application,
} from '@/lib/api/student';
import toast from 'react-hot-toast';

const typeConfig: Record<string, { label: string; bg: string; text: string; icon: typeof Briefcase }> = {
  SCHOLARSHIP: { label: 'Scholarship', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: GraduationCap },
  INTERNSHIP:  { label: 'Internship',  bg: 'bg-amber-100',   text: 'text-amber-700',   icon: Briefcase },
  JOB:         { label: 'Job',         bg: 'bg-gray-100',    text: 'text-gray-700',    icon: Briefcase },
  UNIVERSITY:  { label: 'University',  bg: 'bg-blue-100',    text: 'text-blue-700',    icon: GraduationCap },
  TRAINING:    { label: 'Training',    bg: 'bg-purple-100',  text: 'text-purple-700',  icon: Briefcase },
};

const appStatusConfig: Record<string, string> = {
  PENDING:     'bg-amber-100 text-amber-700',
  SUBMITTED:   'bg-emerald-100 text-emerald-700',
  UNDER_REVIEW:'bg-blue-100 text-blue-700',
  ACCEPTED:    'bg-emerald-100 text-emerald-700',
  REJECTED:    'bg-red-100 text-red-600',
};

export default function CareerPage() {
  const [opportunities, setOpportunities]   = useState<Opportunity[]>([]);
  const [applications, setApplications]     = useState<Application[]>([]);
  const [loading, setLoading]               = useState(true);
  const [filter, setFilter]                 = useState('ALL');
  const [search, setSearch]                 = useState('');
  const [applying, setApplying]             = useState<Opportunity | null>(null);
  const [appNote, setAppNote]               = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [useMatched, setUseMatched]         = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [opps, apps] = await Promise.all([
        useMatched ? fetchMatchedOpportunities() : fetchOpportunities(),
        fetchMyApplications(),
      ]);
      setOpportunities(opps);
      setApplications(apps);
    } catch {
      // fallback to all opportunities if matched fails
      try {
        const [opps, apps] = await Promise.all([fetchOpportunities(), fetchMyApplications()]);
        setOpportunities(opps);
        setApplications(apps);
        setUseMatched(false);
      } catch {
        toast.error('Failed to load opportunities');
      }
    } finally {
      setLoading(false);
    }
  }, [useMatched]);

  useEffect(() => { load(); }, [load]);

  const submitApplication = async () => {
    if (!applying) return;
    setSubmitting(true);
    try {
      await applyToOpportunity(applying.id);
      await createApplication({
        position: applying.title,
        organization: applying.organization,
        type: applying.type,
        coverLetter: appNote || undefined,
      });
      toast.success('Application submitted!');
      setApplying(null);
      setAppNote('');
      load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const appliedSet = new Set(applications.map((a) => `${a.position}__${a.organization}`));

  const filtered = opportunities.filter((o) => {
    const matchType   = filter === 'ALL' || o.type === filter;
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.organization.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch && o.isActive;
  });

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
                placeholder="Briefly explain why you are a good fit..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setApplying(null)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={submitApplication} disabled={submitting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 rounded-xl transition-colors">
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Career Hub</h1>
        <p className="text-gray-500 text-sm mt-1">Build your CV, track applications, and discover opportunities.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Opportunities */}
        <div className="lg:col-span-2 space-y-4">

          {/* Matched toggle */}
          <div className="flex items-center gap-3">
            <button onClick={() => setUseMatched(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${useMatched ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              Matched for me
            </button>
            <button onClick={() => setUseMatched(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${!useMatched ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              All opportunities
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search opportunities..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>

          {/* Type tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'SCHOLARSHIP', 'INTERNSHIP', 'JOB', 'UNIVERSITY', 'TRAINING'] as const).map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === t ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {t === 'ALL' ? 'All' : typeConfig[t].label}
              </button>
            ))}
          </div>

          {/* Cards */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No opportunities match your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((opp) => {
                const cfg  = typeConfig[opp.type] ?? typeConfig.JOB;
                const Icon = cfg.icon;
                const applied = appliedSet.has(`${opp.title}__${opp.organization}`);
                return (
                  <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 leading-snug">{opp.title}</h3>
                          <div className="flex items-center gap-2 shrink-0">
                            {opp.matchScore != null && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                {opp.matchScore}% match
                              </span>
                            )}
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{opp.organization}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{opp.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                          {opp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {opp.location}
                            </span>
                          )}
                          {opp.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Deadline: {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {opp.requiredSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {opp.requiredSkills.map((skill) => (
                              <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{skill}</span>
                            ))}
                          </div>
                        )}
                        {applied ? (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                            <CheckCircle className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => setApplying(opp)}>
                            Apply Now <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                <p className="text-xs text-gray-400">Build your professional CV</p>
              </div>
            </div>
            <Link href="/student/career/cv-builder">
              <Button variant="primary" size="sm" className="w-full mb-2">
                Open CV Builder
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
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 leading-snug">{app.position}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${appStatusConfig[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {app.organization} · {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tip */}
          <div className="bg-emerald-900 rounded-2xl p-5">
            <h3 className="font-bold text-white text-sm mb-3">💡 Career Tip</h3>
            <p className="text-emerald-200 text-xs leading-relaxed">
              Complete your CV before applying. Opportunities with a complete CV get 3x more responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
