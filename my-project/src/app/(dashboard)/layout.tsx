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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname  = usePathname();
  const { logout } = useAuthContext();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const initials = mockUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── MOBILE OVERLAY ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col bg-emerald-900 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-emerald-800 shrink-0', collapsed ? 'justify-center' : 'gap-3')}>
          <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-lg tracking-tight">
              EDU<span className="text-amber-400">-Bridge</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-emerald-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Student</p>
          )}
          {studentNav.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive(href, exact)
                  ? 'bg-white/15 text-white'
                  : 'text-emerald-300 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive(href, exact) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-emerald-800 pt-3">
          <Link
            href="/student/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-300 hover:bg-white/10 hover:text-white transition-all',
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
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-300 hover:bg-white/10 hover:text-white transition-all',
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
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-emerald-700 border border-emerald-600 rounded-full items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>

        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-4 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
