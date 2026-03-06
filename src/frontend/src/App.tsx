import { motion } from "motion/react";

const CURRENT_YEAR = new Date().getFullYear();

// Ornamental diamond SVG separator
function DiamondSeparator() {
  return (
    <div className="flex items-center gap-4 w-full max-w-xs mx-auto">
      <div className="ornament-line flex-1" />
      <svg
        role="img"
        aria-label="Diamond ornament"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="flex-shrink-0"
      >
        <title>Diamond ornament</title>
        <rect
          x="5"
          y="0.5"
          width="6.36"
          height="6.36"
          transform="rotate(45 5 5)"
          fill="oklch(var(--gold) / 0.7)"
        />
      </svg>
      <div className="ornament-line flex-1" />
    </div>
  );
}

export default function App() {
  return (
    <div className="grain min-h-screen bg-radial-glow flex flex-col font-body">
      {/* NAV */}
      <header
        data-ocid="nav.section"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.08 0.010 60 / 0.95), oklch(0.08 0.010 60 / 0))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Left ornament */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="w-6 h-px"
            style={{ background: "oklch(var(--gold) / 0.4)" }}
          />
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: "oklch(var(--gold) / 0.5)" }}
          />
        </div>

        {/* Center logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mx-auto sm:mx-0"
        >
          <img
            src="/assets/uploads/looogo-1.jpeg"
            alt="Logo"
            className="h-12 w-12 object-contain rounded logo-glow-sm"
            style={{ imageRendering: "crisp-edges" }}
          />
        </motion.div>

        {/* Right ornament */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: "oklch(var(--gold) / 0.5)" }}
          />
          <div
            className="w-6 h-px"
            style={{ background: "oklch(var(--gold) / 0.4)" }}
          />
        </div>
      </header>

      {/* HERO */}
      <main
        data-ocid="hero.section"
        className="flex-1 flex flex-col items-center justify-center min-h-screen pt-20 pb-24 px-6"
      >
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xs mb-10"
        >
          <DiamondSeparator />
        </motion.div>

        {/* Hero logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10"
        >
          {/* Glow ring behind logo */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.15 140) 0%, transparent 70%)",
              transform: "scale(1.4)",
            }}
          />
          <img
            src="/assets/uploads/looogo-1.jpeg"
            alt="Logo"
            className="relative z-10 rounded-lg logo-glow"
            style={{
              width: "clamp(180px, 30vw, 280px)",
              height: "clamp(180px, 30vw, 280px)",
              objectFit: "contain",
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p
            className="font-display text-sm tracking-[0.35em] uppercase"
            style={{ color: "oklch(var(--gold) / 0.65)" }}
          >
            Welcome
          </p>
        </motion.div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xs mt-10"
        >
          <DiamondSeparator />
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-6 px-4">
        <p
          className="text-xs tracking-widest"
          style={{ color: "oklch(var(--muted-foreground) / 0.5)" }}
        >
          © {CURRENT_YEAR}. Built with{" "}
          <span style={{ color: "oklch(var(--gold) / 0.7)" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="footer.link"
            className="hover:underline transition-opacity hover:opacity-100"
            style={{ color: "oklch(var(--gold) / 0.6)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
