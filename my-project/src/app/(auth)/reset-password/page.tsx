'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ── Set-new-password form (shown when ?token= is present) ──
function SetNewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPw, setNewPw]       = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/password-reset/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: newPw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Reset failed.');
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Password updated!</h1>
        <p className="text-gray-500 text-sm">Your password has been reset. You can now sign in.</p>
        <Button variant="primary" size="lg" className="w-full" onClick={() => router.push('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Set new password</h1>
        <p className="text-gray-500 text-sm">Choose a strong password for your account.</p>
      </div>
      {error && (
        <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[{ label: 'New password', value: newPw, set: setNewPw }, { label: 'Confirm password', value: confirmPw, set: setConfirmPw }].map(({ label, value, set }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={value} onChange={(e) => set(e.target.value)} required
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <Button variant="primary" size="lg" className="w-full mt-2" type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset Password <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
      </form>
    </>
  );
}

// ── Request-reset form (default, no token) ──
function RequestResetForm() {
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Request failed.');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Check your inbox</h1>
        <p className="text-gray-500 text-sm mb-1">We've sent a reset link to</p>
        <p className="font-semibold text-gray-900">{email}</p>
        <p className="text-xs text-gray-400">
          Didn&apos;t receive it?{' '}
          <button onClick={() => setSubmitted(false)} className="text-emerald-700 font-semibold hover:underline">Try again</button>
        </p>
        <Link href="/login">
          <Button variant="outline" size="lg" className="w-full mt-2">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset your password</h1>
        <p className="text-gray-500 text-sm">Enter the email linked to your account and we'll send a reset link.</p>
      </div>
      {error && (
        <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.rw" required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
        </div>
        <Button variant="primary" size="lg" className="w-full mt-2" type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link href="/login" className="text-emerald-700 font-semibold hover:text-emerald-800">Sign in</Link>
      </p>
    </>
  );
}

// ── Page wrapper ──
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-700/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-800/60 blur-3xl" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">EDU<span className="text-amber-400">-Bridge</span></span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              {token ? 'Set a new password' : 'Forgot your password?'}
            </h2>
            <p className="text-emerald-300 leading-relaxed">
              {token
                ? 'Choose a strong new password for your EDU-Bridge account.'
                : 'No worries — enter your email and we\'ll send you a reset link within minutes.'}
            </p>
          </div>
          <div className="space-y-3">
            {['Check your inbox after submitting', 'Link expires after 30 minutes', 'Contact support if you need more help'].map((tip) => (
              <div key={tip} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-200 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-emerald-500 text-xs">© {new Date().getFullYear()} EDU-Bridge · Free for all public day school students in Rwanda</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">EDU<span className="text-emerald-700">-Bridge</span></span>
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
          {token ? <SetNewPasswordForm token={token} /> : <RequestResetForm />}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
