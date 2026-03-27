'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Status = 'pending' | 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/verify-email?token=${token}`);
        const json = await res.json();
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(json.message || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verify();
  }, [token]);

  // ── "Check your inbox" state (after registration) ──
  if (status === 'pending') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Check your email</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          We sent a verification link to{' '}
          {email ? <strong className="text-gray-700">{email}</strong> : 'your email address'}.
          <br />Click the link to activate your account.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <Link href="/register" className="font-semibold underline">register again</Link>.
        </div>
        <Link href="/login" className="block text-sm text-emerald-700 font-semibold hover:underline mt-2">
          Back to login
        </Link>
      </div>
    );
  }

  // ── Verifying token ──
  if (status === 'verifying') {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Verifying your email…</h1>
      </div>
    );
  }

  // ── Success ──
  if (status === 'success') {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Email verified!</h1>
        <p className="text-gray-500 text-sm">Your account is now active. You can log in.</p>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ── Error ──
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900">Verification failed</h1>
      <p className="text-gray-500 text-sm">{message || 'The link is invalid or has expired.'}</p>
      <Link href="/register" className="block w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors text-center">
        Register again
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link href="/" className="inline-flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg tracking-tight">
          EDU<span className="text-emerald-700">-Bridge</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Suspense fallback={<Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
