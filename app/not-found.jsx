import Link from "next/link";
import { Ghost, ArrowRight, Home } from "lucide-react";
import Footer from "@/components/public-page-components/Footer";
import Navbar from "@/components/public-page-components/Navbar";

export const metadata = {
  title: "Page not found — BreachGuard",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden border-b border-border-subtle bg-gradient-to-b from-bg-hero-from via-bg-hero-via to-bg-canvas px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 border border-brand-primary/25 text-brand-cyan">
            <Ghost className="w-8 h-8" strokeWidth={1.75} />
          </div>

          <p className="mt-6 font-heading text-7xl font-bold text-text-primary">404</p>
          <h1 className="mt-2 font-heading text-xl font-bold text-text-primary">
            This page isn&rsquo;t in our records.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            The page you&rsquo;re looking for doesn&rsquo;t exist, may have
            moved, or the link might be broken.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-brand-hover px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              href="/#email-checker"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border-medium bg-bg-card px-5 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-brand-primary/40"
            >
              Check your email
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
