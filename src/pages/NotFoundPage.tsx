import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { BackButton } from '../components/ui/BackButton';
import { FadeIn } from '../components/ui/FadeIn';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-32 bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center">
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <FadeIn>
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black text-slate-900 tracking-tight leading-[1.1]">
              404. Page Not Found.
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed font-medium">
              We couldn't find the page you were looking for. It might have been moved or doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <BackButton />
              <NavLink to="/" className="btn-primary px-8 py-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>Return to Home</span>
              </NavLink>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
