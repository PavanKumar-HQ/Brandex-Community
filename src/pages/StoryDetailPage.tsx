import React, { useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, User, Share2, Linkedin, Mail, BookOpen } from 'lucide-react';
import { getStoryBySlug, getStories } from '../repositories/repository';
import { Story } from '../models/types';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [recommendations, setRecommendations] = useState<Story[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoryAndRecommendations() {
      if (!slug) return;
      setLoading(true);
      const data = await getStoryBySlug(slug);
      setStory(data);

      const allStories = await getStories();
      // Filter out current story and take top 2 for recommendation
      const filtered = allStories.filter(s => s.slug !== slug).slice(0, 2);
      setRecommendations(filtered);
      setLoading(false);
    }
    loadStoryAndRecommendations();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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

  // Author details mapping
  const isPavan = story.author.includes('Pavan');
  const authorInfo = isPavan 
    ? {
        name: 'Pavan Kumar.S',
        role: 'Co-founder & CEO, Brandex',
        bio: 'Driving platform engineering and AI systems at Brandex. Focused on bridging the gap between classroom theory and real-world execution.',
        linkedin: 'https://www.linkedin.com/in/pavankumarofficialcareers/',
        avatar: '/brandex-dp.webp'
      }
    : {
        name: 'Sathvik.N',
        role: 'Founder & CTO, Brandex',
        bio: 'Pioneering technology education initiatives, wargames, and CTFs. Lead builder of the open-sourced Geniusphere workshop curriculum.',
        linkedin: 'https://www.linkedin.com/in/sathvik-nagesh/',
        avatar: '/brandex-dp.webp'
      };

  return (
    <div className="pb-20 pt-24 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Stories', path: '/stories' }, { label: story.title }]} />

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Article Content */}
        <article className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
              {story.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-[1.1]">
              {story.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-2 border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <User className="w-4 h-4 text-indigo-600" />
                {authorInfo.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {story.date}
              </span>
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/9] bg-slate-100 border border-slate-100">
            <img
              src={story.coverImage || '/brandex-full-logo.webp'}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Editorial Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed pt-2 space-y-6">
            <p className="text-base font-semibold text-slate-800 leading-relaxed bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              {story.excerpt}
            </p>
            <p className="whitespace-pre-line text-slate-600">{story.content}</p>
          </div>
        </article>

        {/* Right Column: Sticky Author Details Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="border border-slate-200/80 bg-slate-50/50 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
              ABOUT THE AUTHOR
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-xl overflow-hidden shadow shrink-0 border border-slate-800">
                <img src={authorInfo.avatar} alt={authorInfo.name} className="w-full h-full object-cover p-1 bg-slate-950" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-slate-900">{authorInfo.name}</h4>
                <p className="text-xs text-indigo-600 font-semibold">{authorInfo.role}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {authorInfo.bio}
            </p>

            <div className="pt-2 flex gap-3 text-slate-500 border-t border-slate-200/60">
              <a 
                href={authorInfo.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-xs font-bold text-slate-700 shadow-sm"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a 
                href="mailto:contact@brandex.co.in" 
                className="flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all text-slate-700 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Recommended Reads section */}
      {recommendations.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200 space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Recommended Reading</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <NavLink 
                key={rec.id} 
                to={`/stories/${rec.slug}`}
                className="flex gap-4 p-4 border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl bg-slate-50/20 transition-all group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={rec.coverImage} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{rec.category}</span>
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-tight">{rec.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{rec.date}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
