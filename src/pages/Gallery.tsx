import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Gallery = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: images = [], isLoading, isError } = useQuery({
    queryKey: ["gallery"],
    queryFn: api.gallery,
  });

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + images.length) % images.length);
  };

  return (
    <>
      <SEO 
        title="Gallery - Kunphen Hospital Facilities & Traditional Medicine Photos"
        description="View photos of Kunphen Tibetan Medicine Hospital, our practitioners, herbal medicine preparations, facilities, and traditional healing practices."
        keywords="Kunphen gallery, Tibetan medicine photos, hospital facilities, traditional medicine images, herbal preparation, Kunphen hospital photos"
      />
      <main className="pt-20">
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Gallery
            </h1>
            <div className="tibetan-divider mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Glimpses of life at Kunphen — our healing activities, community events, and the beauty of Tibetan medicine in practice.
            </p>
          </motion.div>

          {isLoading && (
            <p className="text-center text-muted-foreground">Loading gallery…</p>
          )}
          {isError && (
            <p className="text-center text-muted-foreground">Unable to load gallery right now.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setLightbox(i)}
                className="cursor-pointer aspect-square overflow-hidden rounded-lg group"
              >
                <img
                  src={img.image_url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground z-10"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 text-primary-foreground/80 hover:text-primary-foreground z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 text-primary-foreground/80 hover:text-primary-foreground z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <img
                src={images[lightbox].image_url}
                alt={images[lightbox].caption}
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
              <p className="text-center text-primary-foreground/70 text-sm mt-4 font-body">
                {images[lightbox].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </>
  );
};

export default Gallery;
