import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import { api } from "@/lib/api";

interface Slide {
  src: string;
  title: string;
  subtitle: string;
}

// Shown until the CMS has slides, and whenever the API is unreachable — so the hero
// never renders empty. Kept in sync with scripts.seed_hero_slides in the backend.
const FALLBACK_SLIDES: Slide[] = [
  { src: hero1, title: "Ancient Healing Wisdom", subtitle: "Rooted in centuries of Tibetan medical tradition" },
  { src: hero2, title: "Natural Remedies", subtitle: "Herbal formulations crafted with care and precision" },
  { src: hero3, title: "Expert Practitioners", subtitle: "Guided by experienced Tibetan medicine doctors" },
  { src: hero4, title: "Traditional Medicines", subtitle: "Time-tested herbal compounds for holistic wellness" },
  { src: hero5, title: "Healing Gardens", subtitle: "Where nature and medicine come together" },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const { data } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: api.heroSlides,
  });

  const slides: Slide[] =
    data && data.length > 0
      ? data.map((s) => ({ src: s.image_url, title: s.title, subtitle: s.subtitle }))
      : FALLBACK_SLIDES;

  // The list can change under us (fetch resolves, or an editor removes a slide), so
  // never index past the end — snap back to the first slide when the source changes.
  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  const count = slides.length;
  const index = current % count;

  const next = useCallback(() => setCurrent((p) => p + 1), []);
  const prev = useCallback(() => setCurrent((p) => p - 1 + count), [count]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[index].src}
            alt={slides[index].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/70" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center px-4"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
              {slides[index].title}
            </h1>
            {slides[index].subtitle && (
              <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                {slides[index].subtitle}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-primary-foreground rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-primary-foreground rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? "bg-accent w-8" : "bg-primary-foreground/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
