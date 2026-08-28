import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube, Mail, MapPin, Phone, ArrowUpRight, ShieldCheck, Instagram, Clock, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 font-sans">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Manifesto (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <NavLink to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/brandex-logo.png"
                alt="Brandex Logo"
                className="h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Brandex
              </span>
            </NavLink>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The digital showcase and education platform for emerging technology communities, school workshops, research initiatives, and live events.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {[
                { icon: Github, href: 'https://github.com/PavanKumar-HQ/Brandex-Community', label: 'GitHub' },
                { icon: Twitter, href: 'https://twitter.com/brandex', label: 'Twitter (X)' },
                { icon: Linkedin, href: 'https://linkedin.com/company/brandex', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://instagram.com/brandex', label: 'Instagram' },
                { icon: MessageCircle, href: 'https://reddit.com/r/brandex', label: 'Reddit' },
                { icon: Phone, href: 'https://wa.me/919480944727', label: 'WhatsApp' },
                { icon: MessageCircle, href: 'https://discord.gg/brandex', label: 'Discord' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Showcase Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Showcase Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {[
                { name: 'Community Circles', path: '/community' },
                { name: 'Education Pathways', path: '/education' },
                { name: 'Technical Training', path: '/training' },
                { name: 'Events & Summits', path: '/events' },
                { name: 'Campus Ambassadors', path: '/ambassador' },
                { name: 'Media & Photo Vault', path: '/media' },
                { name: 'Impact Stories', path: '/stories' },
                { name: 'About Brandex', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Domain Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Domains
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>Artificial Intelligence</li>
              <li>Cybersecurity & Defense</li>
              <li>Distributed Systems</li>
              <li>Design & Swiss UX</li>
              <li>School Series</li>
              <li>Fintech Engineering</li>
            </ul>
          </div>

          {/* Column 4: Contact & Verification (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Location & Contact
            </h4>
            
            <div className="space-y-3 text-xs text-slate-400 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">#121, 13th main Binny layout<br/>Vijaynagar Bangalore-560040</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="mailto:brandexhq@gmail.com" className="hover:text-white transition-colors">
                  brandexhq@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="tel:9986880072" className="hover:text-white transition-colors">+91 99868 80072</a>
              </div>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="hover:text-white text-indigo-400 font-semibold transition-colors">
                  www.brandex.co.in
                </a>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>GST Registered: 29OGNPS8060K1Z5</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Official digital ecosystem for Brandex technology initiatives.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div>© {currentYear} Brandex. All Rights Reserved.</div>
            <div className="text-slate-400 font-mono text-[11px]">GSTIN: 29OGNPS8060K1Z5</div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-medium">
            <NavLink to="/about" className="hover:text-white transition-colors">Privacy Policy</NavLink>
            <NavLink to="/about" className="hover:text-white transition-colors">Terms of Service</NavLink>
            <NavLink to="/admin" className="text-slate-400 hover:text-indigo-400 transition-colors">Admin Portal</NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
};
