import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  RefreshCw,
  Cpu,
  ArrowRight,
  Key,
  Lock,
  X,
  UserCheck,
  Terminal
} from 'lucide-react';
import {
  getOrCreateIdentity,
  updateIdentityHandle,
  getIdenticonSvg,
  AnonymousIdentity,
  addContributorPoints,
  generateRandomHandle
} from '../../utils/identity';

interface AppAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (identity: AnonymousIdentity) => void;
  intent?: 'circle' | 'general';
  onProceedToCircle?: () => void;
}

export const AppAuthModal: React.FC<AppAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  intent = 'general',
  onProceedToCircle
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [handleInput, setHandleInput] = useState<string>(generateRandomHandle());
  const [selectedDomain, setSelectedDomain] = useState<string>('Artificial Intelligence');
  
  // Loading Animation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [loadingText, setLoadingText] = useState<string>('Initializing cryptographic keys...');
  const [createdIdentity, setCreatedIdentity] = useState<AnonymousIdentity | null>(null);

  if (!isOpen) return null;

  const handleRandomize = () => {
    setHandleInput(generateRandomHandle());
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalHandle = handleInput.trim() || generateRandomHandle();

    setIsLoading(true);
    setLoadingStep(1);
    setLoadingText('Deriving deterministic avatar seed from entropy...');

    await new Promise((r) => setTimeout(r, 600));
    setLoadingStep(2);
    setLoadingText('Generating pseudo-anonymous zero-PII session token...');

    await new Promise((r) => setTimeout(r, 650));
    setLoadingStep(3);
    setLoadingText('Establishing cryptographic handshake with Brandex Engine...');

    await new Promise((r) => setTimeout(r, 600));

    const updated = updateIdentityHandle(finalHandle);
    addContributorPoints(100);
    setCreatedIdentity(updated);
    setIsLoading(false);
    if (onSuccess) onSuccess(updated);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleInput.trim()) {
      const updated = updateIdentityHandle(handleInput.trim());
      setCreatedIdentity(updated);
      if (onSuccess) onSuccess(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOADING ANIMATION STATE */}
        {isLoading ? (
          <div className="py-8 text-center space-y-6 animate-fade-in">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer ambient glow */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-md animate-pulse" />
              {/* Precision outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin [animation-duration:1.8s]" />
              {/* Counter-rotating ring */}
              <div className="absolute inset-2.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 border-r-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:4s]" />
              
              {/* Centered Brandex Logo mark */}
              <div className="relative z-10 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl p-2.5 flex items-center justify-center shadow-md border border-slate-200/80 dark:border-slate-700">
                <img
                  src="/brandex-navbar-logo.webp"
                  alt="Brandex"
                  className="w-full h-auto object-contain animate-pulse"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Phase 0{loadingStep}/03
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Generating Anonymous Identity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                {loadingText}
              </p>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${(loadingStep / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : createdIdentity ? (
          /* SUCCESS STATE */
          <div className="py-4 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Zero-PII Identity Issued
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Welcome to Brandex
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Your cryptographic handle is ready. Use it across service bookings, open-source PR claims, and domain circles.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-left">
              <img
                src={getIdenticonSvg(createdIdentity.avatarSeed)}
                alt="Avatar"
                className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-600"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs text-slate-400 block font-mono">Active Handle</span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white truncate block">
                  {createdIdentity.handle}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  +100 Welcome Points Credited
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (intent === 'circle' && onProceedToCircle) {
                  onProceedToCircle();
                }
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{intent === 'circle' ? 'Continue to Domain Circle Registration' : 'Enter Brandex Ecosystem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-6">
            <div>
              {intent === 'circle' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Account Required to Join Domain Circles</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-PII Privacy Guaranteed</span>
                </div>
              )}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create Anonymous Account' : 'Sign In to Brandex'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {intent === 'circle'
                  ? 'Domain circles require an active cryptographic handle to assign verified peer review badges and CTF credentials.'
                  : 'No phone numbers or invasive tracking. Participate in engineering sprints and community circles with a secure cryptographic handle.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Sign Up (New Handle)
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Sign In (Existing)
              </button>
            </div>

            <form onSubmit={mode === 'signup' ? handleCreateAccount : handleSignIn} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Your Anonymous Handle
                  </label>
                  {mode === 'signup' && (
                    <button
                      type="button"
                      onClick={handleRandomize}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="@crypto_builder_101"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Domain Discipline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Artificial Intelligence',
                      'Cybersecurity & Defense',
                      'Distributed Systems',
                      'Swiss Editorial UX'
                    ].map((dom) => (
                      <button
                        type="button"
                        key={dom}
                        onClick={() => setSelectedDomain(dom)}
                        className={`p-2.5 rounded-xl border text-xs text-left transition-colors ${
                          selectedDomain === dom
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'signup' ? 'Generate Identity & Sign Up' : 'Authenticate Handle'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
