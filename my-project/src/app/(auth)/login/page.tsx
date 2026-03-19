'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle, Users, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const highlights = [
  { icon: Users,     value: '500+', label: 'Students enrolled' },
  { icon: TrendingUp, value: '88%', label: 'Completion rate' },
  { icon: Award,     value: '100%', label: 'Free to access' },
];

const demoAccounts = [
  { role: 'Student', email: 'student@edubridge.rw', password: 'student123' },
  { role: 'Mentor',  email: 'mentor@edubridge.rw',  password: 'mentor123' },
  { role: 'Admin',   email: 'admin@edubridge.rw',   password: 'admin123' },
];

export default function LoginPage() {
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  const fillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-700/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-800/60 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">EDU<span className="text-amber-400">-Bridge</span></span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">Welcome back to your learning journey</h2>
            <p className="text-emerald-300 leading-relaxed">Thousands of Rwandan students are building their futures with EDU-Bridge every day.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {highlights.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                <Icon className="w-4 h-4 text-emerald-300 mx-auto mb-2" />
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-emerald-400 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
            <div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
            <p className="text-emerald-100 text-sm leading-relaxed italic mb-4">
              &quot;EDU-Bridge gave me the English and digital skills I needed to apply for university. I got accepted — and it was completely free.&quot;
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=48&h=48&fit=crop&crop=face" alt="Amina K." className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600" />
              <div>
                <div className="text-white text-sm font-semibold">Amina K.</div>
                <div className="text-emerald-400 text-xs">Senior 6 Graduate, GS Ruyenzi</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-emerald-500 text-xs">© {new Date().getFullYear()} EDU-Bridge · Free for all public day school students in Rwanda</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">EDU<span className="text-emerald-700">-Bridge</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Create one free</Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="text-xs font-semibold text-amber-700 mb-2">Demo accounts — click to fill:</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="text-xs px-3 py-1.5 bg-white border border-amber-200 text-amber-700 font-semibold rounded-lg hover:bg-amber-100 transition-colors"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.rw"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/reset-password" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-emerald-700" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me for 30 days</label>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {['Free forever', 'No credit card', 'School-safe'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
