'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-700/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-800/60 blur-3xl" />

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
        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Forgot your password?
            </h2>
            <p className="text-emerald-300 leading-relaxed">
              No worries — it happens to everyone. Enter your email and we'll send you a link to reset your password within a few minutes.
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

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">EDU<span className="text-emerald-700">-Bridge</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">

          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          {!submitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset your password</h1>
                <p className="text-gray-500 text-sm">
                  Enter the email address linked to your account and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button variant="primary" size="lg" className="w-full mt-2" type="submit">
                  Send Reset Link <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link href="/login" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your inbox</h1>
              <p className="text-gray-500 text-sm mb-2">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-gray-900 mb-6">{email}</p>
              <p className="text-xs text-gray-400 mb-8">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
                >
                  try again
                </button>
                .
              </p>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
