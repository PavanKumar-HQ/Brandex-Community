import React, { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { getOrCreateIdentity, addContributorPoints } from '../utils/identity';
import {
  GitFork,
  Star,
  ExternalLink,
  CheckCircle2,
  Code2,
  Filter,
  GitPullRequest,
  AlertCircle,
  ShieldCheck,
  Tag,
  Loader2,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  starsCount: number;
  openIssuesCount: number;
  hasGoodFirstIssues?: boolean;
  category?: 'ai' | 'systems' | 'editorial' | 'all';
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'geniusphere',
    title: 'Geniusphere Agent Engine',
    description: 'Autonomous multi-agent orchestration runtime with deterministic tool-calling, hybrid RAG, and offline token management.',
    repoUrl: 'https://github.com/brandex-community/geniusphere',
    techStack: ['TypeScript', 'Node.js', 'Vector Search', 'LangGraph'],
    starsCount: 342,
    openIssuesCount: 14,
    hasGoodFirstIssues: true,
    category: 'ai'
  },
  {
    id: 'swiss-ui',
    title: 'Swiss Editorial Design System',
    description: 'High-contrast minimalist component library adhering to Swiss grid typography, micro-interactions, and accessible tokens.',
    repoUrl: 'https://github.com/brandex-community/swiss-ui',
    techStack: ['React 19', 'Astro 5', 'Tailwind CSS', 'TypeScript'],
    starsCount: 512,
    openIssuesCount: 8,
    hasGoodFirstIssues: true,
    category: 'editorial'
  },
  {
    id: 'code-audit-agent',
    title: 'Autonomous Code Audit Sandbox',
    description: 'Containerized AST-level vulnerability scanner designed for Go, Rust, and Node.js microservices with automated patch generation.',
    repoUrl: 'https://github.com/brandex-community/code-audit-agent',
    techStack: ['Go 1.22', 'Rust', 'Docker Sandboxes', 'OWASP Rules'],
    starsCount: 289,
    openIssuesCount: 6,
    hasGoodFirstIssues: false,
    category: 'systems'
  }
];

export const ProjectsPage: React.FC = () => {
  useSEO(
    'Open-Source Registry & Contributor Leaderboard',
    'Explore Brandex open-source systems, claim Good First Issues, and verify merged pull requests for verified contributor credentials.'
  );

  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGoodFirstIssuesOnly, setFilterGoodFirstIssuesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // PR Claim Modal State
  const [prClaimOpen, setPrClaimOpen] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('geniusphere');
  const [prUrl, setPrUrl] = useState<string>('');
  const [isVerifyingPr, setIsVerifyingPr] = useState<boolean>(false);
  const [prVerificationResult, setPrVerificationResult] = useState<{
    success: boolean;
    message: string;
    pointsAwarded?: number;
    verified?: boolean;
  } | null>(null);

  const identity = getOrCreateIdentity();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/pwa/projects');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.projects;
          if (Array.isArray(list) && list.length > 0) {
            const enriched = list.map((p: any) => ({
              id: p.id || p.slug,
              title: p.title,
              description: p.description,
              repoUrl: p.repo_url || p.repoUrl || 'https://github.com/brandex-hq',
              techStack: Array.isArray(p.tech_stack) ? p.tech_stack : Array.isArray(p.techStack) ? p.techStack : ['TypeScript'],
              starsCount: p.stars_count ?? p.starsCount ?? 150,
              openIssuesCount: p.open_issues_count ?? p.openIssuesCount ?? 5,
              hasGoodFirstIssues: (p.good_first_issues_count ?? 0) > 0 || true,
              category: ((p.category || '').toLowerCase().includes('design') || (p.slug || '').includes('swiss')
                ? 'editorial'
                : (p.category || '').toLowerCase().includes('systems') || (p.slug || '').includes('audit')
                ? 'systems'
                : 'ai') as 'editorial' | 'systems' | 'ai'
            }));
            setProjects(enriched);
          }
        }
      } catch {
        // Fallback to static seed
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleVerifyPr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prUrl.trim() || !prUrl.includes('github.com')) {
      setPrVerificationResult({
        success: false,
        message: 'Please provide a valid GitHub Pull Request URL (e.g., https://github.com/brandex-community/geniusphere/pull/12)'
      });
      return;
    }

    setIsVerifyingPr(true);
    setPrVerificationResult(null);

    try {
      const res = await fetch('/api/pwa/verify-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prUrl: prUrl.trim(),
          userHandle: identity.handle,
          projectId: selectedProjectId
        })
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        addContributorPoints(50);
        setPrVerificationResult({
          success: true,
          verified: true,
          pointsAwarded: 50,
          message: data.message || 'Pull request verified as merged! +50 Contributor Points awarded to your anonymous handle.'
        });
      } else {
        // If unmerged or mock verification response
        setPrVerificationResult({
          success: false,
          verified: false,
          message: data.message || 'Pull request is either unmerged, closed without merge, or inaccessible via GitHub public API.'
        });
      }
    } catch {
      // Offline fallback verification simulation
      setPrVerificationResult({
        success: false,
        message: 'Could not connect to GitHub API. Please check your internet connection and try again.'
      });
    } finally {
      setIsVerifyingPr(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesGoodFirst = !filterGoodFirstIssuesOnly || p.hasGoodFirstIssues;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesGoodFirst && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-brand-canvas transition-colors pt-24 sm:pt-28 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Open-Source Registry' }
            ]}
          />
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Open-Source Registry & PR Badges
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Inspect Brandex production repositories, claim Good First Issues, and claim verified contributor credentials with public GitHub PR verification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setPrClaimOpen(true);
                setPrVerificationResult(null);
                setPrUrl('');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Submit Merged PR Claim</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'ai', label: 'AI & Agents' },
              { id: 'systems', label: 'Systems & Go/Rust' },
              { id: 'editorial', label: 'Swiss Editorial UI' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === tab.id
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterGoodFirstIssuesOnly}
                onChange={(e) => setFilterGoodFirstIssuesOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Good First Issues Only</span>
            </label>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, repos..."
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-mono font-bold text-sm">
                    {project.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{project.starsCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.openIssuesCount} issues</span>
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {project.hasGoodFirstIssues ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <Tag className="w-3 h-3" />
                    <span>Good First Issues</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Standard Backlog</span>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PR Claim Modal */}
        {prClaimOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Submit Merged PR Claim
                  </h3>
                </div>
                <button
                  onClick={() => setPrClaimOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Enter your merged pull request URL. Brandex backend calls GitHub's public API to verify the merge commit without requiring your OAuth token.
              </p>

              <form onSubmit={handleVerifyPr} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Repository
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Merged Pull Request URL
                  </label>
                  <input
                    type="url"
                    value={prUrl}
                    onChange={(e) => setPrUrl(e.target.value)}
                    placeholder="https://github.com/brandex-community/geniusphere/pull/12"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Your Anonymous Handle
                  </label>
                  <input
                    type="text"
                    disabled
                    value={identity.handle}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs font-mono cursor-not-allowed"
                  />
                </div>

                {prVerificationResult && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                      prVerificationResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {prVerificationResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{prVerificationResult.message}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPrClaimOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifyingPr}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isVerifyingPr ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying GitHub...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Merge Status</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
