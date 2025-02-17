"use client";

import { WalletInfo } from "@/types";
import { useState, useEffect } from "react";
import { getTopMatches } from "@/utils/storage";
import { CONFIG } from "@/config/index";
import { CommandsTable } from "@/components/CommandsTable";
import { formatRuntime } from '@/utils/formatRuntime';

interface MainContentProps {
  walletInfo: WalletInfo | null;
  copyToClipboard: (text: string, id: string) => void;
  copyingId: string | null;
  attempts: number;
  isRunning: boolean;
  hasWon: boolean;
  showCommands: boolean;
  setShowCommands: (show: boolean) => void;
  reset: () => void;
  runtime: number;
}

export function MainContent({ 
  walletInfo, 
  copyToClipboard, 
  copyingId, 
  attempts, 
  isRunning, 
  hasWon, 
  showCommands,
  setShowCommands,
  reset,
  runtime
}: MainContentProps) {
  const [topMatches, setTopMatches] = useState<WalletInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const fullText = '> INITIALIZING ZERO ADDRESS HACK_';
  const [recentAddresses, setRecentAddresses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newMatches = getTopMatches();
    if (walletInfo && !topMatches.find(m => m.address === walletInfo.address)) {
      setRecentAddresses(prev => new Set(prev).add(walletInfo.address));
      setTimeout(() => {
        setRecentAddresses(prev => {
          const next = new Set(prev);
          next.delete(walletInfo.address);
          return next;
        });
      }, CONFIG.NEW_ENTRY_DELAY_MS * 1000);
    }
    setTopMatches(newMatches);
  }, [walletInfo]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const typeText = () => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeText, CONFIG.TYPING_SPEED_MS);
      } else {
        setTimeout(() => setIsLoading(false), CONFIG.INITIAL_LOADING_MS);
      }
    };

    typeText();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isRunning && !hasStarted) {
      setHasStarted(true);
    }
  }, [isRunning]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reset]);

  // Helper function for consistent number formatting
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <div className="text-center w-full mb-8">
        <h1 className="relative font-mono text-6xl mb-4">
          <div className="glitch-container">
            <div className="text-[#33ff00] glitch-text" data-text="ZERO_QUEST">
              ZERO_QUEST
            </div>
          </div>
        </h1>
        <p className="text-sm text-[#33ff00] drop-shadow-[0_0_3px_rgba(51,255,0,0.3)]">
          {typedText}
        </p>
        <p className="text-sm text-[#33ff00] drop-shadow-[0_0_3px_rgba(51,255,0,0.3)]/50 mt-4 animate-pulse">
          {'>'} LOADING_
        </p>
      </div>
    );
  }

  return (
    <>
      <CommandsTable 
        show={showCommands} 
        onClose={() => setShowCommands(false)} 
      />
      
      <div className="text-center w-full mb-4">
        <h1 className="relative font-mono text-6xl mb-4">
          <div className="glitch-container">
            <div className="text-[#33ff00] glitch-text" data-text="ZERO_QUEST">
              ZERO_QUEST
            </div>
          </div>
        </h1>
        <p className="text-base text-[#33ff00] drop-shadow-[0_0_3px_rgba(51,255,0,0.3)]">
          {hasWon ? 
            '> MISSION ACCOMPLISHED! 🎉' : 
            '> INITIALIZING ZERO ADDRESS HACK_'
          }
        </p>
        <p className="text-base text-[#33ff00] drop-shadow-[0_0_3px_rgba(51,255,0,0.3)]/50 mt-1">
          {'>'} ATTEMPTS: {formatNumber(attempts)}_{isRunning ? ' [RUNNING]' : ''}
        </p>
        <p className="text-base text-[#33ff00] drop-shadow-[0_0_3px_rgba(51,255,0,0.3)]/50 mt-1">
          {'>'} RUNTIME: {formatRuntime(runtime)}_
        </p>
      </div>

      <div className="grid grid-rows-[auto_1fr] gap-4 w-full">
        {/* Terminal Output Panel */}
        <div className="w-full p-2 bg-[#001100] border border-[#33ff00]/20 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] font-mono text-base">
          <div className="flex flex-col gap-1">
            {walletInfo && (
              <>
                <p className="text-[#33ff00]">
                  {'>'} Generated: {walletInfo.address}
                </p>
                {/* <p className="text-[#33ff00]">
                  {'>'} Match: {walletInfo.zeroMatchPercentage.toFixed(2)}%
                </p> */}
              </>
            )}
            <div className="text-[#33ff00]">
              {'>'} STATUS: {isRunning ? 'RUNNING' : hasWon ? 'COMPLETED' : 'READY'}_
            </div>
          </div>
        </div>

        {/* Top Matches Panel - only show after generation has started */}
        {hasStarted && topMatches.length > 0 && (
          <div className="w-full p-2 bg-[#001100] border border-[#33ff00]/20 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] font-mono">
            <div className="text-[#33ff00] mb-2">
              {'>'} cat TOP_MATCHES.log
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-y border-[#33ff00]/20">
                <th className="px-4 py-1 text-center text-[#33ff00] font-normal">KEY</th>
                  <th className="px-4 py-1 text-left text-[#33ff00] font-normal">ADDRESS</th>
                  <th className="px-4 py-1 text-right text-[#33ff00] font-normal">MATCH%</th>
                  <th className="px-4 py-1 text-right text-[#33ff00] font-normal">RUNTIME</th>
                  <th className="px-4 py-1 text-right text-[#33ff00] font-normal">ATTEMPT</th>
                 
                </tr>
              </thead>
              <tbody>
                {topMatches.map((match, index) => (
                  <tr key={match.address} className="border-t border-[#33ff00]/10">
                   <td className="py-1 text-center">
                      <button
                        onClick={() => copyToClipboard(match.privateKey, match.address)}
                        className={`${recentAddresses.has(match.address) ? 'animate-new-entry' : 'text-[#33ff00]'} hover:text-[#33ff00] transition-colors`}
                      >
                        {copyingId === match.address ? 'OK_' : `[${index}]`}
                      </button>
                    </td>
                    <td className={`px-4 py-1 text-sm font-mono ${recentAddresses.has(match.address) ? 'animate-new-entry' : 'text-[#33ff00]'}`}>
                      {match.address}
                    </td>
                    <td className={`px-4 py-1 text-sm text-right ${recentAddresses.has(match.address) ? 'animate-new-entry' : 'text-[#33ff00]'}`}>
                      {match.zeroMatchPercentage.toFixed(3)}%
                    </td>
                    <td className={`px-4 py-1 text-sm text-right ${recentAddresses.has(match.address) ? 'animate-new-entry' : 'text-[#33ff00]'}`}>
                      {formatRuntime(match.matchRuntime || 0)}
                    </td>
                    <td className={`px-4 py-1 text-sm text-right ${recentAddresses.has(match.address) ? 'animate-new-entry' : 'text-[#33ff00]'}`}>
                      {match.matchAttempts?.toLocaleString() || 0}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}