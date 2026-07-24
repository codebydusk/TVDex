"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let requestRef: number;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly update inner dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") || 
        target.closest("a");

      if (cursorRef.current && ringRef.current) {
        if (isClickable) {
          cursorRef.current.classList.add("scale-[2.5]", "bg-[var(--accent)]");
          ringRef.current.classList.add("scale-50", "opacity-0");
        } else {
          cursorRef.current.classList.remove("scale-[2.5]", "bg-[var(--accent)]");
          ringRef.current.classList.remove("scale-50", "opacity-0");
        }
      }
    };

    const animateRing = () => {
      // Lerp for smooth trailing effect
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      requestRef = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMouseMove);
    requestRef = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, [isVisible]);

  // Don't render anything during SSR to avoid mismatch
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* The trailing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full pointer-events-none z-[9998] border border-[var(--accent)] transition-all duration-150 ease-out will-change-transform no-print ${isVisible ? "opacity-40" : "opacity-0"}`}
      />
      {/* The main dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full pointer-events-none z-[9999] bg-[var(--foreground)] shadow-[0_0_15px_var(--accent-glow)] transition-transform duration-150 ease-out will-change-transform no-print ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
