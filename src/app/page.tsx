"use client";
import { useState, useEffect, useMemo } from "react";
import { MainContent } from "@/components/MainContent";
import { TerminalFooter } from "@/components/TerminalFooter";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useWallet } from "@/hooks/useWallet";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { getTopMatches } from "@/utils/storage";
import { HelpModal } from "@/components/HelpModal";
import { TabAnimation } from '@/components/TabAnimation';
import { ShareModal } from '@/components/ShareModal';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const { 
    walletInfo, 
    generatePrivateKey, 
    attempts, 
    isRunning, 
    startRunning, 
    stopRunning, 
    hasWon,
    reset,
    runtime
  } = useWallet();

  const { copyingId, copyToClipboard } = useCopyToClipboard();
  
  // Get top match for sharing
  const topMatch = useMemo(() => {
    const matches = getTopMatches();
    return matches.length > 0 ? matches[0] : null;
  }, []);

  const { handleKeyPress } = useKeyboardShortcuts({
    showInfo,
    setShowInfo,
    walletInfo,
    generatePrivateKey,
    copyToClipboard,
    isRunning,
    startRunning,
    stopRunning,
    showCommands,
    setShowCommands,
    reset,
    getTopMatches,
    showShare,
    setShowShare,
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <TabAnimation runtime={runtime} isRunning={isRunning} />
      <HelpModal show={showInfo} onClose={() => setShowInfo(false)} />
      <div className="grid grid-cols-[20%_1fr_20%] gap-4 h-[calc(100vh-theme(spacing.14))] -mt-4">
        <div className="border-r border-[#33ff00] text-base">
          {/* Ad Space 1 */}
        </div>

        <main className="flex flex-col gap-8 pt-4 text-base">
          <MainContent 
            walletInfo={walletInfo}
            copyToClipboard={copyToClipboard}
            copyingId={copyingId}
            attempts={attempts}
            isRunning={isRunning}
            hasWon={hasWon}
            showCommands={showCommands}
            setShowCommands={setShowCommands}
            reset={reset}
            runtime={runtime}
          />
        </main>

        <div className="border-l border-[#33ff00]">
          {/* Ad Space 2 */}
        </div>
      </div>

      <TerminalFooter 
        setShowCommands={setShowCommands}
        setShowInfo={setShowInfo}
        setShowShare={setShowShare}
      />
      <ShareModal 
        show={showShare}
        onClose={() => setShowShare(false)}
        topMatch={topMatch}
        runtime={runtime}
        attempts={attempts}
      />
    </div>
  );
}
