'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle, BookOpen, Laptop, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const pillars = [
  { icon: BookOpen, label: 'English Learning' },
  { icon: Laptop, label: 'Digital Literacy' },
  { icon: Briefcase, label: 'Career Guidance' },
];

const schools = [
  'GS Ruyenzi',
  'GS Kimironko',
  'GS Nyamirambo',
  'GS Kacyiru',
  'GS Remera',
  'Other',
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    school: '',
    gradeLevel: '',
    agreed: false,
  });

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (p.length < 8 || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-amber-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(p)) return { label: 'Good', color: 'bg-emerald-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-600', width: 'w-full' };
  })();

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-700/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-700/60 blur-3xl" />
        <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              EDU<span className="text-amber-400">-Bridge</span>
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Free for all students
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              Start your journey to a better future
            </h2>
            <p className="text-emerald-300 leading-relaxed">
              Join EDU-Bridge and get access to English learning, digital skills training, and career guidance — completely free.
            </p>
          </div>

          {/* Pillars */}
          <div className="space-y-3">
            {pillars.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-8 h-8 bg-emerald-700/60 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-200" />
                </div>
                <span className="text-white text-sm font-medium">{label}</span>
                <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
              </div>
            ))}
          </div>

          {/* Image strip */}
          <div className="flex gap-2">
            {[
              'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
            ].map((src, i) => (
              <img key={i} src={src} alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-800" />
            ))}
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-emerald-300 font-bold">
              500+
            </div>
          </div>
          <p className="text-emerald-400 text-xs -mt-4">Students already enrolled</p>
        </div>

        {/* Footer note */}
        <div className="relative z-10">
          <p className="text-emerald-500 text-xs">
            © {new Date().getFullYear()} EDU-Bridge · Built for Rwanda&apos;s public day schools
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              EDU<span className="text-emerald-700">-Bridge</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your free account</h1>
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">I am joining as a</p>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'mentor'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 text-left ${
                    role === r
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold capitalize">{r}</div>
                  <div className="text-xs font-normal mt-0.5 opacity-70">
                    {r === 'student' ? 'Learn & grow your skills' : 'Guide & support students'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-emerald-700 text-white' : step > s ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-medium ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s === 1 ? 'Account' : 'Profile'}
                </span>
                {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>

          {/* Step 1 — Account details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  placeholder="Jean Pierre Nkurunziza"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@school.rw"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{passwordStrength.label}</p>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={() => setStep(2)}
                disabled={!form.fullName || !form.email || form.password.length < 6}
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 — Profile details */}
          {step === 2 && (
            <div className="space-y-4">
              {role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">School</label>
                    <select
                      value={form.school}
                      onChange={(e) => set('school', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select your school</option>
                      {schools.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Senior 1', 'Senior 2', 'Senior 3', 'Senior 4', 'Senior 5', 'Senior 6'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => set('gradeLevel', g)}
                          className={`py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                            form.gradeLevel === g
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {role === 'mentor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Area of expertise</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select your expertise</option>
                    <option>English & Communication</option>
                    <option>Technology & Digital Skills</option>
                    <option>Career Counseling</option>
                    <option>University Admissions</option>
                    <option>Business & Entrepreneurship</option>
                  </select>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => set('agreed', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-emerald-700"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
                  I agree to the{' '}
                  <Link href="#" className="text-emerald-700 font-medium hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-emerald-700 font-medium hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" disabled={!form.agreed}>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google SSO */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Trust badges */}
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
