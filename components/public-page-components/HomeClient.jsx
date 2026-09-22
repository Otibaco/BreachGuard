"use client";

import { useState, useRef } from "react";
import { Radar, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import EmailChecker from "@/components/breach/EmailChecker";
import BreachResult from "@/components/breach/BreachResult";
import HowItWorks from "@/components/public-page-components/HowItWorks";
import SecurityTopics from "@/components/public-page-components/SecurityTopics";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomeClient({ stats }) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [checkedEmail, setCheckedEmail] = useState("");

  function handleStartCheck() {
    setIsChecking(true);
    setResult(null);
  }

  function handleResult(data) {
    setIsChecking(false);
    if (data) {
      setResult(data);
      const input = document.getElementById("breach-email-input");
      setCheckedEmail(input?.value?.trim().toLowerCase() || "");
    }
  }

  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "15%"]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "4%"]
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 0]
  );

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <Navbar />
      <section
        ref={heroRef}
        className="
        relative
        min-h-[82svh]
        overflow-hidden
        border-b border-border-subtle
        bg-bg-canvas
        sm:min-h-[100svh]
      "
      >
        {/* Subtle background atmosphere */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : backgroundY,
          }}
          className="pointer-events-none absolute inset-0"
        >
          {/* Soft central light */}
          <div
            className="
            absolute
            left-1/2
            top-[18%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            bg-brand-cyan/[0.025]
            blur-[120px]
          "
          />

          {/* Very subtle radar rings */}
          <div
            className="
            absolute
            left-1/2
            top-[27%]
            h-[520px]
            w-[520px]
            -translate-x-1/2
            rounded-full
            border border-white/[0.025]
          "
          />

          <div
            className="
            absolute
            left-1/2
            top-[27%]
            h-[380px]
            w-[380px]
            -translate-x-1/2
            rounded-full
            border border-white/[0.02]
          "
          />

          {/* Fade atmosphere */}
          <div
            className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_35%,transparent_0%,var(--bg-canvas)_72%)]
          "
          />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : contentY,
            opacity: shouldReduceMotion ? 1 : contentOpacity,
          }}
          className="
          relative
          z-10
          flex
          min-h-[82svh]
          items-center
          justify-center
          px-4
          py-10
          sm:min-h-[100svh]
          sm:px-6
          sm:py-20
          lg:px-8
        "
        >
          <div className="w-full max-w-5xl text-center">

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="
              mx-auto
              max-w-4xl
              font-heading
              text-[2.75rem]
              font-semibold
              leading-[0.98]
              tracking-[-0.045em]
              text-text-primary
              sm:text-6xl
              lg:text-7xl
              xl:text-[5.5rem]
            "
            >
              Know if your email
              <br className="hidden sm:block" />

              {" "}has been{" "}

              <span
                className="
                relative
                inline-block
                text-brand-cyan
              "
              >
                exposed
                <span
                  className="
                  absolute
                  -bottom-1
                  left-0
                  h-[2px]
                  w-full
                  rounded-full
                  bg-brand-cyan/40
                "
                />
              </span>
              .
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.12 }}
              className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-7
              text-text-muted
              sm:text-lg
              sm:leading-8
            "
            >
              Check your email against known data breaches and understand
              exactly what your result means.
            </motion.p>

            {/* Email checker */}
            <motion.div
              id="email-checker"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.24 }}
              className="mx-auto mt-10 w-full max-w-2xl scroll-mt-28"
            >
              <EmailChecker
                onStartCheck={handleStartCheck}
                onResult={handleResult}
                isChecking={isChecking}
              />
            </motion.div>

            {/* Stats */}
            {stats?.available && stats.totalChecks > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.36 }}
                className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                text-xs
                text-text-dim
              "
              >
                <ShieldCheck className="h-3.5 w-3.5 text-clean" />

                <span>
                  {stats.totalChecks.toLocaleString()} checks performed
                </span>

                <span className="text-text-dim/40">•</span>

                <span>
                  {stats.breachedCount.toLocaleString()} breaches flagged
                </span>
              </motion.div>
            )}

            {/* Privacy reassurance */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="
              mt-5
              text-[11px]
              tracking-wide
              text-text-dim
            "
            >
              No password required · Minimal data retention
            </motion.p>
          </div>
        </motion.div>

        {/* Minimal scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="
          absolute
          bottom-7
          left-1/2
          hidden
          -translate-x-1/2
          sm:block
        "
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                  y: [0, 6, 0],
                  opacity: [0.25, 0.6, 0.25],
                }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-7 w-px bg-text-dim/40"
          />
        </motion.div>
      </section>

      {result && (
        <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 bg-bg-canvas">
          <BreachResult email={checkedEmail} result={result} />
        </section>
      )}

      <HowItWorks />
      <SecurityTopics />
      <Footer />
    </>
  );
}
