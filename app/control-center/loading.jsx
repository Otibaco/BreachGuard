"use client";

import { motion } from "framer-motion";

const statCards = Array.from({ length: 4 }, (_, index) => index);
const panels = Array.from({ length: 2 }, (_, index) => index);

export default function ControlCenterLoading() {
  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-bg-canvas">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%),linear-gradient(to_bottom,#0b0f17,#0f172a)]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-10 rounded-xl border border-border-subtle bg-bg-card/70"
          />
          <motion.div
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
            className="h-10 w-10 rounded-xl border border-border-subtle bg-bg-card/70 lg:hidden"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <div>
            <motion.div
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-7 w-40 rounded-md border border-border-subtle bg-bg-card/80"
            />
            <motion.div
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
              className="mt-2 h-4 w-64 rounded-md border border-border-subtle bg-bg-card/70"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.25 }}
                className="h-28 rounded-2xl border border-border-subtle bg-bg-card/70 shadow-sm shadow-black/10"
              >
                <motion.div
                  animate={{ opacity: [0.28, 0.8, 0.28] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                  className="h-full w-full rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.18),rgba(148,163,184,0.06))] bg-[length:200%_100%]"
                />
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {panels.map((panel, index) => (
              <motion.div
                key={panel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.28 }}
                className="h-72 rounded-2xl border border-border-subtle bg-bg-card/70 shadow-sm shadow-black/10"
              >
                <motion.div
                  animate={{ opacity: [0.26, 0.75, 0.26] }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", delay: index * 0.14 }}
                  className="h-full w-full rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.18),rgba(148,163,184,0.06))] bg-[length:200%_100%]"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
