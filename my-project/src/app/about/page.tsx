import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Target, Eye, Users, Lightbulb, Heart, Globe } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Equity First',
    description: "Every student deserves access to quality education tools, regardless of their school's resources.",
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Lightbulb,
    title: 'Practical Learning',
    description: 'We focus on skills that are immediately useful — not just theory, but real-world application.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Mentors, teachers, and students work together to create a supportive learning ecosystem.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Globe,
    title: 'Rwanda Focused',
    description: 'Built specifically for the Rwandan context — language, culture, and educational system.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const team = [
  {
    name: 'Amina Uwase',
    role: 'Founder & Education Lead',
    bio: "Former secondary school teacher with 10 years of experience in Rwanda's public education system.",
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'David Nkurunziza',
    role: 'Technology Director',
    bio: 'Software engineer passionate about using technology to solve education challenges in Africa.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Grace Mukamana',
    role: 'Mentorship Coordinator',
    bio: 'Career counselor who has helped hundreds of students navigate university applications and job searches.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── PAGE HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 py-24 sm:py-32">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container-custom relative z-10 text-center">
            <span className="inline-block text-xs font-semibold text-emerald-300 bg-emerald-800/60 border border-emerald-700 px-3 py-1 rounded-full mb-5">
              About EDU-Bridge
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
              Built for Students Who Deserve Better
            </h1>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">
              EDU-Bridge was born from a simple belief: every Rwandan student, regardless of their school&apos;s
              resources, deserves the skills to succeed in university and beyond.
            </p>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {/* Mission */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10">
                <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To empower public day school students in Rwanda by providing free, accessible tools
                  for English communication, digital literacy, and career readiness — bridging the gap
                  between secondary education and real-world opportunity.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gray-900 rounded-3xl p-10">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-gray-400 leading-relaxed">
                  A Rwanda where every secondary school graduate — regardless of their school&apos;s location
                  or resources — has the English fluency, digital confidence, and career knowledge to
                  compete for university places, scholarships, and meaningful employment.
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Our Story</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                  Why EDU-Bridge Was Created
                </h2>
                <div className="space-y-4 text-gray-500 leading-relaxed">
                  <p>
                    In 2023, our founders visited several public day schools in rural Rwanda and discovered
                    a troubling pattern: students were bright, motivated, and hardworking — but consistently
                    held back by gaps in English and digital skills that their schools simply couldn&apos;t address.
                  </p>
                  <p>
                    University entrance exams required strong English. Job applications required email and
                    computer skills. Scholarship forms were online. Yet most students had never sent an email
                    or written a formal letter in English.
                  </p>
                  <p>
                    EDU-Bridge was built to close that gap — a platform that works in school computer labs,
                    requires no personal device, and gives students exactly the skills they need to move forward.
                  </p>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop"
                  alt="Students in a classroom in Rwanda"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900">GS Ruyenzi, Rwanda</p>
                    <p className="text-xs text-gray-500">Where EDU-Bridge was first piloted in 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TARGET USERS ── */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Who We Serve</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for These Students</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                EDU-Bridge is designed specifically for students who face the greatest barriers to opportunity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop',
                  title: 'Secondary School Students',
                  description: 'Senior 4, 5, and 6 students preparing for national exams, university applications, and their first jobs.',
                },
                {
                  image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop',
                  title: 'Public Day School Learners',
                  description: 'Students in government-funded day schools that lack dedicated English labs, career counselors, or digital training.',
                },
                {
                  image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop',
                  title: 'First-Generation Graduates',
                  description: 'Students who will be the first in their families to attend university or enter the formal job market.',
                },
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">Our Values</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">The Team</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">People Behind EDU-Bridge</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl border border-gray-100 p-7 text-center shadow-sm hover:shadow-md transition-shadow">
                  <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-emerald-50" />
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to Learn More?</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Explore the problem we're solving, our solution, or get in touch with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/problem">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white border-0">
                  See the Problem <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-gray-200 text-gray-700">
                  Contact Us
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
