import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import SEO from "@/components/SEO";
import { api } from "@/lib/api";

const MedicineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ["medicine", id],
    queryFn: () => api.medicine(id!),
    enabled: !!id,
  });

  return (
    <>
      <SEO
        title={medicine ? `${medicine.name} - Kunphen Hospital` : "Medicine - Kunphen Hospital"}
        description={medicine?.description ?? "Traditional Tibetan medicine from Kunphen Hospital."}
      />
      <main className="pt-20">
        <section className="section-padding">
          <div className="container mx-auto max-w-5xl">
            <Link
              to="/medicines"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All medicines
            </Link>

            {isLoading && (
              <p className="text-center text-muted-foreground">Loading medicine…</p>
            )}
            {isError && (
              <p className="text-center text-muted-foreground">
                Medicine not found or unable to load.
              </p>
            )}

            {medicine && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
              >
                <div className="aspect-square md:aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={medicine.image_url}
                    alt={medicine.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  {medicine.category && (
                    <p className="text-accent text-xs mb-2 font-medium tracking-wide uppercase">
                      {medicine.category}
                    </p>
                  )}
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {medicine.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-6">
                    {medicine.price > 0 && (
                      <span className="text-lg font-semibold text-foreground">
                        €{medicine.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-border text-foreground">
                      {medicine.in_stock ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  {medicine.description && (
                    <p className="text-muted-foreground mb-4">{medicine.description}</p>
                  )}
                  {medicine.full_description && (
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {medicine.full_description}
                    </p>
                  )}

                  <div className="space-y-4 mb-6">
                    {medicine.dosage && (
                      <div className="bg-secondary/50 border border-border rounded-lg p-4">
                        <h4 className="font-display font-semibold text-foreground mb-1">
                          Dosage
                        </h4>
                        <p className="text-muted-foreground text-sm">{medicine.dosage}</p>
                      </div>
                    )}
                    {medicine.notes && (
                      <div className="bg-card border border-border rounded-lg p-4">
                        <h4 className="font-display font-semibold text-foreground mb-1">
                          Notes
                        </h4>
                        <p className="text-muted-foreground text-sm">{medicine.notes}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-xs mb-6">
                    Tibetan medicines are prescribed according to individual constitution. Please speak
                    with a Kunphen practitioner before starting any formula.
                  </p>

                  <a
                    href={`mailto:info@kunphen.com?subject=Enquiry about ${encodeURIComponent(medicine.name)}`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-6 rounded-md text-sm font-medium hover:bg-maroon-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Enquire about this medicine
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default MedicineDetail;
