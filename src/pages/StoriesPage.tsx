import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { getStories } from '../repositories/repository';
import { Story } from '../models/types';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BackButton } from '../components/ui/BackButton';
import { EmptyState } from '../components/ui/EmptyState';

export const StoriesPage: React.FC = () => {
  useSEO("Impact Stories & Blog", "Read tech articles, case studies, and impact stories written by Pavan Kumar.S and Sathvik.N.");
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function loadStories() {
      const data = await getStories();
      setStories(data);
    }
    loadStories();
  }, []);

  const categories = ['All', 'School Impact Story', 'Community Story', 'Achievement Story'];

  const filtered = selectedCategory === 'All'
    ? stories
    : stories.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          Community Stories & Milestones
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
          Brandex Impact Stories
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Real narratives highlighting student accomplishments, faculty innovations, workshop breakthroughs, and community milestones.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No stories found in this category."
          description="Try selecting a different filter."
          actionText="Show All Stories"
          onAction={() => setSelectedCategory('All')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((story) => (
            <NavLink
              key={story.id}
              to={`/stories/${story.slug}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-indigo-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={story.coverImage || '/brandex-full-logo.webp'}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-xs font-semibold bg-slate-900/90 text-white px-2.5 py-1 rounded">
                  {story.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      {story.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {story.date}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-all">
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      )}

    </div>
  );
};
