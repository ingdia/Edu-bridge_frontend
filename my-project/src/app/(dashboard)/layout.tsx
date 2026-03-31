'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap, LayoutDashboard, BookOpen, TrendingUp, Briefcase,
  MessageSquare, Bell, ChevronLeft, ChevronRight, LogOut, Settings,
  Menu, X, Users, CalendarDays, ClipboardCheck, UserCircle, FileText,
  CheckCircle, Clock, Star, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

const studentNav = [
  { href: '/student',          label: 'Overview',    icon: LayoutDashboard, exact: true },
  { href: '/student/learning', label: 'Learning',    icon: BookOpen },
  { href: '/student/progress', label: 'My Progress', icon: TrendingUp },
  { href: '/student/career',   label: 'Career',      icon: Briefcase },
  { href: '/student/sessions', label: 'Sessions',    icon: CalendarDays },
  { href: '/student/messages', label: 'Messages',    icon: MessageSquare },
  { href: '/student/profile',  label: 'My Profile',  icon: UserCircle },
];

const mentorNav = [
  { href: '/mentor',           label: 'Overview',  icon: LayoutDashboard, exact: true },
  { href: '/mentor/requests',  label: 'Requests',  icon: AlertCircle },
  { href: '/mentor/students',  label: 'Students',  icon: Users },
  { href: '/mentor/sessions',  label: 'Sessions',  icon: CalendarDays },
  { href: '/mentor/grading',   label: 'Grading',   icon: ClipboardCheck },
  { href: '/mentor/messages',  label: 'Messages',  icon: MessageSquare },
];

const adminNav = [
  { href: '/admin',                  label: 'Overview',       icon: LayoutDashboard, exact: true },
  { href: '/admin/users',            label: 'Users',          icon: Users },
  { href: '/admin/schools',          label: 'Schools',        icon: GraduationCap },
  { href: '/admin/mentors',          label: 'Mentor Requests',icon: UserCircle },
  { href: '/admin/modules',          label: 'Modules',        icon: BookOpen },
  { href: '/admin/analytics',        label: 'Analytics',      icon: TrendingUp },
  { href: '/admin/opportunities',    label: 'Opportunities',  icon: Briefcase },
  { href: '/admin/reports',          label: 'Reports',        icon: FileText },
  { href: '/admin/notifications',    label: 'Notifications',  icon: Bell },
];

// Static fallback notifications for mentor (not yet wired)
const mentorNotifications = [
  { id: 'n1', icon: Clock,       color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Session in 1 hour',      body: 'Weekly Mentorship with Jean Pierre — 2:00 PM today.', time: '55m ago', read: false },
  { id: 'n2', icon: FileText,    color: 'text-amber-600',   bg: 'bg-amber-50',   title: '3 submissions pending',  body: 'Jean Pierre, Marie, and Patrick submitted exercises.', time: '2h ago',  read: false },
  { id: 'n3', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Grade submitted',         body: 'Your grade for Emmanuel was saved.', time: '1d ago',  read: true },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface ApiNotif {
  id: string;
  title: string;
  message: string;
  status: string;
  type: string;
  createdAt: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const notifRef                    = useRef<HTMLDivElement>(null);
  const pathname                    = usePathname();
  const { user, logout }            = useAuthContext();

  const isAdmin  = pathname.startsWith('/admin');
  const isMentor = pathname.startsWith('/mentor');
  const isStudent = pathname.startsWith('/student');

  // Real notifications state (student only)
  const [apiNotifs, setApiNotifs]   = useState<ApiNotif[]>([]);
  const [notifLoaded, setNotifLoaded] = useState(false);

  const loadStudentNotifs = useCallback(async () => {
    if (!isStudent || notifLoaded) return;
    try {
      const res = await apiFetch<{ success: boolean; data: ApiNotif[] }>('/api/notifications/my-notifications?limit=10');
      setApiNotifs(res.data ?? []);
      setNotifLoaded(true);
    } catch { /* silent */ }
  }, [isStudent, notifLoaded]);

  useEffect(() => { loadStudentNotifs(); }, [loadStudentNotifs]);

  const markStudentRead = async (id: string) => {
    setApiNotifs((prev) => prev.map((n) => n.id === id ? { ...n, status: 'READ' } : n));
    try { await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }); } catch { /* silent */ }
  };

  const markAllStudentRead = async () => {
    setApiNotifs((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
    try { await apiFetch('/api/notifications/mark-all-read', { method: 'PATCH' }); } catch { /* silent */ }
  };

  // Mentor static notifications
  const [mentorReadIds, setMentorReadIds] = useState<Set<string>>(new Set());
  const mentorNotifs = mentorNotifications.map((n) => ({ ...n, read: n.read || mentorReadIds.has(n.id) }));

  // Derive unread count per role
  const unreadCount = isStudent
    ? apiNotifs.filter((n) => n.status === 'UNREAD').length
    : isMentor
    ? mentorNotifs.filter((n) => !n.read).length
    : 0; // admin bell just links to /admin/notifications

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav      = isAdmin ? adminNav : isMentor ? mentorNav : studentNav;
  const navLabel = isAdmin ? 'Admin' : isMentor ? 'Mentor' : 'Student';
  const settingsHref = isAdmin ? '/admin/settings' : isMentor ? '/mentor/settings' : '/student/settings';

  const theme = isAdmin
    ? { sidebar: 'border-amber-200',   logo: 'bg-emerald-50 border-emerald-100', logoIcon: 'text-emerald-700', active: 'bg-emerald-50 text-emerald-700', dot: 'bg-amber-400', avatar: 'bg-emerald-700', topbar: 'border-amber-100',   sidebarBg: 'bg-gray-50', topbarBg: 'bg-gray-50' }
    : isMentor
    ? { sidebar: 'border-emerald-200', logo: 'bg-emerald-50 border-emerald-100', logoIcon: 'text-emerald-700', active: 'bg-emerald-50 text-emerald-700', dot: 'bg-amber-400', avatar: 'bg-emerald-700', topbar: 'border-emerald-200', sidebarBg: 'bg-gray-50', topbarBg: 'bg-gray-50' }
    : { sidebar: 'border-amber-100',   logo: 'bg-emerald-50 border-emerald-100', logoIcon: 'text-emerald-700', active: 'bg-emerald-50 text-emerald-700', dot: 'bg-amber-400', avatar: 'bg-emerald-700', topbar: 'border-gray-100',   sidebarBg: 'bg-white',   topbarBg: 'bg-white' };

  const topbarTitle = isAdmin ? 'Admin Dashboard' : isMentor ? 'Mentor Dashboard' : 'Student Dashboard';

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'User';
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName   = displayName.split(' ')[0];
  const roleLabel   = user?.gradeLevel || (isAdmin ? 'Administrator' : isMentor ? 'Mentor' : '');

  return (
    <div className="min-h-screen flex bg-white">

      {mobileOpen && (
        <div className="fixed inset-0 bg-amber-100/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        `fixed top-0 left-0 h-full z-40 flex flex-col ${theme.sidebarBg} border-r ${theme.sidebar} transition-all duration-300`,
        collapsed ? 'w-[72px]' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className={cn('flex items-center h-16 px-4 border-b border-gray-100 shrink-0', collapsed ? 'justify-center' : 'gap-3')}>
          <div className={`w-9 h-9 ${theme.logo} rounded-xl flex items-center justify-center shrink-0`}>
            <GraduationCap className={`w-5 h-5 ${theme.logoIcon}`} />
          </div>
          {!collapsed && (
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              EDU<span className="text-amber-400">-Bridge</span>
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">{navLabel}</p>
          )}
          {nav.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive(href, exact) ? theme.active : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive(href, exact) && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${theme.dot}`} />
              )}
            </Link>
          ))}
        </nav>

        <div className="px-2 pb-4 space-y-0.5 border-t border-gray-100 pt-3">
          <Link
            href={settingsHref}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all', collapsed && 'justify-center px-2')}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={logout}
            className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all', collapsed && 'justify-center px-2')}
            title={collapsed ? 'Log out' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>

        <header className={`sticky top-0 z-20 h-16 ${theme.topbarBg} border-b ${theme.topbar} flex items-center px-4 sm:px-6 gap-4 shrink-0`}>
          <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-gray-900">{topbarTitle}</h1>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">

            {/* ── BELL ── */}
            <div className="relative" ref={notifRef}>
              {/* Admin bell → link to notifications page */}
              {isAdmin ? (
                <Link href="/admin/notifications" className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors block">
                  <Bell className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && isStudent) loadStudentNotifs(); }}
                    className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={isStudent ? markAllStudentRead : () => setMentorReadIds(new Set(mentorNotifications.map((n) => n.id)))}
                            className="text-xs text-emerald-700 font-semibold hover:text-emerald-800"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {isStudent ? (
                          apiNotifs.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet.</div>
                          ) : (
                            apiNotifs.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => markStudentRead(n.id)}
                                className={cn('flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer', n.status === 'UNREAD' && 'bg-amber-50/40')}
                              >
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                  <Bell className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                                </div>
                                {n.status === 'UNREAD' && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />}
                              </div>
                            ))
                          )
                        ) : (
                          mentorNotifs.map((n) => {
                            const Icon = n.icon;
                            return (
                              <div
                                key={n.id}
                                onClick={() => setMentorReadIds((prev) => new Set([...prev, n.id]))}
                                className={cn('flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer', !n.read && 'bg-amber-50/40')}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.bg}`}>
                                  <Icon className={`w-4 h-4 ${n.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.body}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                </div>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── USER ── */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
              <div className={`w-8 h-8 rounded-full ${theme.avatar} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 leading-none">{firstName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{roleLabel}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
