import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl font-bold mb-4">Kunphen</h3>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
              Preserving the ancient wisdom of Tibetan medicine while embracing
              modern healthcare practices for holistic healing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: "/about", label: "About Us" },
                { to: "/medicines", label: "Our Medicines" },
                { to: "/articles", label: "Articles" },
                { to: "/gallery", label: "Gallery" },
                { to: "/appointments", label: "Book Appointment" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:+97715351920" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +977 1-5351920
              </a>
              <a href="mailto:info@kunphen.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@kunphen.com
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>123 Himalayan Way, Dharamsala, Himachal Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/50 text-xs">
          © {new Date().getFullYear()} Kunphen Tibetan Medicine Hospital. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
