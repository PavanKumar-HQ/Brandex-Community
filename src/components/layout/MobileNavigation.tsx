import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { openModal } = useRegistration();

  if (!isOpen) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Community', path: '/community' },
    { name: 'Education', path: '/education' },
    { name: 'Training', path: '/training' },
    { name: 'Events', path: '/events' },
    { name: 'Media', path: '/media' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 animate-fade-in md:hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
          <img src="/brandex-logo.png" alt="Brandex Logo" className="h-8 w-auto object-contain" />
          <span className="font-display font-bold text-lg text-slate-900">Brandex</span>
        </NavLink>
        <button
          onClick={onClose}
          aria-label="Close Navigation"
          className="p-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
        <div className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `text-xl font-semibold px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* CTAs */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <button
            onClick={() => {
              openModal('community');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl text-base font-semibold shadow-sm"
          >
            <span>Join Brandex</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <NavLink
            to="/app/dashboard"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50"
          >
            <span>Member Portal</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
