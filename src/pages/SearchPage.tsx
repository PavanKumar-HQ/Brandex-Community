import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { PageHero } from '../components/ui/PageHero';
import { Search, Filter, Calendar, BookOpen, FileText, Users, ArrowRight } from 'lucide-react';
import {
  getEvents,
  getTrainingPrograms,
  getStories,
  getCommunities,
  getOpportunities
} from '../repositories/repository';
import { Event, TrainingProgram, Story, Community, Opportunity } from '../models/types';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useSEO(
    'Global Search — Discover Brandex Programs',
    'Search across all Brandex educational tracks, summit events, community circles, and student opportunities.'
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    async function loadSearchData() {
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
    loadSearchData();
  }, []);

  const allItems = useMemo(() => {
    const list: any[] = [];
    events.forEach(e => list.push({ ...e, searchType: 'event', searchLink: `/events/${e.slug}` }));
    trainings.forEach(t => list.push({ ...t, searchType: 'training', searchLink: `/training/${t.slug}` }));
    stories.forEach(s => list.push({ ...s, searchType: 'story', searchLink: `/stories/${s.slug}` }));
    communities.forEach(c => list.push({ ...c, searchType: 'community', searchLink: `/community` }));
    opportunities.forEach(o => list.push({ ...o, searchType: 'opportunity', searchLink: o.actionUrl || '/community' }));
    return list;
  }, [events, trainings, stories, communities, opportunities]);

  const filtered = useMemo(() => {
    let results = allItems;
    if (activeFilter !== 'all') {
      results = results.filter(item => item.searchType === activeFilter);
    }
    const q = query.trim().toLowerCase();
    if (!q) return results;
    return results.filter(item => {
      const title = item.title || item.name || '';
      const desc = item.shortDescription || item.description || item.excerpt || '';
      const cat = item.category || '';
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );
    });
  }, [allItems, activeFilter, query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  return (
    <div className="space-y-8 pb-20 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <Breadcrumb items={[{ label: 'Global Search' }]} />

      <PageHero
        tag="GLOBAL DIRECTORY SEARCH"
        title="Search the Brandex Ecosystem"
        description="Find events, curriculum modules, community domain circles, student stories, and open volunteer opportunities."
        widgetTitle="Search.Engine"
        widgetStatLabel="Total Indexed Items"
        widgetStatValue={`${allItems.length} Records`}
        widgetStatusLabel="Search Engine"
        widgetStatusText="Instant Client Indexing"
      />

      {/* Search Input Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords (e.g. AI models, CTF wargames, Geniusphere, workshops, ambassador)..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">Filter:</span>
          {[
            { key: 'all', label: `All (${allItems.length})` },
            { key: 'event', label: `Events (${events.length})` },
            { key: 'training', label: `Training (${trainings.length})` },
            { key: 'story', label: `Stories (${stories.length})` },
            { key: 'community', label: `Communities (${communities.length})` },
            { key: 'opportunity', label: `Opportunities (${opportunities.length})` }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
          <span>Showing {filtered.length} matching result(s)</span>
          {query && <span>Query: <strong className="text-indigo-600 font-bold">"{query}"</strong></span>}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 bg-slate-50 border border-slate-200 rounded-3xl">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-display font-bold text-base text-slate-800">No results found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find matches for your search. Try broadening your terms or resetting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {item.searchType}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 line-clamp-2">
                    {item.title || item.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.shortDescription || item.description || item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <NavLink
                    to={item.searchLink}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 inline-flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
