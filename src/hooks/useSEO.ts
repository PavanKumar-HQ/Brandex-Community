import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'event';
}

export const useSEO = (
  title: string,
  description: string,
  options?: { image?: string; type?: 'website' | 'article' | 'event' }
) => {
  useEffect(() => {
    const fullTitle = `${title} | Brandex Community`;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Description
    setMetaTag('name', 'description', description);

    // Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', options?.type || 'website');
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:image', options?.image || `${window.location.origin}/brandex-full-logo.png`);
    setMetaTag('property', 'og:site_name', 'Brandex Community');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', options?.image || `${window.location.origin}/brandex-full-logo.png`);
  }, [title, description, options?.image, options?.type]);
};
