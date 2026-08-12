import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '@/lib/site';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  /** Emit <meta name="robots" content="noindex, nofollow">. Use on soft-404s. */
  noIndex?: boolean;
}

const SEO = ({
  title = "Kunphen Hospital - Tibetan Medicine & Sowa Rigpa Healing Center",
  description = "Kunphen Tibetan Medicine Hospital offers authentic Sowa Rigpa treatments, herbal medicines, pulse diagnosis, and holistic healing. Book appointments with experienced Tibetan medicine practitioners.",
  keywords = "Kunphen Hospital, Tibetan Medicine, Sowa Rigpa, Traditional Tibetan Medicine, Herbal Medicine, Pulse Diagnosis, Holistic Healing",
  ogImage = `${SITE_URL}/og-image.jpg`,
  canonical,
  noIndex = false,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `${SITE_URL}${location.pathname}`;
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

    // Only touch robots when we explicitly want to hide the page. On indexable
    // pages we leave the rich default directive from index.html untouched.
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonicalUrl);
  }, [title, description, keywords, ogImage, currentUrl, canonicalUrl, noIndex]);

  return null;
};

export default SEO;
