'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Users, School, BookOpen, X, Plus, Trash2 } from 'lucide-react';
import {
  fetchMentorRequests, approveMentor, rejectMentor, assignMentorToSchool,
  fetchMentorModules, assignModuleToMentor, unassignModuleFromMentor,
  fetchSchools, type MentorAccessRequest, type School as SchoolType,
} from '@/lib/api/school';
import { fetchAdminModules, type AdminModule } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING:  { label: 'Pending',  className: 'bg-amber-100 text-amber-700',    icon: Clock },
  APPROVED: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-600',         icon: XCircle },
};

export default function AdminMentorsPage() {
  const [requests, setRequests]   = useState<MentorAccessRequest[]>([]);
  const [schools, setSchools]     = useState<SchoolType[]>([]);
  const [allModules, setAllModules] = useState<AdminModule[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [acting, setActing]       = useState<string | null>(null);

  // Reject modal
  const [rejectId, setRejectId]   = useState<string | null>(null);
  const [reason, setReason]       = useState('');

  // Approve modal (with school selection)
  const [approveId, setApproveId] = useState<string | null>(null);
  const [approveSchool, setApproveSchool] = useState('');

  // Assign school modal
  const [assignId, setAssignId]   = useState<string | null>(null);
  const [assignSchool, setAssignSchool] = useState('');

  // Assign modules modal
  const [modulesId, setModulesId]         = useState<string | null>(null);
  const [mentorModules, setMentorModules] = useState<any[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, schoolList, modules] = await Promise.all([
        fetchMentorRequests(),
        fetchSchools(),
        fetchAdminModules(),
      ]);
      setRequests(data);
      setSchools(schoolList);
      setAllModules(modules);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async () => {
    if (!approveId) return;
    setActing(approveId);
    try {
      await approveMentor(approveId, approveSchool || undefined);
      setRequests((p) => p.map((r) => r.id === approveId
        ? { ...r, accessStatus: 'APPROVED', school: schools.find((s) => s.id === approveSchool) ?? r.school }
        : r
      ));
      toast.success('Mentor approved — they can now log in');
      setApproveId(null);
      setApproveSchool('');
    } catch (err: any) { toast.error(err.message || 'Failed to approve'); }
    finally { setActing(null); }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActing(rejectId);
    try {
      await rejectMentor(rejectId, reason || undefined);
      setRequests((p) => p.map((r) => r.id === rejectId ? { ...r, accessStatus: 'REJECTED', accessNote: reason } : r));
      toast.success('Mentor access rejected');
      setRejectId(null);
      setReason('');
    } catch (err: any) { toast.error(err.message || 'Failed to reject'); }
    finally { setActing(null); }
  };

  const handleAssign = async () => {
    if (!assignId || !assignSchool) return;
    setActing(assignId);
    try {
      await assignMentorToSchool(assignId, assignSchool);
      const school = schools.find((s) => s.id === assignSchool);
      setRequests((p) => p.map((r) => r.id === assignId ? { ...r, school: school ?? r.school } : r));
      toast.success(`School assigned: ${school?.name}`);
      setAssignId(null);
      setAssignSchool('');
    } catch (err: any) { toast.error(err.message || 'Failed to assign school'); }
    finally { setActing(null); }
  };

  const openModulesModal = async (mentorProfileId: string) => {
    setModulesId(mentorProfileId);
    setLoadingModules(true);
    try {
      const data = await fetchMentorModules(mentorProfileId);
      setMentorModules(data);
    } catch { toast.error('Failed to load assigned modules'); }
    finally { setLoadingModules(false); }
  };

  const handleAssignModule = async (moduleId: string) => {
    if (!modulesId) return;
    try {
      await assignModuleToMentor(modulesId, moduleId);
      const mod = allModules.find((m) => m.id === moduleId);
      if (mod) setMentorModules((p) => [...p, mod]);
      toast.success('Module assigned');
    } catch (err: any) { toast.error(err.message || 'Failed to assign module'); }
  };

  const handleUnassignModule = async (moduleId: string) => {
    if (!modulesId) return;
    try {
      await unassignModuleFromMentor(modulesId, moduleId);
      setMentorModules((p) => p.filter((m) => m.id !== moduleId));
      toast.success('Module removed');
    } catch (err: any) { toast.error(err.message || 'Failed to remove module'); }
  };

  const filtered = requests.filter((r) => filter === 'ALL' || r.accessStatus === filter);
  const pendingCount = requests.filter((r) => r.accessStatus === 'PENDING').length;

  return (
    <div className="space-y-6">

      {/* Approve modal */}
      {approveId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Approve Mentor</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Assign to School (optional)</label>
              <select value={approveSchool} onChange={(e) => setApproveSchool(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">No school assigned yet</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">You can assign a school later from this page.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setApproveId(null); setApproveSchool(''); }}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleApprove} disabled={!!acting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                {acting ? 'Approving…' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Reject Mentor Access</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Reason (optional)</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why access is being denied..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRejectId(null); setReason(''); }}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleReject} disabled={!!acting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-60">
                {acting ? 'Rejecting…' : 'Reject Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign school modal */}
      {assignId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Assign School to Mentor</h2>
            <p className="text-sm text-gray-500">The mentor will see all students registered under this school.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Select School *</label>
              <select value={assignSchool} onChange={(e) => setAssignSchool(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">Choose a school</option>
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setAssignId(null); setAssignSchool(''); }}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleAssign} disabled={!assignSchool || !!acting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl disabled:opacity-60">
                {acting ? 'Assigning…' : 'Assign School'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign modules modal */}
      {modulesId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Assign Courses to Mentor</h2>
                <p className="text-xs text-gray-400 mt-0.5">Mentor will only see assigned courses. If none assigned, all active courses are visible.</p>
              </div>
              <button onClick={() => setModulesId(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>

            {/* Currently assigned */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Assigned Courses ({mentorModules.length})</p>
              {loadingModules ? (
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ) : mentorModules.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No courses assigned yet — mentor sees all active courses.</p>
              ) : (
                <div className="space-y-2">
                  {mentorModules.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                        <p className="text-xs text-gray-400">{m.type} · {m.difficulty}</p>
                      </div>
                      <button onClick={() => handleUnassignModule(m.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available to assign */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest pt-2">Available Courses</p>
              <div className="space-y-2">
                {allModules
                  .filter((m) => m.isActive && !mentorModules.some((am) => am.id === m.id))
                  .map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{m.title}</p>
                        <p className="text-xs text-gray-400">{m.type} · {m.difficulty}</p>
                      </div>
                      <button onClick={() => handleAssignModule(m.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  ))
                }
                {allModules.filter((m) => m.isActive && !mentorModules.some((am) => am.id === m.id)).length === 0 && (
                  <p className="text-xs text-gray-400 py-2">All active courses are already assigned.</p>
                )}
              </div>
            </div>

            <button onClick={() => setModulesId(null)}
              className="w-full py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Done
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mentor Access Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0 ? <span className="text-amber-600 font-semibold">{pendingCount} pending</span> : 'No pending requests'}
            {' '}· {requests.length} total
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              filter === f ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300')}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} ({f === 'ALL' ? requests.length : requests.filter((r) => r.accessStatus === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No {filter !== 'ALL' ? filter.toLowerCase() : ''} mentor requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const cfg = statusConfig[r.accessStatus];
            const Icon = cfg.icon;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.user.email}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${cfg.className}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <School className="w-3 h-3" />
                    {r.school?.name
                      ? <span className="text-emerald-700 font-medium">{r.school.name}</span>
                      : <span className="text-amber-600">No school assigned</span>
                    }
                    <span>·</span>
                    <span>Requested {new Date(r.user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {r.accessNote && r.accessStatus === 'REJECTED' && (
                    <p className="text-xs text-red-500 mt-0.5">Reason: {r.accessNote}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  {r.accessStatus === 'PENDING' && (
                    <>
                      <button onClick={() => setApproveId(r.id)} disabled={acting === r.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => setRejectId(r.id)} disabled={acting === r.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {r.accessStatus === 'APPROVED' && (
                    <>
                      <button
                        onClick={() => { setAssignId(r.id); setAssignSchool(r.school?.id ?? ''); }}
                        disabled={acting === r.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors"
                      >
                        <School className="w-3.5 h-3.5" /> {r.school ? 'Change School' : 'Assign School'}
                      </button>
                      <button
                        onClick={() => openModulesModal(r.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Assign Courses
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
