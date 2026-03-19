'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  BookOpen,
  Laptop,
  Briefcase,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  Star,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'English Learning',
    description:
      'Interactive listening, speaking, reading, and writing exercises tailored for Rwandan secondary students.',
    color: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-100',
    href: '/solution',
  },
  {
    icon: Laptop,
    title: 'Digital Literacy',
    description:
      'Hands-on training in email, internet safety, document creation, and online applications — usable in school labs.',
    color: 'bg-blue-50 text-blue-700',
    border: 'border-blue-100',
    href: '/solution',
  },
  {
    icon: Briefcase,
    title: 'Career Guidance',
    description:
      'CV building, mentorship sessions, opportunity matching, and university application support.',
    color: 'bg-amber-50 text-amber-700',
    border: 'border-amber-100',
    href: '/solution',
  },
];

const stats = [
  { value: '500+', label: 'Students Enrolled', icon: Users },
  { value: '88%', label: 'Completion Rate', icon: TrendingUp },
  { value: '3', label: 'Core Programs', icon: BookOpen },
  { value: '100%', label: 'Free to Access', icon: Award },
];

const testimonials = [
  {
    name: 'Jean Pierre N.',
    role: 'Senior 6, GS Ruyenzi',
    quote:
      'EDU-Bridge helped me improve my English and I got accepted to university. The mentorship was life-changing.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Marie Uwimana',
    role: 'Senior 5, GS Ruyenzi',
    quote:
      'I learned how to write professional emails and build a CV. I now feel ready for the real world.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    name: 'Emmanuel H.',
    role: 'Senior 6, GS Ruyenzi',
    quote:
      'My mentor helped me track my applications and I landed an internship at a tech company in Kigali.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-70 translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-50 opacity-60 -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  For Public Day Schools in Rwanda
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-gray-900 mb-6 tracking-tight">
                  Empowering Students to{' '}
                  <span className="relative inline-block text-emerald-700">
                    Bridge the Gap
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                      <path d="M0 8 Q75 2 150 6 Q225 10 300 4" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                  </span>
                </h1>

                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                  EDU-Bridge equips Rwandan secondary school students with English communication,
                  digital literacy, and career skills — completely free, accessible from school computer labs.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-100">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Learn More
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-5">
                  {['No device needed', 'Free forever', 'Works in school labs'].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — image + floating cards */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=650&fit=crop"
                    alt="Students studying together"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Floating — students */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 leading-none">500+</div>
                    <div className="text-xs text-gray-500 mt-0.5">Students Enrolled</div>
                  </div>
                </div>

                {/* Floating — success */}
                <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 leading-none">88%</div>
                    <div className="text-xs text-gray-500 mt-0.5">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-6 h-6 text-emerald-600 mb-1" />
                  <div className="text-3xl font-extrabold text-gray-900">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION SNAPSHOT ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                      <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=530&fit=crop" alt="Student learning" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
                      <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4172?w=400&h=250&fit=crop" alt="Digital training" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
                      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop" alt="Collaboration" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                      <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=530&fit=crop" alt="Mentorship" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Closing the Skills Gap for Rwanda's Next Generation
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Thousands of public day school students in Rwanda graduate without the English fluency,
                  digital skills, or career knowledge needed to compete for university places and jobs.
                </p>
                <p className="text-gray-500 leading-relaxed mb-8">
                  EDU-Bridge was built to change that — combining structured learning, real mentorship,
                  and career tools in one free platform designed for school computer labs.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Interactive English modules with audio & writing',
                    'Digital skills training from scratch',
                    'One-on-one mentorship with professionals',
                    'CV builder and opportunity matching',
                    'Progress tracking and performance reports',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/about">
                  <Button variant="primary">
                    Read Our Story
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE CARDS ── */}
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">What We Offer</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three Pillars of Growth</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Every program is free, designed for underserved students, and accessible from any school computer lab.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description, color, border, href }) => (
                <div key={title} className={`bg-white rounded-2xl border ${border} p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{description}</p>
                  <Link href={href} className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                    Learn more <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Student Stories</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Hear From Our Students</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Real results from students at GS Ruyenzi who used EDU-Bridge to change their futures.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <MessageSquare className="w-7 h-7 text-emerald-200 mb-4" />
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-20">
          <div className="container-custom">
            <div className="relative rounded-3xl overflow-hidden bg-emerald-900 text-center px-8 py-16 sm:px-16 sm:py-20">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-emerald-200 text-lg mb-8 max-w-xl mx-auto">
                  Join EDU-Bridge today — free for all public day school students in Rwanda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto shadow-lg">
                      Create Free Account
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10">
                      Contact Our Team
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
