"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const normalizedEmail = form.email.trim().toLowerCase();

    // 🔐 NextAuth login
     const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password.");
      toast.error("Sign in failed", { description: "Check your credentials and try again." });
      setIsSubmitting(false);
      return;
    }

    toast.success("Signed in");
    router.push("/control-center");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-bg-hero-from via-bg-hero-via to-bg-canvas px-4">
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/15 border border-brand-primary/30">
            <ShieldCheck className="w-6 h-6 text-brand-cyan" />
          </div>
          <p className="mt-3 text-xs font-mono uppercase tracking-widest text-text-subtle">
            BreachGuard
          </p>
          <h1 className="font-heading text-xl font-bold text-text-primary">Control Center</h1>
          <p className="mt-1 text-sm text-text-muted">Administrator sign in</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-2xl shadow-black/40"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted font-mono"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="focus-ring w-full rounded-lg border border-border-medium bg-bg-input px-3 py-2.5 text-sm text-text-primary placeholder-text-dim"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted font-mono"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-border-medium bg-bg-input px-3 py-2.5 pr-10 text-sm text-text-primary placeholder-text-dim"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-text-muted transition-colors hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-critical-light">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-brand-hover py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
