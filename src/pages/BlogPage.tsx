import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArrowRight, Clock, User, Calendar, Tag, Search, BookOpen, ChevronRight } from 'lucide-react';
import { getStories } from '../repositories/repository';
import { Story } from '../models/types';

export const BlogPage: React.FC = () => {
  useSEO(
    'Engineering & Community Blog',
    'Official Brandex Blog: Technical deep dives, curriculum case studies, and engineering insights.'
  );

  const [articles, setArticles] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      const data = await getStories();
      setArticles(data);
      setLoading(false);
    }
    loadArticles();
  }, []);

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

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
            
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              Brandex Engineering & Community Blog
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              In-depth technical architecture breakdowns, educational curriculum case studies, and insights written by Brandex instructors, researchers, and students.
            </p>
          </div>
        </div>

        {/* Featured Article Card (Visual Hierarchy) */}
        {!loading && featuredPost && selectedCategory === 'All' && !searchQuery && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
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
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />5 min read</span>
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

        {/* Article Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No articles found</h3>
            <p className="text-xs text-slate-500">We couldn't find any articles matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <NavLink 
                key={post.id} 
                to={`/stories/${post.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-5 flex flex-col h-full space-y-4 relative">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded uppercase tracking-wider self-start group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                    {post.category}
                  </span>
                  
                  <div className="space-y-2 flex-1">
                    <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <User className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}

    </div>
  );
};
