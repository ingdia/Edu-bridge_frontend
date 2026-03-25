'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Briefcase,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  X,
  Users,
  CalendarDays,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser } from '@/lib/api/mockData';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const studentNav = [
  { href: '/student',          label: 'Overview',    icon: LayoutDashboard, exact: true },
  { href: '/student/learning', label: 'Learning',    icon: BookOpen },
  { href: '/student/progress', label: 'My Progress', icon: TrendingUp },
  { href: '/student/career',   label: 'Career',      icon: Briefcase },
  { href: '/student/messages', label: 'Messages',    icon: MessageSquare },
];

const mentorNav = [
  { href: '/mentor',           label: 'Overview',  icon: LayoutDashboard, exact: true },
  { href: '/mentor/students',  label: 'Students',  icon: Users },
  { href: '/mentor/sessions',  label: 'Sessions',  icon: CalendarDays },
  { href: '/mentor/grading',   label: 'Grading',   icon: ClipboardCheck },
  { href: '/mentor/messages',  label: 'Messages',  icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname  = usePathname();
  const { logout } = useAuthContext();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const isMentor = pathname.startsWith('/mentor');
  const nav = isMentor ? mentorNav : studentNav;
  const navLabel = isMentor ? 'Mentor' : 'Student';
  const settingsHref = isMentor ? '/mentor/settings' : '/student/settings';

  const theme = isMentor
    ? { sidebar: 'border-emerald-200', logo: 'bg-emerald-50 border-emerald-100', logoIcon: 'text-emerald-700', active: 'bg-emerald-50 text-emerald-700', dot: 'bg-amber-400', avatar: 'bg-emerald-700', topbar: 'border-emerald-200', sidebarBg: 'bg-gray-50', topbarBg: 'bg-gray-50' }
    : { sidebar: 'border-amber-100',  logo: 'bg-emerald-50 border-emerald-100', logoIcon: 'text-emerald-700', active: 'bg-emerald-50 text-emerald-700', dot: 'bg-amber-400', avatar: 'bg-emerald-700', topbar: 'border-gray-100', sidebarBg: 'bg-white', topbarBg: 'bg-white' };

  const topbarTitle = isMentor ? 'Mentor Dashboard' : 'Student Dashboard';
  const initials = mockUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-amber-100/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          `fixed top-0 left-0 h-full z-40 flex flex-col ${theme.sidebarBg} border-r ${theme.sidebar} transition-all duration-300`,
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
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

        {/* Nav */}
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
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive(href, exact)
                  ? theme.active
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
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

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-gray-100 pt-3">
          <Link
            href={settingsHref}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={logout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Log out' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>

        {/* Top bar */}
        <header className={`sticky top-0 z-20 h-16 ${theme.topbarBg} border-b ${theme.topbar} flex items-center px-4 sm:px-6 gap-4 shrink-0`}>
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-gray-900">{topbarTitle}</h1>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
              <div className={`w-8 h-8 rounded-full ${theme.avatar} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 leading-none">{mockUser.fullName.split(' ')[0]}</div>
                <div className="text-xs text-gray-400 mt-0.5">{mockUser.gradeLevel}</div>
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
