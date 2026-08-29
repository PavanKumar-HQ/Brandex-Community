import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageLoadingScreen } from './components/layout/PageLoadingScreen';
import { ThemeProvider } from './contexts/ThemeContext';

// Page Components
import { Home } from './pages/Home';
import { NowPage } from './pages/NowPage';
import { WorkWithBrandexPage } from './pages/WorkWithBrandexPage';
import { CommunityPage } from './pages/CommunityPage';
import { CommunityGuidelinesPage } from './pages/CommunityGuidelinesPage';
import { SearchPage } from './pages/SearchPage';
import { EducationPage } from './pages/EducationPage';
import { TrainingPage } from './pages/TrainingPage';
import { TrainingDetailPage } from './pages/TrainingDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MediaPage } from './pages/MediaPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { BrandAmbassadorPage } from './pages/BrandAmbassadorPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CareersPage } from './pages/CareersPage';
import { RegistrationModal } from './components/ui/RegistrationModal';
import { PersistentJoinCTA } from './components/ui/PersistentJoinCTA';

// Page Transition Wrapper Component
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export const App: React.FC = () => {
  const location = useLocation();

  // Scroll position persistence on navigation & refresh
  useEffect(() => {
    const key = `scrollPosition_${location.pathname}_${location.search}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(saved, 10),
          behavior: 'auto'
        });
      }, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const key = `scrollPosition_${location.pathname}_${location.search}`;
      sessionStorage.setItem(key, window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, location.search]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-indigo-600 selection:text-white font-sans transition-colors duration-300">
        <Navbar />

        <main className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto">
          <Suspense fallback={<PageLoadingScreen />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/now" element={<PageWrapper><NowPage /></PageWrapper>} />
                <Route path="/work-with-us" element={<PageWrapper><WorkWithBrandexPage /></PageWrapper>} />
                <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
                <Route path="/community" element={<PageWrapper><CommunityPage /></PageWrapper>} />
                <Route path="/community/guidelines" element={<PageWrapper><CommunityGuidelinesPage /></PageWrapper>} />
                <Route path="/education" element={<PageWrapper><EducationPage /></PageWrapper>} />
                <Route path="/training" element={<PageWrapper><TrainingPage /></PageWrapper>} />
                <Route path="/training/:slug" element={<PageWrapper><TrainingDetailPage /></PageWrapper>} />
                <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
                <Route path="/events/:slug" element={<PageWrapper><EventDetailPage /></PageWrapper>} />
                <Route path="/media" element={<PageWrapper><MediaPage /></PageWrapper>} />
                <Route path="/media/photos" element={<PageWrapper><MediaPage /></PageWrapper>} />
                <Route path="/stories" element={<PageWrapper><StoriesPage /></PageWrapper>} />
                <Route path="/stories/:slug" element={<PageWrapper><StoryDetailPage /></PageWrapper>} />
                <Route path="/blog" element={<Navigate to="/stories" replace />} />
                <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                <Route path="/ambassador" element={<PageWrapper><BrandAmbassadorPage /></PageWrapper>} />
                <Route path="/careers" element={<PageWrapper><CareersPage /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                {/* Catch-all route */}
                <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        <PersistentJoinCTA />
        <RegistrationModal />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
