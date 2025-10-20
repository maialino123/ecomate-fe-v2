"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const transitionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!transitionRef.current || !contentRef.current) return;

    // Show overlay at start of new page
    setShowOverlay(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // Remove overlay completely after animation
        setShowOverlay(false);
      }
    });

    // Animation in: curtain reveal + content fade in
    tl.fromTo(
      transitionRef.current,
      { scaleY: 1, transformOrigin: "top" },
      { scaleY: 0, duration: 0.8, ease: "power3.inOut" }
    ).fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      {/* Transition overlay curtain - only render during animation */}
      {showOverlay && (
        <div
          ref={transitionRef}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pointer-events-none"
          style={{ transformOrigin: "top" }}
        />
      )}

      {/* Content */}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
