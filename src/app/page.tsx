"use client";
import { useState, useEffect } from "react";
import { MainContent } from "@/components/MainContent";
import { TopMatches } from "@/components/TopMatches";
import { InfoSection } from "@/components/InfoSection";
import { TerminalFooter } from "@/components/TerminalFooter";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useWallet } from "@/hooks/useWallet";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showTopMatches, setShowTopMatches] = useState(false);
  
  const { walletInfo, generatePrivateKey } = useWallet();
  const { copyingId, copyNotification, copyToClipboard } = useCopyToClipboard();
  
  const { handleKeyPress } = useKeyboardShortcuts({
    showInfo,
    setShowInfo,
    showTopMatches,
    setShowTopMatches,
    walletInfo,
    generatePrivateKey,
    copyToClipboard
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <div className="grid grid-rows-[20px_1fr_20px] min-h-screen gap-8">
        <main className="flex flex-col gap-8 row-start-2 items-center max-w-4xl mx-auto w-full">
          {!showInfo && !showTopMatches ? (
            <MainContent 
              walletInfo={walletInfo}
              generatePrivateKey={generatePrivateKey}
              copyToClipboard={copyToClipboard}
              copyingId={copyingId}
            />
          ) : showInfo ? (
            <InfoSection />
          ) : (
            <TopMatches 
              copyToClipboard={copyToClipboard}
              copyingId={copyingId}
              copyNotification={copyNotification}
            />
          )}
        </main>

        <TerminalFooter 
          showInfo={showInfo}
          showTopMatches={showTopMatches}
          setShowInfo={setShowInfo}
          setShowTopMatches={setShowTopMatches}
        />
      </div>
    </div>
  );
}
