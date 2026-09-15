import React, { useState } from 'react';
import { X, Send, CheckCircle2, Copy, Check, ArrowRight, Loader2, Briefcase, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface CareerApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (refCode: string) => void;
}

export const CareerApplyModal: React.FC<CareerApplyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [focusArea, setFocusArea] = useState('AI Engineering & Systems');
  const [links, setLinks] = useState('');
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !pitch.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, and Background/Pitch).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/pwa/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userHandle: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          type: 'careers',
          name: name.trim(),
          email: email.trim().toLowerCase(),
          organization: 'Independent Candidate',
          domains: [focusArea],
          experienceLevel: 'Talent Pool Candidate',
          contributions: JSON.stringify(['General Application', links]),
          focusAreas: JSON.stringify([focusArea, links]),
          projectIdea: pitch.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const refCode = data.applicationId || data.id;
        setCreatedRef(refCode);

        // Save to local recent references
        try {
          const recent = JSON.parse(localStorage.getItem('brandex_recent_refs') || '[]');
          if (!recent.includes(refCode)) {
            localStorage.setItem('brandex_recent_refs', JSON.stringify([refCode, ...recent]));
          }
        } catch {}

        if (onSuccess) onSuccess(refCode);
      } else {
        setErrorMsg(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setErrorMsg('Network error connecting to admissions server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (createdRef) {
      navigator.clipboard.writeText(createdRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {createdRef ? 'Candidacy Submitted' : 'Submit Candidacy / Resume'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {createdRef ? 'Receipt generated for status tracking' : 'Direct admission into the Brandex talent pipeline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {createdRef ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Application Successfully Registered
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Your profile has been queued directly into the persistent admissions database and synced to our CRM.
                </p>
              </div>

              {/* Unique Ref Number Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Deterministic Unique Reference Number
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                    {createdRef}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <NavLink
                  to={`/status?id=${createdRef}`}
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Track Status Live</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
                <button
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Focus Area / Domain
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AI Engineering & Systems">AI Engineering & Systems</option>
                  <option value="Full-Stack & Distributed Systems">Full-Stack & Distributed Systems</option>
                  <option value="Cybersecurity & Defense">Cybersecurity & Defense</option>
                  <option value="Campus Ambassador / Fellow">Campus Ambassador / Fellow</option>
                  <option value="Swiss Editorial UX & Design">Swiss Editorial UX & Design</option>
                  <option value="Community & Education Growth">Community & Education Growth</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  GitHub / Portfolio / LinkedIn URL
                </label>
                <input
                  type="url"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="https://github.com/username or portfolio link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Brief Background & What You Build *
                </label>
                <textarea
                  required
                  rows={3}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Summarize your engineering background, top projects, and what you would like to build with Brandex."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{submitting ? 'Registering...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
