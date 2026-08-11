import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface LightboxState {
  album: number;
  image: number;
}

const Gallery = () => {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const { data: albums = [], isLoading, isError } = useQuery({
    queryKey: ["gallery"],
    queryFn: api.gallery,
  });

  const openAlbum = albums[lightbox?.album ?? -1];
  // A refetch can shrink the data while the viewer is open, so never index blindly.
  const openImage = openAlbum?.images[lightbox?.image ?? -1];
  const isOpen = openImage !== undefined;

  const navigate = useCallback(
    (dir: number) => {
      setLightbox((prev) => {
        if (prev === null) return prev;
        const count = albums[prev.album]?.images.length ?? 0;
        if (count === 0) return null;
        return { ...prev, image: (prev.image + dir + count) % count };
      });
    },
    [albums]
  );

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, navigate]);

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
            {albums.map((album, i) => {
              const cover = album.images[0];
              const count = album.images.length;
              if (!cover) return null;

              return (
                <motion.button
                  key={album.id}
                  type="button"
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setLightbox({ album: i, image: 0 })}
                  aria-label={
                    count > 1
                      ? `${album.title || "Album"} — ${count} photos`
                      : album.title || "Photo"
                  }
                  className="relative block w-full text-left pt-2 group"
                >
                  {/* Offset card edges peeking out behind the cover, so an album reads
                      as a set of photos rather than a single one. */}
                  {count > 1 && (
                    <>
                      <span
                        aria-hidden
                        className="absolute inset-x-4 top-0 h-2 rounded-t-md bg-card/70 border border-b-0 border-border"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-2 top-1 h-2 rounded-t-md bg-card border border-b-0 border-border"
                      />
                    </>
                  )}

                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={cover.image_url}
                      alt={album.title || cover.caption}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {album.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent pt-8 px-3 pb-2.5">
                        <p className="text-primary-foreground text-sm font-medium line-clamp-2">
                          {album.title}
                        </p>
                      </div>
                    )}

                    {count > 1 && (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-foreground/70 backdrop-blur-sm px-2 py-1 text-xs font-medium text-primary-foreground">
                        <Images className="w-3 h-3" />
                        {count}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={openAlbum.title || "Gallery image"}
            className="fixed inset-0 z-[60] bg-foreground/95 overflow-y-auto"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground z-10"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="min-h-full mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center gap-6 p-4 pt-16 lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image pane */}
              <div className="relative flex-1 flex items-center justify-center min-w-0">
                {openAlbum.images.length > 1 && (
                  <>
                    <button
                      onClick={() => navigate(-1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-primary-foreground transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <button
                      onClick={() => navigate(1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-primary-foreground transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                  </>
                )}

                <motion.img
                  key={`${openAlbum.id}-${lightbox.image}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={openImage.image_url}
                  alt={openImage.caption || openAlbum.title}
                  className="max-w-full max-h-[55vh] lg:max-h-[85vh] w-auto object-contain rounded-lg"
                />
              </div>

              {/* Caption panel */}
              <aside className="w-full lg:w-80 xl:w-96 shrink-0 text-primary-foreground">
                {openAlbum.title && (
                  <h2 className="font-display text-2xl md:text-3xl font-bold">
                    {openAlbum.title}
                  </h2>
                )}
                <div className="tibetan-divider !mx-0 my-4" />

                {openImage.caption ? (
                  <p className="font-body text-primary-foreground/80 leading-relaxed">
                    {openImage.caption}
                  </p>
                ) : (
                  <p className="font-body text-primary-foreground/40 italic text-sm">
                    No caption for this photo.
                  </p>
                )}

                {openAlbum.images.length > 1 && (
                  <>
                    <p className="mt-6 text-sm text-primary-foreground/60">
                      {lightbox.image + 1} / {openAlbum.images.length}
                    </p>

                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible">
                      {openAlbum.images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() =>
                            setLightbox((prev) =>
                              prev === null ? prev : { ...prev, image: index }
                            )
                          }
                          aria-label={`View image ${index + 1}`}
                          aria-current={index === lightbox.image}
                          className={`shrink-0 w-14 h-14 rounded-md overflow-hidden transition-opacity ${
                            index === lightbox.image
                              ? "ring-2 ring-accent"
                              : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img.image_url}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </>
  );
};

export default Gallery;
