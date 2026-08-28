import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';

export const JoinPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'community'; // 'community' or 'enroll'

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    selections: [] as string[],
    otherSelectionText: '',
    experienceLevel: 'Intermediate',
    goals: [] as string[],
    otherGoalText: '',
  });

  // Dynamic context based on type
  const isEnroll = type === 'enroll';
  const pageTitle = isEnroll ? 'Enroll in Brandex Education' : 'Join the Brandex Ecosystem';
  const pageDesc = isEnroll 
    ? 'Register for upcoming cohort-based courses, masterclasses, and specialized training tracks.' 
    : 'Tell us about your technical background and interest areas. Complete this brief onboarding application to join community channels and cohort registrations.';
  
  const selectionTitle = isEnroll ? '02. Course Interest' : '02. Domains of Interest';
  const selectionDesc = isEnroll ? 'Select the programs you want to enroll in:' : 'Select the technology disciplines you want to explore:';
  const availableSelections = isEnroll 
    ? ['AI Engineering Cohort', 'Cybersecurity Foundation', 'Advanced System Design', 'UX/UI Mastery', 'Other']
    : ['Artificial Intelligence', 'Cybersecurity & Defense', 'Distributed Systems', 'Swiss Editorial UX & Design', 'Other'];

  const availableGoals = [
    'Develop Practical Technical Skills',
    'Participate in Live Summits & Hackathons',
    'Connect & Network with High-Impact Peers',
    'Other'
  ];

  // Reset step if type changes
  useEffect(() => {
    setStep(1);
    setFormData(prev => ({...prev, selections: [], goals: []}));
  }, [type]);

  const toggleSelection = (sel: string) => {
    if (formData.selections.includes(sel)) {
      setFormData({ ...formData, selections: formData.selections.filter(s => s !== sel) });
    } else {
      setFormData({ ...formData, selections: [...formData.selections, sel] });
    }
  };

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
    } else {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setErrorMsg('Please provide both your name and email address to proceed.');
        return;
      }
    }
    if (step === 2) {
      if (formData.selections.length === 0) {
        setErrorMsg('Please select at least one option.');
        return;
      }
      if (formData.selections.includes('Other') && !formData.otherSelectionText.trim()) {
        setErrorMsg('Please specify your "Other" selection.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.goals.includes('Other') && !formData.otherGoalText.trim()) {
      setErrorMsg('Please specify your "Other" goal.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const resetForm = () => {
    setStep(1);
    setIsSuccess(false);
    setFormData({
      name: '', email: '', organization: '', selections: [], otherSelectionText: '', experienceLevel: 'Intermediate', goals: [], otherGoalText: '',
    });
  };

  return (
    <div className="space-y-12 pb-20 pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 max-w-[1400px] mx-auto bg-white text-slate-900 font-sans">
      
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 mix-blend-screen pointer-events-none"></div>
        <span className="relative z-10 inline-block px-3 py-1 bg-white/10 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-md">
          {isEnroll ? 'Program Registration' : 'Membership Onboarding'}
        </span>
        <h1 className="relative z-10 text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          {pageTitle}
        </h1>
        <p className="relative z-10 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {pageDesc}
        </p>
      </div>

      {/* Main Wizard Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        {!isSuccess && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>STEP 0{step} OF 04</span>
              <span>{step === 1 ? 'PERSONAL DETAILS' : step === 2 ? 'SELECTIONS' : step === 3 ? 'EXPERIENCE' : 'GOALS'}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            {errorMsg}
          </div>
        )}

        {isSuccess ? (
          /* Success View */
          <div className="py-12 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-bold text-3xl text-slate-900">
                Application Received
              </h2>
              <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. We've sent the details to <span className="text-indigo-600 font-semibold">{formData.email}</span>.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <NavLink to="/app/dashboard" className="btn-primary">
                Go to Member Portal
              </NavLink>
              <button onClick={resetForm} className="btn-secondary">
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          /* Form Steps */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
                  01. Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Maya Lin" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="maya@example.org" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization / School (Optional)</label>
                    <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} placeholder="e.g. University of Tech" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Selections */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
                  {selectionTitle}
                </h3>
                <p className="text-sm text-slate-600">{selectionDesc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSelections.map((sel) => {
                    const isSelected = formData.selections.includes(sel);
                    return (
                      <button type="button" key={sel} onClick={() => toggleSelection(sel)} className={`p-4 text-left text-sm font-semibold rounded-xl border transition-all flex items-center justify-between hover-lift ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 text-slate-800 bg-slate-50 hover:border-indigo-300'}`}>
                        <span>{sel}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
                
                {/* Dynamic Text Input for "Other" */}
                {formData.selections.includes('Other') && (
                  <div className="pt-2 animate-fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Please specify:</label>
                    <input type="text" value={formData.otherSelectionText} onChange={(e) => setFormData({ ...formData, otherSelectionText: e.target.value })} placeholder="Type your specific interest..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Experience */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
                  03. Experience Level
                </h3>
                <div className="space-y-3">
                  {[
                    { level: 'Beginner', desc: 'Starting out in technology programming or design.' },
                    { level: 'Intermediate', desc: 'Active developer/researcher with 1-3 years experience.' },
                    { level: 'Advanced', desc: 'Senior engineer, team lead, or published researcher.' },
                  ].map((item) => (
                    <button type="button" key={item.level} onClick={() => setFormData({ ...formData, experienceLevel: item.level })} className={`w-full p-4 text-left border rounded-xl transition-all hover-lift ${formData.experienceLevel === item.level ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold shadow-md' : 'border-slate-200 text-slate-800 bg-slate-50 hover:border-indigo-300'}`}>
                      <div className="font-display font-bold text-lg text-slate-900">{item.level}</div>
                      <div className="text-sm text-slate-600 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Goals */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-display font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
                  04. Goals & Intent
                </h3>
                <div className="space-y-3">
                  {availableGoals.map((goal) => {
                    const isSelected = formData.goals.includes(goal);
                    return (
                      <button type="button" key={goal} onClick={() => toggleGoal(goal)} className={`w-full p-4 text-left text-sm font-semibold rounded-xl border transition-all hover-lift flex items-center justify-between ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 text-slate-800 bg-slate-50 hover:border-indigo-300'}`}>
                        <span>{goal}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>
                
                {/* Dynamic Text Input for "Other" Goal */}
                {formData.goals.includes('Other') && (
                  <div className="pt-2 animate-fade-in">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Please specify your goal:</label>
                    <input type="text" value={formData.otherGoalText} onChange={(e) => setFormData({ ...formData, otherGoalText: e.target.value })} placeholder="What are you hoping to achieve?" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {/* Controls Footer */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="btn-secondary">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button type="button" onClick={handleNext} className="btn-primary">
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <><span>Submit Request</span><ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
