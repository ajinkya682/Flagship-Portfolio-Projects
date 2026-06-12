"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";

type GridAnimation = "rise" | "cascade" | "flip";

interface AnimatedGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number; // in px
  animation?: GridAnimation;
  className?: string;
}

export default function AnimatedGrid({
  children,
  columns = 3,
  gap = 24,
  animation = "rise",
  className = "",
}: AnimatedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(containerRef.current.children, { opacity: 1, duration: 0.1 });
        return;
      }

      const items = Array.from(containerRef.current.children);

      if (animation === "rise") {
        // Items in same row simultaneous, next row starts half way through previous
        // GSAP grid stagger makes this easy
        gsap.fromTo(
          items,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: {
              amount: 0.1 * (items.length / columns),
              grid: "auto",
              from: "start",
              axis: "y",
            },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
            },
          },
        );
      } else if (animation === "cascade") {
        // Wave from top-left
        gsap.fromTo(
          items,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: {
              amount: 0.8,
              grid: "auto",
              from: [0, 0], // top left corner
            },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
            },
          },
        );
      } else if (animation === "flip") {
        gsap.set(containerRef.current, { perspective: 600 });
        gsap.fromTo(
          items,
          { rotationY: 90, opacity: 0, transformOrigin: "left center" },
          {
            rotationY: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
            },
          },
        );
      }
    },
    { scope: containerRef },
  );

  // FIX: Added 'return' keyword here
  return (
    <div
      ref={containerRef}
      className={`grid ${className}`}
      style={{
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}
