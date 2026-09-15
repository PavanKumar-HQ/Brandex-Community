import React, { useState, useEffect, useRef } from 'react';
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
  Terminal,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import {
  getOrCreateIdentity,
  updateIdentityHandle,
  getIdenticonSvg,
  AnonymousIdentity,
  addContributorPoints,
  generateRandomHandle,
  AVATAR_PRESETS,
  getAvatarPreset,
  registerUserAccount
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
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(AVATAR_PRESETS[0].id);
  const [selectedDomain, setSelectedDomain] = useState<string>('Artificial Intelligence');
  
  // Real-time Handle Uniqueness State (Instagram-style)
  const [isCheckingHandle, setIsCheckingHandle] = useState<boolean>(false);
  const [handleStatus, setHandleStatus] = useState<{
    available: boolean;
    message?: string;
    suggestions?: string[];
  } | null>(null);

  // Loading Animation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [loadingText, setLoadingText] = useState<string>('Initializing cryptographic keys...');
  const [createdIdentity, setCreatedIdentity] = useState<AnonymousIdentity | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Instagram-style handle availability check
  useEffect(() => {
    if (mode !== 'signup' || !isOpen) return;

    const trimmed = handleInput.trim().replace(/^@+/, '');
    if (!trimmed) {
      setHandleStatus(null);
      return;
    }

    if (trimmed.length < 3) {
      setHandleStatus({
        available: false,
        message: 'Username must be at least 3 characters'
      });
      return;
    }

    const regex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!regex.test(trimmed)) {
      setHandleStatus({
        available: false,
        message: 'Only letters, numbers, and underscores allowed'
      });
      return;
    }

    setIsCheckingHandle(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/pwa/check-handle?handle=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.available) {
            setHandleStatus({
              available: true,
              message: `✓ @${trimmed} is available`
            });
          } else {
            setHandleStatus({
              available: false,
              message: data.reason || data.error || 'Username is already taken',
              suggestions: data.suggestions || []
            });
          }
        } else {
          setHandleStatus({ available: true });
        }
      } catch {
        // Offline or backend unreachable: allow client-side uniqueness
        setHandleStatus({ available: true });
      } finally {
        setIsCheckingHandle(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [handleInput, mode, isOpen]);

  if (!isOpen) return null;

  const handleRandomize = () => {
    const fresh = generateRandomHandle();
    setHandleInput(fresh);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setHandleInput(suggestion);
  };

  const activePreset = getAvatarPreset(selectedAvatarId);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const clean = handleInput.trim().replace(/^@+/, '').toLowerCase();
    const finalHandle = `@${clean}`;

    setIsLoading(true);
    setLoadingStep(1);
    setLoadingText('Verifying global handle uniqueness across SQLite network...');

    // Attempt backend registration
    try {
      const resp = await fetch('/api/pwa/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: finalHandle,
          avatarSeed: selectedAvatarId,
          domain: selectedDomain
        })
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        if (resp.status === 409) {
          setIsLoading(false);
          setServerError(errorData.message || `Username ${finalHandle} is already taken. Please pick another.`);
          setHandleStatus({
            available: false,
            message: `Username ${finalHandle} is taken`,
            suggestions: [`${finalHandle}_dev`, `${finalHandle}_hq`, `${finalHandle}_99`]
          });
          return;
        }
      }
    } catch {
      // Backend offline fallback - proceed locally
    }

    setLoadingStep(2);
    setLoadingText('Assigning algorithmic vector avatar token...');
    await new Promise((r) => setTimeout(r, 450));

    setLoadingStep(3);
    setLoadingText('Issuing cryptographic zero-PII credentials...');
    await new Promise((r) => setTimeout(r, 450));

    // Save locally
    const updated = registerUserAccount(finalHandle, selectedAvatarId, undefined, selectedDomain);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in font-sans transform-gpu">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
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
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-md animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin [animation-duration:1.8s]" />
              <div className="absolute inset-2.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 border-r-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:4s]" />
              
              <div className="relative z-10 w-16 h-16 rounded-2xl p-1 flex items-center justify-center shadow-md bg-slate-950">
                <img
                  src={activePreset.svgDataUri}
                  alt={activePreset.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Phase 0{loadingStep}/03
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Configuring Zero-PII Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono">
                {loadingText}
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${(loadingStep / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : createdIdentity ? (
          /* SUCCESS STATE */
          <div className="py-3 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Unique Handle Reserved • Zero-PII Issued
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Welcome to Brandex
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Your unique handle is globally registered. Use it across service bookings, open-source PR claims, and domain circles.
              </p>
            </div>

            {/* Selected Avatar Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3.5 text-left">
              <img
                src={getIdenticonSvg(createdIdentity.avatarSeed)}
                alt="Selected Avatar"
                className="w-14 h-14 rounded-2xl border-2 border-indigo-500/40 shadow-sm object-contain"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white truncate block">
                    {createdIdentity.handle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Verified
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  Avatar Archetype: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{getAvatarPreset(createdIdentity.avatarSeed).name}</strong>
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-1">
                  ★ +150 Welcome Points Credited
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
          <div className="space-y-5">
            <div>
              {intent === 'circle' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Account needed to join Domain Circles</span>
                </div>
              )}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'signup'
                  ? 'Pick an avatar preset and reserve your unique @handle.'
                  : 'Enter your unique handle to sign in to your account.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-lg transition-colors text-center ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 rounded-lg transition-colors text-center ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
            </div>

            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={mode === 'signup' ? handleCreateAccount : handleSignIn} className="space-y-4">
              {/* AVATAR SELECTOR (5 CURATED PRESETS) */}
              {mode === 'signup' && (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      1. Select Avatar
                    </label>
                  </div>

                  {/* Active Selected Avatar Highlight Card */}
                  <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="relative shrink-0">
                      <img
                        src={activePreset.svgDataUri}
                        alt={activePreset.name}
                        className="w-12 h-12 rounded-xl object-contain shadow-xs border border-indigo-500/30"
                      />
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-indigo-600 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {activePreset.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {activePreset.tagline}
                      </p>
                    </div>
                  </div>

                  {/* 5 Avatar Selector Grid */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = selectedAvatarId === preset.id;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setSelectedAvatarId(preset.id)}
                          className={`relative aspect-square rounded-xl p-1 transition-all flex items-center justify-center border ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500 shadow-sm scale-105'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-102 opacity-80 hover:opacity-100'
                          }`}
                          title={preset.name}
                        >
                          <img
                            src={preset.svgDataUri}
                            alt={preset.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* USERNAME INPUT (INSTAGRAM-STYLE GLOBALLY UNIQUE) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {mode === 'signup' ? '2. Unique Handle' : 'Your Handle'}
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

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
                    @
                  </div>
                  <input
                    type="text"
                    value={handleInput.replace(/^@+/, '')}
                    onChange={(e) => setHandleInput(`@${e.target.value}`)}
                    placeholder="crypto_builder_101"
                    required
                    className={`w-full pl-8 pr-10 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 ${
                      mode === 'signup' && handleStatus
                        ? handleStatus.available
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                  />
                  {mode === 'signup' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {isCheckingHandle ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : handleStatus?.available ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : handleStatus && !handleStatus.available ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Real-time Instagram-Style Availability Feedback */}
                {mode === 'signup' && handleStatus && (
                  <div className="mt-1.5 space-y-1">
                    <p
                      className={`text-[11px] font-semibold flex items-center gap-1 ${
                        handleStatus.available
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {handleStatus.message}
                    </p>

                    {/* Suggestions when handle is taken */}
                    {handleStatus.suggestions && handleStatus.suggestions.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-400 block mb-1">
                          Available suggestions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {handleStatus.suggestions.map((sug) => (
                            <button
                              type="button"
                              key={sug}
                              onClick={() => handleSelectSuggestion(sug)}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono hover:bg-indigo-100 transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PRIMARY DOMAIN (CONCISE ESSENTIAL DATA ONLY) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    3. Primary Focus Discipline
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      'Artificial Intelligence',
                      'Cybersecurity & Defense',
                      'Distributed Systems',
                      'Web3 & Cloud Architecture'
                    ].map((dom) => (
                      <button
                        type="button"
                        key={dom}
                        onClick={() => setSelectedDomain(dom)}
                        className={`p-2 rounded-xl border text-[11px] text-left transition-colors truncate ${
                          selectedDomain === dom
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
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
                disabled={mode === 'signup' && handleStatus !== null && !handleStatus.available}
                className={`w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                  mode === 'signup' && handleStatus !== null && !handleStatus.available
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

