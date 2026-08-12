const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export interface Medicine {
  id: number;
  name: string;
  tibetan_name: string;
  description: string;
  full_description: string;
  image_url: string;
  uses: string[];
  created_at: string;
  updated_at: string;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image_url: string;
  published_at: string;
}

export interface Article extends ArticleListItem {
  content: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbumImage {
  id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  sort_order: number;
  /** Ordered; the first image is the album cover. Never empty. */
  images: GalleryAlbumImage[];
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  sort_order: number;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json();
}

export const api = {
  medicines: () => get<Medicine[]>("/api/medicines"),
  articles: () => get<ArticleListItem[]>("/api/articles"),
  article: (slug: string) => get<Article>(`/api/articles/${slug}`),
  gallery: () => get<GalleryAlbum[]>("/api/gallery"),
  heroSlides: () => get<HeroSlide[]>("/api/hero-slides"),
};
