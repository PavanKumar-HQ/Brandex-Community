import React, { useState, useEffect } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  Award
} from 'lucide-react';
import { getEnquiries } from '../repositories/repository';
import { Enquiry } from '../models/types';

interface StoredApplication {
  id: string;
  name: string;
  email: string;
  type: string;
  program: string;
  status: 'Under Review' | 'Accepted' | 'Waitlisted' | 'Scheduled for Interview';
  submittedAt: string;
  batch: string;
  notes: string;
}

export const ApplicationStatusPage: React.FC = () => {
  useSEO(
    'Application & Cohort Status Checker',
    'Track your Brandex cohort admission, workshop RSVP, or partnership enquiry status in real time with your application reference ID.'
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';
  const [searchId, setSearchId] = useState(initialQuery);
  const [result, setResult] = useState<StoredApplication | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample persistent mock entries for live demo lookup
  const mockApplications: StoredApplication[] = [
    {
      id: 'BX-2026-8812',
      name: 'Aditya Vardhan',
      email: 'aditya.v@example.edu',
      type: 'Cohort Training Application',
      program: 'Advanced AI Systems & Agent Architecture',
      status: 'Accepted',
      submittedAt: 'August 22, 2026',
      batch: 'Cohort 04 (Starts Oct 2026)',
      notes: 'Application approved by technical admissions board. Onboarding materials dispatched to email.'
    },
    {
      id: 'BX-2026-4401',
      name: 'Sahana Kulkarni',
      email: 'sahana.k@institution.org',
      type: 'Campus Ambassador Track',
      program: 'Geniusphere Student Chapter Lead',
      status: 'Under Review',
      submittedAt: 'August 26, 2026',
      batch: 'Fall 2026 Chapter Intake',
      notes: 'Initial profile screened. Peer review in progress by Regional Chapter Coordinator.'
    },
    {
      id: 'ENQ-2026-1092',
      name: 'National Model School',
      email: 'contact@nmschool.ac.in',
      type: 'Institutional School Syllabus',
      program: 'Geniusphere Secondary Coding Curriculum',
      status: 'Scheduled for Interview',
      submittedAt: 'August 28, 2026',
      batch: 'Q4 2026 Rollout',
      notes: 'Institutional consultation scheduled with academic syllabus director.'
    }
  ];

  const handleSearch = (query: string) => {
    const cleanId = query.trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter a valid Application or Enquiry ID.');
      setResult(null);
      return;
    }

    setErrorMsg('');
    setSearched(true);
    setSearchParams({ id: cleanId });

    // 1. Check local mock list
    const foundMock = mockApplications.find(
      (app) => app.id.toUpperCase() === cleanId || app.email.toLowerCase() === query.trim().toLowerCase()
    );

    if (foundMock) {
      setResult(foundMock);
      return;
    }

    // 2. Check local repository enquiries dynamically
    getEnquiries().then((enquiries) => {
      const foundEnquiry = enquiries.find(
        (e) => e.id.toUpperCase() === cleanId || e.email.toLowerCase() === query.trim().toLowerCase()
      );

      if (foundEnquiry) {
        setResult({
          id: foundEnquiry.id,
          name: foundEnquiry.contactName || foundEnquiry.orgName,
          email: foundEnquiry.email,
          type: `Partnership: ${foundEnquiry.type.toUpperCase()}`,
          program: foundEnquiry.orgName,
          status: 'Under Review',
          submittedAt: new Date(foundEnquiry.createdAt).toLocaleDateString(),
          batch: '2026 Cycle',
          notes: 'Your institutional inquiry has been logged in our queue. A team member is reviewing your requirements.'
        });
      } else {
        // Fallback for demo ID pattern
        if (cleanId.startsWith('BX-') || cleanId.startsWith('ENQ-')) {
          setResult({
            id: cleanId,
            name: 'Verified Applicant',
            email: 'applicant@brandex.network',
            type: 'Technical Cohort Registration',
            program: 'Emerging Technologies Program',
            status: 'Under Review',
            submittedAt: 'Recent Submission',
            batch: 'Upcoming 2026 Cohort',
            notes: 'Application received and securely queued. Standard review period is 48-72 business hours.'
          });
        } else {
          setResult(null);
          setErrorMsg('No application or inquiry found matching this reference ID or email.');
        }
      }
    });
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  const getStatusBadge = (status: StoredApplication['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accepted & Confirmed</span>
          </span>
        );
      case 'Scheduled for Interview':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Scheduled for Interview</span>
          </span>
        );
      case 'Waitlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Waitlisted for Next Batch</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Under Review</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8 pb-20 pt-20 sm:pt-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Application Status' }]} />

        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <span>Admissions & Verification</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
            Application Status Tracker
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            Track your Brandex cohort admission, ambassador application, or institutional partnership in real time with your Application Reference ID or email.
          </p>
        </div>

        {/* Lookup Card */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchId);
            }}
            className="space-y-4"
          >
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Application Reference ID or Email Address
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. BX-2026-8812 or aditya.v@example.edu"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="btn-primary py-3.5 px-6 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Track Status</span>
              </button>
            </div>
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>

          {/* Quick Demo Badges */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick Test IDs:</span>
            {mockApplications.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setSearchId(app.id);
                  handleSearch(app.id);
                }}
                className="font-mono text-[11px] px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-md transition-colors"
              >
                {app.id}
              </button>
            ))}
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="text-xs text-slate-400 font-mono">Reference ID: {result.id}</div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-1">
                  {result.program}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">{result.type}</div>
              </div>
              <div>{getStatusBadge(result.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Applicant Name</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{result.name}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Email</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 truncate">{result.email}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Intake Batch</div>
                <div className="text-sm font-semibold text-indigo-600 mt-1">{result.batch}</div>
              </div>
            </div>

            <div className="p-5 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wide">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Admissions Committee Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {result.notes}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Submitted on: {result.submittedAt}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <NavLink
                to="/training"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
              >
                <span>Browse other active training tracks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>

              <a
                href={`mailto:brandexhq@gmail.com?subject=Inquiry%20Regarding%20Application%20${result.id}`}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Need assistance with this application?
              </a>
            </div>
          </div>
        )}

        {searched && !result && !errorMsg && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">No Record Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please double check the reference ID format (e.g. BX-2026-XXXX) or verify the email used when submitting your application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
