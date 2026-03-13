import {
  Link,
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flame,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";

const CURRENT_YEAR = new Date().getFullYear();

// ─────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────

function ClayOrnament({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 w-full ${className}`}
    >
      <span className="ornament" />
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        role="img"
        aria-label="Diamond ornament"
      >
        <rect
          x="4"
          y="0.5"
          width="5"
          height="5"
          transform="rotate(45 4 4)"
          fill="oklch(var(--clay) / 0.55)"
        />
      </svg>
      <span className="ornament" />
    </div>
  );
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}
function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      className="text-center mb-14"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="text-xs font-semibold tracking-[0.3em] uppercase clay-text mb-3">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
        {title}
      </h1>
      <ClayOrnament className="mx-auto mt-4" />
      {subtitle && (
        <p className="mt-5 text-base text-foreground/65 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────

type NavLink = {
  label: string;
  to: string;
  ocid: string;
  exact?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: "Home", to: "/", ocid: "nav.home.link", exact: true },
  { label: "About Us", to: "/about", ocid: "nav.about.link" },
  { label: "Services", to: "/services", ocid: "nav.services.link" },
  { label: "Programs", to: "/programs", ocid: "nav.programs.link" },
  { label: "Policies", to: "/policies", ocid: "nav.policies.link" },
  { label: "Contact", to: "/contact", ocid: "nav.contact.link" },
];

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally tracking route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  function isActive(to: string, exact: boolean) {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  }

  return (
    <header
      data-ocid="nav.section"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-blur border-b border-border shadow-warm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        {/* Logo + Name */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Go to homepage"
        >
          <img
            src="/assets/generated/logo-clean-final-transparent.dim_400x400.png"
            alt="Claze Creative Space Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-base sm:text-lg font-semibold text-foreground tracking-wide hidden sm:block">
            Claze Creative Space
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.to, item.exact ?? false);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  active
                    ? "text-foreground bg-muted/70 font-semibold"
                    : "text-foreground/65 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ml-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Book a Session
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden nav-blur border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {NAV_LINKS.map((item) => {
                const active = isActive(item.to, item.exact ?? false);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-ocid={item.ocid}
                    className={`text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? "text-foreground bg-muted/70 font-semibold"
                        : "text-foreground/75 hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="mt-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 transition-opacity text-center"
              >
                Book a Session
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-card border-t border-border py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo-clean-final-transparent.dim_400x400.png"
              alt="Claze Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-display text-base font-semibold text-foreground">
                Claze Creative Space
              </p>
              <p className="text-xs text-foreground/50">
                A Collective Pottery Space
              </p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-4 text-sm text-foreground/60">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-1 text-sm text-foreground/60">
            <a
              href="tel:9187152615"
              className="hover:text-foreground transition-colors"
            >
              +91 91871 52615
            </a>
            <a
              href="mailto:claze.info@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              claze.info@gmail.com
            </a>
            <p>HSR Layout, Bengaluru 560102</p>
          </div>
        </div>

        <div className="section-divider my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/40">
          <p>© {CURRENT_YEAR} Claze Creative Space. All rights reserved.</p>
          <p>
            Built with <span className="clay-text">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/70 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Layout (wraps all pages)
// ─────────────────────────────────────────────

function RootLayout() {
  return (
    <div className="grain min-h-screen bg-background font-body flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 sm:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────
// Page: Home
// ─────────────────────────────────────────────

const OFFER_CARDS = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Clay Experiences",
    desc: "Group sessions blending hand building and wheel throwing in one immersive experience.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Wheel Throwing & Handbuilding",
    desc: "Structured beginner and intermediate programs with instructor guidance.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Glaze & Firing Specialization",
    desc: "Learn the art of glazing and formulate your own unique glazes from scratch.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Open Space Practice",
    desc: "Drop in anytime — 3-hour sessions to practice your craft at your own pace. From ₹260.",
  },
  {
    icon: <Flame className="h-6 w-6" />,
    title: "Kiln Firing Services",
    desc: "Professional kiln firing, bisque firing, and glaze firing handled by our team.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        data-ocid="hero.section"
        className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-pottery.dim_1400x800.jpg"
            alt="Pottery workspace background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          {/* Logo — prominent hero placement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/assets/generated/logo-clean-final-transparent.dim_400x400.png"
              alt="Claze Creative Space"
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm font-bold tracking-[0.25em] uppercase text-white drop-shadow-md">
              Bengaluru's Collective Pottery Space
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
              Claze Creative Space
            </h1>
            <ClayOrnament className="my-1" />
            <p className="text-base sm:text-lg text-white/90 max-w-xl leading-relaxed font-medium drop-shadow">
              A warm, welcoming space in HSR Layout where beginners and seasoned
              potters come together to shape, fire, and create.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <Link
              to="/services"
              data-ocid="hero.primary_button"
              className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-clay"
            >
              Explore Sessions
            </Link>
            <Link
              to="/programs"
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              View Programs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs — visible on front page */}
      <section
        data-ocid="home.nav_tabs.section"
        className="py-14 px-4 bg-background"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] uppercase clay-text mb-2">
              Explore
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">
              Where Would You Like to Go?
            </h2>
            <ClayOrnament className="mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {[
              {
                label: "About Us",
                to: "/about",
                ocid: "home.about.tab",
                desc: "Bengaluru's collective pottery space in the heart of HSR Layout.",
                icon: "🌿",
              },
              {
                label: "Services",
                to: "/services",
                ocid: "home.services.tab",
                desc: "Drop-in open space sessions — hand building, wheel throwing & glazing.",
                icon: "⚱️",
              },
              {
                label: "Programs",
                to: "/programs",
                ocid: "home.programs.tab",
                desc: "Structured courses from beginner to advanced, kiln & glaze specializations.",
                icon: "🏺",
              },
              {
                label: "Policies",
                to: "/policies",
                ocid: "home.policies.tab",
                desc: "Session guidelines, refund policies, storage, kiln & damage policies.",
                icon: "📋",
              },
              {
                label: "Contact",
                to: "/contact",
                ocid: "home.contact.tab",
                desc: "Visit us at 221, 9th Main Road, HSR Layout · Open 10AM–8:30PM.",
                icon: "📍",
              },
            ].map((tab, i) => (
              <motion.div
                key={tab.to}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <Link
                  to={tab.to}
                  data-ocid={tab.ocid}
                  className="group flex flex-col gap-3 bg-card rounded-2xl border border-border shadow-warm hover:shadow-clay-lg p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 h-full"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: "oklch(var(--clay) / 0.10)" }}
                    >
                      {tab.icon}
                    </span>
                    <span
                      className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: "oklch(var(--clay))" }}
                    >
                      →
                    </span>
                  </div>
                  <h3
                    className="font-display text-xl sm:text-2xl text-foreground leading-tight"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", "Fraunces", Georgia, serif',
                    }}
                  >
                    {tab.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
                    {tab.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] uppercase clay-text mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
              Everything Clay, Under One Roof
            </h2>
            <ClayOrnament className="mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFER_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="card-hover bg-card rounded-2xl p-7 flex flex-col gap-4 border border-border shadow-warm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(var(--clay) / 0.10)" }}
                >
                  <span className="clay-text">{card.icon}</span>
                </div>
                <h3 className="font-display text-lg text-foreground leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}

            {/* Image card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="sm:col-span-2 lg:col-span-1 rounded-2xl overflow-hidden border border-border shadow-warm"
              style={{ minHeight: "220px" }}
            >
              <img
                src="/assets/generated/pottery-glazed.dim_600x400.jpg"
                alt="Glazed pottery pieces"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity shadow-clay"
            >
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────
// Page: Services (Open Space)
// ─────────────────────────────────────────────

function ServicesPage() {
  return (
    <section data-ocid="services.section" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Services"
          title="Open Studio"
          subtitle="Drop into the studio, bring your clay and tools, and work at your own rhythm. Create, experiment, and leave your piece with us to be fired in the studio. Practice. Create. Repeat"
        />

        <div className="flex flex-col gap-8 mb-10">
          {/* Hand Building */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Open Studio
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  Handbuilding
                </h2>
              </div>
              <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full self-start">
                ₹260
              </span>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Work freely with clay using hand-building techniques — pinching,
              coiling, and slab building. A great way to explore your creativity
              at your own pace in our open space.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Session Details
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    1 Session · 3 Hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Additional hour: ₹100
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Drop in any time between 10.00 to 5.30
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Guidelines
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Bring your own clay and tools
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Clean your workspace after use
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Storage not included (₹50/day if needed 43*43 cms)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Inform the team in advance if extra time is needed
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Wheel Throwing */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl"
              style={{ background: "oklch(var(--clay))" }}
            />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Open Studio · Most Popular
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  Wheel Throwing
                </h2>
              </div>
              <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full self-start">
                ₹280
              </span>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Experience the meditative art of wheel throwing. Center your clay,
              shape it on the spinning wheel, and walk away with a piece you
              made with your own hands.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Session Details
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    1 Session · 3 Hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Additional hour: ₹100
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Drop in any time between 10.00 to 5.30
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Guidelines
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Bring your own clay and tools
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Clean the wheel and workspace after use
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Inform the team in advance if extra time is needed
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Storage not included (₹50/day if needed 43*43 cms)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Glazing */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Open Studio
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  Glazing
                </h2>
              </div>
              <div className="flex flex-col gap-2 self-start">
                <div className="flex items-center gap-2">
                  <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                    ₹280
                  </span>
                  <span className="text-xs text-foreground/55">1 session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                    ₹560
                  </span>
                  <span className="text-xs text-foreground/55">
                    2 sessions / day
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Apply glazes to your bisque-fired pieces and bring colour and
              finish to your work. Ideal for those who have completed their
              pottery and are ready for the final step before kiln firing.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Session Details
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    1 session: ₹280
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 sessions per day: ₹560
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Guidelines
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Bring your own bisque-fired pottery pieces
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Bring your own glazing tools
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Kiln Firing Service */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Service
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  Kiln Firing Service
                </h2>
              </div>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Get your pottery fired by our team. We offer bisque firing and
              glaze firing services for pieces you've made — whether here or
              elsewhere. Drop off your work and we'll take care of the rest.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Services Available
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Bisque firing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Glaze firing
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Guidelines
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Drop off between 10:30 AM – 5:30 PM
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Pieces must be completely dry before firing
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Not responsible for damage from air bubbles, glaze faults,
                    or improper clay prep
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Additional charges may apply if a piece damages the kiln
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Glaze Formulation Course */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Course
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Glaze Formulation Course
              </h2>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Understanding glazes changes the way you see ceramics. Instead of
              relying on ready-made recipes, this course helps you understand
              why glazes behave the way they do. Over six sessions, we explore
              the fundamentals of glaze chemistry and move step by step into
              creating your own glazes with confidence. You will learn how
              different materials interact, how firing affects surfaces, and how
              small adjustments can completely transform the result. The course
              combines theory with hands-on practice. Participants will mix
              glazes, fire test tiles, analyse results, and refine their
              understanding through guided experiments.
            </p>
            <div className="section-divider" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                What You Will Learn
              </p>
              <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                {[
                  "Introduction to glazes and their components",
                  "Understanding glaze materials and how they function",
                  "Mixing and making glazes from raw materials",
                  "Evaluating glaze test tiles after firing",
                  "Using Glazy as a tool for glaze exploration and testing",
                  "Creating glossy, matte and satin matte glazes",
                  "Working with fluxes, opacifiers and colourants",
                  "Understanding common glaze defects and how to prevent them",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              By the end of the course, you will not just follow glaze recipes —
              you will understand how to develop and adjust them to suit your
              own work.
            </p>
          </motion.div>

          {/* Technical Firing Mastery */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Course
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Technical Firing Mastery
              </h2>
              <p className="text-sm text-foreground/55 mt-1">
                From Clay Body to Fire – Ceramic &amp; Kiln Firing Course
              </p>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Many potters learn firing through trial and error. This course is
              designed to change that. "From Clay Body to Fire" focuses on
              understanding what actually happens inside clay during firing and
              how to control the kiln with confidence. Instead of copying firing
              schedules, you will learn the logic behind them. Through a series
              of progressive sessions, we move from clay behaviour to practical
              kiln programming and firing strategies.
            </p>
            <div className="section-divider" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                Course Topics
              </p>
              <div className="flex flex-col gap-4 text-sm text-foreground/65">
                {[
                  {
                    topic: "Clay Body Behaviour",
                    points: [
                      "How clay transforms from a shaped form into a fired pot",
                      "The hidden changes that occur inside clay during firing",
                    ],
                  },
                  {
                    topic: "Clay Body Defects",
                    points: [
                      "Understanding issues such as cracks, warping and bloating",
                      "Learning how to prevent these problems before they happen",
                    ],
                  },
                  {
                    topic: "Kiln Firing Logic",
                    points: [
                      "Understanding firing programs instead of simply copying schedules",
                      "Bisque firing and glaze firing explained through firing curves",
                      "Using ramp, hold and drop-hold techniques to prevent blisters and pinholes",
                    ],
                  },
                  {
                    topic: "Kiln Programming & Loading",
                    points: [
                      "Hands-on kiln programming practice",
                      "Adjusting firing schedules for different clay bodies and thicknesses",
                      "Best practices for loading a kiln to avoid misfires and defects",
                    ],
                  },
                ].map((section) => (
                  <div key={section.topic}>
                    <p className="font-semibold text-foreground/80 mb-1">
                      {section.topic}
                    </p>
                    <ul className="flex flex-col gap-1 pl-2">
                      {section.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                What You Will Gain
              </p>
              <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                {[
                  "Insight into what most potters are never formally taught",
                  "The ability to diagnose why pots crack, warp or fail",
                  "Confidence to adjust firing schedules for your own work",
                  "Independence from guesswork or borrowed firing programs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              Most potters fire by habit. This course will help you fire with
              understanding.
            </p>
          </motion.div>

          {/* Clay Body Formulation */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Course
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Clay Body Formulation
              </h2>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Clay is the foundation of every ceramic piece, yet many potters
              work with ready-made clay bodies without fully understanding what
              makes them behave the way they do. This course is designed to help
              you understand clay from the inside out. Instead of relying only
              on commercial clay bodies, you will learn how to analyse, adjust
              and even create your own clay bodies to suit your work. Through
              practical sessions and testing, we explore how different raw
              materials affect plasticity, strength, drying behaviour and firing
              performance. The focus is not just on theory, but on learning how
              to make informed decisions while working with clay.
            </p>
            <div className="section-divider" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                What You Will Learn
              </p>
              <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                {[
                  "Understanding the basic components of a clay body",
                  "How different clays, fillers and fluxes affect performance",
                  "Plasticity, workability and drying behaviour",
                  "Shrinkage and how to control it",
                  "Strength of clay bodies at different stages",
                  "Common clay body defects and how to prevent them",
                  "Testing methods for clay bodies",
                  "Adjusting clay bodies for different forming techniques",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                Hands-on Learning
              </p>
              <p className="text-sm text-foreground/65 leading-relaxed">
                Participants will work directly with clay materials, mix small
                test batches and observe how they behave during drying and
                firing. By studying test results, you will develop a deeper
                understanding of how clay bodies can be improved or customised.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                By the End of the Course
              </p>
              <p className="text-sm text-foreground/65 leading-relaxed mb-2">
                You will gain the knowledge to:
              </p>
              <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                {[
                  "Understand why a clay body behaves the way it does",
                  "Adjust existing clay bodies to suit your making process",
                  "Begin developing clay bodies tailored to your own work",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              This course helps potters move from simply using clay to truly
              understanding it.
            </p>
          </motion.div>

          {/* Consultation */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Service
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Consultation
              </h2>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Every ceramic practice is different. Sometimes what you need is
              not a course, but focused guidance to solve a specific problem or
              refine your process. The consultation sessions are designed for
              potters, ceramic studios, and educators who want deeper technical
              understanding or help troubleshooting challenges in their work.
              Whether you are struggling with clay body issues, glaze defects,
              or inconsistent kiln firings, these sessions help you identify the
              root cause and find practical solutions.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  Areas of Consultation
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Clay body behaviour and formulation",
                    "Glaze formulation and glaze defects",
                    "Kiln firing schedules and troubleshooting",
                    "Clay body defects such as cracking, warping or bloating",
                    "Glaze issues like pinholing, blistering or crawling",
                    "Studio workflow and material testing methods",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  Who This Is For
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Individual potters",
                    "Ceramic studios",
                    "Artists developing new work",
                    "Educators and teaching studios",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                How It Works
              </p>
              <p className="text-sm text-foreground/65 leading-relaxed">
                Consultations are tailored to your specific needs. You can bring
                your questions, firing logs, glaze recipes, or clay samples, and
                we will analyse them together. The goal is not just to fix one
                problem, but to help you understand the process so you can make
                confident decisions in your future work.
              </p>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              Sometimes a small technical adjustment can transform your results.
              These sessions are meant to help you work with more clarity,
              control and confidence.
            </p>
          </motion.div>

          {/* Custom Glazes & Clay Body Development */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Service
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Custom Glazes &amp; Clay Body Development
              </h2>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Surface is one of the most defining aspects of ceramic work. The
              way a glaze melts, breaks, pools or settles on a clay body can
              completely transform a piece. This service focuses primarily on
              developing customised glazes, created specifically for your firing
              temperature, clay body and surface requirements. Alongside this,
              custom clay body recipes can also be developed for artists who
              want to mix their own clay.
            </p>
            <div className="section-divider" />
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                  Custom Glazes (Made to Order)
                </p>
                <p className="text-sm text-foreground/65 leading-relaxed mb-3">
                  Glazes are developed specifically against order, based on the
                  surface qualities you are looking for. Each glaze is carefully
                  formulated and tested to achieve stable surfaces and reliable
                  firing behaviour. The glazes are supplied in powder form,
                  ready to be mixed with water and used in the studio. Glaze
                  formulations are not shared, and each glaze is produced only
                  upon request.
                </p>
                <p className="text-xs font-semibold text-foreground/60 mb-2">
                  Possible surfaces include:
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Glossy glazes",
                    "Matte and satin matte glazes",
                    "Opaque or translucent surfaces",
                    "Colour variations and special effects",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                  Custom Clay Body Recipes
                </p>
                <p className="text-sm text-foreground/65 leading-relaxed mb-3">
                  For artists who want greater control over their materials,
                  custom clay body formulations can also be developed. Instead
                  of supplying finished clay bodies, you will receive a tested
                  clay body recipe that can be mixed and produced in your own
                  studio.
                </p>
                <p className="text-xs font-semibold text-foreground/60 mb-2">
                  This includes:
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Clay body formulation tailored to your firing temperature",
                    "Material ratios for mixing",
                    "Guidance on preparation and testing",
                    "Notes on drying and firing behaviour",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
                  Who This Is For
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Ceramic artists looking for custom glaze surfaces",
                    "Studios wanting reliable glazes suited to their firing conditions",
                    "Artists interested in developing their own clay bodies",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              The aim is to help artists work with materials that truly support
              their creative process.
            </p>
          </motion.div>

          {/* Glazing Service for Ceramic Artists */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-warm flex flex-col gap-5"
          >
            <div>
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Service
              </p>
              <h2 className="font-display text-2xl text-foreground">
                Glazing Service for Ceramic Artists
              </h2>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">
              Glazing can completely transform a ceramic piece, but it also
              requires time, materials and technical control. Many artists
              prefer to focus on making their forms while leaving the glazing
              process to someone experienced. This service is designed for
              ceramic artists who would like their work professionally glazed.
              You can bring your bisque-fired pieces, and the glazing will be
              done carefully using selected glaze surfaces to achieve consistent
              and well-finished results.
            </p>
            <div className="section-divider" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  What the Service Includes
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Professional glaze application on bisque-fired work",
                    "Selection of glaze surfaces suited to the form",
                    "Careful handling to maintain the integrity of the piece",
                    "Consistent and well-controlled glaze finishes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  Who This Is For
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Artists who enjoy making forms but prefer not to glaze",
                    "Studios that do not have glaze materials or space for glazing",
                    "Artists looking for reliable and well-finished glaze surfaces",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-sm text-foreground/65 italic leading-relaxed">
              Each piece is handled with attention to detail so that the glaze
              enhances the form rather than overpowering it. The goal is simple
              — to help your work reach its final stage with care and
              consistency.
            </p>
          </motion.div>
        </div>

        {/* Space image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="rounded-2xl overflow-hidden shadow-clay-lg"
          style={{ maxHeight: "380px" }}
        >
          <img
            src="/assets/generated/pottery-studio.dim_600x400.jpg"
            alt="Claze Creative Space interior"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page: Programs
// ─────────────────────────────────────────────

function ProgramsPage() {
  return (
    <section data-ocid="programs.section" className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Programs"
          title="Learn, Grow & Create"
          subtitle="From one-time community experiences to structured multi-week programs, find the right path for your pottery journey."
        />

        <div className="flex flex-col gap-8">
          {/* Community Clay Experience */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-warm p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Experience
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                  Community Clay Experience
                </h2>
              </div>
              <div className="flex flex-col gap-2 min-w-fit">
                <div className="flex items-center gap-2">
                  <span className="price-badge text-sm font-bold px-4 py-1.5 rounded-full">
                    ₹2,600
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground/65 leading-relaxed mb-5">
              A fun, guided pottery session perfect for beginners, groups, and
              anyone curious about clay. You'll spend time handbuilding your own
              piece and get a hands-on taste of the wheel — no experience
              needed. Your finished work will be fired and ready for you to take
              home.
            </p>

            <div className="section-divider mb-5" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Session Details */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  Session Details
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    1 session · 3 hours total
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2.5 hrs handbuilding
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    30 mins wheel throwing experience
                  </li>
                </ul>
              </div>

              {/* What's Included */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase clay-text">
                  What's Included
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Clay, tools &amp; apron provided
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Instructor guidance throughout
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Finished piece fired &amp; ready for collection
                  </li>
                </ul>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mb-5">
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                Guidelines
              </p>
              <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  No prior pottery experience required.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  All materials and tools are provided — just come ready to
                  create.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  Finished pottery pieces will be fired and prepared for
                  collection at a later date.
                </li>
              </ul>
            </div>

            {/* Refund Policy */}
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: "oklch(var(--clay) / 0.07)" }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-1">
                Refund Policy
              </p>
              <p className="flex items-start gap-2 text-sm text-foreground/65">
                <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Cancellation 2 days before the session: 75% refund.
              </p>
              <p className="flex items-start gap-2 text-sm text-foreground/65">
                <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Cancellation within 2 days of the session: No refund.
              </p>
            </div>
          </motion.div>

          {/* Structured Wheel Throwing & Handbuilding */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-warm p-8"
          >
            <div className="mb-5">
              <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                Structured Course
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                Wheel Throwing &amp; Handbuilding
              </h2>
            </div>
            <div className="section-divider mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Beginner */}
              <div
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ background: "oklch(var(--beige-mid) / 0.5)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-foreground/50 font-semibold mb-1">
                      Level
                    </p>
                    <h3 className="font-display text-xl text-foreground">
                      Beginner
                    </h3>
                  </div>
                  <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
                    ₹15,000
                  </span>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    14 sessions · 3 hrs each · Mon – Sun
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    10 + 4 flexible practice sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 clay bags will be provided
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Tools &amp; apron available in the space
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 glazing sessions with expert instructors
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    4 products to take home (Glaze fired)
                  </li>
                </ul>
              </div>

              {/* Intermediate */}
              <div
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ background: "oklch(var(--beige-mid) / 0.5)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-foreground/50 font-semibold mb-1">
                      Level
                    </p>
                    <h3 className="font-display text-xl text-foreground">
                      Intermediate
                    </h3>
                  </div>
                  <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
                    ₹20,000
                  </span>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    16 sessions · 3 hrs each
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    12 sessions with instructor + 4 flexible practice sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 clay bags will be provided
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Tools &amp; apron available in the space
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 glazing sessions with expert instructors
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    4 products to take home (Glaze fired)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Kiln & Glaze Row */}
          <div className="flex flex-col gap-6">
            {/* Technical Firing Mastery */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-hover bg-card rounded-2xl border border-border shadow-warm p-7 flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                    Specialization
                  </p>
                  <h2 className="font-display text-2xl text-foreground">
                    Technical Firing Mastery
                  </h2>
                  <p className="text-sm clay-text mt-1 italic">
                    From Clay Body to Fire – Ceramic &amp; Kiln Firing Course
                  </p>
                </div>
                <span className="price-badge text-lg font-bold px-5 py-2 rounded-full self-start whitespace-nowrap">
                  ₹9,300
                </span>
              </div>
              <p className="text-sm text-foreground/65 leading-relaxed">
                Many potters learn firing through trial and error. This course
                is designed to change that. "From Clay Body to Fire" focuses on
                understanding what actually happens inside clay during firing
                and how to control the kiln with confidence. Instead of copying
                firing schedules, you will learn the logic behind them. Through
                a series of progressive sessions, we move from clay behaviour to
                practical kiln programming and firing strategies.
              </p>
              <div className="section-divider" />
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  Course Topics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      topic: "Clay Body Behaviour",
                      points: [
                        "How clay transforms from a shaped form into a fired pot",
                        "The hidden changes that occur inside clay during firing",
                      ],
                    },
                    {
                      topic: "Clay Body Defects",
                      points: [
                        "Understanding issues such as cracks, warping and bloating",
                        "Learning how to prevent these problems before they happen",
                      ],
                    },
                    {
                      topic: "Kiln Firing Logic",
                      points: [
                        "Understanding firing programs instead of simply copying schedules",
                        "Bisque firing and glaze firing explained through firing curves",
                        "Using ramp, hold and drop-hold techniques to prevent blisters and pinholes",
                      ],
                    },
                    {
                      topic: "Kiln Programming & Loading",
                      points: [
                        "Hands-on kiln programming practice",
                        "Adjusting firing schedules for different clay bodies and thicknesses",
                        "Best practices for loading a kiln to avoid misfires and defects",
                      ],
                    },
                  ].map((section) => (
                    <div key={section.topic} className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {section.topic}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {section.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex items-start gap-2 text-sm text-foreground/65"
                          >
                            <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-divider" />
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  What You Will Gain
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Insight into what most potters are never formally taught",
                    "The ability to diagnose why pots crack, warp or fail",
                    "Confidence to adjust firing schedules for your own work",
                    "Independence from guesswork or borrowed firing programs",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-foreground/65 italic leading-relaxed">
                Most potters fire by habit. This course will help you fire with
                understanding.
              </p>
            </motion.div>

            {/* Glaze Formulation Course */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-hover bg-card rounded-2xl border border-border shadow-warm p-7 flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                    Advanced
                  </p>
                  <h2 className="font-display text-2xl text-foreground">
                    Glaze Formulation Course
                  </h2>
                </div>
                <span className="price-badge text-lg font-bold px-5 py-2 rounded-full self-start whitespace-nowrap">
                  ₹18,000
                </span>
              </div>
              <p className="text-sm text-foreground/65 leading-relaxed">
                Understanding glazes changes the way you see ceramics. Instead
                of relying on ready-made recipes, this course helps you
                understand why glazes behave the way they do. Over six sessions,
                we explore the fundamentals of glaze chemistry and move step by
                step into creating your own glazes with confidence. You will
                learn how different materials interact, how firing affects
                surfaces, and how small adjustments can completely transform the
                result. The course combines theory with hands-on practice.
                Participants will mix glazes, fire test tiles, analyse results,
                and refine their understanding through guided experiments.
              </p>
              <div className="section-divider" />
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
                  What You Will Learn
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  {[
                    "Introduction to glazes and their components",
                    "Understanding glaze materials and how they function",
                    "Mixing and making glazes from raw materials",
                    "Evaluating glaze test tiles after firing",
                    "Using Glazy as a tool for glaze exploration and testing",
                    "Creating glossy, matte and satin matte glazes",
                    "Working with fluxes, opacifiers and colourants",
                    "Understanding common glaze defects and how to prevent them",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-foreground/65 italic leading-relaxed">
                By the end of the course, you will not just follow glaze recipes
                — you will understand how to develop and adjust them to suit
                your own work.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page: About
// ─────────────────────────────────────────────

function AboutPage() {
  return (
    <section data-ocid="about.section" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Images — stacked column */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <img
                src="/assets/generated/pottery-community.dim_800x500.jpg"
                alt="Pottery space community"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <img
                src="/assets/generated/hands-on-wheel.dim_800x500.jpg"
                alt="Hands on the wheel"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <img
                src="/assets/generated/pottery-display.dim_800x500.jpg"
                alt="Handmade ceramic collection"
                className="w-full h-56 object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase clay-text mb-3">
                About Us
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-snug">
                Claze Creative Space
              </h1>
              <ClayOrnament className="mt-4" />
            </div>

            <div className="flex flex-col gap-4 text-foreground/70 leading-relaxed text-base">
              <p>
                Claze Creative is a space dedicated to exploring ceramics from
                the first touch of clay to the final fired surface.
              </p>
              <p>
                Ceramics is both a creative and a technical practice. While many
                artists begin with the joy of shaping clay, a deeper
                understanding of materials, glazes and firing opens up new
                possibilities in the work. The aim of Claze Creative is to
                bridge this gap between creative practice and material knowledge
                for artists.
              </p>
              <p>
                Through courses, workshops and shared studio experiences, the
                space encourages artists to not only make with clay, but also to
                understand how it behaves, transforms and responds through every
                stage of the ceramic process.
              </p>
              <p className="font-semibold text-foreground/80">
                At Claze Creative, the focus includes:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Wheel throwing from beginner to advanced levels
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Handbuilding workshops exploring different ways of working
                  with clay
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Community clay experiences that bring people together through
                  making
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Technical ceramic learning such as clay body formulation,
                  glaze formulation and kiln firing mastery
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Custom glaze development and glazing services for artists
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-1" />
                  Consultations for studios and ceramic practitioners
                </li>
              </ul>
              <p>
                The intention is to create a place where making and material
                understanding grow together. Whether someone is touching clay
                for the first time or deepening their technical knowledge, Claze
                Creative supports artists in building confidence, curiosity and
                independence in their ceramic practice.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: "Programs", value: "6+" },
                { label: "Sessions / week", value: "7 days" },
                { label: "Location", value: "HSR Layout" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl clay-text font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity shadow-clay w-fit"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page: Contact
// ─────────────────────────────────────────────

function ContactPage() {
  return (
    <section data-ocid="contact.section" className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <PageHeader eyebrow="Contact" title="Come Find Us" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-warm p-8 flex flex-col gap-6"
          >
            <h2 className="font-display text-xl text-foreground">
              Get in Touch
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(var(--clay) / 0.10)" }}
                >
                  <MapPin className="h-5 w-5 clay-text" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Address
                  </p>
                  <p className="text-sm text-foreground/65 leading-relaxed">
                    221, 9th Main Road, 15th Cross Rd,
                    <br />
                    Sector 6, HSR Layout,
                    <br />
                    Bengaluru, Karnataka 560102
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(var(--clay) / 0.10)" }}
                >
                  <Clock className="h-5 w-5 clay-text" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Hours
                  </p>
                  <p className="text-sm text-foreground/65">
                    Open Daily · 10:00 AM – 8:30 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(var(--clay) / 0.10)" }}
                >
                  <Phone className="h-5 w-5 clay-text" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:9187152615"
                    className="text-sm text-foreground/65 hover:text-foreground transition-colors"
                  >
                    +91 91871 52615
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(var(--clay) / 0.10)" }}
                >
                  <Mail className="h-5 w-5 clay-text" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:claze.info@gmail.com"
                    className="text-sm text-foreground/65 hover:text-foreground transition-colors break-all"
                  >
                    claze.info@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="section-divider" />

            <a
              href="tel:9187152615"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              <Phone className="h-4 w-4" />
              Call to Book a Session
            </a>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-border shadow-warm"
            style={{ minHeight: "360px" }}
          >
            <iframe
              title="Claze Creative Space Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9366636499!2d77.6407!3d12.9116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s221%2C%209th%20Main%20Road%2C%2015th%20Cross%20Rd%2C%20Sector%206%2C%20HSR%20Layout%2C%20Bengaluru%2C%20Karnataka%20560102!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "360px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page: Policies
// ─────────────────────────────────────────────

interface PolicySection {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

function PolicyAccordionItem({
  section,
  index,
}: {
  section: PolicySection;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-card rounded-2xl border border-border shadow-warm overflow-hidden"
      data-ocid={`policies.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/40 transition-colors"
        data-ocid={`policies.toggle.${index + 1}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {section.badge && (
            <span
              className="hidden sm:inline text-xs font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "oklch(var(--clay) / 0.12)",
                color: "oklch(var(--clay))",
              }}
            >
              {section.badge}
            </span>
          )}
          <h2 className="font-display text-lg sm:text-xl text-foreground leading-snug">
            {section.title}
          </h2>
        </div>
        <ChevronDown
          className={`h-5 w-5 clay-text flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1">
              <div className="section-divider mb-5" />
              <div className="text-sm text-foreground/70 leading-relaxed">
                {section.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PoliciesPage() {
  const policies: PolicySection[] = [
    {
      id: "open-studio",
      title: "Open Studio Policy",
      badge: "Drop-in",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Session Details
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Duration: 3 hours per session
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Wheel Throwing: ₹280
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Handbuilding: ₹260
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Additional Hour: ₹100 per hour
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Guidelines
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Participants must bring their own clay and tools.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Wheels and workspaces must be cleaned after use.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Storage is not included. If required, ₹50 per day applies.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                If additional time is needed, inform the team in advance.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "community-clay",
      title: "Community Clay Experience",
      badge: "Experience",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Session Details
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Total Duration: 3 hours (2.5 hrs handbuilding + 30 mins wheel
                throwing)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                ₹2,000 – Without glazing
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                ₹2,600 – With glazing
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Guidelines
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                No prior pottery experience required.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Instructor guidance provided throughout the session.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Finished pieces will be fired and available for collection
                later.
              </li>
            </ul>
          </div>
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "oklch(var(--clay) / 0.07)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-1">
              Refund Policy
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Cancellation 2 days before the session: 75% refund.
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Cancellation within 2 days of the session: No refund.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "beginner-course",
      title: "Structured Wheel Throwing & Handbuilding – Beginner Course",
      badge: "Course",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Course Details
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Available as Weekend or Weekday course
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Total Sessions: 10 guided sessions + 4 practice sessions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Duration: 3 hours per session
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Course Includes
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "10 instructor-led sessions",
                "4 flexible practice sessions without instructor guidance",
                "2 glazing sessions with instructor guidance",
                "2 bags of clay",
                "Space tools and apron for use inside the space",
                "Bisque firing for up to 4 finished pottery pieces",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
              ₹15,000
            </span>
          </div>
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "oklch(var(--clay) / 0.07)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-1">
              Refund Policy
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Cancellation 7 days before course start: 75% refund.
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              No refund once the course has started. Participants may join the
              next available batch.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "intermediate-course",
      title: "Structured Wheel Throwing & Handbuilding – Intermediate Course",
      badge: "Course",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Course Details
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Available as Weekend or Weekday course
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Total Sessions: 12 guided sessions + 4 practice sessions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Duration: 3 hours per session
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Course Includes
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "12 instructor-led sessions",
                "4 flexible practice sessions without instructor guidance",
                "2 glazing sessions with instructor guidance",
                "2 bags of clay",
                "Space tools and apron for use inside the space",
                "Bisque firing for up to 4 finished pottery pieces",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
              ₹20,000
            </span>
          </div>
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "oklch(var(--clay) / 0.07)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-1">
              Refund Policy
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Cancellation 7 days before course start: 75% refund.
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              No refund once the course has started. Participants may join the
              next available batch.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "handbuilding-session",
      title: "Handbuilding Session Policy",
      badge: "Session",
      content: (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Duration: 3 hours
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Fee: ₹260 per session
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "glaze-application",
      title: "Glaze Application Policy",
      badge: "Session",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Session Details
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                1 session: ₹280
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                2 sessions per day: ₹560
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Guidelines
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Participants must bring their own bisque-fired pottery pieces.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Space glazes will not be provided.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Participants must bring their own glazing tools.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "kiln-masterclass",
      title: "Kiln Master Class Policy",
      badge: "Masterclass",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Course Covers
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Understanding what happens inside the kiln during firing",
                "Identifying and avoiding clay body and glaze defects such as warping, cracks, pinholing, and blistering",
                "Understanding kiln firing programs including bisque firing, glaze firing, and through firing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
              ₹9,300
            </span>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: "oklch(var(--clay) / 0.07)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
              Refund Policy
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              No refunds are available. Participants may join a future batch if
              they miss the course.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "glaze-formulation",
      title: "Glaze Formulation Course Policy",
      badge: "Advanced",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Topics Covered
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Understanding raw materials",
                "Glaze chemistry basics",
                "Introduction and usage of Glazy",
                "Experimentation with glossy, matte, and satin matte glazes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span className="price-badge text-base font-bold px-4 py-1.5 rounded-full">
              ₹18,000
            </span>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: "oklch(var(--clay) / 0.07)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-2">
              Refund Policy
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              No refunds are available. Participants may join a future batch if
              needed.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "kiln-firing-service",
      title: "Kiln Firing Service Policy",
      badge: "Service",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Services Available
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Bisque firing
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Glaze firing
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase clay-text mb-3">
              Guidelines
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Pottery pieces must be dropped off between 10:30 AM and 5:30 PM.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                Pieces must be completely dry before firing.
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                The space is not responsible for damages caused by air bubbles,
                glaze faults, or improper clay preparation.
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                If a piece causes damage to the kiln during firing, additional
                charges may apply depending on the extent of the damage.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "storage-collection",
      title: "Storage & Collection Policy",
      badge: "Storage",
      content: (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Finished pottery pieces must be collected within the time period
              informed by the space.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Due to limited storage space, uncollected pieces may be discarded
              after the storage period.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "breakage-damage",
      title: "Breakage & Ceramic Damage Policy",
      badge: "Liability",
      content: (
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              Ceramic pieces are fragile and may crack or break during drying,
              glazing, or firing.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              While the space takes great care during the process, Claze
              Creative Space cannot guarantee that every piece will survive
              firing.
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
              The space is not responsible for damage caused by clay body
              issues, trapped air, glaze reactions, or firing behavior.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section data-ocid="policies.section" className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Policies"
          title="Class & Service Policies"
          subtitle="Please read our policies carefully before booking any session, course, or service at Claze Creative Space."
        />

        <div className="flex flex-col gap-4">
          {policies.map((section, i) => (
            <PolicyAccordionItem key={section.id} section={section} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-foreground/55 mb-4">
            Questions about any of our policies?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity shadow-clay"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Router setup (hash-based for ICP)
// ─────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const programsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs",
  component: ProgramsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const policiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/policies",
  component: PoliciesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  programsRoute,
  aboutRoute,
  policiesRoute,
  contactRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
