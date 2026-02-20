"use client";

import { WalletInfo } from "@/types";
import { useState, useEffect } from "react";
import { getTopMatches } from "@/utils/storage";
import { formatRuntime } from "@/utils/formatRuntime";
import Link from "next/link";

interface LeaderboardContentProps {
  copyToClipboard: (text: string, id: string) => void;
  copyingId: string | null;
}

export function LeaderboardContent({ copyToClipboard, copyingId }: LeaderboardContentProps) {
  const [topMatches, setTopMatches] = useState<WalletInfo[]>([]);
  const [recentAddresses, setRecentAddresses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newMatches = getTopMatches();
    if (Array.isArray(newMatches)) {
      setTopMatches(newMatches);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopMatches(getTopMatches());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const truncateAddress = (addr: string, maxLen = 20) => {
    if (addr.length <= maxLen) return addr;
    return `${addr.slice(0, 10)}…${addr.slice(-8)}`;
  };

  if (topMatches.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-steam-text-muted text-sm mb-8">No matches yet.</p>
        <Link
          href="/"
          className="text-[11px] font-medium tracking-widest uppercase text-steam hover:text-steam/80 transition-colors"
        >
          Start generating
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
        >
          ← Generator
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted mb-6">Top matches</div>
        {/* Desktop: full table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-3 text-center text-[11px] font-medium tracking-widest uppercase text-steam-text-muted">
                  KEY
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-[11px] font-medium tracking-widest uppercase text-steam-text-muted">
                  ADDRESS
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-[11px] font-medium tracking-widest uppercase text-steam-text-muted">
                  MATCH%
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-[11px] font-medium tracking-widest uppercase text-steam-text-muted">
                  RUNTIME
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-[11px] font-medium tracking-widest uppercase text-steam-text-muted">
                  ATTEMPT
                </th>
              </tr>
            </thead>
            <tbody>
              {topMatches.map((match, index) => (
                <tr key={match.address} className="border-t border-steam-border/30">
                  <td className="py-2 text-center">
                    <button
                      onClick={() => copyToClipboard(match.privateKey, match.address)}
                      className={`${
                        recentAddresses.has(match.address) ? "text-steam" : "text-steam-text"
                      } hover:text-steam focus:outline-none focus:ring-2 focus:ring-steam/50 transition-colors`}
                      aria-label={`Copy private key for match ${index + 1}`}
                    >
                      {copyingId === match.address ? "✓" : index}
                    </button>
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm transition-colors ${
                      recentAddresses.has(match.address) ? "text-steam" : "text-steam-text"
                    }`}
                  >
                    {match.address}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm text-right transition-colors ${
                      recentAddresses.has(match.address) ? "text-steam" : "text-steam-text"
                    }`}
                  >
                    {match.zeroMatchPercentage.toFixed(3)}%
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm text-right transition-colors ${
                      recentAddresses.has(match.address) ? "text-steam" : "text-steam-text"
                    }`}
                  >
                    {formatRuntime(match.matchRuntime || 0)}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm text-right transition-colors ${
                      recentAddresses.has(match.address) ? "text-steam" : "text-steam-text"
                    }`}
                  >
                    {match.matchAttempts?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile: card layout */}
        <div className="md:hidden space-y-2">
          {topMatches.map((match, index) => (
            <button
              key={match.address}
              onClick={() => copyToClipboard(match.privateKey, match.address)}
              className="w-full text-left p-4 bg-steam-panel/50 transition-colors focus:outline-none focus:ring-1 focus:ring-steam/30 hover:bg-steam-panel"
              aria-label={`Copy private key for match ${index + 1}: ${truncateAddress(match.address)}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-steam-text">
                  [{index}] {truncateAddress(match.address)}
                </span>
              </div>
              <div className="flex gap-3 mt-1 text-xs text-steam-text-muted">
                <span>MATCH: {match.zeroMatchPercentage.toFixed(3)}%</span>
                <span>RUNTIME: {formatRuntime(match.matchRuntime || 0)}</span>
                <span>#{match.matchAttempts?.toLocaleString() || 0}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
