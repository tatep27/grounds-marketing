"use client";

import { useState, useEffect, useMemo } from "react";

interface RotatingWordProps {
  words: readonly string[];
  intervalMs?: number;
  transitionMs?: number;
  className?: string;
}

export function RotatingWord({
  words,
  intervalMs = 1500,
  transitionMs = 400,
  className = "",
}: RotatingWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate min width based on longest word (rough estimate using ch units)
  const minWidth = useMemo(() => {
    const longest = Math.max(...words.map((w) => w.length));
    return `${longest}ch`;
  }, [words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Update current index and stop animating at the same moment
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, transitionMs);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [words.length, intervalMs, transitionMs]);

  const currentWord = words[currentIndex];
  const nextWord = words[(currentIndex + 1) % words.length];

  return (
    <span
      className={`inline-block relative ${className}`}
      style={{
        minWidth,
        verticalAlign: "baseline",
      }}
      suppressHydrationWarning
    >
      {/* Current word - fades out quickly during animation */}
      <span
        className="inline-block whitespace-nowrap"
        style={{
          color: "var(--base-color-forest-500)",
          opacity: isAnimating ? 0 : 1,
          transition: isAnimating ? `opacity ${transitionMs * 0.5}ms ease-out` : "none",
        }}
        suppressHydrationWarning
      >
        {currentWord}
      </span>

      {/* Next word - drops in with full color, fading from transparent to full */}
      {isAnimating && (
        <span
          key={nextWord}
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{
            color: "var(--base-color-forest-500)",
            animation: `dropIn ${transitionMs}ms ease-out forwards`,
          }}
          suppressHydrationWarning
        >
          {nextWord}
        </span>
      )}
      
      {/* CSS animation - word drops in and fades from transparent to full opacity */}
      <style>{`
        @keyframes dropIn {
          0% {
            opacity: 0.3;
            transform: translateY(-120%);
          }
          50% {
            opacity: 0.6;
            transform: translateY(-50%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </span>
  );
}

