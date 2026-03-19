import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, AlertTriangle, TrendingDown, WifiOff, BookX, UserX, BarChart3 } from 'lucide-react';

const problems = [
  {
    icon: BookX,
    stat: '< 30%',
    title: 'Low English Proficiency',
    description:
      'Fewer than 30% of public secondary school students in Rwanda can communicate effectively in English — the language of university instruction, professional work, and global opportunity.',
    details: [
      'English is the medium of instruction from Senior 1, yet most students lack foundational skills',
      'Limited exposure to spoken English outside the classroom',
      'No dedicated language labs or audio resources in most public schools',
      'Teachers themselves often lack confidence in spoken English',
    ],
    color: 'border-emerald-200 bg-emerald-50',
    iconColor: 'bg-emerald-100 text-emerald-700',
    statColor: 'text-emerald-700',
  },
  {
    icon: WifiOff,
    stat: '12.8%',
    title: 'Digital Literacy Gap',
    description:
      'Only 12.8% of Rwandan secondary students have meaningful computer literacy skills. Most have never sent an email, created a document, or filled out an online form.',
    details: [
      'School computer labs exist but are underutilized due to lack of structured curriculum',
      'Students cannot complete online scholarship or university applications',
      'No training in internet safety, file management, or professional digital communication',
      'Digital divide widens the gap between urban and rural students',
    ],
    color: 'border-amber-200 bg-amber-50',
    iconColor: 'bg-amber-100 text-amber-700',
    statColor: 'text-amber-700',
  },
  {
    icon: UserX,
    stat: '< 5%',
    title: 'No Career Guidance',
    description:
      'Fewer than 5% of public day school students have access to a career counselor. Most graduate with no CV, no knowledge of available opportunities, and no guidance on next steps.',
    details: [
      'No structured career education in the national curriculum',
      'Students unaware of scholarship opportunities, internships, or vocational paths',
      'No mentorship connections to professionals or university graduates',
      'University application processes are confusing and unsupported',
    ],
    color: 'border-gray-200 bg-gray-50',
    iconColor: 'bg-gray-100 text-gray-700',
    statColor: 'text-gray-700',
  },
];

const stats = [
  { value: '17%', label: 'Secondary school completion rate in rural Rwanda', icon: TrendingDown, color: 'text-emerald-700' },
  { value: '75%', label: 'Schools with internet but no digital curriculum', icon: WifiOff, color: 'text-emerald-700' },
  { value: '60%', label: 'Graduates unable to write a formal letter in English', icon: BookX, color: 'text-emerald-700' },
  { value: '90%', label: 'Students with no access to career counseling', icon: UserX, color: 'text-emerald-700' },
];

export default function ProblemPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── PAGE HERO ── */}
        <section className="relative overflow-hidden bg-emerald-900 py-24 sm:py-32">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container-custom relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-emerald-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Challenge We&apos;re Solving
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
              The Skills Gap Holding Rwanda&apos;s Students Back
            </h1>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Thousands of motivated, intelligent students in Rwanda&apos;s public day schools are being left behind —
              not because of lack of effort, but because of systemic gaps in English, digital skills, and career support.
            </p>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map(({ value, label, icon: Icon, color }) => (
                <div key={label} className="text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-3 ${color}`} />
                  <div className={`text-3xl font-extrabold mb-1 text-gray-900`}>{value}</div>
                  <div className="text-xs text-gray-500 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM CARDS ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Three Core Challenges</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What's Holding Students Back
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                These aren&apos;t isolated issues — they compound each other, creating a cycle that&apos;s hard to break without targeted support.
              </p>
            </div>

            <div className="space-y-8">
              {problems.map((problem, index) => {
                const Icon = problem.icon;
                return (
                  <div key={problem.title} className={`rounded-3xl border-2 ${problem.color} overflow-hidden`}>
                    <div className="grid lg:grid-cols-5 gap-0">
                      {/* Left — stat + title */}
                      <div className="lg:col-span-2 p-10 flex flex-col justify-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${problem.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className={`text-5xl font-black mb-2 ${problem.statColor}`}>{problem.stat}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{problem.description}</p>
                      </div>

                      {/* Right — details */}
                      <div className="lg:col-span-3 bg-white/70 p-10 flex flex-col justify-center">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Issues</p>
                        <ul className="space-y-3">
                          {problem.details.map((detail) => (
                            <li key={detail} className="flex items-start gap-3 text-sm text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${problem.statColor.replace('text-', 'bg-')}`} />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── VISUAL CONTEXT ── */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">The Bigger Picture</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                  A Cycle That Repeats Without Intervention
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  When students lack English skills, they struggle in exams. When they lack digital skills,
                  they can&apos;t apply for opportunities online. When they lack career guidance, they don&apos;t know
                  what opportunities even exist.
                </p>
                <p className="text-gray-500 leading-relaxed mb-6">
                  These three gaps reinforce each other — and without a targeted intervention, they
                  perpetuate inequality across generations.
                </p>
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Rwanda Education Board, 2023</p>
                      <p className="text-sm text-gray-500">
                        Students from public day schools are 3x less likely to gain university admission
                        compared to peers from private schools, primarily due to English and digital skill gaps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
                  alt="Students in a classroom"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900">The gap is real — and solvable.</p>
                  <p className="text-xs text-gray-500 mt-0.5">EDU-Bridge was built to break this cycle.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">We Built a Solution</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              EDU-Bridge directly addresses each of these three gaps with targeted, free, accessible tools.
            </p>
            <Link href="/solution">
              <Button variant="primary">
                See Our Solution <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
