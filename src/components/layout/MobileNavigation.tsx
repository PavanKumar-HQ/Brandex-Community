import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ArrowRight, Sparkles, Handshake, Shield, Search } from 'lucide-react';
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
    { name: 'Live Now', path: '/now', isLive: true },
    { name: 'Work With Brandex', path: '/work-with-us' },
    { name: 'Community Circles', path: '/community' },
    { name: 'Education & Schools', path: '/education' },
    { name: 'Training Cohorts', path: '/training' },
    { name: 'Events & Summits', path: '/events' },
    { name: 'Community Guidelines', path: '/community/guidelines' },
    { name: 'About Us', path: '/about' },
    { name: 'Careers & Ambassadors', path: '/careers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 animate-fade-in lg:hidden">
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
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between space-y-6">
        <div className="flex flex-col space-y-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `text-base font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                  isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2">
                {link.isLive && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
                <span>{link.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </NavLink>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onClose();
              openModal('community');
            }}
            className="w-full btn-primary py-3.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
          >
            <span>Join Brandex Circle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
