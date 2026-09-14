import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  User,
  Mail,
  Building2,
  Sparkles,
  AlertCircle,
  Code2,
  Users,
  Zap,
  BookOpen,
  Compass,
  Cpu,
  ShieldCheck,
  Palette,
  Layers,
  Check,
  Copy,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';

export const RegistrationModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, type, closeModal } = useRegistration();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [shakeStep, setShakeStep] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    selections: [] as string[],
    otherSelectionText: '',
    experienceLevel: 'Intermediate',
    contributions: [] as string[],
    focusAreas: [] as string[],
    goals: [] as string[],
    otherGoalText: '',
    projectIdea: '',
  });

  // Touched & Error tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic context based on type
  const isEnroll = type === 'enroll';
  const pageTitle = isEnroll ? 'Enroll in Brandex Education' : 'Join the Brandex Community';
  const pageDesc = isEnroll
    ? 'Register for upcoming cohort-based courses, hands-on masterclasses, and specialized training tracks.'
    : 'Connect with driven builders, researchers, and engineers. Complete this brief onboarding application to unlock community channels, working circles, and hackathon squads.';

  const selectionTitle = isEnroll ? '02. Target Course Track' : '02. Domain Circles of Interest';
  const selectionDesc = isEnroll
    ? 'Choose the specialized educational program you want to enroll in (select at least one):'
    : 'Choose the technology circles you want to actively participate in (select at least one):';

  // Domain circle options with icons & descriptions
  const domainOptions = isEnroll
    ? [
        {
          id: 'AI Engineering Cohort',
          title: 'AI Engineering Cohort',
          desc: 'Transformers, fine-tuning, RAG architectures & autonomous agents.',
          icon: Cpu,
          badge: 'High Demand',
        },
        {
          id: 'Cybersecurity Foundation',
          title: 'Cybersecurity Foundation',
          desc: 'Network enumeration, CTF methodology, web vulnerability defense.',
          icon: ShieldCheck,
          badge: 'Hands-On Labs',
        },
        {
          id: 'Advanced System Design',
          title: 'Advanced System Design',
          desc: 'High-throughput distributed systems, databases, and microservices.',
          icon: Layers,
          badge: 'Advanced',
        },
        {
          id: 'UX/UI Mastery',
          title: 'UX/UI Mastery',
          desc: 'Swiss editorial design, interaction ergonomics & component systems.',
          icon: Palette,
          badge: 'Design Track',
        },
        {
          id: 'Other',
          title: 'Other Specialized Track',
          desc: 'Custom focus or interdisciplinary technology research.',
          icon: Sparkles,
          badge: 'Custom',
        },
      ]
    : [
        {
          id: 'Artificial Intelligence',
          title: 'Artificial Intelligence Circle',
          desc: 'LLMs, autonomous agents, computer vision, and neural architecture.',
          icon: Cpu,
          badge: 'Active Labs',
        },
        {
          id: 'Cybersecurity & Defense',
          title: 'Cybersecurity & Defense Circle',
          desc: 'Offensive security, ethical hacking, CTF competitions & sandboxes.',
          icon: ShieldCheck,
          badge: 'Weekly CTFs',
        },
        {
          id: 'Distributed Systems',
          title: 'Distributed Systems Circle',
          desc: 'Low-level concurrency, cloud-native infra, Go/Rust high-throughput engines.',
          icon: Layers,
          badge: 'Systems Code',
        },
        {
          id: 'Swiss Editorial UX & Design',
          title: 'Swiss Editorial UX & Design',
          desc: 'Modern web aesthetics, micro-interactions, accessible design systems.',
          icon: Palette,
          badge: 'Visual Craft',
        },
        {
          id: 'Other',
          title: 'Other Domain / Custom',
          desc: 'Propose a custom research interest or cross-disciplinary initiative.',
          icon: Sparkles,
          badge: 'Custom',
        },
      ];

  // Community Contribution Roles ("What will you bring to the community?")
  const contributionRoles = [
    {
      id: 'Open Source Builder',
      title: 'Open Source Builder & Hacker',
      role: 'Code & Tools',
      desc: 'Ship functional code, publish starter repos, and build public tools with peer circles.',
      icon: Code2,
      accent: 'indigo',
    },
    {
      id: 'Peer Mentorship',
      title: 'Peer Support & Knowledge Sharing',
      role: 'Collaboration',
      desc: 'Assist teammates during coding labs, debug tricky issues, and share weekly research notes.',
      icon: Users,
      accent: 'emerald',
    },
    {
      id: 'Hackathons & Sprints',
      title: 'Hackathons & CTF Teaming',
      role: 'Competitions',
      desc: 'Form or join fast squads for 48h hackathons, builder showdowns, and CTF challenges.',
      icon: Zap,
      accent: 'amber',
    },
    {
      id: 'Research & Tech Talks',
      title: 'Research Papers & Tech Talks',
      role: 'Deep-Dives',
      desc: 'Lead paper breakdown sessions on modern LLMs, distributed consensus, or security audits.',
      icon: BookOpen,
      accent: 'cyan',
    },
    {
      id: 'Campus / Circle Ambassador',
      title: 'Campus / Circle Ambassador',
      role: 'Leadership',
      desc: 'Organize local study groups, campus workshops, and bridge student talent.',
      icon: Compass,
      accent: 'rose',
    },
    {
      id: 'Other / Custom',
      title: 'Specialized Contributor',
      role: 'Custom Value',
      desc: 'Offer cross-functional expertise like technical writing, UI design, or venture building.',
      icon: Sparkles,
      accent: 'purple',
    },
  ];

  // Focus topic tags
  const focusPills = [
    'Autonomous AI Agents & RAG',
    'Distributed Systems & Rust/Go',
    'Penetration Testing & Defense',
    'Swiss Editorial UI & Design Systems',
    'Cloud-Native Infra & Edge',
    'Web3 Protocols & Cryptography',
  ];

  // Quick Inspiration starter chips for project idea
  const projectInspirations = [
    'Build an autonomous LLM code-review agent for GitHub PRs',
    'Implement a high-throughput distributed key-value store in Go',
    'Design an ultra-minimal Swiss design component system',
    'Team up for the upcoming cybersecurity CTF defense tournament',
  ];

  // Reset step if type changes or reopened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg('');
      setErrors({});
      setTouched({});
      setIsSuccess(false);
    }
  }, [type, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const markTouched = (fields: string[]) => {
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((f) => {
        next[f] = true;
      });
      return next;
    });
  };

  // Field validation logic
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required to proceed.';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Please provide a valid full name (at least 2 characters).';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please provide a valid email address (e.g. name@university.edu).';
      }
    }

    if (currentStep === 2) {
      if (formData.selections.length === 0) {
        newErrors.selections = isEnroll
          ? 'Please select at least one course track to proceed.'
          : 'Please select at least one technology domain circle.';
      }
      if (formData.selections.includes('Other') && !formData.otherSelectionText.trim()) {
        newErrors.otherSelectionText = 'Please specify your other domain or course interest.';
      }
    }

    if (currentStep === 3) {
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Please choose your current experience level.';
      }
    }

    if (currentStep === 4) {
      const hasContribution = isEnroll
        ? formData.goals.length > 0
        : formData.contributions.length > 0;

      if (!hasContribution) {
        newErrors.contributions = isEnroll
          ? 'Please select at least one learning goal.'
          : 'Please select at least one way you plan to contribute to the community.';
      }

      if (formData.contributions.includes('Other / Custom') && !formData.otherGoalText.trim()) {
        newErrors.otherGoalText = 'Please provide details on your specialized contribution.';
      }
      if (formData.goals.includes('Other') && !formData.otherGoalText.trim()) {
        newErrors.otherGoalText = 'Please specify your other learning goal.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Mark current step fields touched
    if (step === 1) markTouched(['name', 'email']);
    if (step === 2) markTouched(['selections', 'otherSelectionText']);
    if (step === 3) markTouched(['experienceLevel']);
    if (step === 4) markTouched(['contributions', 'otherGoalText']);

    const isValid = validateStep(step);
    if (!isValid) {
      setErrorMsg('Please review and fill in the highlighted missing information below.');
      setShakeStep(true);
      setTimeout(() => setShakeStep(false), 500);
      return;
    }

    setErrorMsg('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markTouched(['contributions', 'otherGoalText', 'projectIdea']);

    const isValid = validateStep(4);
    if (!isValid) {
      setErrorMsg('Please complete the highlighted missing items before submitting.');
      setShakeStep(true);
      setTimeout(() => setShakeStep(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const toggleSelection = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selections.includes(id);
      const updated = exists ? prev.selections.filter((s) => s !== id) : [...prev.selections, id];
      return { ...prev, selections: updated };
    });
    if (errors.selections) {
      setErrors((prev) => ({ ...prev, selections: '' }));
    }
  };

  const toggleContribution = (id: string) => {
    if (isEnroll) {
      setFormData((prev) => {
        const exists = prev.goals.includes(id);
        const updated = exists ? prev.goals.filter((g) => g !== id) : [...prev.goals, id];
        return { ...prev, goals: updated };
      });
    } else {
      setFormData((prev) => {
        const exists = prev.contributions.includes(id);
        const updated = exists ? prev.contributions.filter((c) => c !== id) : [...prev.contributions, id];
        return { ...prev, contributions: updated };
      });
    }
    if (errors.contributions) {
      setErrors((prev) => ({ ...prev, contributions: '' }));
    }
  };

  const toggleFocusPill = (pill: string) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(pill);
      const updated = exists ? prev.focusAreas.filter((p) => p !== pill) : [...prev.focusAreas, pill];
      return { ...prev, focusAreas: updated };
    });
  };

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setErrorMsg('');
    setErrors({});
    setTouched({});
    setFormData({
      name: '',
      email: '',
      organization: '',
      selections: [],
      otherSelectionText: '',
      experienceLevel: 'Intermediate',
      contributions: [],
      focusAreas: [],
      goals: [],
      otherGoalText: '',
      projectIdea: '',
    });
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText('BX-2026-8812');
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xl animate-fade-in font-sans overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up transition-all my-auto ${
          shakeStep ? 'animate-shake' : ''
        }`}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shrink-0" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close form"
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full transition-all backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-indigo-50/70 via-slate-50/50 to-white dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-5 py-6 sm:px-8 sm:py-7 text-center space-y-2 relative overflow-hidden shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-full uppercase tracking-wider shadow-xs border border-indigo-100 dark:border-indigo-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
              {isEnroll ? 'Program Registration' : 'Community Onboarding'}
            </span>
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate('/status');
              }}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors inline-flex items-center gap-1"
            >
              <span>Check Existing Application Status</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {pageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {pageDesc}
          </p>

          {/* Stepper Navigation */}
          {!isSuccess && (
            <div className="pt-4 max-w-xl mx-auto">
              <div className="grid grid-cols-4 gap-2 text-left">
                {[
                  { num: 1, label: 'Profile', icon: User },
                  { num: 2, label: 'Domains', icon: Layers },
                  { num: 3, label: 'Experience', icon: Sparkles },
                  { num: 4, label: isEnroll ? 'Goals' : 'Contributions', icon: Zap },
                ].map((s) => {
                  const isDone = step > s.num;
                  const isCurrent = step === s.num;
                  const StepIcon = s.icon;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      disabled={s.num > step}
                      onClick={() => s.num < step && setStep(s.num)}
                      className={`group flex items-center gap-2 p-2 rounded-xl transition-all text-left ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800'
                          : isDone
                          ? 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <StepIcon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                          Step 0{s.num}
                        </div>
                        <div
                          className={`text-xs font-bold truncate leading-tight mt-0.5 ${
                            isCurrent
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : isDone
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Global Warning Banner if errors exist */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {isSuccess ? (
              /* Success View */
              <div className="py-6 sm:py-10 text-center space-y-6 animate-fade-in">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                    Application Verified & Logged
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                    Welcome to Brandex, {formData.name.split(' ')[0]}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Your onboarding submission has been received. Our ecosystem review team will process your application and send your community invitation pass to{' '}
                    <strong className="text-slate-900 dark:text-slate-200 font-semibold">{formData.email}</strong>.
                  </p>
                </div>

                {/* Application Reference ID Box */}
                <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl max-w-md mx-auto text-left space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                      Tracking Reference ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      {copiedRef ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                    BX-2026-8812
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Save this reference code to track admission progress anytime on our status portal.
                  </p>
                </div>

                {/* Next Steps Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>What happens next:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-disc">
                    <li>Automated email confirmation sent to your inbox.</li>
                    <li>Working circle leads review domain selections within 48 hours.</li>
                    <li>Discord and WhatsApp portal invitation link issued.</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 text-sm font-semibold">
                  <NavLink
                    to="/status?id=BX-2026-8812"
                    onClick={handleClose}
                    className="btn-primary w-full sm:w-auto justify-center px-6 py-3"
                  >
                    <span>Track Status Live</span>
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary w-full sm:w-auto justify-center px-6 py-3"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Form Steps */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                          01. Candidate Profile
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Tell us who you are and where we can reach you.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Step 1 of 4
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          {touched.name && errors.name ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" /> Missing
                            </span>
                          ) : touched.name && formData.name.trim() ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Complete
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Required</span>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={formData.name}
                            onBlur={() => {
                              markTouched(['name']);
                              validateStep(1);
                            }}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                            }}
                            placeholder="e.g. Maya Lin"
                            className={`w-full pl-10 pr-10 py-3.5 rounded-xl text-sm transition-all shadow-xs focus:outline-none ${
                              touched.name && errors.name
                                ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 dark:text-rose-200 ring-4 ring-rose-500/10'
                                : touched.name && formData.name.trim()
                                ? 'bg-white dark:bg-slate-800 border-2 border-emerald-500/60 text-slate-900 dark:text-white ring-4 ring-emerald-500/10'
                                : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            {touched.name && errors.name && (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                            {touched.name && !errors.name && formData.name.trim() && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                        {touched.name && errors.name && (
                          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          {touched.email && errors.email ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" /> Missing
                            </span>
                          ) : touched.email && formData.email.trim() && !errors.email ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Required</span>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onBlur={() => {
                              markTouched(['email']);
                              validateStep(1);
                            }}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            placeholder="maya@example.org"
                            className={`w-full pl-10 pr-10 py-3.5 rounded-xl text-sm transition-all shadow-xs focus:outline-none ${
                              touched.email && errors.email
                                ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500 text-rose-900 dark:text-rose-200 ring-4 ring-rose-500/10'
                                : touched.email && formData.email.trim() && !errors.email
                                ? 'bg-white dark:bg-slate-800 border-2 border-emerald-500/60 text-slate-900 dark:text-white ring-4 ring-emerald-500/10'
                                : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                            {touched.email && errors.email && (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                            {touched.email && !errors.email && formData.email.trim() && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                        {touched.email && errors.email && (
                          <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          We will send your circle channels link and onboarding package here.
                        </p>
                      </div>

                      {/* Organization / Institution */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            University / School / Company
                          </label>
                          <span className="text-[10px] text-slate-400">Optional</span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            placeholder="e.g. National Institute of Tech / Startup"
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Selections (Domains of Interest) */}
                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                          {selectionTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {selectionDesc}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Step 2 of 4
                      </span>
                    </div>

                    {/* Missing selection warning */}
                    {touched.selections && errors.selections && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{errors.selections}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {domainOptions.map((opt) => {
                        const isSelected = formData.selections.includes(opt.id);
                        const Icon = opt.icon;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => toggleSelection(opt.id)}
                            className={`p-4 text-left rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                              isSelected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {opt.badge}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                className={`font-display font-bold text-sm leading-tight ${
                                  isSelected
                                    ? 'text-indigo-950 dark:text-white'
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                {opt.title}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Text Input for "Other" */}
                    {formData.selections.includes('Other') && (
                      <div className="pt-2 animate-fade-in">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1">
                            Specify Your Area of Interest <span className="text-rose-500">*</span>
                          </label>
                          {touched.otherSelectionText && errors.otherSelectionText && (
                            <span className="text-[11px] font-semibold text-rose-600">Missing</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={formData.otherSelectionText}
                          onChange={(e) => {
                            setFormData({ ...formData, otherSelectionText: e.target.value });
                            if (errors.otherSelectionText) {
                              setErrors((prev) => ({ ...prev, otherSelectionText: '' }));
                            }
                          }}
                          placeholder="e.g. Embedded Firmware, Quantum Algorithms, Robotics..."
                          className={`w-full p-3.5 rounded-xl text-sm transition-all focus:outline-none ${
                            touched.otherSelectionText && errors.otherSelectionText
                              ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900 ring-4 ring-rose-500/10'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10'
                          }`}
                        />
                        {touched.otherSelectionText && errors.otherSelectionText && (
                          <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.otherSelectionText}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Experience Level */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                          03. Engineering Experience Level
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Helps us pair you with the right circle leads, challenges, and peer working groups.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Step 3 of 4
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          level: 'Beginner',
                          bars: 1,
                          tag: 'Foundational Builder',
                          desc: 'Starting out in coding, algorithms, or product design. Eager for structured learning and weekly labs.',
                        },
                        {
                          level: 'Intermediate',
                          bars: 2,
                          tag: 'Active Developer',
                          desc: 'Hands-on developer with 1-3 years experience building projects, APIs, or contributing to repos.',
                        },
                        {
                          level: 'Advanced',
                          bars: 3,
                          tag: 'Senior / Specialist',
                          desc: 'Senior engineer, architect, team lead, or published researcher. Looking to mentor and tackle hard systems.',
                        },
                      ].map((item) => {
                        const isSelected = formData.experienceLevel === item.level;
                        return (
                          <button
                            type="button"
                            key={item.level}
                            onClick={() => {
                              setFormData({ ...formData, experienceLevel: item.level });
                              if (errors.experienceLevel) {
                                setErrors((prev) => ({ ...prev, experienceLevel: '' }));
                              }
                            }}
                            className={`w-full p-4.5 sm:p-5 text-left border rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 group ${
                              isSelected
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-display font-bold text-base ${
                                    isSelected
                                      ? 'text-indigo-950 dark:text-white'
                                      : 'text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  {item.level}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {item.tag}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            {/* Difficulty / Level Bars indicator */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {[1, 2, 3].map((b) => (
                                <div
                                  key={b}
                                  className={`w-2 h-6 rounded-full transition-all ${
                                    b <= item.bars
                                      ? isSelected
                                        ? 'bg-indigo-600 dark:bg-indigo-400'
                                        : 'bg-slate-400 dark:bg-slate-600'
                                      : 'bg-slate-200 dark:bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: The Questions: "What Will You Bring & Build?" */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                          <span>04. What Will You Bring & Build?</span>
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isEnroll
                            ? 'Share your learning intent, aspirations, and what you hope to achieve.'
                            : 'Brandex thrives on active builders. How will you participate and what excites you?'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Step 4 of 4
                      </span>
                    </div>

                    {/* Missing contribution warning */}
                    {touched.contributions && errors.contributions && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{errors.contributions}</span>
                      </div>
                    )}

                    {/* Question 1: What will you bring to the community? */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                          <span>{isEnroll ? 'What are your primary goals?' : 'What will you bring to the community?'}</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Select all that apply</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {contributionRoles.map((role) => {
                          const isSelected = isEnroll
                            ? formData.goals.includes(role.id)
                            : formData.contributions.includes(role.id);
                          const Icon = role.icon;
                          return (
                            <button
                              type="button"
                              key={role.id}
                              onClick={() => toggleContribution(role.id)}
                              className={`p-4 text-left rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                                isSelected
                                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-0.5'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white'
                                      : 'border border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>

                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                                  {role.role}
                                </div>
                                <div
                                  className={`font-display font-bold text-sm leading-tight ${
                                    isSelected
                                      ? 'text-indigo-950 dark:text-white'
                                      : 'text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  {role.title}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                  {role.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom contribution specification if selected */}
                      {((isEnroll && formData.goals.includes('Other / Custom')) ||
                        (!isEnroll && formData.contributions.includes('Other / Custom'))) && (
                        <div className="pt-2 animate-fade-in">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Please describe your custom contribution: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.otherGoalText}
                            onChange={(e) => {
                              setFormData({ ...formData, otherGoalText: e.target.value });
                              if (errors.otherGoalText) {
                                setErrors((prev) => ({ ...prev, otherGoalText: '' }));
                              }
                            }}
                            placeholder="Share how you want to contribute..."
                            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Question 2: Interactive Focus Tags */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                          <span>What will you focus on mastering or building?</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Quick Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {focusPills.map((pill) => {
                          const isPicked = formData.focusAreas.includes(pill);
                          return (
                            <button
                              key={pill}
                              type="button"
                              onClick={() => toggleFocusPill(pill)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                isPicked
                                  ? 'bg-indigo-600 text-white shadow-xs scale-102'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>{pill}</span>
                              {isPicked && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question 3: Interactive Project Idea with Clickable Inspiration Prompts */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>What will you build next? (Your Vision or Project Idea)</span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {formData.projectIdea.length}/400
                        </span>
                      </div>

                      {/* Clickable Inspiration Starter Chips */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Inspire me (Click to auto-fill starter idea):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {projectInspirations.map((idea, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, projectIdea: idea });
                              }}
                              className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors text-left"
                            >
                              💡 {idea}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={3}
                          maxLength={400}
                          value={formData.projectIdea}
                          onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
                          placeholder="Tell us about a tool, app, or open-source idea you want to build alongside fellow Brandex circle members..."
                          className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary px-4 sm:px-5 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div className="text-xs text-slate-400 font-medium hidden sm:block">
                      Step 1: Your Profile Details
                    </div>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-5 sm:px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-semibold ml-auto"
                    >
                      <span>Continue to Step 0{step + 1}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary px-6 sm:px-8 py-2.5 disabled:opacity-50 flex items-center gap-2 text-xs sm:text-sm font-semibold ml-auto shadow-md shadow-indigo-500/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Onboarding Application</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
