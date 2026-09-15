import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowRight, WifiOff, ShieldCheck, User } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
import { MobileBottomBar } from './MobileBottomBar';
import { useRegistration } from '../../contexts/RegistrationContext';
import { getOrCreateIdentity, getIdenticonSvg, AnonymousIdentity, isUserRegistered } from '../../utils/identity';
import { IdentityModal } from '../ui/IdentityModal';
import { NotificationCenter } from '../ui/NotificationCenter';
import { AppAuthModal } from '../ui/AppAuthModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<'general' | 'circle'>('general');
  const [identity, setIdentity] = useState<AnonymousIdentity>(getOrCreateIdentity());
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { openModal } = useRegistration();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Open Source', path: '/projects' },
    { name: 'Community', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'Training', path: '/training' },
    { name: 'Careers', path: '/careers' },
    { name: 'Tracker', path: '/status' },
  ];

  const identicon = getIdenticonSvg(identity.avatarSeed);
  const registered = isUserRegistered();

  const handleJoinCircleClick = () => {
    if (!registered) {
      setAuthIntent('circle');
      setAuthModalOpen(true);
    } else {
      openModal('community');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-200 ${
          isScrolled ? 'py-2 shadow-xs' : 'py-2.5 sm:py-3'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/brandex-navbar-logo.webp"
              alt="Brandex Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
            />
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-nowrap items-center space-x-1 whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-3 py-1.5 text-xs font-semibold transition-colors inline-flex items-center ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-0 left-2 right-2 h-[2px] bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-200 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {/* Offline Status */}
            {!isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </span>
            )}

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Account / Identity Widget */}
            {registered ? (
              <button
                onClick={() => {
                  setIdentity(getOrCreateIdentity());
                  setIdentityModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-mono group"
                title="View Brandex Identity & Points"
              >
                <img
                  src={identicon}
                  alt="Avatar"
                  className="w-5 h-5 rounded-md object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="font-bold text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                  {identity.handle}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Registered Builder" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthIntent('general');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Create Account Handle"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Up</span>
              </button>
            )}

            {/* Primary CTA: Join Circle (Account Guarded) */}
            <button
              onClick={handleJoinCircleClick}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Header Actions (Clean, Spacious, No Cramming) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Notification Bell */}
            <NotificationCenter />

            {/* Mobile Account Profile Pill */}
            <button
              onClick={() => {
                if (!registered) {
                  setAuthIntent('general');
                  setAuthModalOpen(true);
                } else {
                  setIdentity(getOrCreateIdentity());
                  setIdentityModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 p-1 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title={registered ? identity.handle : 'Create Account'}
            >
              <img
                src={identicon}
                alt="Avatar"
                className="w-5 h-5 rounded-md object-cover"
              />
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 max-w-[70px] truncate">
                {registered ? identity.handle : 'Sign Up'}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Identity & Offline Sync Drawer Modal */}
      <IdentityModal
        isOpen={identityModalOpen}
        onClose={() => {
          setIdentity(getOrCreateIdentity());
          setIdentityModalOpen(false);
        }}
        deferredInstallPrompt={deferredInstallPrompt}
      />

      {/* App Sign Up / Auth Modal with Loading Animation */}
      <AppAuthModal
        isOpen={authModalOpen}
        intent={authIntent}
        onProceedToCircle={() => openModal('community')}
        onClose={() => {
          setIdentity(getOrCreateIdentity());
          setAuthModalOpen(false);
        }}
        onSuccess={(updated) => {
          setIdentity(updated);
        }}
      />

      {/* Full-Screen Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAuth={(intent) => {
          setAuthIntent(intent);
          setAuthModalOpen(true);
        }}
        onOpenIdentity={() => {
          setIdentity(getOrCreateIdentity());
          setIdentityModalOpen(true);
        }}
      />

      {/* Modern Thumb-Friendly Mobile Bottom Bar */}
      <MobileBottomBar onOpenMenu={() => setMobileMenuOpen(true)} />
    </>
  );
};
