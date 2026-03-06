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
  CheckCircle2,
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
import { useEffect, useState } from "react";

const CURRENT_YEAR = new Date().getFullYear();

// ─────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────

function ClayOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
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
            src="/assets/uploads/looogo-1.jpeg"
            alt="Claze Creative Space Logo"
            className="h-10 w-10 object-contain rounded-md"
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
              src="/assets/uploads/looogo-1.jpeg"
              alt="Claze Logo"
              className="h-10 w-10 object-contain rounded-md"
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
            src="/assets/generated/pottery-hero.dim_1200x700.jpg"
            alt="Pottery workspace background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
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
              src="/assets/uploads/looogo-1.jpeg"
              alt="Claze Creative Space"
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain rounded-2xl shadow-clay mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm font-semibold tracking-[0.25em] uppercase clay-text">
              Bengaluru's Collective Pottery Space
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight">
              Claze Creative Space
            </h1>
            <ClayOrnament className="my-1" />
            <p className="text-base sm:text-lg text-foreground/70 max-w-xl leading-relaxed">
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
              className="px-8 py-3.5 border border-primary/50 text-primary font-semibold rounded-full hover:bg-muted/60 transition-colors duration-200"
            >
              View Programs
            </Link>
          </motion.div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Hand Building */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-hover bg-card rounded-2xl p-7 border border-border shadow-warm flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl text-foreground">
                Hand Building
              </h2>
              <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                ₹260
              </span>
            </div>
            <div className="section-divider" />
            <ul className="flex flex-col gap-2 text-sm text-foreground/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />1
                Session · 3 Hours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                Bring your own clay &amp; tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                Take your product home
              </li>
            </ul>
          </motion.div>

          {/* Wheel Throwing */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-hover bg-card rounded-2xl p-7 border border-border shadow-warm flex flex-col gap-4 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 left-0 h-1 rounded-t-2xl"
              style={{ background: "oklch(var(--clay))" }}
            />
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl text-foreground">
                Wheel Throwing
              </h2>
              <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                ₹280
              </span>
            </div>
            <div className="section-divider" />
            <ul className="flex flex-col gap-2 text-sm text-foreground/70">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />1
                Session · 3 Hours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                Bring your own clay &amp; tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                Take your product home
              </li>
            </ul>
            <p className="text-xs text-clay font-semibold mt-auto">
              ✦ Most Popular
            </p>
          </motion.div>

          {/* Glazing */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-hover bg-card rounded-2xl p-7 border border-border shadow-warm flex flex-col gap-4"
          >
            <h2 className="font-display text-xl text-foreground">Glazing</h2>
            <div className="section-divider" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">1 Session</span>
                <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                  ₹280
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">
                  2 Sessions / day
                </span>
                <span className="price-badge text-sm font-bold px-3 py-1 rounded-full">
                  ₹560
                </span>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-foreground/70 mt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                No tools needed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                Bring your own clay
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Space image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
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
            <div className="section-divider mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground/80">
                  Session Details
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    1 session · 3 hours total
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    2 hrs hand building
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    30 mins wheel throwing experience
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground/80">
                  What's Included
                </p>
                <ul className="flex flex-col gap-2 text-sm text-foreground/65">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    Clay, tools &amp; apron provided
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    Take your finished product home
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 clay-text flex-shrink-0" />
                    Optional glazing upgrade available
                  </li>
                </ul>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden shadow-clay-lg"
          >
            <img
              src="/assets/generated/pottery-handbuilding.dim_600x400.jpg"
              alt="Handbuilding pottery at Claze Creative Space"
              className="w-full h-80 lg:h-full object-cover"
              loading="lazy"
            />
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  programsRoute,
  aboutRoute,
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
