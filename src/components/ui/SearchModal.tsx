import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Calendar, BookOpen, FileText, Users, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import {
  getEvents,
  getTrainingPrograms,
  getStories,
  getCommunities,
  getOpportunities
} from '../../repositories/repository';
import { Event, TrainingProgram, Story, Community, Opportunity } from '../../models/types';

interface SearchResultItem {
  id: string;
  title: string;
  type: 'event' | 'training' | 'story' | 'community' | 'opportunity';
  category: string;
  description: string;
  link: string;
  extra?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [events, setEvents] = useState<Event[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    if (isOpen) {
      async function loadAllSearchData() {
        const [ev, tr, st, co, op] = await Promise.all([
          getEvents(),
          getTrainingPrograms(),
          getStories(),
          getCommunities(),
          getOpportunities()
        ]);
        setEvents(ev);
        setTrainings(tr);
        setStories(st);
        setCommunities(co);
        setOpportunities(op);
      }
      loadAllSearchData();
    }
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Search indexing & fuzzy filtering
  const allResults: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    events.forEach(e => {
      items.push({
        id: `evt-${e.id}`,
        title: e.title,
        type: 'event',
        category: e.category,
        description: e.shortDescription || e.description,
        link: `/events/${e.slug}`,
        extra: e.date
      });
    });

    trainings.forEach(t => {
      items.push({
        id: `tr-${t.id}`,
        title: t.title,
        type: 'training',
        category: t.category,
        description: t.shortDescription || t.description,
        link: `/training/${t.slug}`,
        extra: t.level
      });
    });

    stories.forEach(s => {
      items.push({
        id: `st-${s.id}`,
        title: s.title,
        type: 'story',
        category: s.category,
        description: s.excerpt || s.content,
        link: `/stories/${s.slug}`,
        extra: s.author
      });
    });

    communities.forEach(c => {
      items.push({
        id: `comm-${c.id}`,
        title: c.name,
        type: 'community',
        category: c.category,
        description: c.shortDescription || c.description,
        link: `/community`
      });
    });

    opportunities.forEach(o => {
      items.push({
        id: `opp-${o.id}`,
        title: o.title,
        type: 'opportunity',
        category: o.category,
        description: o.description,
        link: o.actionUrl || `/community`,
        extra: o.deadline ? `Deadline: ${o.deadline}` : undefined
      });
    });

    return items;
  }, [events, trainings, stories, communities, opportunities]);

  const filteredResults = useMemo(() => {
    let list = allResults;
    if (activeFilter !== 'all') {
      list = list.filter(item => item.type === activeFilter);
    }

    const q = query.trim().toLowerCase();
    if (!q) return list.slice(0, 8); // return top default items

    return list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }, [allResults, activeFilter, query]);

  if (!isOpen) return null;

  const handleSelect = (link: string) => {
    onClose();
    navigate(link);
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'training': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'story': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'community': return <Users className="w-4 h-4 text-emerald-600" />;
      case 'opportunity': return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, syllabus tracks, stories, circles, or opportunities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { key: 'all', label: 'All Results' },
            { key: 'event', label: 'Events' },
            { key: 'training', label: 'Training' },
            { key: 'story', label: 'Stories' },
            { key: 'community', label: 'Communities' },
            { key: 'opportunity', label: 'Opportunities' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                activeFilter === f.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-1.5 flex-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No matching items found for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching for "Geniusphere", "AI", "Cybersecurity", or "Summit".</p>
            </div>
          ) : (
            filteredResults.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.link)}
                className="p-3.5 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-slate-100 group-hover:bg-white rounded-xl shrink-0 mt-0.5 border border-slate-200/60 shadow-xs transition-colors">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {item.type}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 truncate">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-center">
                  {item.extra && (
                    <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">
                      {item.extra}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Search across all active programs & circles</span>
          <span className="font-semibold text-indigo-600">{filteredResults.length} Result(s)</span>
        </div>
      </div>
    </div>
  );
};
