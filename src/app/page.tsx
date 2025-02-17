"use client";
import { useState, useEffect, useCallback } from "react";
import { MainContent } from "@/components/MainContent";
import { TerminalFooter } from "@/components/TerminalFooter";
import { useWallet } from "@/hooks/useWallet";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { getTopMatches } from "@/utils/storage";
import { HelpModal } from "@/components/HelpModal";
import { TabAnimation } from '@/components/TabAnimation';
import { ShareModal } from '@/components/ShareModal';
import { VAULT_URL } from '@/utils/constants';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showVaultConfirm, setShowVaultConfirm] = useState(false);
  
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
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Handle reset confirmation
    if (showResetConfirm) {
      event.preventDefault();
      if (event.key.toLowerCase() === 'y') {
        reset();
        setShowResetConfirm(false);
      } else if (event.key.toLowerCase() === 'n' || event.key === 'Escape') {
        setShowResetConfirm(false);
      }
      return;
    }

    // Handle vault confirmation
    if (showVaultConfirm) {
      event.preventDefault();
      if (event.key.toLowerCase() === 'y') {
        window.open(VAULT_URL, '_blank');
        setShowVaultConfirm(false);
      } else if (event.key.toLowerCase() === 'n' || event.key === 'Escape') {
        setShowVaultConfirm(false);
      }
      return;
    }

    // Handle ctrl key combinations
    if (event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 'r':
          event.preventDefault();
          setShowResetConfirm(true); // Only show confirmation, don't reset yet
          return;
        case '/':
          event.preventDefault();
          setShowCommands(prev => !prev);
          return;
        case 's':
          event.preventDefault();
          setShowShare(true);
          return;
        case 'v':
          event.preventDefault();
          setShowVaultConfirm(true);
          return;
      }
    }

    // Handle space bar for start/stop
    if (event.key === ' ') {
      event.preventDefault();
      if (isRunning) {
        stopRunning();
      } else {
        startRunning();
      }
      return;
    }

    // Handle number keys for copying private keys
    if (/^[0-9]$/.test(event.key)) {
      const matches = getTopMatches();
      const index = parseInt(event.key);
      if (matches[index]) {
        copyToClipboard(matches[index].privateKey, matches[index].address);
      }
      return;
    }

    // Handle single key commands
    switch (event.key.toLowerCase()) {
      case 'escape':
        setShowInfo(false);
        setShowCommands(false);
        setShowShare(false);
        break;
      case 'h':
        setShowInfo(prev => !prev);
        break;
      case 'c':
        if (walletInfo) {
          copyToClipboard(walletInfo.privateKey, walletInfo.address);
        }
        break;
    }
  }, [
    showResetConfirm,
    showVaultConfirm,
    reset,
    isRunning,
    stopRunning,
    startRunning,
    copyToClipboard,
    walletInfo,
    setShowInfo,
    setShowCommands,
    setShowShare
  ]);

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
      <div className="grid grid-cols-[20%_1fr_20%] gap-4 h-[calc(100vh-theme(spacing.8))] -mt-4">
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
        showResetConfirm={showResetConfirm}
        showVaultConfirm={showVaultConfirm}
      />
      <ShareModal 
        show={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}
