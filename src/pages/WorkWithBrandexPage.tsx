import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { ShareButton } from '../components/ui/ShareButton';
import { createEnquiry } from '../repositories/repository';
import { EnquiryType } from '../models/types';
import {
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  Users,
  Check,
  Copy,
  Mail,
  Phone,
  User,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface EnquiryCategoryOption {
  type: EnquiryType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

export const WorkWithBrandexPage: React.FC = () => {
  useSEO(
    'Work With Brandex — Institutional & Corporate Partnerships',
    'Partner with Brandex for school technology syllabus integration, corporate cybersecurity training tracks, workshop hosting, and event sponsorships.'
  );

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  const [selectedType, setSelectedType] = useState<EnquiryType>('school');
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '' // Spam trap
  });

  const [mountTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const categories: EnquiryCategoryOption[] = [
    {
      type: 'school',
      title: 'School and College Partnerships',
      subtitle: 'Introduce the Geniusphere coding syllabus, campus cybersecurity wargames, or setup a student chapter.',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Academic & Schools'
    },
    {
      type: 'corporate',
      title: 'Corporate Training and Upskilling',
      subtitle: 'Custom team cohorts in modern AI agent construction, secure coding, and cloud incident simulations.',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Enterprise & Startups'
    },
    {
      type: 'workshop',
      title: 'Workshops and Hackathons',
      subtitle: 'Collaborate on multi-day technology bootcamps, Capture The Flag competitions, or UI/UX design workshops.',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badge: 'Events & Labs'
    },
    {
      type: 'sponsorship',
      title: 'Event and Prize Sponsorships',
      subtitle: 'Sponsor Brandex summits, provide compute credits to student builders, or support prize tracks.',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'Sponsors & Grants'
    },
    {
      type: 'partnership',
      title: 'Strategic Partnerships',
      subtitle: 'Co-brand curriculum tracks, open-source tooling collaborations, and long-term ecosystem integration.',
      icon: HeartHandshake,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Institutions'
    }
  ];

  const totalSteps = 6;

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!selectedType) {
        setErrorMessage('Please select a partnership category.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.orgName.trim()) {
        setErrorMessage('Please enter your organization or institution name.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.contactName.trim()) {
        setErrorMessage('Please enter your contact person name.');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid official email address.');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.message.trim()) {
        setErrorMessage('Please share a brief overview of your objectives or requirements.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < totalSteps && currentStep !== 5) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Honeypot check
    if (formData.honeypot.trim() !== '') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedRef('ENQ-SPAM-PREVENTED');
      }, 1000);
      return;
    }

    // Minimum submission duration check (2s)
    const elapsed = Date.now() - mountTime;
    if (elapsed < 2000) {
      setErrorMessage('Please review your details before submitting.');
      return;
    }

    // Rate Limiting Check
    const count = parseInt(sessionStorage.getItem('enquiry_submit_count') || '0', 10);
    if (count >= 3) {
      setErrorMessage('Submission limit reached for this session. Please email us directly at brandexhq@gmail.com.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullContact = formData.role
        ? `${formData.contactName} (${formData.role})`
        : formData.contactName;

      const enq = await createEnquiry({
        type: selectedType,
        orgName: formData.orgName,
        contactName: fullContact,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message,
        adminNotes: `Source: /work-with-us wizard. Category: ${selectedType}`
      });

      sessionStorage.setItem('enquiry_submit_count', (count + 1).toString());
      setIsSubmitting(false);
      setSubmittedRef(enq.id);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('There was an issue logging your enquiry. Please check your network connection.');
    }
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const currentCategory = categories.find((c) => c.type === selectedType) || categories[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0
    })
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-16 pt-20 sm:pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: 'Work With Brandex' }]} className="mb-0" />
        <ShareButton title="Work With Brandex — Institutional & Corporate Partnerships" />
      </div>

      {/* Hero Header */}
      <PageHero
        tag="BUSINESS & INSTITUTIONAL PARTNERSHIPS"
        title="Work With Brandex"
        description="Partner with Brandex to deploy open-source technology curricula in schools, conduct corporate team wargames, or sponsor our developer summits."
        widgetTitle="Partner.Desk"
        widgetStatLabel="Response Time"
        widgetStatValue="< 24 Hours"
        widgetStatusLabel="Partnership Window"
        widgetStatusText="Now Open for 2026-27"
      />

      {/* Clear Distinction Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">Looking to join as an individual builder?</h4>
            <p className="text-[11px] sm:text-xs text-slate-600">
              If you are a student or developer wanting to join circles, explore our Community Portal instead.
            </p>
          </div>
        </div>
        <NavLink
          to="/community"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1.5"
        >
          <span>Community Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* ========================================================================= */}
      {/* CONVERSATIONAL STEP-BY-STEP WIZARD (Zero Scrolling, One Question at a Time) */}
      {/* ========================================================================= */}
      <section className="max-w-3xl mx-auto w-full">
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Progress Header */}
          {!submittedRef && (
            <div className="bg-white px-4 sm:px-8 py-3.5 sm:py-4 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                  {currentStep}
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              {/* Progress Track */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      if (st < currentStep || validateStep(currentStep)) {
                        setDirection(st > currentStep ? 1 : -1);
                        setCurrentStep(st);
                      }
                    }}
                    aria-label={`Go to step ${st}`}
                    className={`h-2 rounded-full transition-all ${
                      st === currentStep
                        ? 'w-6 sm:w-8 bg-indigo-600'
                        : st < currentStep
                        ? 'w-3 sm:w-4 bg-emerald-500 hover:opacity-80'
                        : 'w-2 sm:w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form Content Area */}
          <div className="p-4 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between min-h-[380px]">
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot Hidden Input */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {submittedRef ? (
              /* ========================================================================= */
              /* SUCCESS CONFIRMATION STATE */
              /* ========================================================================= */
              <div className="py-6 sm:py-8 text-center space-y-5 animate-fade-in my-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Partnership Request Dispatched
                  </span>
                  <h3 className="text-xl sm:text-3xl font-display font-bold text-slate-900">
                    Enquiry Logged Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.contactName}</strong> from <strong className="text-slate-900">{formData.orgName}</strong>. Our partnerships desk will review and reach out to you within 24 hours.
                  </p>
                </div>

                {/* Reference ID Pill */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl max-w-sm mx-auto space-y-2 text-left shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Reference Receipt ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
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
                  <div className="font-mono font-bold text-base sm:text-lg text-indigo-600">
                    {submittedRef}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                  <NavLink
                    to={`/status?id=${submittedRef}`}
                    className="btn-primary justify-center px-6 py-2.5 text-xs font-bold"
                  >
                    <span>Track Status Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setCurrentStep(1);
                      setFormData({
                        orgName: '',
                        contactName: '',
                        role: '',
                        email: '',
                        phone: '',
                        message: '',
                        honeypot: ''
                      });
                    }}
                    className="btn-secondary justify-center px-6 py-2.5 text-xs font-semibold bg-white"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* STEPPED QUESTION BODIES */
              /* ========================================================================= */
              <div className="flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait" custom={direction}>
                  
                  {/* STEP 1: CATEGORY SELECTION */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Question 01</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          Select Your Partnership Track
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Choose the collaboration model that best fits your institution or organization.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = selectedType === cat.type;
                          return (
                            <button
                              key={cat.type}
                              type="button"
                              onClick={() => {
                                setSelectedType(cat.type);
                                setErrorMessage(null);
                              }}
                              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${cat.color}`}>
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                    {cat.badge}
                                  </span>
                                  {isSelected && (
                                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                  {cat.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                  {cat.subtitle}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: ORGANIZATION NAME */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Question 02</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          What is your organization, school, or company name?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          We will formulate the syllabus or proposal structure tailored to your institution.
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            autoFocus
                            placeholder="e.g. National Institute of Tech / Acme Corp"
                            value={formData.orgName}
                            onChange={(e) => {
                              setFormData({ ...formData, orgName: e.target.value });
                              if (errorMessage) setErrorMessage(null);
                            }}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-12 pr-4 py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Tip: Press <span className="font-mono font-bold text-slate-600">Enter ↵</span> to proceed.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CONTACT LEAD PERSON */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Question 03</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          Who should we direct this proposal to?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Provide the primary faculty coordinator, director, or lead engineer contact.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Full Name *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                              <User className="w-5 h-5" />
                            </div>
                            <input
                              type="text"
                              autoFocus
                              placeholder="e.g. Dr. Priya Sharma"
                              value={formData.contactName}
                              onChange={(e) => {
                                setFormData({ ...formData, contactName: e.target.value });
                                if (errorMessage) setErrorMessage(null);
                              }}
                              onKeyDown={handleKeyDown}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Designation or Role (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Head of Department, Faculty Lead, or Director"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-indigo-600 transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: OFFICIAL EMAIL & PHONE */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Question 04</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          How can our partnerships team reach you?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          We'll email the official curriculum dossier and dispatch coordination details.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Official Email Address *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                              <Mail className="w-5 h-5" />
                            </div>
                            <input
                              type="email"
                              autoFocus
                              placeholder="priya@institution.edu"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errorMessage) setErrorMessage(null);
                              }}
                              onKeyDown={handleKeyDown}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Phone or WhatsApp (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                              <Phone className="w-5 h-5" />
                            </div>
                            <input
                              type="tel"
                              placeholder="+91 99868 80072"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              onKeyDown={handleKeyDown}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: PROPOSAL / INITIATIVE DETAILS */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Question 05</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          What would you like to achieve together?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Outline your proposed dates, cohort size, syllabus focus, or hackathon scope.
                        </p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Initiative Scope & Objectives *</label>
                        <textarea
                          rows={4}
                          autoFocus
                          placeholder="e.g. We want to host a 3-day AI & Systems Hackathon for 250 engineering undergraduates in October 2026..."
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xs resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 6: SUMMARY & SUBMIT */}
                  {currentStep === 6 && (
                    <motion.div
                      key="step6"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Final Step</span>
                        <h3 className="font-display font-bold text-lg sm:text-2xl text-slate-900">
                          Review & Dispatch Proposal
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Confirm details before transmitting to the Brandex executive team.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Category:</span>
                          <span className="font-bold text-indigo-600 text-right">
                            {categories.find(c => c.type === selectedType)?.title}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Organization:</span>
                          <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                            {formData.orgName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Contact Lead:</span>
                          <span className="font-bold text-slate-900 text-right">
                            {formData.contactName} {formData.role && `(${formData.role})`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-medium">Email or Phone:</span>
                          <span className="font-bold text-slate-900 text-right">
                            {formData.email} {formData.phone && `· ${formData.phone}`}
                          </span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-slate-500 font-medium block">Scope & Objectives:</span>
                          <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg text-[11px] leading-relaxed line-clamp-3">
                            {formData.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct executive dispatch. Zero public data exposure.</span>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Wizard Controls Bottom Bar */}
                <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-5 py-2.5 text-xs font-bold justify-center"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmit()}
                      className="btn-primary px-6 py-2.5 text-xs font-bold justify-center disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Logging Request...' : 'Submit Partnership Request'}</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* Why Partner With Brandex Section */}
      <section className="py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Why Partner With Brandex?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We are building the most active developer ecosystem in the country. Our partners gain direct access to technical talent and innovative learning models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
          <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Open-Source Syllabus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Access our proven, field-tested AI and cybersecurity curriculum used by leading secondary schools.</p>
          </div>
          <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Talent Pipeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Engage directly with passionate student builders and emerging engineers through workshops and hackathons.</p>
          </div>
          <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Corporate Upskilling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Elevate your team's capabilities with hands-on, scenario-based wargames and technical training cohorts.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
