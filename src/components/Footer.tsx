import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative z-0 relative mt-auto bg-gradient-to-r from-primary via-primary/95 to-primary text-white transition-all duration-1000 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >

   
      {/* Top subtle divider */}
      <div className="h-[1px] w-full bg-white/10" />

      <div className="container mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <img
              src="/b2blogo.png"
              alt="B2B Partners Logo"
              className="h-16 mb-5"
            />

            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Empowering seamless B2B travel and business partnerships with
              reliability and innovation.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition duration-300"
              >
                <Facebook size={16} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition duration-300"
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition duration-300"
              >
                <Linkedin size={16} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition duration-300"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold tracking-widest text-xs uppercase mb-5 text-white/80">
              Company
            </h4>

            <div className="space-y-3">
              {[
                { label: "About Us", path: "/about" },
                { label: "Contact Us", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Terms of Service", path: "/terms-of-service" },
                { label: "Cancellation Policy", path: "/cancellation-policy" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition group"
                >
                  {item.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold tracking-widest text-xs uppercase mb-5 text-white/80">
              Contact
            </h4>

            <div className="space-y-4 text-sm text-white/70">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <span>Dadar West, Mumbai - 400028, India</span>
              </div>

              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-accent" />
                <span>salil@sktt.in</span>
              </div>

              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 9820870771</span>
              </div>

              <div className="flex gap-3 items-center">
                <Globe className="w-4 h-4 text-accent" />
                <Link to="#" className="hover:text-white transition">
                  b2bpartners.in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end items-center text-sm text-white/60">
  <p>
    © {new Date().getFullYear()}{" "}
    <span className="font-semibold text-white">B2B Partners</span>. All
    rights reserved.
  </p>
</div>
      </div>
    </footer>
  );
};

export default Footer;
