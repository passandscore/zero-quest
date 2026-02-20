"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-steam-bg text-steam-text flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-light tracking-tight mb-4">Error</h1>
      <p className="text-sm text-steam-text-muted text-center max-w-sm mb-8 leading-relaxed">
        Something went wrong. Please try again.
      </p>
      <button
        onClick={reset}
        className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
