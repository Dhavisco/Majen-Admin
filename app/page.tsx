"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import { DashboardPreview } from "./components/dashboard-preview";
import { MajenLogo } from "./components/majen-logo";
import Image from "next/image";
import { BackToTop } from "./components/BackToTop";

const featureCards = [
  {
    title: "Designer Management",
    description:
      "Approve designer applications, monitor seller activity, and keep onboarding standards consistent.",
    icon: FiUsers,
  },
  {
    title: "Product Moderation",
    description:
      "Review new catalog submissions and enforce marketplace quality before products go live.",
    icon: FiBox,
  },
  {
    title: "Order Management",
    description:
      "Track fulfillment, review order history, and keep cross-region operations moving smoothly.",
    icon: FiShoppingBag,
  },
  {
    title: "Platform Analytics",
    description:
      "Monitor revenue, conversion, and performance signals from a single admin control layer.",
    icon: FiBarChart2,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="page-shell min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="transition-transform duration-300 hover:scale-[1.02]">
          <MajenLogo />
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold">
          <Link
            href="#features"
            className="rounded-full px-4 py-2 text-slate-600 transition-colors hover:text-(--brand)"
          >
            Features
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-(--brand) text-white! px-5 py-3 transition-transform duration-300 hover:-translate-y-0.5"
          >
            Login
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-center gap-16 px-6 pb-20 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28 lg:pt-12">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            variants={fadeInUp}
            className="max-w-xl"
          >
            <span className="mb-6 inline-flex rounded-full border border-[rgba(26,0,137,0.08)] bg-(--brand-soft) px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-(--brand)">
              Internal Marketplace Platform
            </span>
            <h1 className="font-display max-w-lg text-5xl leading-[0.92] font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Majen Admin <span className="text-[#1A0089]">Console</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Manage designers, products, orders, and marketplace performance
              from one calm, high-visibility workspace built for fashion
              operations.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-(--brand) px-6 py-4 text-base font-semibold text-white! shadow-[0_14px_40px_rgba(26,0,137,0.28)] transition-transform duration-300 hover:-translate-y-1"
              >
                Admin Login
                <FiArrowRight className="text-lg" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-6 py-4 text-base font-semibold text-slate-700 transition-colors duration-300 hover:border-[rgba(26,0,137,0.16)] hover:text-(--brand)"
              >
                View Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute inset-x-10 top-10 -z-10 h-32 rounded-full bg-[rgba(26,0,137,0.18)] blur-3xl" />
            <DashboardPreview />
          </motion.div>
        </section>

        <section id="features" className="border-t border-[rgba(17,25,47,0.06)] bg-white/80">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6 }}
              variants={fadeInUp}
              className="max-w-3xl"
            >
              <h2 className="font-display text-4xl leading-tight font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Everything you need to oversee the Majen fashion marketplace.
              </h2>
              <div className="mt-5 h-1.5 w-16 rounded-full bg-(--brand)" />
            </motion.div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.01 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="group soft-card rounded-[28px] border border-border bg-white p-7 transition-all duration-300 hover:border-[rgba(26,0,137,0.16)] hover:shadow-[0_24px_60px_rgba(26,0,137,0.12)]"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: -4 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--brand-soft) text-xl text-(--brand) transition-colors duration-300 group-hover:bg-(--brand) group-hover:text-white"
                    >
                      <Icon />
                    </motion.div>

                    <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em] text-slate-900 transition-colors duration-300 group-hover:text-(--brand)">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(17,25,47,0.06)] bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            <Image
              src="/majen.svg"
              alt="Majen"
              width={166}
              height={41}
              priority
              className="h-auto w-33 sm:w-41.5">
            </Image>
            {/* <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand) text-sm font-bold text-white">
              M
            </span> */}
            <div>
              <p className="font-semibold">© 2026 Majen.</p>
              <p>Internal admin system for authorized personnel only.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            {/* <span>Internal Admin System</span> */}
            <span>Security</span>
            <span>Privacy</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}
