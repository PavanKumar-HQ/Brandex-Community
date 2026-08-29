import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ArrowRight } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
import { useRegistration } from '../../contexts/RegistrationContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Community', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'Training', path: '/training' },
    { name: 'Events', path: '/events' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border transition-all duration-200 ${
          isScrolled ? 'py-3 shadow-sm dark:shadow-black/25' : 'py-4'
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-24 flex items-center justify-between">
          {/* Logo & Identity */}
          <NavLink to="/" className="flex items-center gap-3 group -ml-2 sm:-ml-3">
            <img
              src="/brandex-navbar-logo.png"
              alt="Brandex Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex flex-nowrap items-center space-x-0.5 lg:space-x-1.5 whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-2.5 py-1.5 text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 font-semibold'
                      : 'text-brand-muted hover:text-brand-dark'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
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
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              <span>Join Brandex</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => openModal()}
              className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold"
            >
              Join
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 border border-brand-border text-brand-muted rounded-lg hover:bg-brand-bg"
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
