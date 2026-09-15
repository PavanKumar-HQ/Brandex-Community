import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
  Code2,
  Compass,
  Cpu,
  ShieldCheck,
  Layers,
  Palette
} from 'lucide-react';
import { useRegistration } from '../../contexts/RegistrationContext';
import { queueOfflineAction } from '../../utils/offlineDb';

export const CohortEnrollmentModal: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, type, modalData, closeModal } = useRegistration();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [referenceId, setReferenceId] = useState<string>('');

  const cohortPrograms = [
    {
      id: 'ai_engineering',
      title: 'AI Engineering & Autonomous Agents Cohort',
      duration: '8 Weeks Intensive',
      level: 'Intermediate to Advanced',
      icon: Cpu,
      badge: 'Live Mentorship'
    },
    {
      id: 'cybersecurity_defense',
      title: 'Offensive Security & Network Defense Lab',
      duration: '6 Weeks Hands-on',
      level: 'All Levels',
      icon: ShieldCheck,
      badge: 'CTF Sandboxes'
    },
    {
      id: 'systems_architecture',
      title: 'High-Concurrency Distributed Systems in Go/Rust',
      duration: '10 Weeks Architecture Track',
      level: 'Advanced Engineers',
      icon: Layers,
      badge: 'Production Systems'
    },
    {
      id: 'swiss_ux_ui',
      title: 'Swiss Editorial UX/UI & Ergonomic Design Systems',
      duration: '4 Weeks Build Track',
      level: 'Design & Frontend',
      icon: Palette,
      badge: 'Design Sprint'
    },
    {
      id: 'custom_workshop',
      title: 'Hands-on Weekend Buildathon & Masterclass',
      duration: 'Weekend Sprint',
      level: 'Accelerated',
      icon: BookOpen,
      badge: 'Fast Track'
    }
  ];

  const batchSchedules = [
    {
      id: 'weekend_bootcamp',
      label: 'Weekend Intensive Bootcamp',
      timing: 'Sat & Sun (10:00 AM – 2:00 PM IST)',
      desc: 'Ideal for working professionals and university students.'
    },
    {
      id: 'weekday_evening',
      label: 'Weekday Evening Cohort',
      timing: 'Tue & Thu (7:00 PM – 9:30 PM IST)',
      desc: 'Live instructor teardowns, coding reviews, and pair debugging.'
    },
    {
      id: 'self_paced_mentored',
      label: 'Self-Paced with 1-on-1 Office Hours',
      timing: 'Flexible schedule + Weekly Mentor Sync',
      desc: 'Async modular curriculum with direct mentor code review.'
    }
  ];

  const learningOutcomes = [
    'Job Placement & Software Engineering Roles',
    'University Research Paper & Thesis Project',
    'Startup / Production Product Prototyping',
    'Technical Upskilling & Promotion at Work',
    'Open-Source Portfolio Hardening'
  ];

  const codingProficiencies = [
    'Beginner (Basic programming knowledge)',
    'Intermediate (Built 2-3 fullstack/backend projects)',
    'Advanced (Production engineer / System builder)'
  ];

  const [formData, setFormData] = useState({
    // Step 1: Program & Schedule
    programTitle: cohortPrograms[0].title,
    batchSchedule: batchSchedules[0].label,
    // Step 2: Candidate Details
    fullName: '',
    email: '',
    phone: '',
    institutionOrCompany: '',
    majorOrRole: '',
    // Step 3: Prerequisites & Learning Outcome
    proficiency: codingProficiencies[1],
    targetOutcome: learningOutcomes[0],
    prerequisiteNote: '',
    githubOrPortfolio: ''
  });

  useEffect(() => {
    if (modalData?.program) {
      setFormData((prev) => ({ ...prev, programTitle: modalData.program || prev.programTitle }));
    }
  }, [modalData]);

  if (!isOpen || type !== 'enroll') return null;

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setErrorMsg('');
    }, 300);
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.programTitle) {
        setErrorMsg('Please select a target training program.');
        return false;
      }
      if (!formData.batchSchedule) {
        setErrorMsg('Please select your preferred cohort schedule.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
        setErrorMsg('Please enter your full name (minimum 3 characters).');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMsg('Please provide a valid email address for admission confirmation.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 8) {
        setErrorMsg('Please enter a valid contact phone or WhatsApp number.');
        return false;
      }
      if (!formData.institutionOrCompany.trim()) {
        setErrorMsg('Please specify your current college, university, or company.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.proficiency) {
        setErrorMsg('Please select your current coding background level.');
        return false;
      }
      if (!formData.targetOutcome) {
        setErrorMsg('Please select your primary career/learning outcome.');
        return false;
      }
    }

    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedRef = `BX-ENR-${new Date().getFullYear()}-${randomNum}`;

    const payload = {
      id: generatedRef,
      userHandle: `@${formData.fullName.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
      type: 'cohort',
      domains: [formData.programTitle],
      experienceLevel: formData.proficiency,
      contributions: [formData.targetOutcome],
      projectIdea: `Enrolled in ${formData.programTitle} (${formData.batchSchedule}). Candidate from ${formData.institutionOrCompany}. Notes: ${formData.prerequisiteNote || 'Standard cohort placement.'}`
    };

    try {
      const res = await fetch('/api/pwa/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Server offline');
      }
    } catch {
      await queueOfflineAction('application', '/api/pwa/applications', payload);
    } finally {
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
          localStorage.setItem('brandex_recent_refs', JSON.stringify(Array.from(new Set([generatedRef, ...saved]))));
        } catch {}
      }
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-slide-up">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Step {step} of 3
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {step === 1 && 'Course & Batch Selection'}
                  {step === 2 && 'Student / Professional Profile'}
                  {step === 3 && 'Background & Career Goals'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Cohort Course Enrollment Form
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            /* SUCCESS VIEW */
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Cohort Seat Application Registered
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  Welcome to Brandex Cohorts, {formData.fullName.split(' ')[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Your enrollment for <strong>{formData.programTitle}</strong> ({formData.batchSchedule}) has been queued.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2 max-w-md mx-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Official Cohort Reference ID:
                </span>
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-mono font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
                    {referenceId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-800"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Pre-reading materials and syllabus repository will be dispatched to <strong>{formData.email}</strong> within 24h.
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <NavLink
                  to={`/status?id=${referenceId}`}
                  onClick={handleClose}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Track Enrollment Status</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* STEPPED FORM */
            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              
              {/* STEP 1: Program & Batch Selection */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Training Program / Cohort Track *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {cohortPrograms.map((prog) => {
                        const isSelected = formData.programTitle === prog.title;
                        const Icon = prog.icon;
                        return (
                          <button
                            key={prog.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, programTitle: prog.title })}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs ring-2 ring-indigo-500/20'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                  {prog.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {prog.duration} • {prog.level}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                              {prog.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Cohort Schedule *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {batchSchedules.map((batch) => {
                        const isSelected = formData.batchSchedule === batch.label;
                        return (
                          <button
                            key={batch.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, batchSchedule: batch.label })}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-xs ring-2 ring-indigo-500/20'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {batch.label}
                              </div>
                              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                                {batch.timing}
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                              {batch.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Candidate Academic / Professional Profile */}
              {step === 2 && (
                <div className="space-y-3.5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Maya Lin"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Email Address (For Syllabus Access) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="maya@university.edu"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Phone / WhatsApp (For Cohort Updates) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 99868 80072"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Current College / University / Employer *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institutionOrCompany}
                        onChange={(e) => setFormData({ ...formData, institutionOrCompany: e.target.value })}
                        placeholder="e.g. National Institute of Tech / Self-Taught"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Academic Major / Current Designation
                    </label>
                    <input
                      type="text"
                      value={formData.majorOrRole}
                      onChange={(e) => setFormData({ ...formData, majorOrRole: e.target.value })}
                      placeholder="e.g. 3rd Year B.Tech Computer Science / Junior Frontend Dev"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Background & Prerequisites */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Programming & Systems Proficiency *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {codingProficiencies.map((prof) => (
                        <button
                          key={prof}
                          type="button"
                          onClick={() => setFormData({ ...formData, proficiency: prof })}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                            formData.proficiency === prof
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <span>{prof}</span>
                          {formData.proficiency === prof && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Career / Learning Outcome *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {learningOutcomes.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetOutcome: goal })}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                            formData.targetOutcome === goal
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <span>{goal}</span>
                          {formData.targetOutcome === goal && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        GitHub / Portfolio Link
                      </label>
                      <input
                        type="url"
                        value={formData.githubOrPortfolio}
                        onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                        placeholder="https://github.com/yourhandle"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Special Prerequisites / Questions
                      </label>
                      <input
                        type="text"
                        value={formData.prerequisiteNote}
                        onChange={(e) => setFormData({ ...formData, prerequisiteNote: e.target.value })}
                        placeholder="e.g. Inquiring about GPU cloud credits / macOS setup"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Cohort Seat...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Course Enrollment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
  );
};
