import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const categories = ["All", "Wellness", "Herbal Medicine", "Philosophy", "Treatments"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Articles = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: articles = [], isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: api.articles,
  });

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <SEO 
        title="Tibetan Medicine Articles & Blog - Kunphen Hospital Wellness Resources"
        description="Read informative articles about Tibetan medicine, Sowa Rigpa philosophy, herbal remedies, and holistic wellness from Kunphen Hospital's expert practitioners."
        keywords="Tibetan medicine articles, Sowa Rigpa blog, herbal medicine information, holistic wellness articles, traditional medicine resources, Kunphen blog"
      />
      <main className="pt-20">
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Articles & Insights
            </h1>
            <div className="tibetan-divider mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the wisdom of Tibetan medicine through our articles on healing, wellness, and ancient practices.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
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
            <p className="text-center text-muted-foreground">Loading articles…</p>
          )}
          {isError && (
            <p className="text-center text-muted-foreground">Unable to load articles right now.</p>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((article, i) => (
              <motion.article
                key={article.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <Link to={`/articles/${article.slug}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-accent/15 text-accent text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {article.category}
                      </span>
                      <span className="text-muted-foreground text-xs">{formatDate(article.published_at)}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">No articles found matching your search.</p>
          )}
        </div>
      </section>
    </main>
    </>
  );
};

export default Articles;
