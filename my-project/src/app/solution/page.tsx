import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  BookOpen,
  Laptop,
  Users,
  Briefcase,
  CheckCircle,
  Mic,
  PenLine,
  Headphones,
  FileText,
  Mail,
  Shield,
  Calendar,
  BarChart2,
  Star,
  Zap,
} from 'lucide-react';

const modules = [
  {
    icon: BookOpen,
    title: 'English Learning Modules',
    color: 'bg-emerald-700',
    lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    description: 'Structured English exercises covering all four language skills, designed for Rwandan secondary students.',
    features: [
      { icon: Headphones, label: 'Listening comprehension with audio exercises' },
      { icon: Mic, label: 'Speaking practice with guided prompts' },
      { icon: BookOpen, label: 'Reading passages on Rwandan and global topics' },
      { icon: PenLine, label: 'Writing tasks: paragraphs, letters, and essays' },
    ],
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=500&fit=crop',
  },
  {
    icon: Laptop,
    title: 'Digital Literacy Training',
    color: 'bg-blue-700',
    lightColor: 'bg-blue-50 text-blue-700 border-blue-100',
    description: 'Practical computer skills training that works in school labs — no personal device required.',
    features: [
      { icon: Mail, label: 'Professional email writing and inbox management' },
      { icon: FileText, label: 'Document creation: Word, spreadsheets, presentations' },
      { icon: Shield, label: 'Internet safety and responsible digital citizenship' },
      { icon: Laptop, label: 'Online applications and form completion' },
    ],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&h=500&fit=crop',
  },
  {
    icon: Users,
    title: 'Mentorship System',
    color: 'bg-purple-700',
    lightColor: 'bg-purple-50 text-purple-700 border-purple-100',
    description: 'Structured one-on-one and group mentorship connecting students with professionals and educators.',
    features: [
      { icon: Calendar, label: 'Weekly scheduled sessions with assigned mentors' },
      { icon: Users, label: 'Group sessions for shared learning and peer support' },
      { icon: BarChart2, label: 'Mentor feedback on exercises and progress' },
      { icon: Star, label: 'Mentor matching based on student goals and interests' },
    ],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&h=500&fit=crop',
  },
  {
    icon: Briefcase,
    title: 'Career Preparation Tools',
    color: 'bg-amber-600',
    lightColor: 'bg-amber-50 text-amber-700 border-amber-100',
    description: 'Everything a student needs to move from school to university or employment with confidence.',
    features: [
      { icon: FileText, label: 'Step-by-step CV and cover letter builder' },
      { icon: Briefcase, label: 'Opportunity matching: scholarships, internships, jobs' },
      { icon: BarChart2, label: 'Application tracker to manage submissions' },
      { icon: Star, label: 'University application guidance and interview prep' },
    ],
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&h=500&fit=crop',
  },
];

const uniqueFeatures = [
  {
    icon: Laptop,
    title: 'Works in School Computer Labs',
    description: 'No personal device or home internet needed. EDU-Bridge is designed to run entirely from school computer labs during supervised sessions.',
  },
  {
    icon: Users,
    title: 'Designed for Underserved Students',
    description: 'Every feature is built with public day school students in mind — simple interface, local context, and no assumptions about prior digital experience.',
  },
  {
    icon: Zap,
    title: 'Learning + Mentorship + Career in One',
    description: 'Unlike standalone apps, EDU-Bridge combines structured learning, human mentorship, and career tools in a single integrated platform.',
  },
  {
    icon: BarChart2,
    title: 'Progress Tracking & Analytics',
    description: 'Students, mentors, and school administrators can all track progress with clear dashboards and performance reports.',
  },
  {
    icon: Star,
    title: 'Opportunity Matching',
    description: 'The platform automatically matches students with scholarships, internships, and jobs based on their skills, grades, and interests.',
  },
  {
    icon: Shield,
    title: 'Safe & Private',
    description: 'Student data is protected. No advertising, no data selling. Built with student privacy as a core principle.',
  },
];

export default function SolutionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── PAGE HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-800 py-24 sm:py-32">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container-custom relative z-10 text-center">
            <span className="inline-block text-xs font-semibold text-emerald-300 bg-emerald-800/60 border border-emerald-700 px-3 py-1 rounded-full mb-5">
              Our Solution
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
              One Platform. Three Skills. Unlimited Potential.
            </h1>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
              EDU-Bridge combines English learning, digital literacy training, mentorship, and career tools
              into a single free platform — built for school computer labs, designed for underserved students.
            </p>
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map(({ icon: Icon, title, color, lightColor }) => (
                <div key={title} className={`rounded-2xl border p-6 ${lightColor}`}>
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODULE DEEP DIVES ── */}
        <section className="py-24">
          <div className="container-custom space-y-24">
            {modules.map((mod, index) => {
              const Icon = mod.icon;
              const isEven = index % 2 === 0;
              return (
                <div key={mod.title} className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:order-2'}>
                    <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border mb-5 ${mod.lightColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {mod.title}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{mod.title}</h2>
                    <p className="text-gray-500 leading-relaxed mb-7">{mod.description}</p>
                    <ul className="space-y-3">
                      {mod.features.map(({ icon: FIcon, label }) => (
                        <li key={label} className="flex items-center gap-3 text-sm text-gray-700">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mod.lightColor}`}>
                            <FIcon className="w-4 h-4" />
                          </div>
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image */}
                  <div className={`relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] ${isEven ? '' : 'lg:order-1'}`}>
                    <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── UNIQUE FEATURES ── */}
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">What Makes Us Different</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Built Different, By Design
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                EDU-Bridge isn&apos;t just another edtech app. It was built from the ground up for the specific
                context of Rwandan public day schools.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple to Start</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: '01', title: 'Sign Up Free', desc: 'Create an account with your school email. No device needed — use your school computer lab.', color: 'bg-emerald-500' },
                { step: '02', title: 'Learn & Practice', desc: 'Work through English and digital modules at your own pace, with mentor guidance each week.', color: 'bg-amber-500' },
                { step: '03', title: 'Unlock Opportunities', desc: 'Build your CV, get matched with scholarships and jobs, and apply with confidence.', color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={item.step} className="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-7xl font-black text-gray-50 leading-none mb-4 select-none">{item.step}</div>
                  <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 z-10"><ArrowRight className="w-5 h-5 text-gray-300" /></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-emerald-900">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to See the Impact?</h2>
            <p className="text-emerald-200 mb-8 max-w-lg mx-auto">
              Discover how EDU-Bridge is already changing outcomes for students across Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/impact">
                <Button className="bg-amber-500 hover:bg-amber-400 text-white border-0">
                  See Our Impact <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
