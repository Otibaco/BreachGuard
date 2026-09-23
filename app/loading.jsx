"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-canvas px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_54%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-cyan border-r-brand-cyan/60"
          />
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 rounded-full border border-border-subtle bg-white/[0.02]"
          />
          <ShieldCheck className="h-7 w-7 text-brand-cyan" strokeWidth={2.1} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mt-6 font-heading text-sm font-semibold tracking-[0.24em] text-text-secondary uppercase"
        >
          BreachGuard
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim"
        >
          Loading
          <motion.span
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="ml-1 inline-block"
          >
            ...
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
}
