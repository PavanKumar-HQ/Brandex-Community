import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowRight, Download, Wifi, WifiOff } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
import { useRegistration } from '../../contexts/RegistrationContext';
import { getOrCreateIdentity, getIdenticonSvg, AnonymousIdentity } from '../../utils/identity';
import { IdentityModal } from '../ui/IdentityModal';
import { NotificationCenter } from '../ui/NotificationCenter';
import { AppAuthModal } from '../ui/AppAuthModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [identity, setIdentity] = useState<AnonymousIdentity>(getOrCreateIdentity());
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { openModal } = useRegistration();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    { name: 'Events', path: '/events' },
    { name: 'Careers', path: '/careers' },
    { name: 'Tracker', path: '/status' },
  ];

  const identicon = getIdenticonSvg(identity.avatarSeed);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-200 ${
          isScrolled ? 'py-2 shadow-sm' : 'py-3'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <NavLink to="/" className="flex items-center gap-3 group -ml-2 sm:-ml-3 shrink-0">
            <img
              src="/brandex-navbar-logo.webp"
              alt="Brandex Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex flex-nowrap items-center space-x-1 whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-2.5 py-1.5 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
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
                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-2.5 shrink-0">
            {/* Network Status Pill */}
            {!isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </span>
            )}

            {/* Notification Center (Replaces Install App button) */}
            <NotificationCenter />

            {/* Sign Up / Authenticate Modal Trigger */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              title="Sign Up or Authenticate with Handle"
            >
              <span>Sign Up</span>
            </button>

            {/* Pseudo-Anonymous Identity Trigger */}
            <button
              onClick={() => {
                setIdentity(getOrCreateIdentity());
                setIdentityModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-mono"
              title="View your Anonymous Brandex Identity & Offline Queue"
            >
              <img
                src={identicon}
                alt="Avatar"
                className="w-5 h-5 rounded-md object-cover border border-slate-300 dark:border-slate-600"
              />
              <span className="font-bold text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                {identity.handle}
              </span>
            </button>

            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Mobile Notification Center */}
            <NotificationCenter />

            {/* Anonymous Avatar Trigger */}
            <button
              onClick={() => {
                setIdentity(getOrCreateIdentity());
                setIdentityModalOpen(true);
              }}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700"
              title="Identity & Offline Queue"
            >
              <img
                src={identicon}
                alt="Avatar"
                className="w-6 h-6 rounded-md object-cover"
              />
            </button>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Sign Up
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
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
        onClose={() => {
          setIdentity(getOrCreateIdentity());
          setAuthModalOpen(false);
        }}
        onSuccess={(updated) => {
          setIdentity(updated);
        }}
      />

      {/* Mobile Drawer */}
      <MobileNavigation isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

