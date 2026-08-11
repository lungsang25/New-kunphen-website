import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => api.article(slug!),
    enabled: !!slug,
  });

  return (
    <>
      <SEO
        title={article ? `${article.title} - Kunphen Hospital` : "Article - Kunphen Hospital"}
        description={article?.excerpt ?? "Tibetan medicine article from Kunphen Hospital."}
      />
      <main className="pt-20">
        <section className="section-padding">
          <div className="container mx-auto max-w-3xl">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {isLoading && (
              <p className="text-center text-muted-foreground">Loading article…</p>
            )}
            {isError && (
              <p className="text-center text-muted-foreground">
                Article not found or unable to load.
              </p>
            )}

            {article && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-accent/15 text-accent text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(article.published_at)}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {article.title}
                </h1>
                {article.image_url && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-8">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_strong]:text-foreground">
                  <Markdown>{article.content}</Markdown>
                </div>
              </motion.article>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ArticleDetail;
