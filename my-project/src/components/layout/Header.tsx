'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Menu, X, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/problem', label: 'The Challenge' },
  { href: '/solution', label: 'Our Approach' },
  { href: '/impact', label: 'Our Results' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300',
        isScrolled ? 'shadow-md' : 'border-b border-gray-100'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              EDU<span className="text-emerald-700">-Bridge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-emerald-700">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="bg-emerald-700 hover:bg-emerald-800 shadow-sm">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <nav className="flex flex-col gap-0.5 mb-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-gray-300">Login</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="primary" size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
