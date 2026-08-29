import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowRight, Handshake } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
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
    { name: 'Community', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'Training', path: '/training' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Ambassadors', path: '/ambassador' },
    { name: 'Careers', path: '/careers' },
    { name: 'Partnerships', path: '/work-with-us' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200 ${
          isScrolled ? 'py-2.5 shadow-sm' : 'py-3.5'
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <NavLink to="/" className="flex items-center gap-3 group -ml-2 sm:-ml-3 shrink-0">
            <img
              src="/brandex-navbar-logo.webp"
              alt="Brandex Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
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
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              <span>Join Brandex</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">

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


      {/* Mobile Drawer */}
      <MobileNavigation isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
