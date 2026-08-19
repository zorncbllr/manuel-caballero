"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/#work" },
  { label: "Contact", href: "/contact" },
];

// Placeholder links — set your real profiles.
const SOCIALS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "#" },
];

function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const wordmark = rootRef.current?.querySelector("[data-wordmark]");
      if (!wordmark) return;

      gsap.fromTo(
        wordmark,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      ref={rootRef}
      className="relative mt-40 overflow-hidden border-t border-white/10 bg-black"
    >
      <div className="px-40 pb-8 pt-16">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={36} height={36} />
            <div>
              <p className="font-medium">Manuel Caballero</p>
              <p className="text-xs text-white/40">AI Solutions Engineer</p>
            </div>
          </div>

          <nav className="flex gap-12 text-sm text-white/45">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-6 text-sm text-white/45">
            {SOCIALS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35">
          <span>© 2026 Manuel Caballero</span>
          <span>Built in Next.js · GSAP · Motion</span>
          <button
            onClick={scrollToTop}
            className="transition-colors duration-300 hover:text-white"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      <div
        data-wordmark
        aria-hidden
        className="pointer-events-none mt-24 select-none whitespace-nowrap text-center text-[14vw] font-semibold uppercase leading-[0.72] tracking-tight text-white/[0.03]"
      >
        Caballero
      </div>
    </footer>
  );
}

export default SiteFooter;
