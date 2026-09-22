import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-darker mt-auto text-xs text-text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-cyan">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span className="font-heading font-bold text-sm tracking-tight text-text-secondary uppercase">
            Breach<span className="text-brand-cyan">Guard</span>
          </span>
          <span className="text-text-dim">|</span>
          <span className="text-text-subtle">
            Zero raw email retention &bull; Privacy-first assessment
          </span>
        </div>

        <div className="flex items-center gap-5 text-text-subtle font-mono text-[11px]">
          <span>&copy; {new Date().getFullYear()} BreachGuard</span>
          <Link href="/control-center/login" className="text-text-muted hover:text-brand-cyan transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
