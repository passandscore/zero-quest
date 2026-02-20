"use client";

import { useState, useEffect, useCallback } from "react";
import { MainContent } from "@/components/MainContent";
import { TerminalFooter } from "@/components/TerminalFooter";
import { useWallet, TOP_MATCHES_KEY, GLOBAL_STATE_KEY } from "@/hooks/useWallet";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { getTopMatches } from "@/utils/storage";
import { HelpModal } from "@/components/HelpModal";
import { TabAnimation } from '@/components/TabAnimation';
import { ShareModal } from '@/components/ShareModal';
import { AdsterraAd } from '@/components/AdsterraAd';
import { StartStopFAB } from '@/components/StartStopFAB';
import { MobileMenu } from '@/components/MobileMenu';
import { VAULT_URL } from '@/utils/constants';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFileImportConfirm, setShowFileImportConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  
  const { 
    walletInfo, 
    attempts, 
    isRunning, 
    startRunning, 
    stopRunning, 
    hasWon,
    reset,
    runtime,
    setRuntime,
    runtimeRef,
    setAttempts,
    attemptsRef,
  } = useWallet();

  const { copyToClipboard } = useCopyToClipboard();

  const doExport = useCallback(() => {
    const matches = getTopMatches();
    const globalState = {
      runtime: runtimeRef.current,
      attempts: attemptsRef.current,
    };
    localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(globalState));
    const exportData = { matches, globalState };
    const file = new File(
      [JSON.stringify(exportData, null, 2)],
      `zero_quest_backup_${new Date().toISOString().split("T")[0]}.txt`,
      { type: "application/plaintext" }
    );
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportConfirm(false);
  }, [runtimeRef, attemptsRef]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Handle reset confirmation
    if (showResetConfirm) {
      event.preventDefault();
      if (event.key.toLowerCase() === 'y') {
        reset();
        setShowResetConfirm(false);
      } else if (event.key.toLowerCase() === ' ') {
        stopRunning();
      }else if (event.key.toLowerCase() === 'n' || event.key === 'Escape') {
        setShowResetConfirm(false);
      }
      return;
    }

    // Handle file import confirmation
    if (showFileImportConfirm) {
      event.preventDefault();
      console.log("export confirm");
      if (event.key.toLowerCase() === 'y') {
        // Logic to handle file import
        console.log('Importing file...');

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.onchange = async (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files?.length) {
            setShowFileImportConfirm(false);
            try {
              const fileContent = await files[0].text();
              const importData = JSON.parse(fileContent);
              
              // Check if it's the new format
              if (importData.matches && importData.globalState) {
                // Update matches
                localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(importData.matches));
                
                // Update global state
                localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(importData.globalState));
                
                // Update runtime and attempts state
                setRuntime(importData.globalState.runtime);
                runtimeRef.current = importData.globalState.runtime;
                setAttempts(importData.globalState.attempts);
                attemptsRef.current = importData.globalState.attempts;
              } else {
                // Handle old format (just matches array)
                localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(importData));
              }
            } catch (error) {
              console.error('Error reading file:', error);
              alert('Error: Invalid backup file');
            }
          } else if (event.key.toLowerCase() === ' ') {
            stopRunning();
          } else {
            console.log('No file selected');
          }
        };
        fileInput.click();
        
      } else if (event.key.toLowerCase() === 'n' || event.key === 'Escape') {
        setShowFileImportConfirm(false);
      }
      return;
    }

    // export the local storage to a file
    if (showExportConfirm) {
      event.preventDefault();
      if (event.key.toLowerCase() === 'y') {
        doExport();
      } else if (event.key.toLowerCase() === 'n' || event.key === 'Escape') {
        setShowExportConfirm(false);
      }
      return;
    }

    // Handle ctrl key combinations
    if (event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 'r':
          event.preventDefault();
          setShowResetConfirm(true);
          return;
        case 'i':
          event.preventDefault();
          setShowFileImportConfirm(true);
          return;
        case 'e':
          event.preventDefault();
          console.log("export confirm - 1");
          setShowExportConfirm(true);
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
          window.open(VAULT_URL, '_blank');
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
    reset,
    isRunning,
    stopRunning,
    startRunning,
    copyToClipboard,
    walletInfo,
    setShowInfo,
    setShowCommands,
    setShowShare,
    runtime,
    attempts,
    setRuntime,
    runtimeRef,
    attemptsRef,
    doExport,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    // Restore saved state on component mount
    const savedState = localStorage.getItem('zero_quest_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        console.log('Restoring state:', state);
        if (state.runtime && state.attempts) {
          setRuntime(state.runtime);
          runtimeRef.current = state.runtime;
          setAttempts(state.attempts);
          attemptsRef.current = state.attempts;
        }
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-steam-bg text-steam-text p-3 sm:p-4 pb-12 md:pb-10">
      <TabAnimation runtime={runtime} isRunning={isRunning} />
      <HelpModal show={showInfo} onClose={() => setShowInfo(false)} />
      {/* Top banner - mobile/tablet only */}
      <div className="lg:hidden mb-3 flex justify-center min-h-[50px]">
        <AdsterraAd className="w-full max-w-[728px] min-h-[50px]" />
      </div>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] max-w-2xl mx-auto pt-8 sm:pt-16">
        <MainContent
          walletInfo={walletInfo}
          attempts={attempts}
          isRunning={isRunning}
          hasWon={hasWon}
          showCommands={showCommands}
          setShowCommands={setShowCommands}
          runtime={runtime}
        />
      </main>

      {/* Bottom ad - mobile/tablet only (replaces footer on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 flex justify-center bg-steam-bg/90 backdrop-blur-md py-2 min-h-[50px]">
        <AdsterraAd className="w-full max-w-[728px] min-h-[50px]" />
      </div>

      <TerminalFooter
        setShowCommands={setShowCommands}
        setShowInfo={setShowInfo}
        setShowShare={setShowShare}
        showResetConfirm={showResetConfirm}
        showFileImportConfirm={showFileImportConfirm}
        showFileExportConfirm={showExportConfirm}
        isRunning={isRunning}
        setRuntime={setRuntime}
        runtimeRef={runtimeRef}
        setAttempts={setAttempts}
        attemptsRef={attemptsRef}
      />
      <MobileMenu
        setShowCommands={setShowCommands}
        setShowInfo={setShowInfo}
        setShowShare={setShowShare}
        setShowResetConfirm={setShowResetConfirm}
        setShowFileImportConfirm={setShowFileImportConfirm}
        setShowExportConfirm={setShowExportConfirm}
        showResetConfirm={showResetConfirm}
        showFileImportConfirm={showFileImportConfirm}
        showFileExportConfirm={showExportConfirm}
        isRunning={isRunning}
        setRuntime={setRuntime}
        runtimeRef={runtimeRef}
        setAttempts={setAttempts}
        attemptsRef={attemptsRef}
        reset={reset}
        onExportConfirmYes={doExport}
      />
      <StartStopFAB
        isRunning={isRunning}
        hasWon={hasWon}
        onStart={startRunning}
        onStop={stopRunning}
      />
      <ShareModal 
        show={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}
