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
  { label: "Services", to: "/services", ocid: "nav.services.link" },
  { label: "Programs", to: "/programs", ocid: "nav.programs.link" },
  { label: "About Us", to: "/about", ocid: "nav.about.link" },
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
                label: "About Us",
                to: "/about",
                ocid: "home.about.tab",
                desc: "Bengaluru's collective pottery space in the heart of HSR Layout.",
                icon: "🌿",
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
          title="Open Space"
          subtitle="Drop in and practice your craft. Bring your own clay and tools, work at your own pace, and take your finished piece home. No commitment needed — just creativity."
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
                  Open Space
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
                    Take your product home
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
                    Storage not included (₹50/day if needed)
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
                  Open Space · Most Popular
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
                    Take your product home
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
                  Open Space
                </p>
                <h2 className="font-display text-2xl text-foreground">
                  Glaze Application
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
                    Space glazes will not be provided
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
                    ₹2,000
                  </span>
                  <span className="text-xs text-foreground/55">
                    without glazing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="price-badge text-sm font-bold px-4 py-1.5 rounded-full">
                    ₹2,600
                  </span>
                  <span className="text-xs text-foreground/55">
                    with glazing
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
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    Optional glazing upgrade available
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
                    6 sessions with instructor + 4 practice sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 clay bags to take home
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
                    4 products to take home (Bisque fired)
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
                    12 sessions with instructor + 4 without
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0 mt-0.5" />
                    2 clay bags to take home
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
                    4 products to take home (Bisque fired)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Kiln & Glaze Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Kiln Classes */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-hover bg-card rounded-2xl border border-border shadow-warm p-7 flex flex-col gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(var(--clay) / 0.10)" }}
              >
                <Flame className="h-6 w-6 clay-text" />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Specialization
                </p>
                <h2 className="font-display text-xl text-foreground">
                  Kiln Classes
                </h2>
              </div>
              <div className="section-divider" />
              <ul className="flex flex-col gap-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                  Basic to Intermediate level
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                  Learn kiln operation &amp; firing
                </li>
              </ul>
              <div className="mt-auto">
                <span className="price-badge text-lg font-bold px-5 py-2 rounded-full">
                  ₹9,300
                </span>
              </div>
            </motion.div>

            {/* Glaze Formulation */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-hover bg-card rounded-2xl border border-border shadow-warm p-7 flex flex-col gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(var(--clay) / 0.10)" }}
              >
                <Sparkles className="h-6 w-6 clay-text" />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase clay-text font-semibold mb-1">
                  Advanced
                </p>
                <h2 className="font-display text-xl text-foreground">
                  Glaze Formulation
                </h2>
              </div>
              <div className="section-divider" />
              <ul className="flex flex-col gap-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                  Formulate &amp; make your own glazes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                  Work with experienced professionals
                </li>
              </ul>
              <div className="mt-auto">
                <span className="price-badge text-lg font-bold px-5 py-2 rounded-full">
                  ₹18,000
                </span>
              </div>
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
                A Space to Shape, Fire &amp; Create Together
              </h1>
              <ClayOrnament className="mt-4" />
            </div>

            <div className="flex flex-col gap-4 text-foreground/70 leading-relaxed text-base">
              <p>
                Claze Creative Space is Bengaluru's collective pottery space,
                nestled in the heart of HSR Layout. We built this space as a
                warm, welcoming community for anyone who wants to work with clay
                — whether you've never touched a wheel or you've been throwing
                for years.
              </p>
              <p>
                We offer everything from drop-in open space sessions to
                structured multi-week courses, community experiences for groups,
                and specialized kiln and glaze programs. Our team of experienced
                instructors is here to guide you every step of the way.
              </p>
              <p>
                Come in with curiosity, leave with something you made yourself.
                That's the Claze way.
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
