"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { LeaderboardContent } from "@/components/LeaderboardContent";

export default function LeaderboardPage() {
  const { copyingId, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="min-h-screen bg-steam-bg text-steam-text p-6 sm:p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-steam-text mb-2">
          Leaderboard
        </h1>
        <p className="text-[11px] text-steam-text-muted tracking-widest uppercase mb-12">
          Top 10 addresses closest to zero
        </p>
        <LeaderboardContent
          copyToClipboard={copyToClipboard}
          copyingId={copyingId}
        />
      </div>
    </div>
  );
}
