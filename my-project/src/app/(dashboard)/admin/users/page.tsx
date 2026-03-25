'use client';

import { useState } from 'react';
import { Search, UserPlus, Users, GraduationCap, Shield } from 'lucide-react';
import { mockAllUsers } from '@/lib/api/mockData';
import { cn } from '@/lib/utils';

type RoleFilter = 'ALL' | 'STUDENT' | 'MENTOR' | 'ADMIN';

const roleConfig = {
  STUDENT: { label: 'Student', className: 'bg-emerald-100 text-emerald-700', icon: GraduationCap },
  MENTOR:  { label: 'Mentor',  className: 'bg-amber-100 text-amber-700',     icon: Users },
  ADMIN:   { label: 'Admin',   className: 'bg-violet-100 text-violet-700',   icon: Shield },
};

const statusConfig = {
  ACTIVE:   'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsersPage() {
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');

  const filtered = mockAllUsers.filter((u) => {
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    ALL:     mockAllUsers.length,
    STUDENT: mockAllUsers.filter((u) => u.role === 'STUDENT').length,
    MENTOR:  mockAllUsers.filter((u) => u.role === 'MENTOR').length,
    ADMIN:   mockAllUsers.filter((u) => u.role === 'ADMIN').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage students, mentors, and administrators.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
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
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
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
                  ? 'bg-violet-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-sm text-gray-400">No users found.</td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const role   = roleConfig[u.role];
                  const status = statusConfig[u.status as keyof typeof statusConfig];
                  const initials = u.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-gray-900">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${role.className}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{u.school}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(u.joinedAt)}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs text-violet-700 font-semibold hover:text-violet-900 transition-colors">
                          Edit
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
          Showing {filtered.length} of {mockAllUsers.length} users
        </div>
      </div>
    </div>
  );
}
