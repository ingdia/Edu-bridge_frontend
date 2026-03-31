'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Users, GraduationCap } from 'lucide-react';
import {
  fetchStudentRequests, approveStudentRequest, rejectStudentRequest,
  type StudentRequest,
} from '@/lib/api/studentRequest';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING:  { label: 'Pending',  className: 'bg-amber-100 text-amber-700',    icon: Clock },
  APPROVED: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-600',         icon: XCircle },
};

export default function MentorRequestsPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState<string | null>(null);
  const [filter, setFilter]     = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStudentRequests();
      setRequests(data);
    } catch { toast.error('Failed to load requests'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    setActing(id);
    try {
      await approveStudentRequest(id);
      setRequests((p) => p.map((r) => r.id === id ? { ...r, status: 'APPROVED' } : r));
      toast.success('Student approved — they can now log in');
    } catch (err: any) { toast.error(err.message || 'Failed to approve'); }
    finally { setActing(null); }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActing(rejectId);
    try {
      await rejectStudentRequest(rejectId, reason || undefined);
      setRequests((p) => p.map((r) => r.id === rejectId ? { ...r, status: 'REJECTED', rejectNote: reason } : r));
      toast.success('Request rejected');
      setRejectId(null);
      setReason('');
    } catch (err: any) { toast.error(err.message || 'Failed to reject'); }
    finally { setActing(null); }
  };

  const filtered = requests.filter((r) => filter === 'ALL' || r.status === filter);
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Reject Student Request</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Reason (optional)</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you are declining this request..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRejectId(null); setReason(''); }}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleReject} disabled={!!acting}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-60">
                {acting ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Student Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pendingCount > 0
              ? <span className="text-amber-600 font-semibold">{pendingCount} pending</span>
              : 'No pending requests'
            }
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
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} ({f === 'ALL' ? requests.length : requests.filter((r) => r.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No {filter !== 'ALL' ? filter.toLowerCase() : ''} student requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{r.student?.fullName ?? r.student?.user.email}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${cfg.className}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {r.student?.schoolName} · {r.student?.gradeLevel} · {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {r.note && <p className="text-xs text-gray-500 mt-0.5 italic">"{r.note}"</p>}
                  {r.rejectNote && r.status === 'REJECTED' && (
                    <p className="text-xs text-red-500 mt-0.5">Reason: {r.rejectNote}</p>
                  )}
                </div>
                {r.status === 'PENDING' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApprove(r.id)} disabled={acting === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => setRejectId(r.id)} disabled={acting === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl disabled:opacity-60 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
