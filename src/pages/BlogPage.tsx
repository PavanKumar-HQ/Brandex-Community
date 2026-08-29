import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArrowRight, Clock, User, Calendar, Tag, Search, BookOpen, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

const articles: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Zero-Trust Architecture in Educational Institutions',
    slug: 'zero-trust-education',
    excerpt: 'Exploring how modern educational platforms and campus networks are adopting zero-trust frameworks to protect student data and research intellectual property.',
    author: 'Elena Rodriguez',
    date: 'August 24, 2026',
    readTime: '6 min read',
    category: 'Cybersecurity',
    featured: true,
  },
  {
    id: '2',
    title: 'Why We Open-Sourced the Geniusphere Curriculum for Schools',
    slug: 'open-source-curriculum',
    excerpt: 'Our mission to democratize technology education means breaking down the walls of proprietary curricula. Here is why we made the leap to open-access courseware.',
    author: 'David Chen',
    date: 'August 18, 2026',
    readTime: '4 min read',
    category: 'Community',
    featured: false,
  },
  {
    id: '3',
    title: 'Building High-Concurrency Systems with Rust and WebAssembly',
    slug: 'rust-wasm-concurrency',
    excerpt: 'A technical deep dive into the architecture behind our interactive coding labs and how we scaled them to support concurrent build sessions with low latency.',
    author: 'Sarah Jenkins',
    date: 'August 10, 2026',
    readTime: '12 min read',
    category: 'Engineering',
    featured: false,
  },
  {
    id: '4',
    title: 'Autonomous AI Agents: Structuring Production Evaluation Loops',
    slug: 'autonomous-ai-agents-eval',
    excerpt: 'How our AI cohort teams construct rigorous deterministic benchmarking pipelines for autonomous multi-agent task execution.',
    author: 'Pavan Kumar.S',
    date: 'August 02, 2026',
    readTime: '8 min read',
    category: 'Artificial Intelligence',
    featured: false,
  },
  {
    id: '5',
    title: 'Swiss Typography and Information Hierarchy in Developer Tooling',
    slug: 'swiss-typography-dev-tools',
    excerpt: 'Applying classical international typographic principles to modern technical interfaces to improve developer cognitive load and readability.',
    author: 'Sathvik.N',
    date: 'July 28, 2026',
    readTime: '5 min read',
    category: 'Design & UX',
    featured: false,
  }
];

export const BlogPage: React.FC = () => {
  useSEO(
    'Engineering & Community Blog',
    'Official Brandex Blog: Technical deep dives, curriculum case studies, and engineering insights on AI, Cybersecurity, Systems, and Swiss UX.'
  );

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Artificial Intelligence', 'Cybersecurity', 'Engineering', 'Community', 'Design & UX'];

  const filtered = articles.filter(post => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featuredPost = articles.find(a => a.featured) || articles[0];

  return (
    <div className="w-full space-y-10 pb-20 pt-20 sm:pt-24 px-4 sm:px-8 lg:px-12 xl:px-16 bg-white text-slate-900 font-sans">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Breadcrumb items={[{ label: 'Blog & Articles' }]} />
          
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <span>Articles & Research</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
              Brandex Engineering & Community Blog
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              In-depth technical architecture breakdowns, educational curriculum case studies, and insights written by Brandex instructors, researchers, and students.
            </p>
          </div>
        </div>

        {/* Featured Article Card (Visual Hierarchy) */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Featured Article</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                {featuredPost.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                <NavLink to={`/stories/${featuredPost.slug}`}>{featuredPost.title}</NavLink>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" />{featuredPost.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{featuredPost.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{featuredPost.readTime}</span>
              </div>
              <NavLink
                to={`/stories/${featuredPost.slug}`}
                className="btn-primary text-xs px-4 py-2"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <NavLink
              key={post.id}
              to={`/stories/${post.slug}`}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{post.author} • {post.date}</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </NavLink>
          ))}
        </div>

    </div>
  );
};
