import { useSEO } from '../hooks/useSEO';
import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { FadeIn } from '../components/ui/FadeIn';

export const ContactPage: React.FC = () => {
  useSEO("Get In Touch", "Contact Brandex for educational collaborations, hiring talent, and general inquiries.");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-24 bg-white text-slate-900 min-h-screen">
      
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left side: Info */}
            <div className="space-y-8">
              <div>
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 block">GET IN TOUCH</span>
                <h1 className="text-4xl sm:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]">
                  Start a conversation with Brandex.
                </h1>
                <p className="mt-6 text-xl text-slate-600 leading-relaxed font-medium max-w-lg">
                  Whether you're looking to partner for institutional education, hire talent from our cohorts, or collaborate on tech initiatives—we're ready.
                </p>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Email Us</h3>
                    <p className="text-slate-600 text-sm mt-1">For partnerships and general inquiries.</p>
                    <a href="mailto:brandexhq@gmail.com" className="text-indigo-600 font-bold mt-2 inline-block hover:underline">brandexhq@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Community & WhatsApp</h3>
                    <p className="text-slate-600 text-sm mt-1">Join our open community or contact on WhatsApp.</p>
                    <a href="/community" className="text-blue-600 font-bold mt-2 inline-block hover:underline">View Community Circles</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">HQ Location</h3>
                    <p className="text-slate-600 text-sm mt-1">#121, 13th Main, Binny Layout, Vijaynagar, Bangalore - 560040</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
              <FadeIn>
                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900">Message Sent Successfully!</h3>
                    <p className="text-slate-600 max-w-sm mx-auto">
                      Thank you for reaching out to Brandex. Our team will review your message and get back to you shortly.
                    </p>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="btn-secondary mt-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-6">Send a direct message</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <input required type="text" className="w-full bg-white border border-slate-300 rounded-xl px-4 h-12 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <input required type="email" className="w-full bg-white border border-slate-300 rounded-xl px-4 h-12 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all" placeholder="jane@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inquiry Type</label>
                      <div className="relative">
                        <select required className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 h-12 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all pr-10">
                          <option value="">Select a topic...</option>
                          <option value="partnership">Institutional Partnership</option>
                          <option value="hiring">Hiring Cohort Talent</option>
                          <option value="press">Press / Media</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                      <textarea required rows={4} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none" placeholder="Tell us how we can help..."></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full btn-primary h-14 text-base flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </FadeIn>
              
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3"></div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
};
