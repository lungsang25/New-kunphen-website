import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Pill, BookOpen, Heart, Leaf, Shield } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  return (
    <main>
      <HeroSlider />

      {/* Quick Actions */}
      <section className="relative -mt-16 z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: CalendarDays, label: "Book Appointment", to: "/appointments", desc: "Schedule a consultation" },
            { icon: BookOpen, label: "Our Doctors", to: "/about", desc: "Meet our practitioners" },
            { icon: Pill, label: "View Medicines", to: "/medicines", desc: "Explore our remedies" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-card hover:bg-secondary border border-border rounded-lg p-6 flex items-center gap-4 transition-all hover:shadow-lg group"
            >
              <div className="bg-primary/10 rounded-full p-3 group-hover:bg-accent/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About intro */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <p className="text-accent font-display text-lg mb-2">སྨན་ཁང་ཀུན་ཕན།</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to Kunphen
            </h2>
            <div className="tibetan-divider mb-8" />
            <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl mx-auto">
              Kunphen Tibetan Medicine Hospital is dedicated to preserving and
              practicing the ancient art of <em>Sowa Rigpa</em> — the Tibetan
              science of healing. Rooted in over a thousand years of tradition,
              our approach integrates pulse diagnosis, herbal medicine, and
              holistic therapies to restore balance in body, mind, and spirit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
          >
            Our Healing Philosophy
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Compassionate Care", desc: "Every patient is treated with deep compassion and respect, honoring the Buddhist principles at the heart of Tibetan medicine." },
              { icon: Leaf, title: "Natural Remedies", desc: "Our medicines are formulated from pure Himalayan herbs and minerals, following recipes passed down through generations." },
              { icon: Shield, title: "Holistic Approach", desc: "We treat the whole person—body, energy, and mind—addressing root causes rather than just symptoms." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Begin Your Healing Journey
            </h2>
            <p className="text-primary-foreground/70 mb-8">
              Experience the profound benefits of Tibetan medicine. Schedule a consultation with our experienced practitioners today.
            </p>
            <Link
              to="/appointments"
              className="inline-block bg-accent text-accent-foreground font-medium px-8 py-3 rounded-md hover:bg-gold-light transition-colors text-sm tracking-wide"
            >
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Index;
