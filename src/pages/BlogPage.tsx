import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';

const blogPosts = [
  {
    id: '1',
    title: 'The Future of Zero-Trust Architecture in Educational Institutions',
    excerpt: 'Exploring how modern educational platforms are adopting zero-trust frameworks to protect student data and research IP.',
    author: 'Elena Rodriguez',
    date: 'August 24, 2026',
    readTime: '6 min read',
    category: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    slug: 'zero-trust-education'
  },
  {
    id: '2',
    title: 'Why We Open-Sourced the Geniusphere Curriculum',
    excerpt: 'Our mission to democratize technology education means breaking down the walls of proprietary curricula. Here is why we made the leap.',
    author: 'David Chen',
    date: 'August 18, 2026',
    readTime: '4 min read',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    slug: 'open-source-curriculum'
  },
  {
    id: '3',
    title: 'Building High-Concurrency Systems with Rust and WebAssembly',
    excerpt: 'A deep dive into the architecture behind our new interactive coding labs and how we scaled them to support thousands of concurrent students.',
    author: 'Sarah Jenkins',
    date: 'August 10, 2026',
    readTime: '12 min read',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    slug: 'rust-wasm-concurrency'
  }
];

export const BlogPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-24 sm:pt-28 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      
      <PageHero 
        tag="Engineering & Community Blog"
        title="Insights from the Brandex Ecosystem"
        description="Technical deep dives, community announcements, and thoughts on the future of technology education."
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
            {/* Image */}
            <div className="w-full h-48 overflow-hidden bg-slate-100">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                {post.title}
              </h2>
              
              <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{post.author}</span>
                    <span className="text-[10px] text-slate-500">{post.date}</span>
                  </div>
                </div>
                
                <NavLink to={`/blog`} className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
};
