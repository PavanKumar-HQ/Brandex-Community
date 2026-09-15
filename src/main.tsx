import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RegistrationProvider } from './contexts/RegistrationContext';
import './styles/index.css';

import { syncOfflineQueue } from './utils/offlineDb';

// Automatically clean legacy /admin path from address bar if present
if (window.location.pathname.startsWith('/admin')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/^\/admin/, '') || '/');
}

// Register PWA Service Worker & Purge Stale Caches
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Purge any legacy v1 cache immediately
  if ('caches' in window) {
    caches.delete('brandex-cache-v1').catch(() => {});
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.update();
        // Initial sync check on page load if online
        if (navigator.onLine) {
          syncOfflineQueue();
        }
      })
      .catch((err) => console.debug('SW registration error:', err));
  });

  // Re-sync whenever network connectivity is restored
  window.addEventListener('online', () => {
    syncOfflineQueue();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RegistrationProvider>
        <App />
      </RegistrationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
