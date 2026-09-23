"use client";

import { motion } from "framer-motion";
import AdminSidebar from "@/components/admin/AdminSidebar";

const shimmerCards = Array.from({ length: 4 }, (_, index) => index);

export default function ControlCenterLoading() {
  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <motion.div
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-7 w-40 rounded-md bg-bg-card"
              />
              <motion.div
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.08 }}
                className="mt-2 h-4 w-64 rounded-md bg-bg-card"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shimmerCards.map((card, index) => (
                <motion.div
                  key={card}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className="h-28 rounded-2xl border border-border-subtle bg-bg-card"
                >
                  <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
                    className="h-full w-full rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.08),rgba(148,163,184,0.18),rgba(148,163,184,0.08))] bg-[length:200%_100%]"
                  />
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {[0, 1].map((panel, index) => (
                <motion.div
                  key={panel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.35 }}
                  className="h-72 rounded-2xl border border-border-subtle bg-bg-card"
                >
                  <motion.div
                    animate={{ opacity: [0.3, 0.75, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                    className="h-full w-full rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.06),rgba(148,163,184,0.16),rgba(148,163,184,0.06))] bg-[length:200%_100%]"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
