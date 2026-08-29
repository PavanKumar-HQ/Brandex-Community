import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowRight, Search, Handshake } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
import { SearchModal } from '../ui/SearchModal';
import { useRegistration } from '../../contexts/RegistrationContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Keyboard shortcut (Cmd + K / Ctrl + K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Now', path: '/now', isLive: true },
    { name: 'Community', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'Training', path: '/training' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Work With Us', path: '/work-with-us' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-200 ${
          isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5'
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-24 flex items-center justify-between">
          {/* Logo & Identity */}
          <NavLink to="/" className="flex items-center gap-3 group -ml-2 sm:-ml-3 shrink-0">
            <img
              src="/brandex-navbar-logo.png"
              alt="Brandex Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-nowrap items-center space-x-1 whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-2.5 py-1.5 text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 transform origin-left transition-transform duration-300 ease-out ${
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
            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              title="Search across Brandex (Cmd + K)"
            >
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-400">⌘K</kbd>
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
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <Search className="w-4 h-4 text-indigo-600" />
            </button>

            <button
              onClick={() => openModal()}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Join
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer */}
      <MobileNavigation isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
