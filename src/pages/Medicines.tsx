import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";
import { PAGE_META } from "@/lib/site";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const CATEGORIES = [
  "All",
  "Mental well-being",
  "Joints & mobility",
  "Circulation",
  "Digestive",
  "Respiratory",
];

const Medicines = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: medicines = [], isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.medicines,
  });

  const filtered = medicines.filter((med) => {
    const matchCategory = activeCategory === "All" || med.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      med.name.toLowerCase().includes(q) || med.description.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <>
      <SEO {...PAGE_META["/medicines"]} />
      <main className="pt-20">
        <section className="section-padding">
          <div className="container mx-auto max-w-5xl">
            <motion.div {...fadeUp} className="mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Medicines
              </h1>
              <div className="w-24 h-0.5 bg-accent mb-6" />
              <p className="text-muted-foreground max-w-2xl">
                Traditional Tibetan herbal formulations, prepared with authentic Himalayan ingredients
                following centuries-old recipes from the medical tantras.
              </p>
            </motion.div>

            {/* Search & Filters */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or use"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {isLoading && (
              <p className="text-center text-muted-foreground">Loading medicines…</p>
            )}
            {isError && (
              <p className="text-center text-muted-foreground">Unable to load medicines right now.</p>
            )}
            {!isLoading && !isError && medicines.length === 0 && (
              <p className="text-center text-muted-foreground">No medicines available yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((med, i) => (
                <motion.div
                  key={med.id}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link
                    to={`/medicines/${med.id}`}
                    className="block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={med.image_url}
                        alt={med.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {med.name}
                        </h3>
                        <span className="shrink-0 text-xs px-2.5 py-0.5 rounded-full border border-border text-foreground">
                          {med.in_stock ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                      {med.category && (
                        <p className="text-accent text-xs mb-2 font-medium tracking-wide uppercase">
                          {med.category}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm mb-4">{med.description}</p>
                      {med.price > 0 && (
                        <p className="text-foreground font-semibold">€{med.price.toFixed(2)}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {!isLoading && !isError && medicines.length > 0 && filtered.length === 0 && (
              <p className="text-center text-muted-foreground mt-12">
                No medicines found matching your search.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Medicines;
