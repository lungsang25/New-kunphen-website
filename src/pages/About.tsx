import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const DESCRIPTION_TRUNCATE_LENGTH = 180;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const practitioners = [
  {
    name: "Late Dr. Kunsang Phenthok (Kun-Phen)",
    title: "Founder",
    qualification: "Physician & Herbalist",
    experience: "70+ years",
    specialization: "Digestive disorders, Chronic disorders",
    image: "/lovable-uploads/6b8dc07f-2898-43df-9594-0c086fb4fd8d.png",
    description: "Dr. Kunsang is an expert in herbal medicine preparation and has extensive knowledge of meditation-based healing practices.",
  },
  {
    name: "Dr. Kusang Dorjee",
    title: "Chairman",
    qualification: "Physician & Herbalist",
    experience: "40+ years",
    specialization: "Digestive disorders, Respiratory conditions, Meditation therapy",
    image: "/lovable-uploads/65f91f89-eaac-411e-8fb1-544ba173bc33.png",
    description: "Dr. Kusang Dorjee is an expert in herbal medicine preparation and has extensive knowledge of meditation-based healing practices.",
  },
  {
    name: "Dr. Tashi Pedon",
    title: "President/Senior Physician",
    qualification: "Tibetan Medical College, Lhasa",
    experience: "20+ years",
    specialization: "Women's health, Pediatrics, Pulse diagnosis, Chronic conditions",
    image: "/lovable-uploads/44701db8-6d61-4096-9c03-9adf933e175d.png",
    description: "Dr. Tashi is a highly respected practitioner of Traditional Tibetan Medicine (Sowa Rigpa), with over two decades of clinical experience. She received her formal training at the prestigious Lhasa Tibetan Medical Institute, studying under renowned masters such as Truru Tsenam Rinpoche and Gen Gonju Wangdu, and later had the good fortune of further refining her clinical skills under esteemed physicians including Dr. Kunsang. Dr. Tashi is widely known among her patients for her compassionate, attentive, and deeply caring approach to healing. She possesses extensive knowledge in the treatment of chronic non-communicable diseases, particularly rheumatoid arthritis (RA factor), internal disorders, and psychological conditions—areas in which she has gained notable clinical success. With her strong grounding in classical Sowa Rigpa diagnostics and therapies, combined with a sincere dedication to patient well-being, Dr. Tashi continues to make a profound impact in the field of Tibetan medicine.",
  },
  {
    name: "Dr. Nyima Tsering",
    title: "Managing Director/Senior Physician/Herbalist",
    qualification: "Men-Tsee-Khang, Tibetan Medical & Astro. Institute, India",
    experience: "15+ years",
    specialization: "Pulse diagnosis, Chronic conditions, Mental Health, Herbal formulations",
    image: "/lovable-uploads/d47670dc-9152-405f-9d95-a3cfb18b57f6.png",
    description: "Dr. Nyima is a leading authority in Sowa Rigpa (Traditional Tibetan Medicine), with formal training in India in both Sowa Rigpa Medicine and Buddhist Philosophy. He is a founding member and Principal of the Sowa Rigpa International College in Kathmandu—the first institution in Nepal to offer a Bachelor's degree in Sowa Rigpa, affiliated with Lumbini Buddhist University. He also serves as Chief Physician at the Kunphen Tibetan Medical Centre. Renowned for his expertise in traditional diagnostic methods—including pulse reading, urine analysis, and tongue observation—Dr. Nyima brings a holistic approach to healing rooted in ancient wisdom. He has been instrumental in the education, clinical training, and preservation of Sowa Rigpa in Nepal, and is actively involved in research and advocacy for traditional formulations such as Agar-35, used in addressing mental health concerns like anxiety and stress. Beyond Nepal, Dr. Nyima teaches and practices Sowa Rigpa internationally, including in the United States, Latvia, Russia, and across Europe, where he is recognized for his ability to bridge traditional Tibetan healing with modern healthcare contexts. With decades of experience as a physician and educator, Dr. Nyima continues to inspire a new generation of practitioners while expanding the global reach and relevance of Sowa Rigpa medicine.",
  },
  {
    name: "Dr. Tenzin Lektsok",
    title: "Senior physician",
    qualification: "Central University of Tibetan Studies, Varanasi, India",
    experience: "15+ years",
    specialization: "Digestive disorders, Respiratory conditions, Chronic disorders",
    image: "/lovable-uploads/2a3ccb03-c8ca-4024-8bb9-f54283323dae.png",
    description: "Dr. Tenzin is an experienced specialist in internal chronic diseases, with particular expertise in managing complex conditions such as rheumatoid arthritis (RA factor) and psychological disorders. With a long-standing clinical background, Dr. Tenzin is known for providing effective, compassionate care for patients facing persistent and challenging health issues.",
  },
];

type Practitioner = (typeof practitioners)[0];

function PractitionerCard({
  practitioner: p,
  index,
}: {
  practitioner: Practitioner;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = p.description.length > DESCRIPTION_TRUNCATE_LENGTH;
  const displayDesc =
    isLong && !isExpanded
      ? p.description.slice(0, DESCRIPTION_TRUNCATE_LENGTH) + "…"
      : p.description;

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-background rounded-lg overflow-hidden border border-border group flex flex-col h-full"
    >
      <div className="aspect-square overflow-hidden flex-shrink-0">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1 min-h-0">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {p.name}
        </h3>
        <p className="text-accent text-sm mb-2">{p.title}</p>
        <p className="text-foreground text-sm font-medium mb-1">{p.qualification}</p>
        <p className="text-muted-foreground text-xs mb-2">
          Experience: {p.experience}
        </p>
        <p className="text-muted-foreground text-xs mb-3">
          Specialization: {p.specialization}
        </p>
        <div className="flex flex-col flex-1 min-h-[5rem]">
          <div
            className={
              isLong && isExpanded
                ? "max-h-44 overflow-y-auto pr-2 overscroll-contain"
                : ""
            }
          >
            <p
              className={`text-muted-foreground text-sm leading-relaxed ${
                isLong && !isExpanded ? "line-clamp-4" : ""
              }`}
            >
              {displayDesc}
            </p>
          </div>
          {isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-accent text-sm font-medium hover:underline inline-flex items-center gap-1 self-start flex-shrink-0"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const About = () => {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Kunphen
            </h1>
            <div className="tibetan-divider mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              Kunphen, meaning "benefiting all," was established with a singular mission: to make the
              profound healing tradition of Tibetan medicine accessible to everyone. Our hospital stands
              at the crossroads of ancient wisdom and modern care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Mission & Heritage
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tibetan medicine, or <em>Sowa Rigpa</em>, is one of the world's oldest and most
                  complete medical systems. It originated over 2,500 years ago and is built upon the
                  Buddhist understanding of the interdependence of body, mind, and spirit.
                </p>
                <p>
                  At Kunphen, we honor this lineage through authentic practice. Our physicians are
                  trained in the four medical tantras (<em>rGyud-bzhi</em>), mastering pulse diagnosis,
                  urine analysis, and the preparation of herbal compounds from Himalayan botanicals.
                </p>
                <p>
                  We believe that true healing addresses the root cause of disease—not merely its
                  symptoms. Through personalized treatments that may include herbal medicine, dietary
                  guidance, moxibustion, and spiritual counseling, we guide each patient toward
                  lasting balance and wellness.
                </p>
              </div>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-lg p-8 border border-border"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                The Five Elements
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Tibetan medicine views health through the balance of five elements:
              </p>
              <div className="space-y-3">
                {["Earth — Stability & Structure", "Water — Cohesion & Fluidity", "Fire — Transformation & Warmth", "Wind — Movement & Energy", "Space — Openness & Potential"].map(
                  (el) => (
                    <div key={el} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{el}</span>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="section-padding bg-card">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Practitioners
            </h2>
            <div className="tibetan-divider" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {practitioners.map((p, i) => (
              <PractitionerCard key={p.name} practitioner={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
