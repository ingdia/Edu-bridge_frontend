'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, UserPlus, Users, GraduationCap, Shield, X } from 'lucide-react';
import { fetchAdminUsers, toggleUserStatus, type AdminUser } from '@/lib/api/admin';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

type RoleFilter = 'ALL' | 'STUDENT' | 'MENTOR' | 'ADMIN';

const roleConfig = {
  STUDENT: { label: 'Student', className: 'bg-emerald-100 text-emerald-700', icon: GraduationCap },
  MENTOR:  { label: 'Mentor',  className: 'bg-amber-100 text-amber-700',     icon: Users },
  ADMIN:   { label: 'Admin',   className: 'bg-gray-100 text-gray-700',       icon: Shield },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDisplayName(u: AdminUser) {
  return u.fullName || u.email.split('@')[0];
}

function getInitials(u: AdminUser) {
  const name = getDisplayName(u);
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function AdminUsersPage() {
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [toggling, setToggling]     = useState<string | null>(null);
  const [showAdd, setShowAdd]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (userId: string, currentlyActive: boolean) => {
    setToggling(userId);
    try {
      const updated = await toggleUserStatus(userId);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: updated.isActive } : u));
      toast.success(updated.isActive ? 'User activated' : 'User deactivated');
    } catch {
      toast.error('Failed to update user status');
    } finally {
      setToggling(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter;
    const name        = getDisplayName(u).toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    ALL:     users.length,
    STUDENT: users.filter((u) => u.role === 'STUDENT').length,
    MENTOR:  users.filter((u) => u.role === 'MENTOR').length,
    ADMIN:   users.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="space-y-6">

      {/* Add User Modal — placeholder, registration is done via /register */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Add New User</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-gray-500">
              New users register via the <span className="font-semibold text-emerald-700">/register</span> page. Share the link with the user and they will appear here after email verification.
            </p>
            <button onClick={() => setShowAdd(false)} className="w-full py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage students, mentors, and administrators.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['ALL', 'STUDENT', 'MENTOR', 'ADMIN'] as RoleFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                roleFilter === r
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
              )}
            >
              {r === 'ALL' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()} ({counts[r]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">School</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-3.5">
                      <div className="h-5 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-gray-400">No users found.</td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const role = roleConfig[u.role];
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                            {getInitials(u)}
                          </div>
                          <span className="font-medium text-gray-900">{getDisplayName(u)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.className}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {u.schoolName
                          ? u.schoolName
                          : u.role === 'MENTOR' && u.accessStatus === 'PENDING'
                          ? <span className="text-xs text-amber-600 font-medium">Pending approval</span>
                          : u.role === 'STUDENT' && u.accessStatus === 'PENDING'
                          ? <span className="text-xs text-amber-600 font-medium">Awaiting mentor</span>
                          : '—'
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-full',
                          u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        )}>
                          {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggle(u.id, u.isActive)}
                          disabled={toggling === u.id}
                          className={cn(
                            'text-xs font-semibold transition-colors',
                            u.isActive
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-emerald-700 hover:text-emerald-900',
                            toggling === u.id && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {toggling === u.id ? '…' : u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
