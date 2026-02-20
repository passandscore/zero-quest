"use client";

import { formatRuntime } from "@/utils/formatRuntime";

interface SessionSummaryProps {
  show: boolean;
  runtime: number;
  attempts: number;
  bestMatch: number;
}

export function SessionSummary({ show, runtime, attempts, bestMatch }: SessionSummaryProps) {
  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-30 animate-[fadeIn_0.3s_ease-out]"
      role="status"
      aria-live="polite"
    >
      <div className="px-5 py-2.5 bg-steam-panel/95 text-[11px] tracking-widest uppercase text-steam-text-muted">
        Session: {formatRuntime(runtime)} | {attempts.toLocaleString()} attempts | Best: {bestMatch.toFixed(3)}%
      </div>
    </div>
  );
}
