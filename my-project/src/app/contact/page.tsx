'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Mail, MapPin, Clock, MessageSquare, Send, ChevronDown } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@edubridge.rw',
    sub: 'We reply within 24 hours',
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: MapPin,
    label: 'Find Us',
    value: 'Kigali, Rwanda',
    sub: 'KG 123 St, Gasabo District',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon – Fri, 8am – 5pm',
    sub: 'East Africa Time (EAT)',
    color: 'bg-amber-50 text-amber-700',
  },
];

const faqs = [
  {
    q: 'Is EDU-Bridge really free for students?',
    a: 'Yes — completely free. EDU-Bridge is funded through partnerships and grants. Students will never be charged for any feature.',
  },
  {
    q: 'Do students need their own device?',
    a: 'No. EDU-Bridge is designed to work in school computer labs. Students can access everything they need during supervised lab sessions.',
  },
  {
    q: 'How can my school partner with EDU-Bridge?',
    a: 'Fill out the contact form and select "School Partnership" as your subject. Our team will reach out within 48 hours to discuss onboarding.',
  },
  {
    q: 'Can I volunteer as a mentor?',
    a: 'Absolutely. We welcome professionals, university graduates, and educators who want to give back. Use the contact form to express your interest.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        {/* ── PAGE HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-800 py-24 sm:py-28">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="container-custom relative z-10 text-center">
            <span className="inline-block text-xs font-semibold text-emerald-300 bg-emerald-800/60 border border-emerald-700 px-3 py-1 rounded-full mb-5">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              We'd Love to Hear From You
            </h1>
            <p className="text-emerald-200 text-lg max-w-xl mx-auto">
              Whether you're a student, teacher, school administrator, or potential partner —
              our team is here to help.
            </p>
          </div>
        </section>

        {/* ── CONTACT INFO CARDS ── */}
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {contactInfo.map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-semibold text-gray-900 text-sm">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM + MAP ── */}
        <section className="py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Form */}
              <div>
                <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-5">Send a Message</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Our Team</h2>
                <p className="text-gray-500 mb-8 text-sm">Fill out the form and we'll get back to you within 24 hours.</p>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm">
                      Thank you for reaching out. Our team will reply to your email within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-gray-400"
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-gray-400"
                          placeholder="Pierre"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder:text-gray-400"
                        placeholder="you@school.rw"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
                        <option value="">Select a topic...</option>
                        <option>General Inquiry</option>
                        <option>School Partnership</option>
                        <option>Volunteer / Mentor</option>
                        <option>Technical Support</option>
                        <option>Media / Press</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-400">*</span></label>
                      <textarea
                        required
                        rows={5}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none placeholder:text-gray-400"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full">
                      <Send className="mr-2 w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Right side — image + FAQ */}
              <div className="space-y-10">
                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                    alt="EDU-Bridge team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Average response time</p>
                        <p className="text-xs text-gray-500">Under 24 hours on business days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-2">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                          {faq.q}
                          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 ml-3 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === i && (
                          <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
