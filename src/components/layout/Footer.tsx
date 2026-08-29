import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight, ShieldCheck } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 11.779c0-1.459-1.192-2.641-2.661-2.641-.715 0-1.365.286-1.847.746-1.724-1.192-4.043-1.948-6.602-2.034l1.32-4.187 3.593.849c.046 1.053.935 1.902 2.012 1.902 1.114 0 2.019-.905 2.019-2.019 0-1.114-.905-2.019-2.019-2.019-.817 0-1.52.478-1.859 1.168l-3.953-.935c-.171-.04-.344.053-.404.212l-1.554 4.935c-2.736.086-5.202.846-6.994 2.08-.475-.429-1.107-.696-1.803-.696-1.47 0-2.662 1.183-2.662 2.641 0 .919.467 1.729 1.18 2.219-.04.254-.061.513-.061.775 0 3.737 4.542 6.772 10.144 6.772 5.602 0 10.144-3.035 10.144-6.772 0-.256-.02-.507-.058-.756.748-.485 1.238-1.306 1.238-2.238zm-14.159 3.018c-1.139 0-2.062-1.011-2.062-2.257 0-1.246 0.923-2.257 2.062-2.257s2.062 1.011 2.062 2.257c0 1.246-.923 2.257-2.062 2.257zm9.324 0c-1.139 0-2.062-1.011-2.062-2.257 0-1.246 0.923-2.257 2.062-2.257s2.062 1.011 2.062 2.257c0 1.246-.923 2.257-2.062 2.257z" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.004 2c-5.518 0-9.986 4.477-9.986 9.996 0 1.764.459 3.49 1.33 5.01L2 22l5.121-1.343a9.92 9.92 0 004.883 1.282c5.518 0 9.986-4.47 9.986-9.996C21.99 6.477 17.522 2 12.004 2zm0 1.636c4.615 0 8.354 3.74 8.354 8.36 0 4.62-3.739 8.36-8.354 8.36a8.3 8.3 0 01-4.25-1.164l-.305-.18-3.155.827.842-3.076-.198-.314a8.27 8.27 0 01-1.284-4.453c0-4.62 3.739-8.36 8.35-8.36zm-3.6 3.6c-.198-.004-.396.072-.536.216-.18.18-.684.67-.684 1.638s.707 1.9.806 2.034c.1.135 1.39 2.1 3.375 2.973.47.202.837.324 1.125.418.473.15 1.25.129 1.593.08.38-.058 1.17-.482 1.336-.945.167-.464.167-.86.117-.945-.049-.085-.18-.135-.38-.234-.197-.1-1.17-.577-1.35-.644-.18-.067-.315-.1-.446.1-.13.198-.513.644-.626.774-.113.13-.225.148-.423.05-.198-.1-.837-.307-1.593-.984-.589-.525-.987-1.176-1.103-1.373-.117-.198-.013-.306.086-.405.09-.09.198-.234.297-.347.1-.113.13-.198.198-.33.067-.135.032-.25-.018-.35-.05-.1-.446-1.077-.613-1.474-.16-.39-.324-.336-.446-.341z" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58 1.334 17.361a.1.1 0 00.073.052 23.46 23.46 0 0 0 5.856 2.87.087.087 0 0 0 .093-.032c.241-.355.45-.733.623-1.127a.083.083 0 00-.044-.112 17.58 17.58 0 0 1-2.528-1.218.082.082 0 0 1-.008-.135c.168-.124.336-.255.5-.386a.08.08 0 0 1 .085-.011c3.856 1.764 8.016 1.764 11.838 0a.08.08 0 0 1 .085.01c.164.13.332.262.5.387a.082.082 0 0 1-.008.135 17.618 17.618 0 0 1-2.528 1.218.083.083 0 0 0-.044.113c.174.394.383.772.624 1.127a.087.087 0 0 0 .093.032 23.447 23.447 0 0 0 5.855-2.87.1.1 0 0 0 .074-.052c1.479-3.486.637-7.06-1.353-10.366a.07.07 0 0 0-.032-.027zM8.02 15.332c-1.185 0-2.158-1.087-2.158-2.422 0-1.334.955-2.422 2.158-2.422 1.212 0 2.176 1.096 2.158 2.422 0 1.335-.955 2.422-2.158 2.422zm7.96 0c-1.185 0-2.158-1.087-2.158-2.422 0-1.334.955-2.422 2.158-2.422 1.212 0 2.176 1.096 2.158 2.422 0 1.335-.955 2.422-2.158 2.422z" />
  </svg>
);

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
                { icon: GithubIcon, href: 'https://github.com/PavanKumar-HQ/Brandex-Community', label: 'GitHub', hoverClass: 'hover:bg-white hover:text-[#181717] hover:border-white' },
                { icon: XIcon, href: 'https://twitter.com/brandex', label: 'Twitter (X)', hoverClass: 'hover:bg-white hover:text-black hover:border-white' },
                { icon: LinkedinIcon, href: 'https://linkedin.com/company/brandex', label: 'LinkedIn', hoverClass: 'hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]' },
                { icon: InstagramIcon, href: 'https://instagram.com/brandex', label: 'Instagram', hoverClass: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent' },
                { icon: RedditIcon, href: 'https://reddit.com/r/brandex', label: 'Reddit', hoverClass: 'hover:bg-[#ff4500] hover:text-white hover:border-[#ff4500]' },
                { icon: WhatsappIcon, href: 'https://wa.me/919480944727', label: 'WhatsApp', hoverClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
                { icon: DiscordIcon, href: 'https://discord.gg/brandex', label: 'Discord', hoverClass: 'hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2]' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 flex items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 ${s.hoverClass}`}
                >
                  <s.icon className="w-5 h-5 shrink-0" />
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

                { name: 'Work With Brandex', path: '/work-with-us' },
                { name: 'Community Circles', path: '/community' },
                { name: 'Community Guidelines', path: '/community/guidelines' },
                { name: 'Education Pathways', path: '/education' },
                { name: 'Technical Training', path: '/training' },
                { name: 'Events & Summits', path: '/events' },
                { name: 'Global Search', path: '/search' },
                { name: 'Campus Ambassadors', path: '/ambassador' },
                { name: 'Impact Stories', path: '/stories' },
                { name: 'Careers & Status', path: '/careers' },
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
              <li>Geniusphere Series</li>
              <li>Student Wargames</li>
              <li>Ambassador Chapters</li>
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

          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center space-x-6 text-xs font-medium">
              <NavLink to="/about" className="hover:text-white transition-colors">Privacy Policy</NavLink>
              <NavLink to="/about" className="hover:text-white transition-colors">Terms of Service</NavLink>
              <NavLink to="/community/guidelines" className="hover:text-white transition-colors">Guidelines</NavLink>
            </div>
            <a 
              href="https://www.brandex.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-2 opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="text-[10px] text-slate-400 font-medium">POWERED BY</span>
              <img src="/brandex-logo.png" alt="Brandex Logo" className="h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
