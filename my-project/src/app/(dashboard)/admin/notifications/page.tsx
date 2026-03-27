'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bell, Send, Users, X, CheckCircle } from 'lucide-react';
import {
  fetchAllNotifications, sendNotification, sendBulkNotification,
  fetchAdminUsers,
  type AdminNotification, type AdminUser,
} from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const TYPES = ['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT'];

const typeConfig: Record<string, { label: string; className: string }> = {
  SESSION_REMINDER:    { label: 'Session Reminder',    className: 'bg-emerald-100 text-emerald-700' },
  DEADLINE_ALERT:      { label: 'Deadline Alert',      className: 'bg-amber-100 text-amber-700' },
  FEEDBACK_RECEIVED:   { label: 'Feedback Received',   className: 'bg-blue-100 text-blue-700' },
  APPLICATION_UPDATE:  { label: 'Application Update',  className: 'bg-purple-100 text-purple-700' },
  SYSTEM_ANNOUNCEMENT: { label: 'Announcement',        className: 'bg-gray-100 text-gray-700' },
};

const statusConfig: Record<string, string> = {
  UNREAD:   'bg-amber-100 text-amber-700',
  READ:     'bg-emerald-100 text-emerald-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const emptyForm = { recipientId: 'ALL', type: 'SYSTEM_ANNOUNCEMENT', title: '', message: '', sendEmail: false };

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [students, setStudents]           = useState<AdminUser[]>([]);
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [form, setForm]                   = useState(emptyForm);
  const [statusFilter, setStatusFilter]   = useState('ALL');
  const [typeFilter, setTypeFilter]       = useState('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [notifs, users] = await Promise.all([
        fetchAllNotifications(),
        fetchAdminUsers('STUDENT'),
      ]);
      setNotifications(notifs);
      setStudents(users);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Title and message are required'); return; }

    setSending(true);
    try {
      if (form.recipientId === 'ALL') {
        const ids = students.filter((s) => s.studentProfileId).map((s) => s.studentProfileId!);
        if (ids.length === 0) { toast.error('No students to notify'); setSending(false); return; }
        await sendBulkNotification({ recipientIds: ids, type: form.type, title: form.title, message: form.message, sendEmail: form.sendEmail });
        toast.success(`Sent to ${ids.length} students`);
      } else {
        await sendNotification({ recipientId: form.recipientId, type: form.type, title: form.title, message: form.message, sendEmail: form.sendEmail });
        toast.success('Notification sent');
      }
      setForm(emptyForm);
      load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const filtered = notifications.filter((n) => {
    const matchStatus = statusFilter === 'ALL' || n.status === statusFilter;
    const matchType   = typeFilter === 'ALL' || n.type === typeFilter;
    return matchStatus && matchType;
  });

  const unread = notifications.filter((n) => n.status === 'UNREAD').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Send announcements and view notification history.</p>
        </div>
        {unread > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
            <Bell className="w-3.5 h-3.5" /> {unread} unread
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* Send form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSend} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" /> Send Notification
            </h2>

            {/* Recipient */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Recipient</label>
              <select value={form.recipientId} onChange={(e) => setForm((p) => ({ ...p, recipientId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                <option value="ALL">All Students ({students.filter(s => s.studentProfileId).length})</option>
                {students.filter((s) => s.studentProfileId).map((s) => (
                  <option key={s.id} value={s.studentProfileId!}>{s.fullName || s.email}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                {TYPES.map((t) => <option key={t} value={t}>{typeConfig[t].label}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
              <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Important Announcement"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
              <textarea required rows={3} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Write your message here…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
            </div>

            {/* Send email toggle */}
            <div className="flex items-center justify-between py-2 border-t border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">Also send email</p>
                <p className="text-xs text-gray-400">Sends an email copy to the recipient(s)</p>
              </div>
              <button type="button" onClick={() => setForm((p) => ({ ...p, sendEmail: !p.sendEmail }))}
                className={cn('relative w-11 h-6 rounded-full transition-colors', form.sendEmail ? 'bg-emerald-600' : 'bg-gray-200')}>
                <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', form.sendEmail ? 'left-6' : 'left-1')} />
              </button>
            </div>

            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
              <Send className="w-4 h-4" /> {sending ? 'Sending…' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-3 space-y-4">

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {['ALL', 'UNREAD', 'READ', 'ARCHIVED'].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                    statusFilter === s ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300')}>
                  {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option value="ALL">All Types</option>
              {TYPES.map((t) => <option key={t} value={t}>{typeConfig[t].label}</option>)}
            </select>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Notification History</h2>
              <span className="text-xs text-gray-400">{filtered.length} shown</span>
            </div>

            {loading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-3 bg-gray-50 rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                No notifications found.
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {filtered.map((n) => {
                  const type   = typeConfig[n.type] ?? { label: n.type, className: 'bg-gray-100 text-gray-600' };
                  const status = statusConfig[n.status] ?? 'bg-gray-100 text-gray-500';
                  return (
                    <div key={n.id} className={cn('px-5 py-4 hover:bg-gray-50 transition-colors', n.status === 'UNREAD' && 'bg-amber-50/30')}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${type.className}`}>{type.label}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status}`}>{n.status}</span>
                            {n.emailSent && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                                <CheckCircle className="w-2.5 h-2.5" /> Email sent
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            {n.recipient && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {n.recipient.fullName}
                              </span>
                            )}
                            <span>{timeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                        {n.status === 'UNREAD' && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
