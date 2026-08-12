import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShoppingBag, X } from "lucide-react";
import SEO from "@/components/SEO";
import { PAGE_META } from "@/lib/site";
import { api, type Medicine } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Medicines = () => {
  const [selected, setSelected] = useState<Medicine | null>(null);
  const { data: medicines = [], isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.medicines,
  });

  return (
    <>
      <SEO {...PAGE_META["/medicines"]} />
    <main className="pt-20">
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Medicines
            </h1>
            <div className="tibetan-divider mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional Tibetan herbal formulations, prepared with authentic Himalayan ingredients
              following centuries-old recipes from the medical tantras.
            </p>
          </motion.div>

          {isLoading && (
            <p className="text-center text-muted-foreground">Loading medicines…</p>
          )}
          {isError && (
            <p className="text-center text-muted-foreground">Unable to load medicines right now.</p>
          )}
          {!isLoading && !isError && medicines.length === 0 && (
            <p className="text-center text-muted-foreground">No medicines available yet.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {medicines.map((med, i) => (
              <motion.div
                key={med.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setSelected(med)}
                className="cursor-pointer bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={med.image_url}
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-accent text-xs mb-1 font-body">{med.tibetan_name}</p>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {med.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{med.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medicine Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto border border-border"
            >
              <div className="relative">
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1.5"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-accent text-sm mb-1">{selected.tibetan_name}</p>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {selected.name}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {selected.full_description}
                </p>
                <div className="mb-6">
                  <h4 className="font-display text-sm font-semibold text-foreground mb-2">Common Uses:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.uses.map((u) => (
                      <span key={u} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href="mailto:info@kunphen.com?subject=Order Inquiry"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-maroon-dark transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy Now
                  </a>
                  <a
                    href="tel:+97715351920"
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call to Order
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </>
  );
};

export default Medicines;
