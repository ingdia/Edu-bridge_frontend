'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle, BookOpen, Laptop, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { fetchSchools, type School } from '@/lib/api/school';
import { fetchSchoolMentors, sendMentorRequest, type MentorOption } from '@/lib/api/studentRequest';

const pillars = [
  { icon: BookOpen, label: 'English Learning' },
  { icon: Laptop, label: 'Digital Literacy' },
  { icon: Briefcase, label: 'Career Guidance' },
];

export default function RegisterPage() {
  const { register } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'MENTOR'>('STUDENT');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [mentors, setMentors] = useState<MentorOption[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    school: '',
    schoolId: '',
    gradeLevel: '',
    nationalId: '',
    dateOfBirth: '',
    agreed: false,
  });

  useEffect(() => {
    fetchSchools().then(setSchools).catch(() => {});
  }, []);

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const passwordValid = (
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /[0-9]/.test(form.password)
  );

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 8) return { label: 'Too short (min 8)', color: 'bg-red-400', width: 'w-1/4' };
    if (!/[0-9]/.test(p)) return { label: 'Add a number', color: 'bg-amber-400', width: 'w-2/4' };
    if (!/[a-z]/.test(p)) return { label: 'Add a lowercase letter', color: 'bg-amber-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(p)) return { label: 'Add an uppercase letter', color: 'bg-emerald-400', width: 'w-3/4' };
    return { label: 'Strong ✓', color: 'bg-emerald-600', width: 'w-full' };
  })();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      role,
      fullName: form.fullName || undefined,
      gradeLevel: form.gradeLevel || undefined,
      schoolId: form.schoolId || undefined,
      nationalId: form.nationalId || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
    } as any);
    if (result.error) {
      setError(result.error);
    } else if (role === 'MENTOR') {
      setPendingApproval(true);
    } else if (role === 'STUDENT') {
      setRegisteredEmail(form.email);
      setPendingApproval(true);
      // Fetch mentors at the selected school
      if (form.schoolId) {
        fetchSchoolMentors().then(setMentors).catch(() => {});
      }
    }
    setLoading(false);
  };

  const handleSendRequest = async () => {
    if (!selectedMentorId) return;
    setRequestLoading(true);
    try {
      await sendMentorRequest(selectedMentorId, requestNote || undefined);
      setRequestSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
    } finally {
      setRequestLoading(false);
    }
  };

  if (pendingApproval && role === 'MENTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Request Submitted!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your mentor account is <span className="font-semibold text-amber-600">pending approval</span> from the administrator.
              You will be notified once approved.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left space-y-2">
            <p className="text-xs font-semibold text-amber-700">What happens next?</p>
            <ul className="text-xs text-amber-600 space-y-1">
              <li>• The admin will review your registration</li>
              <li>• You'll be notified by email when approved</li>
              <li>• Once approved, you can log in normally</li>
            </ul>
          </div>
          <Link href="/login" className="block w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors text-center">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (pendingApproval && role === 'STUDENT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Account Created!</h1>
            <p className="text-gray-500 text-sm">
              Please verify your email, then request a mentor from your school to activate your account.
            </p>
          </div>

          {requestSent ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-emerald-800">Mentor request sent!</p>
              <p className="text-xs text-emerald-600">Your mentor will review your request and approve your account. You'll be able to log in once approved.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Request a Mentor at Your School</h2>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              {mentors.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">No approved mentors at your school yet.</p>
                  <p className="text-xs text-gray-400 mt-1">The admin will assign a mentor to your school soon.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Select a Mentor</label>
                    <select value={selectedMentorId} onChange={(e) => setSelectedMentorId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">Choose a mentor</option>
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.user.email.split('@')[0]} — {m.school?.name ?? 'School'}
                          {m.expertise.length > 0 ? ` (${m.expertise.slice(0, 2).join(', ')})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Message (optional)</label>
                    <textarea rows={2} value={requestNote} onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="Introduce yourself briefly..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <button onClick={handleSendRequest} disabled={!selectedMentorId || requestLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl disabled:opacity-60 transition-colors">
                    {requestLoading ? 'Sending…' : 'Send Request to Mentor'}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-1">
            <p className="text-xs font-semibold text-amber-700">What happens next?</p>
            <ul className="text-xs text-amber-600 space-y-1">
              <li>• Verify your email address</li>
              <li>• Your mentor will approve your request</li>
              <li>• Once approved, you can log in and start learning</li>
            </ul>
          </div>

          <Link href="/login" className="block w-full py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-900 flex-col justify-between p-12 relative overflow-hidden">

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-700/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-700/60 blur-3xl" />
        <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl" />

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

        <div className="relative z-10">
          <p className="text-emerald-500 text-xs">
            © {new Date().getFullYear()} EDU-Bridge · Built for Rwanda&apos;s public day schools
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white overflow-y-auto">

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
              {(['STUDENT', 'MENTOR'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 text-left ${
                    role === r
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold capitalize">{r.toLowerCase()}</div>
                  <div className="text-xs font-normal mt-0.5 opacity-70">
                    {r === 'STUDENT' ? 'Learn & grow your skills' : 'Guide & support students'}
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

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

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
                disabled={!form.fullName || !form.email || !passwordValid}
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 — Profile details */}
          {step === 2 && (
            <div className="space-y-4">
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">School</label>
                    <select
                      value={form.schoolId}
                      onChange={(e) => {
                        const s = schools.find((x) => x.id === e.target.value);
                        setForm((p) => ({ ...p, schoolId: e.target.value, school: s?.name ?? '' }));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select your school</option>
                      {schools.length > 0
                        ? schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)
                        : ['GS Ruyenzi', 'GS Kimironko', 'GS Nyamirambo', 'GS Kacyiru', 'GS Remera'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))
                      }
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="date" value={form.dateOfBirth}
                        onChange={(e) => set('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">National ID <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" value={form.nationalId} maxLength={16}
                        onChange={(e) => set('nationalId', e.target.value.replace(/\D/g, ''))}
                        placeholder="16 digits"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                    </div>
                  </div>
                </>
              )}

              {role === 'MENTOR' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">School you will mentor at</label>
                  <select
                    value={form.schoolId}
                    onChange={(e) => {
                      const s = schools.find((x) => x.id === e.target.value);
                      setForm((p) => ({ ...p, schoolId: e.target.value, school: s?.name ?? '' }));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select a school</option>
                    {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <p className="text-xs text-amber-600 mt-1.5">Your account will be reviewed by the administrator before you can log in.</p>
                </div>
              )}

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
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={!form.agreed || loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
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
