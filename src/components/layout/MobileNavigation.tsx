import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  ArrowRight,
  ShieldCheck,
  Layers,
  Code2,
  Users,
  BookOpen,
  Calendar,
  Briefcase,
  Search,
  CheckCircle2,
  ChevronRight,
  Zap,
  Lock,
  UserCheck,
  FileText,
  Sparkles,
  Award,
  Info,
  Mail,
  HeartHandshake
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import {
  getOrCreateIdentity,
  getIdenticonSvg,
  isUserRegistered,
  AnonymousIdentity
} from '../../utils/identity';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: (intent: 'general' | 'circle') => void;
  onOpenIdentity: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOpenIdentity
}) => {
  const { openModal } = useRegistration();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const identity: AnonymousIdentity = getOrCreateIdentity();
  const identicon = getIdenticonSvg(identity.avatarSeed);
  const registered = isUserRegistered();

  const handleJoinCircle = () => {
    onClose();
    if (!registered) {
      onOpenAuth('circle');
    } else {
      openModal('community');
    }
  };

  const handleBookService = () => {
    onClose();
    navigate('/services');
  };

  interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
  }

  interface Section {
    title: string;
    links: NavItem[];
  }

  const primarySections: Section[] = [
    {
      title: 'Platform Core',
      links: [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Services & Booking', path: '/services', icon: Layers },
        { name: 'Open-Source Projects', path: '/projects', icon: Code2 },
        { name: 'Community Circles', path: '/community', icon: Users },
        { name: 'Track Status', path: '/status', icon: Search }
      ]
    },
    {
      title: 'Education & Knowledge',
      links: [
        { name: 'Education & Schools', path: '/education', icon: BookOpen },
        { name: 'Training & Cohorts', path: '/training', icon: Zap },
        { name: 'Events & Summits', path: '/events', icon: Calendar },
        { name: 'Member Stories', path: '/stories', icon: Sparkles },
        { name: 'Blog & Articles', path: '/blog', icon: FileText }
      ]
    },
    {
      title: 'Organization & Careers',
      links: [
        { name: 'About Brandex', path: '/about', icon: Info },
        { name: 'Careers & Fellowships', path: '/careers', icon: Briefcase },
        { name: 'Campus Ambassadors', path: '/ambassador', icon: Award },
        { name: 'Work With Us', path: '/work-with-us', icon: HeartHandshake },
        { name: 'Contact Us', path: '/contact', icon: Mail }
      ]
    }
  ];

  // Derive currently active section
  const currentLink = primarySections.flatMap((s) => s.links).find((l) =>
    l.path === '/' ? location.pathname === '/' : location.pathname.startsWith(l.path)
  );
  const currentSectionName = currentLink ? currentLink.name : 'Brandex Platform';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white animate-fade-in md:hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
          <img src="/brandex-logo.webp" alt="Brandex Logo" className="h-8 w-auto object-contain" />
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Brandex</span>
        </NavLink>
        <button
          onClick={onClose}
          aria-label="Close Navigation"
          className="p-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Account / Identity Card */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={identicon}
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                  {identity.handle}
                </span>
                {registered ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Member</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Guest
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {registered
                  ? `${identity.contributorPoints} XP • Circle Verified`
                  : 'Anonymous Handle & Profile'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (registered) {
                onOpenIdentity();
              } else {
                onOpenAuth('general');
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold shrink-0 hover:bg-indigo-100 transition-colors"
          >
            {registered ? 'Profile' : 'Sign Up'}
          </button>
        </div>

        {/* Current Active Section Banner */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-indigo-400"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold">
              Current Section
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-xs bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-2xs">
            {currentSectionName}
          </span>
        </div>

        {/* Section Groups */}
        {primarySections.map((sec) => (
          <div key={sec.title} className="space-y-2">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 font-semibold">
              {sec.title}
            </h3>
            <div className="space-y-1">
              {sec.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                          <span>{link.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white/20 text-white border border-white/30">
                              Active
                            </span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Bottom Action Buttons */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={handleJoinCircle}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
        >
          <span>Join Domain Circle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleBookService}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Book Engineering Service</span>
        </button>
      </div>
    </div>
  );
};
