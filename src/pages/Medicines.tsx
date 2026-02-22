import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShoppingBag, X } from "lucide-react";
import hero2 from "@/assets/hero-2.jpg";
import hero4 from "@/assets/hero-4.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface Medicine {
  id: number;
  name: string;
  tibetan: string;
  description: string;
  fullDescription: string;
  image: string;
  uses: string[];
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Agar-35",
    tibetan: "ཨ་གར་སོ་ལྔ།",
    description: "A calming formula for stress, anxiety, and nervous system balance.",
    fullDescription: "Agar-35 is one of the most renowned Tibetan formulations, composed of 35 carefully selected ingredients including aquilaria, clove, and saffron. It is traditionally used to pacify wind (rLung) imbalances manifesting as anxiety, insomnia, and heart palpitations.",
    image: hero4,
    uses: ["Anxiety & Stress Relief", "Insomnia", "Heart Palpitations", "Nervous System Support"],
  },
  {
    id: 2,
    name: "Ratna Samphel",
    tibetan: "རིན་ཆེན་བསམ་འཕེལ།",
    description: "A precious pill for detoxification and immune system strengthening.",
    fullDescription: "Ratna Samphel, or 'Precious Wish-fulfilling Jewel,' is a revered compound pill containing processed precious metals and rare herbs. Used for deep-level detoxification and rejuvenation of the body's vital energies.",
    image: hero2,
    uses: ["Detoxification", "Immune Boosting", "Chronic Fatigue", "Overall Rejuvenation"],
  },
  {
    id: 3,
    name: "Manu-4",
    tibetan: "མ་ནུ་བཞི་ཐང་།",
    description: "A digestive formula for balancing stomach heat and acidity.",
    fullDescription: "Manu-4 is a classic four-ingredient digestive formula combining pomegranate, long pepper, cinnamon, and cardamom. It is used to restore digestive fire (me-drod) and treat conditions related to bile (mKhris-pa) imbalances.",
    image: hero4,
    uses: ["Digestive Issues", "Acid Reflux", "Appetite Regulation", "Stomach Balance"],
  },
  {
    id: 4,
    name: "Dashel Dutsi",
    tibetan: "བདེ་གཤེལ་བདུད་རྩི།",
    description: "A warming remedy for joint pain and cold-related conditions.",
    fullDescription: "Dashel Dutsi, the 'Nectar of Comfort,' combines warming herbs and minerals to address pain stemming from cold and damp conditions. Particularly effective for arthritis, rheumatism, and cold-type kidney disorders.",
    image: hero2,
    uses: ["Joint Pain", "Arthritis", "Cold Constitution", "Kidney Health"],
  },
];

const Medicines = () => {
  const [selected, setSelected] = useState<Medicine | null>(null);

  return (
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
                    src={med.image}
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-accent text-xs mb-1 font-body">{med.tibetan}</p>
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
                  src={selected.image}
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
                <p className="text-accent text-sm mb-1">{selected.tibetan}</p>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {selected.name}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {selected.fullDescription}
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
  );
};

export default Medicines;
