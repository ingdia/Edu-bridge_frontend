import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Laptop,
  GraduationCap,
  Users,
  Globe,
  Heart,
  Star,
  CheckCircle,
  MapPin,
  Rocket,
} from 'lucide-react';

const outcomes = [
  {
    icon: BookOpen,
    stat: '73%',
    label: 'Improvement in English scores',
    description: 'Students who complete the English modules show an average 73% improvement in written and spoken English assessments.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    statColor: 'text-emerald-700',
  },
  {
    icon: Laptop,
    stat: '89%',
    label: 'Digital confidence increase',
    description: '89% of students report feeling confident using computers for professional tasks after completing the digital literacy program.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    statColor: 'text-emerald-700',
  },
  {
    icon: GraduationCap,
    stat: '3x',
    label: 'Higher university admission rate',
    description: 'EDU-Bridge students are 3x more likely to gain university admission compared to peers without the program.',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    statColor: 'text-amber-700',
  },
  {
    icon: Users,
    stat: '88%',
    label: 'Program completion rate',
    description: '88% of enrolled students complete at least one full module — far above the average for online learning platforms.',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    statColor: 'text-amber-700',
  },
];

const impactAreas = [
  {
    icon: BookOpen,
    title: 'Improved English Skills',
    points: [
      'Students can communicate confidently in written and spoken English',
      'Better performance in national English examinations',
      'Ability to write formal letters, emails, and university applications',
      'Improved comprehension of English-medium instruction',
    ],
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&h=500&fit=crop',
  },
  {
    icon: Laptop,
    title: 'Better Computer Literacy',
    points: [
      'Students can independently use computers for academic and professional tasks',
      'Ability to complete online scholarship and job applications',
      'Understanding of internet safety and responsible digital use',
      'Confidence to learn new digital tools independently',
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=500&fit=crop',
  },
  {
    icon: GraduationCap,
    title: 'Higher University & Job Readiness',
    points: [
      'Students graduate with professional CVs and cover letters',
      'Awareness of available scholarships, internships, and career paths',
      'Mentorship connections that open doors to opportunities',
      'Interview preparation and application tracking skills',
    ],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&h=500&fit=crop',
  },
  {
    icon: Heart,
    title: 'Reduced Education Inequality',
    points: [
      'Public day school students compete on equal footing with private school peers',
      'Rural students gain access to the same quality of career guidance as urban students',
      'First-generation graduates have the tools to break the cycle of limited opportunity',
      'Schools gain a structured digital literacy curriculum at no cost',
    ],
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=500&fit=crop',
  },
];

const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Pilot — GS Ruyenzi',
    status: 'Completed',
    statusColor: 'bg-emerald-100 text-emerald-700',
    year: '2023',
    description: 'Launched with 500+ students at GS Ruyenzi. Validated the platform, refined modules, and established the mentorship model.',
  },
  {
    phase: 'Phase 2',
    title: 'Expand to 10 Schools',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-700',
    year: '2024–2025',
    description: 'Scaling to 10 public day schools across Kigali and Eastern Province, training local mentors and school coordinators.',
  },
  {
    phase: 'Phase 3',
    title: 'National Rollout',
    status: 'Planned',
    statusColor: 'bg-amber-100 text-amber-700',
    year: '2025–2026',
    description: 'Partner with Rwanda Education Board to integrate EDU-Bridge into the national digital literacy curriculum for all public secondary schools.',
  },
  {
    phase: 'Phase 4',
    title: 'East Africa Expansion',
    status: 'Vision',
    statusColor: 'bg-purple-100 text-purple-700',
    year: '2027+',
    description: 'Adapt the platform for Uganda, Tanzania, and Burundi — bringing the same model to underserved students across East Africa.',
  },
];

export default function ImpactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── PAGE HERO ── */}
        <section className="relative overflow-hidden bg-emerald-900 py-24 sm:py-32">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container-custom relative z-10 text-center">
            <span className="inline-block text-xs font-semibold text-emerald-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-5">
              Our Results
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
              Changing Outcomes for Rwanda&apos;s Students
            </h1>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Since our pilot at GS Ruyenzi, EDU-Bridge has been transforming what&apos;s possible for
              public day school students — and we&apos;re just getting started.
            </p>
          </div>
        </section>

        {/* ── OUTCOME STATS ── */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">By the Numbers</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Results from Our Pilot</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Data collected from 500+ students at GS Ruyenzi over 12 months of the EDU-Bridge pilot program.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {outcomes.map(({ icon: Icon, stat, label, description, color, statColor }) => (
                <div key={label} className={`rounded-2xl border-2 p-7 ${color}`}>
                  <Icon className="w-6 h-6 mb-4" />
                  <div className={`text-4xl font-black mb-1 ${statColor}`}>{stat}</div>
                  <div className="font-semibold text-gray-900 text-sm mb-3">{label}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IMPACT AREAS ── */}
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Areas of Impact</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How We're Making a Difference</h2>
            </div>

            <div className="space-y-16">
              {impactAreas.map((area, index) => {
                const Icon = area.icon;
                const isEven = index % 2 === 0;
                return (
                  <div key={area.title} className={`grid lg:grid-cols-2 gap-14 items-center`}>
                    <div className={isEven ? '' : 'lg:order-2'}>
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1 rounded-full mb-5">
                        <Icon className="w-3.5 h-3.5" />
                        {area.title}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-5">{area.title}</h3>
                      <ul className="space-y-3">
                        {area.points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] ${isEven ? '' : 'lg:order-1'}`}>
                      <img src={area.image} alt={area.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── STUDENT STORY ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="bg-emerald-900 rounded-3xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                  <Star className="w-8 h-8 text-amber-400 mb-6" />
                  <blockquote className="text-xl text-white leading-relaxed mb-8 font-light italic">
                    "Before EDU-Bridge, I didn&apos;t know how to send an email or write a CV.
                    Now I have a scholarship to university and a part-time internship.
                    This platform changed everything for me."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
                      alt="Amina K."
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-600"
                    />
                    <div>
                      <div className="font-bold text-white">Amina K.</div>
                      <div className="text-emerald-300 text-sm">Senior 6 Graduate, GS Ruyenzi</div>
                      <div className="text-emerald-400 text-xs mt-0.5">Now studying at University of Rwanda</div>
                    </div>
                  </div>
                </div>
                <div className="relative min-h-[300px] lg:min-h-0">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                    alt="Students celebrating"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-900/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Future Vision</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Scaling Across Rwanda and Beyond
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Our roadmap takes EDU-Bridge from a single school pilot to a national program — and eventually across East Africa.
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />

              <div className="space-y-8">
                {roadmap.map((item) => (
                  <div key={item.phase} className="relative sm:pl-16">
                    {/* Dot */}
                    <div className="hidden sm:flex absolute left-0 top-1 w-12 h-12 bg-white border-2 border-gray-200 rounded-full items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.phase}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700`}>{item.status}</span>
                        <span className="text-xs text-gray-400 ml-auto">{item.year}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── VISION BANNER ── */}
        <section className="py-20">
          <div className="container-custom">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-800 px-8 py-16 sm:px-16 sm:py-20">
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />
              <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-semibold">Our 2027 Vision</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    100,000 Students. Every Province. One Platform.
                  </h2>
                  <p className="text-emerald-200 leading-relaxed">
                    By 2027, we aim to reach 100,000 students across all provinces of Rwanda,
                    partnering with the Rwanda Education Board to make EDU-Bridge part of the
                    national secondary school curriculum.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '100K', label: 'Students by 2027', icon: Users },
                    { value: '30+', label: 'Partner Schools', icon: GraduationCap },
                    { value: '5', label: 'East African Countries', icon: Globe },
                    { value: '0', label: 'Cost to Students', icon: Heart },
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={label} className="bg-white/10 rounded-2xl p-5 text-center">
                      <Icon className="w-5 h-5 text-emerald-300 mx-auto mb-2" />
                      <div className="text-2xl font-black text-white">{value}</div>
                      <div className="text-xs text-emerald-300 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Be Part of the Story</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Whether you&apos;re a student, educator, or partner — there&apos;s a place for you in the EDU-Bridge community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button variant="primary">
                  Join EDU-Bridge Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Partner With Us</Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
