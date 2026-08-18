"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`flex items-center justify-between py-6 px-40 sticky top-0 z-99 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Image src={"/logo.png"} alt="Logo" width={36} height={36} />

      <div className="flex gap-12 text-sm text-foreground/60">
        <Link
          href={"/"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Home
        </Link>
        <Link
          href={"/about"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          About
        </Link>
        <Link
          href={"/projects"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Projects
        </Link>
        <Link
          href={"/contact"}
          className="hover:text-foreground transition-all ease-in-out"
        >
          Contact
        </Link>
      </div>

      <div></div>
    </div>
  );
}

export default AppHeader;
