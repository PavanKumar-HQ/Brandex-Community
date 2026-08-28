import React, { useEffect, useState, useRef } from 'react';
import { Statistic } from '../../models/types';
import { getStatistics } from '../../repositories/repository';
import { Award, Users, Calendar, FolderGit2, Building2, BarChart3 } from 'lucide-react';

interface AnimatedCounterProps {
  endValue: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ endValue, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1200; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = endValue / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) {
              setCount(endValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, hasAnimated]);

  return (
    <span ref={elementRef} className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const ImpactStatisticsSection: React.FC = () => {
  const [stats, setStats] = useState<Statistic[]>([]);

  useEffect(() => {
    async function loadStats() {
      const data = await getStatistics();
      setStats(data);
    }
    loadStats();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 py-8">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
            Verified Community Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Real Numbers & Verified Outcomes
          </h2>
          <p className="text-sm text-slate-600">
            Published platform telemetry representing active student participants, technology circles, and community builds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const icons = [Users, Building2, Calendar, FolderGit2];
            const colors = ['text-blue-600 bg-blue-50', 'text-purple-600 bg-purple-50', 'text-emerald-600 bg-emerald-50', 'text-orange-600 bg-orange-50'];
            const Icon = icons[index % icons.length];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={stat.id}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 hover-lift"
              >
                <div className="flex items-center justify-between">
                  <AnimatedCounter endValue={stat.number} suffix={stat.suffix} />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-black/5 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-sm text-slate-900">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
