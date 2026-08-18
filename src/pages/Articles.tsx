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
      <SEO {...PAGE_META["/articles"]} />
      <main className="pt-20">
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Articles from the clinic
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Writing on Tibetan medical theory, diagnosis, diet and daily practice — written by the practitioners at Kunphen.
            </p>
          </motion.div>

          <div className="border-t border-border mb-8" />

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-secondary"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filtered.map((article, i) => (
              <motion.article
                key={article.id}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/articles/${article.slug}`}>
                  <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3]">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase text-primary">
                    {article.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.author && `${article.author} · `}
                    {formatDate(article.published_at)}
                  </p>
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
