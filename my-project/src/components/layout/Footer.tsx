import Link from 'next/link';
import { GraduationCap, Mail, MapPin, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Learning Modules', href: '#features' },
    { label: 'Mentorship', href: '#features' },
    { label: 'Career Guidance', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ],
  Resources: [
    { label: 'Help Center', href: '#' },
    { label: 'School Partners', href: '#' },
    { label: 'Contact Support', href: '#contact' },
    { label: 'Documentation', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Data Protection', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                EDU<span className="text-emerald-400">-Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Empowering public day school students in Rwanda through English communication,
              digital literacy, and career mentorship.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:hello@edubridge.rw" className="hover:text-emerald-400 transition-colors">
                  hello@edubridge.rw
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-700 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} EDU-Bridge. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-400">❤️</span> for Rwandan students
          </p>
        </div>
      </div>
    </footer>
  );
}
