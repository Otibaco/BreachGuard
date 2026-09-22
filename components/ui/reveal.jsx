"use client";

import { motion } from "framer-motion";

/**
 * Wraps a section in a subtle fade + rise entrance triggered once it
 * scrolls into view. Used across the reading pages (/learn, /about) and
 * the homepage's "Stay protected" section so long-form content doesn't
 * just pop in all at once.
 */
export default function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
