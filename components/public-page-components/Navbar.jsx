"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

function MenuToggleIcon({ open }) {
  return (
    <div className="relative h-5 w-5">
      <span
        className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? "translate-y-2 rotate-45" : "translate-y-0 rotate-0"
        }`}
      />
      <span
        className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? "-translate-y-2 -rotate-45" : "translate-y-0 rotate-0"
        }`}
      />
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/" && window.location.hash === "#email-checker") {
      const timer = setTimeout(() => {
        const el = document.getElementById("email-checker");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          const input = document.getElementById("breach-email-input");
          if (input) input.focus();
        }
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  function handleCheckClick(e) {
    e.preventDefault();
    setMobileMenuOpen(false);

    const scrollToChecker = () => {
      const el = document.getElementById("email-checker");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const input = document.getElementById("breach-email-input");
        if (input) input.focus();
        return true;
      }
      return false;
    };

    if (pathname === "/") {
      scrollToChecker();
      return;
    }

    router.push("/#email-checker");
    setTimeout(() => {
      scrollToChecker();
    }, 220);
  }

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-bg-canvas/70 px-3 py-2 shadow-[0_18px_50px_rgba(8,15,28,0.36)] backdrop-blur-xl ring-1 ring-white/5 sm:px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full text-text-secondary transition-colors hover:text-text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-cyan shadow-[0_0_24px_rgba(56,189,248,0.25)]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span className="font-heading text-base font-bold uppercase tracking-[-0.06em] text-text-secondary sm:text-lg">
              Breach<span className="text-brand-cyan">Guard</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-brand-primary/12 text-brand-cyan ring-1 ring-brand-primary/20"
                      : "text-text-muted hover:bg-white/5 hover:text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {/* <div className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[10px] uppercase tracking-[0.28em] text-text-dim">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-brand-cyan" />
                secure
              </span>
            </div> */}

            <button
              type="button"
              onClick={handleCheckClick}
              className="group inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/12 px-4 py-2 text-sm font-semibold text-brand-cyan transition-all hover:border-brand-primary/40 hover:bg-brand-primary/18 hover:shadow-[0_0_28px_rgba(56,189,248,0.2)]"
            >
              Check Email
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text-primary transition-all hover:border-brand-primary/30 hover:bg-brand-primary/8 md:hidden"
          >
            <MenuToggleIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#020817]/55 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col border-l border-white/10 bg-bg-surface/95 p-4 shadow-[0_0_45px_rgba(2,6,23,0.7)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/25 bg-brand-primary/10 text-brand-cyan">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span className="font-heading text-base font-bold uppercase tracking-[-0.06em] text-text-primary">
                    Breach<span className="text-brand-cyan">Guard</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-text-primary"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-base font-medium transition-all ${
                      pathname === link.href
                        ? "border-brand-primary/25 bg-brand-primary/10 text-brand-cyan"
                        : "border-white/5 bg-white/[0.02] text-text-secondary hover:border-white/10 hover:text-text-primary"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={handleCheckClick}
                className="mt-auto flex items-center justify-between rounded-2xl border border-brand-primary/25 bg-brand-primary/10 px-4 py-3.5 text-left text-base font-semibold text-brand-cyan"
              >
                <span>Check Email</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
