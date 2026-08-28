import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { getStoryBySlug } from '../repositories/repository';
import { Story } from '../models/types';
import { EmptyState } from '../components/ui/EmptyState';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    async function loadStory() {
      if (!slug) return;
      const data = await getStoryBySlug(slug);
      setStory(data);
    }
    loadStory();
  }, [slug]);

  if (!story) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-white">
        <EmptyState
          title="Story Not Found"
          description="The story you requested does not exist or has been archived."
          actionText="Back to Stories"
          onAction={() => navigate('/stories')}
        />
      </div>
    );
  }

  return (
    <article className="pb-20 pt-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white">
      {/* Back Link */}
      <NavLink
        to="/stories"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stories</span>
      </NavLink>

      {/* Header & Meta */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          {story.category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {story.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-2 border-b border-slate-100 pb-4">
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <User className="w-4 h-4 text-indigo-600" />
            {story.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            {story.date}
          </span>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="rounded-2xl overflow-hidden shadow-lg aspect-[16/9] bg-slate-100">
        <img
          src={story.coverImage || '/brandex-full-logo.png'}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Editorial Content Text */}
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 text-base leading-relaxed pt-4">
        <p className="text-lg font-medium text-slate-900 leading-relaxed border-l-4 border-indigo-600 pl-4">
          {story.excerpt}
        </p>
        <p className="whitespace-pre-line">{story.content}</p>
      </div>
    </article>
  );
};
