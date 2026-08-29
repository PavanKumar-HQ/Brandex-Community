import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RegistrationProvider } from './contexts/RegistrationContext';
import './styles/index.css';

// Automatically clean legacy /admin path from address bar if present
if (window.location.pathname.startsWith('/admin')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/^\/admin/, '') || '/');
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
