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
import { VAULT_URL } from '@/utils/constants';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showVaultConfirm, setShowVaultConfirm] = useState(false);
  const [showFileImportConfirm, setShowFileImportConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  
  const { 
    walletInfo, 
    setWalletInfo,
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

  const { copyingId, copyToClipboard } = useCopyToClipboard();
  
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
        const matches = getTopMatches();
        
        // Update global state only during export - use refs for most current values
        const globalState = {
          runtime: runtimeRef.current,  // Use ref instead of state
          attempts: attemptsRef.current // Use ref instead of state
        };

        console.log("globalState", globalState);
        localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(globalState));
        
        const exportData = {
          matches,
          globalState
        };
        
        const file = new File(
          [JSON.stringify(exportData, null, 2)], 
          `zero_quest_backup_${new Date().toISOString().split('T')[0]}.txt`, 
          { type: 'application/plaintext' }
        );
        
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
        setShowExportConfirm(false);
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
    setShowShare,
    runtime,
    attempts,
    setWalletInfo,
    runtimeRef,
    attemptsRef
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
        showFileImportConfirm={showFileImportConfirm}
        showFileExportConfirm={showExportConfirm}
        isRunning={isRunning}
        setRuntime={setRuntime}
        runtimeRef={runtimeRef}
        setAttempts={setAttempts}
        attemptsRef={attemptsRef}
        setShowExportConfirm={setShowExportConfirm}
      />
      <ShareModal 
        show={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}
