import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  Send,
  ShoppingCart,
  Smartphone,
  Star,
  Target,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioItem, Testimonial } from "./backend";
import {
  usePortfolioItems,
  useSubmitContactForm,
  useTestimonials,
} from "./hooks/useQueries";

// ─── Static fallback data ────────────────────────────────────────────────────
const STATIC_PORTFOLIO: PortfolioItem[] = [
  {
    title: "FinTrack Analytics",
    description:
      "A comprehensive financial analytics SaaS platform with real-time data visualization.",
    imageUrl: "/assets/generated/portfolio-1.dim_800x600.jpg",
    category: "SaaS / FinTech",
    liveUrl: "#",
  },
  {
    title: "Maison Élite",
    description:
      "A luxury fashion e-commerce experience with curated collections and seamless checkout.",
    imageUrl: "/assets/generated/portfolio-2.dim_800x600.jpg",
    category: "E-Commerce",
    liveUrl: "#",
  },
  {
    title: "Osteria Roma",
    description:
      "Premium restaurant website with online reservation system and immersive ambiance.",
    imageUrl: "/assets/generated/portfolio-3.dim_800x600.jpg",
    category: "Hospitality",
    liveUrl: "#",
  },
  {
    title: "VitaFlow Wellness",
    description:
      "Health & wellness platform with tracking dashboard, booking, and content hub.",
    imageUrl: "/assets/generated/portfolio-4.dim_800x600.jpg",
    category: "Health & Wellness",
    liveUrl: "#",
  },
];

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    clientName: "Priya Mehta",
    quote:
      "WebCrafters CP transformed our online presence completely. The attention to detail and the quality of design is simply unmatched. Our conversions increased by 340% in the first month.",
    roleOrCompany: "CEO, Luminary Ventures",
    rating: BigInt(5),
  },
  {
    clientName: "James Calloway",
    quote:
      "Truly exceptional work. They understood our brand vision immediately and delivered a website that exceeded every expectation. Professional, prompt, and genuinely talented.",
    roleOrCompany: "Founder, Apex Real Estate",
    rating: BigInt(5),
  },
  {
    clientName: "Sofia Andrade",
    quote:
      "The team at WebCrafters CP brought creativity and technical excellence to our project. Our restaurant site now drives 60% of our reservations digitally. Outstanding!",
    roleOrCompany: "Owner, Osteria Roma",
    rating: BigInt(5),
  },
];

// ─── Gradient palettes for portfolio cards ───────────────────────────────────
const CARD_GRADIENTS = [
  "from-teal-900/60 via-slate-900 to-blue-950",
  "from-amber-900/40 via-slate-900 to-stone-950",
  "from-orange-900/40 via-slate-900 to-slate-950",
  "from-emerald-900/40 via-slate-900 to-slate-950",
];

// ─── Navigation sections ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { value: "150+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "8+", label: "Years of Excellence" },
  { value: "30+", label: "Industry Niches" },
];

const SERVICES = [
  {
    icon: Palette,
    title: "Custom Web Design",
    description:
      "Bespoke, pixel-perfect designs crafted to reflect your brand's unique identity and captivate your target audience.",
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description:
      "Flawlessly adaptive interfaces that deliver a premium experience across every device, screen, and platform.",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description:
      "High-converting online stores with seamless UX, secure payment flows, and integrated inventory management.",
  },
  {
    icon: Globe,
    title: "UX/UI Design",
    description:
      "User-centered design research and prototyping to create intuitive journeys that delight and convert visitors.",
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "Custom Strategy",
    description:
      "Every project begins with deep discovery. We learn your industry, competitors, and goals to craft a digital strategy that's uniquely yours—not a template.",
  },
  {
    icon: Code2,
    title: "Flawless Code",
    description:
      "We write clean, performant, and scalable code. No bloated page builders—just precision-crafted implementations that load fast and work flawlessly.",
  },
  {
    icon: Users,
    title: "Client Focus",
    description:
      "You're not a ticket number here. Direct communication, transparent timelines, and genuine partnership from kickoff to launch and beyond.",
  },
];

const NICHES = [
  "FinTech",
  "E-Commerce",
  "Healthcare",
  "Hospitality",
  "Real Estate",
  "Education",
];

// ─── Helper: Star rating ──────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? "star-filled fill-current" : "star-empty"}`}
        />
      ))}
    </div>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const portfolioQuery = usePortfolioItems();
  const testimonialsQuery = useTestimonials();
  const submitMutation = useSubmitContactForm();

  const portfolioItems =
    portfolioQuery.data && portfolioQuery.data.length > 0
      ? portfolioQuery.data
      : STATIC_PORTFOLIO;

  const testimonials =
    testimonialsQuery.data && testimonialsQuery.data.length > 0
      ? testimonialsQuery.data
      : STATIC_TESTIMONIALS;

  // Intersection Observer for active nav
  useEffect(() => {
    const sections = [
      "hero",
      "services",
      "portfolio",
      "about",
      "testimonials",
      "contact",
    ];
    const observers: IntersectionObserver[] = [];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      sectionRefs.current[id] = el;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  // Testimonial auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("idle");
    try {
      await submitMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        projectType: formData.projectType,
        message: formData.message,
      });
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
    } catch {
      setFormStatus("error");
    }
  };

  const prevTestimonial = () =>
    setTestimonialIdx(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  const nextTestimonial = () =>
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);

  return (
    <div className="min-h-screen bg-deep font-sans">
      {/* ── Navigation ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-deep/95 backdrop-blur-md border-b border-subtle">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("#hero")}
            className="flex items-center gap-3 flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 border border-gold flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-serif font-bold text-sm tracking-wider">
                WC
              </span>
            </div>
            <span className="hidden sm:block text-primary-heading font-sans font-semibold text-sm tracking-widest uppercase">
              WebCrafters <span className="text-gold">CP</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className={`nav-link ${
                  activeSection === item.href.replace("#", "") ? "active" : ""
                }`}
                data-ocid="nav.link"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="hidden md:block cta-pill text-xs"
              data-ocid="nav.primary_button"
            >
              Get Started
            </button>
            <button
              type="button"
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary-heading" />
              ) : (
                <Menu className="w-5 h-5 text-primary-heading" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-surface border-b border-subtle px-6 py-4 flex flex-col gap-4"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="nav-link text-left"
                  data-ocid="nav.link"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="cta-pill self-start"
                data-ocid="nav.primary_button"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden diagonal-texture"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-deep/85" />
        <div className="absolute inset-0 diagonal-texture" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="section-label mb-6">
                Premium Web Design Agency
              </div>
              <h1 className="hero-h1 mb-2">Crafting Unique</h1>
              <p className="hero-italic mb-2">digital experiences</p>
              <h1 className="hero-h1 mb-8">That Drive Results.</h1>
              <p className="text-secondary-body text-base leading-relaxed max-w-xl mb-10">
                Premier web design agency delivering bespoke digital solutions
                for every niche. Genuine, trusted, and results-driven
                craftsmanship for brands that demand the best.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo("#contact")}
                  className="cta-pill px-8 py-3.5"
                  data-ocid="hero.primary_button"
                >
                  Request a Proposal
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("#portfolio")}
                  className="inline-flex items-center gap-2 text-secondary-body hover:text-primary-heading text-sm font-medium transition-colors px-2"
                  data-ocid="hero.secondary_button"
                >
                  View Our Work <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-16 flex flex-wrap gap-10"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-muted-caption text-xs mt-0.5 tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-label mb-3">Services</div>
            <h2 className="section-heading">Elevate Your Digital Presence</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="service-card"
                data-ocid={`services.card.${i + 1}`}
              >
                <div className="mb-4">
                  <service.icon
                    className="w-7 h-7 text-icon"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif font-semibold text-primary-heading text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-secondary-body text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ───────────────────────────────────────── */}
      <section id="portfolio" className="py-24 bg-deep grid-overlay">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-label mb-3">Work Showcase</div>
            <h2 className="section-heading">Featured Masterpieces</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioItems.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="portfolio-card group"
                data-ocid={`portfolio.item.${i + 1}`}
              >
                {/* Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  {item.imageUrl &&
                  !item.imageUrl.startsWith("http://placeholder") ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-medium text-muted-caption tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-primary-heading text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-secondary-body text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.liveUrl && item.liveUrl !== "#" && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex-shrink-0 text-muted-caption hover:text-teal transition-colors"
                      data-ocid={`portfolio.link.${i + 1}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why WebCrafters CP ──────────────────────────────── */}
      <section id="about" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-label mb-3">Why Choose Us</div>
            <h2 className="section-heading">Why WebCrafters CP</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center px-4"
                data-ocid={`about.card.${i + 1}`}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-subtle flex items-center justify-center bg-card-dark">
                  <feature.icon
                    className="w-6 h-6 text-icon"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif font-semibold text-primary-heading text-lg mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="inline-flex items-center gap-2 text-gold hover:text-primary-heading text-sm font-medium transition-colors"
              data-ocid="about.primary_button"
            >
              Explore Our Process <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-deep">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-label mb-3">Testimonials</div>
            <h2 className="section-heading">What Our Clients Say</h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-surface border border-subtle rounded-lg px-8 md:px-14 py-10 text-center"
                data-ocid="testimonials.card"
              >
                <div className="quote-mark mb-4 select-none">&ldquo;</div>
                <StarRating
                  rating={Number(testimonials[testimonialIdx]?.rating ?? 5)}
                />
                <blockquote className="mt-5 mb-6 text-primary-heading font-serif italic text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                  {testimonials[testimonialIdx]?.quote}
                </blockquote>
                <div className="text-primary-heading font-semibold text-sm">
                  {testimonials[testimonialIdx]?.clientName}
                </div>
                <div className="text-muted-caption text-xs mt-1 tracking-wide">
                  {testimonials[testimonialIdx]?.roleOrCompany}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                type="button"
                onClick={prevTestimonial}
                className="w-9 h-9 rounded-full border border-subtle flex items-center justify-center text-secondary-body hover:text-primary-heading hover:border-gold transition-colors"
                aria-label="Previous testimonial"
                data-ocid="testimonials.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((t, i) => (
                  <button
                    type="button"
                    key={t.clientName}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === testimonialIdx
                        ? "bg-gold scale-125"
                        : "bg-subtle opacity-40"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                    data-ocid="testimonials.toggle"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextTestimonial}
                className="w-9 h-9 rounded-full border border-subtle flex items-center justify-center text-secondary-body hover:text-primary-heading hover:border-gold transition-colors"
                aria-label="Next testimonial"
                data-ocid="testimonials.pagination_next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-label mb-3">Contact</div>
            <h2 className="section-heading">Let&apos;s Build Together</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-2xl font-semibold text-primary-heading mb-4">
                Start Your Project Today
              </h3>
              <p className="text-secondary-body text-sm leading-relaxed mb-8 max-w-sm">
                Ready to craft something extraordinary? Reach out and let's
                discuss how we can transform your digital presence into a
                powerful business asset.
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded border border-subtle flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-icon" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-primary-heading text-sm font-medium">
                      Our Studio
                    </div>
                    <div className="text-secondary-body text-sm mt-0.5">
                      123 Design District, Creative City, 10001
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded border border-subtle flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-icon" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-primary-heading text-sm font-medium">
                      Phone
                    </div>
                    <div className="text-secondary-body text-sm mt-0.5">
                      +1 (555) 234-5678
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded border border-subtle flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-icon" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-primary-heading text-sm font-medium">
                      Email
                    </div>
                    <div className="text-secondary-body text-sm mt-0.5">
                      hello@webcrafterscp.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-10 pt-8 border-t border-subtle">
                <div className="section-label mb-4">
                  Trusted by Brands Across
                </div>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map((niche) => (
                    <span
                      key={niche}
                      className="px-3 py-1 text-xs bg-card-dark border border-subtle rounded-full text-muted-caption"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card-dark border border-subtle rounded-lg p-7"
              data-ocid="contact.panel"
            >
              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                    data-ocid="contact.success_state"
                  >
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-teal/20 flex items-center justify-center">
                      <Send className="w-6 h-6 text-teal" />
                    </div>
                    <h3 className="font-serif text-xl text-primary-heading mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-secondary-body text-sm">
                      Thank you for reaching out. We&apos;ll be in touch within
                      24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus("idle")}
                      className="mt-6 text-gold text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-5"
                    initial={{ opacity: 1 }}
                    data-ocid="contact.modal"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="name">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          className="form-input"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            handleFormChange("name", e.target.value)
                          }
                          data-ocid="contact.input"
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="email">
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          className="form-input"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          data-ocid="contact.input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" htmlFor="phone">
                          Phone <span className="opacity-50">(Optional)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="form-input"
                          placeholder="+1 555 000 0000"
                          value={formData.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                          data-ocid="contact.input"
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="projectType">
                          Project Type *
                        </label>
                        <select
                          id="projectType"
                          required
                          className="form-input"
                          value={formData.projectType}
                          onChange={(e) =>
                            handleFormChange("projectType", e.target.value)
                          }
                          data-ocid="contact.select"
                        >
                          <option value="" disabled>
                            Select type…
                          </option>
                          <option value="Custom Web Design">
                            Custom Web Design
                          </option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="Web App">Web App</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Redesign">Website Redesign</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label" htmlFor="message">
                        Project Brief *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Tell us about your project, goals, and timeline…"
                        value={formData.message}
                        onChange={(e) =>
                          handleFormChange("message", e.target.value)
                        }
                        data-ocid="contact.textarea"
                      />
                    </div>

                    {formStatus === "error" && (
                      <div
                        className="text-red-400 text-xs py-2 px-3 bg-red-500/10 border border-red-500/20 rounded"
                        data-ocid="contact.error_state"
                      >
                        Something went wrong. Please try again or email us
                        directly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="cta-pill self-end flex items-center gap-2 px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                      data-ocid="contact.submit_button"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-deep border-t border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 border border-gold flex items-center justify-center">
                  <span className="text-gold font-serif font-bold text-sm tracking-wider">
                    WC
                  </span>
                </div>
                <span className="text-primary-heading font-semibold text-sm tracking-widest uppercase">
                  WebCrafters <span className="text-gold">CP</span>
                </span>
              </div>
              <p className="text-secondary-body text-sm leading-relaxed max-w-xs">
                Crafting unique, high-performance websites for every niche.
                Genuine expertise. Trusted results.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div className="section-label mb-5">Quick Links</div>
              <nav className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    className="text-secondary-body hover:text-primary-heading text-sm text-left transition-colors w-fit"
                    data-ocid="nav.link"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <div className="section-label mb-5">Get in Touch</div>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:hello@webcrafterscp.com"
                  className="flex items-center gap-2 text-secondary-body hover:text-primary-heading text-sm transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-icon" />
                  hello@webcrafterscp.com
                </a>
                <a
                  href="tel:+15552345678"
                  className="flex items-center gap-2 text-secondary-body hover:text-primary-heading text-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-icon" />
                  +1 (555) 234-5678
                </a>
                <div className="flex items-center gap-2 text-secondary-body text-sm">
                  <MapPin className="w-3.5 h-3.5 text-icon" />
                  123 Design District, Creative City
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-muted-caption text-xs">
              &copy; {new Date().getFullYear()} WebCrafters CP. All rights
              reserved.
            </div>
            <div className="text-muted-caption text-xs">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
