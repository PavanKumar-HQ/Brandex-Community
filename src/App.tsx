import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageLoadingScreen } from './components/layout/PageLoadingScreen';

// Lazy Loaded Page Components
import { Home } from './pages/Home';
import { CommunityPage } from './pages/CommunityPage';
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
import { JoinPage } from './pages/JoinPage';
import { AppDashboardPage } from './pages/AppDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-600 selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Suspense fallback={<PageLoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/community" element={<PageWrapper><CommunityPage /></PageWrapper>} />
              <Route path="/education" element={<PageWrapper><EducationPage /></PageWrapper>} />
              <Route path="/training" element={<PageWrapper><TrainingPage /></PageWrapper>} />
              <Route path="/training/:slug" element={<PageWrapper><TrainingDetailPage /></PageWrapper>} />
              <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
              <Route path="/events/:slug" element={<PageWrapper><EventDetailPage /></PageWrapper>} />
              <Route path="/media" element={<PageWrapper><MediaPage /></PageWrapper>} />
              <Route path="/media/photos" element={<PageWrapper><MediaPage /></PageWrapper>} />
              <Route path="/stories" element={<PageWrapper><StoriesPage /></PageWrapper>} />
              <Route path="/stories/:slug" element={<PageWrapper><StoryDetailPage /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
              <Route path="/join" element={<PageWrapper><JoinPage /></PageWrapper>} />
              <Route path="/app/dashboard" element={<PageWrapper><AppDashboardPage /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><AdminDashboardPage /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
