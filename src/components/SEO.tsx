import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEO = ({ 
  title = "Kunphen Hospital - Tibetan Medicine & Sowa Rigpa Healing Center",
  description = "Kunphen Tibetan Medicine Hospital offers authentic Sowa Rigpa treatments, herbal medicines, pulse diagnosis, and holistic healing. Book appointments with experienced Tibetan medicine practitioners.",
  keywords = "Kunphen Hospital, Tibetan Medicine, Sowa Rigpa, Traditional Tibetan Medicine, Herbal Medicine, Pulse Diagnosis, Holistic Healing",
  ogImage = "https://kunphen.com/og-image.jpg",
  canonical
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `https://kunphen.com${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    document.title = title;
    
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', ogImage, true);
    
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:image', ogImage);

    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);
  }, [title, description, keywords, ogImage, currentUrl, canonicalUrl]);

  return null;
};

export default SEO;
