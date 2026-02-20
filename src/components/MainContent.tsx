"use client";

import { WalletInfo } from "@/types";
import { useState, useEffect, useRef } from "react";
import { getTopMatches } from "@/utils/storage";
import { CommandsTable } from "@/components/CommandsTable";
import { formatRuntime } from "@/utils/formatRuntime";
import { SessionSummary } from "@/components/SessionSummary";
import { MilestoneToast } from "@/components/MilestoneToast";
import { useZeroAddressBalance } from "@/hooks/useZeroAddressBalance";
import { VAULT_URL } from "@/utils/constants";

const MILESTONES = [10, 25, 50];

interface MainContentProps {
  walletInfo: WalletInfo | null;
  attempts: number;
  isRunning: boolean;
  hasWon: boolean;
  showCommands: boolean;
  setShowCommands: (show: boolean) => void;
  runtime: number;
}

export function MainContent({
  walletInfo,
  attempts,
  isRunning,
  hasWon,
  showCommands,
  setShowCommands,
  runtime,
}: MainContentProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [showMilestone, setShowMilestone] = useState<number | null>(null);
  const [bestMatch, setBestMatch] = useState(0);
  const prevIsRunningRef = useRef(false);
  const milestonesHitRef = useRef<Set<number>>(new Set());
  const { balance: zeroBalance, isLoading: balanceLoading } = useZeroAddressBalance();

  useEffect(() => {
    const matches = getTopMatches();
    const b = matches[0]?.zeroMatchPercentage ?? 0;
    setBestMatch(b);
    for (const m of MILESTONES) {
      if (b >= m) milestonesHitRef.current.add(m);
    }
  }, [walletInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      const matches = getTopMatches();
      setBestMatch(matches[0]?.zeroMatchPercentage ?? 0);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRunning && !hasStarted) {
      setHasStarted(true);
    }
  }, [isRunning]);

  useEffect(() => {
    if (prevIsRunningRef.current && !isRunning && hasStarted) {
      setShowSessionSummary(true);
      const t = setTimeout(() => setShowSessionSummary(false), 4000);
      prevIsRunningRef.current = isRunning;
      return () => clearTimeout(t);
    }
    prevIsRunningRef.current = isRunning;
  }, [isRunning, hasStarted]);

  useEffect(() => {
    for (const m of MILESTONES) {
      if (bestMatch >= m && !milestonesHitRef.current.has(m)) {
        milestonesHitRef.current.add(m);
        setShowMilestone(m);
        const t = setTimeout(() => setShowMilestone(null), 2500);
        return () => clearTimeout(t);
      }
    }
  }, [bestMatch]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <CommandsTable show={showCommands} onClose={() => setShowCommands(false)} />
      <SessionSummary
        show={showSessionSummary}
        runtime={runtime}
        attempts={attempts}
        bestMatch={bestMatch}
      />
      <MilestoneToast
        show={showMilestone !== null}
        percentage={showMilestone ?? 0}
      />

      <div className="text-center w-full mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-steam-text mb-4 sm:mb-6">
          Zero Quest
        </h1>
        <div className="space-y-0.5 text-base text-steam-text-muted tracking-wide">
          <p>{hasWon ? "Complete" : "Hunting the zero address"}</p>
          <p className="min-h-[1.5em] tabular-nums">
            <a
              href={VAULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-steam hover:opacity-90 transition-opacity inline-block transition-[filter] duration-300 ${
                balanceLoading ? "blur-sm select-none" : ""
              }`}
            >
              {zeroBalance ?? "— ETH"} locked
            </a>
          </p>
          <p className="tabular-nums">
            {formatNumber(attempts)} attempts — {formatRuntime(runtime)}
          </p>
        </div>
        {hasStarted && (
          <div className="mt-4 sm:mt-6 w-full max-w-[280px] mx-auto">
            <p className="text-xs text-steam-text-muted tracking-widest uppercase mb-2">
              Best match
            </p>
            <div className="h-px bg-steam-border overflow-hidden">
              <div
                className="h-full bg-steam/40 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(bestMatch, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-steam-text font-medium">
              {bestMatch.toFixed(3)}%
            </p>
          </div>
        )}
      </div>

    </>
  );
}
