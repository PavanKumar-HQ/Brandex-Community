import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, X, ArrowRight, Handshake } from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';

export const PersistentJoinCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useRegistration();

  useEffect(() => {
    // Show after 1.5 seconds if not dismissed in session
    const isDismissed = sessionStorage.getItem('persistent_cta_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('persistent_cta_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in max-w-sm hidden sm:block">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3 backdrop-blur-md">
        <div className="p-2 bg-indigo-600 rounded-xl shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div className="space-y-1.5 flex-1 pr-2">
          <h4 className="font-display font-bold text-xs text-white">Join the Brandex Movement</h4>
          <p className="text-[11px] text-slate-300 leading-tight">
            Connect with student builders or partner with our educational cohorts.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => openModal('community')}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <NavLink
              to="/work-with-us"
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg transition-colors inline-flex items-center gap-1 border border-slate-700"
            >
              <Handshake className="w-3 h-3 text-indigo-400" />
              <span>Partner</span>
            </NavLink>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white transition-colors p-1"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
