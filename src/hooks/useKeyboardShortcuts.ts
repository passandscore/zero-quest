import { useCallback } from "react";
import { WalletInfo } from "@/types";
import { VAULT_URL } from "@/utils/constants";

interface KeyboardShortcutsProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  walletInfo: WalletInfo | null;
  generatePrivateKey: () => void;
  copyToClipboard: (text: string, id: string) => void;
  isRunning: boolean;
  startRunning: () => void;
  stopRunning: () => void;
  showCommands: boolean;
  setShowCommands: (show: boolean) => void;
  reset: () => void;
  getTopMatches: () => WalletInfo[];
  showShare: boolean;
  setShowShare: (show: boolean) => void;
}

export function useKeyboardShortcuts({
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
  setShowShare
}: KeyboardShortcutsProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // H key for help/info
    if (event.key.toLowerCase() === 'h') {
      event.preventDefault(); // Prevent default behavior
      setShowInfo(prev => !prev); // Toggle the showInfo state
      return;
    }

    // Space bar to toggle running
    if (event.code === 'Space') {
      event.preventDefault();
      if (isRunning) {
        stopRunning();
      } else {
        startRunning();
      }
      return;
    }

    // Handle ESC to close modals
    if (event.key === 'Escape') {
      setShowCommands(false);
      setShowInfo(false);
      return;
    }

    // Handle commands toggle
    if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setShowCommands(prev => !prev);
      return;
    }

    if (!showInfo) {
      // Reset with Ctrl+R
      if (event.key.toLowerCase() === 'r' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        reset();
      }

      // Copy current key with Ctrl+C
      if (event.key.toLowerCase() === 'c' && (event.ctrlKey || event.metaKey) && walletInfo) {
        event.preventDefault();
        copyToClipboard(walletInfo.privateKey, walletInfo.address);
      }

      // Copy selected match with Ctrl+K
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        // Implementation for copying selected match
      }

      if (event.key.toLowerCase() === 'v') {
        window.open(VAULT_URL, '_blank');
      }

      // Copy from top matches with number keys
      const num = parseInt(event.key);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        const matches = getTopMatches();
        if (matches[num]) {
          copyToClipboard(matches[num].privateKey, matches[num].address);
        }
      }
    }

    // Add share command (Ctrl+S)
    if (event.key.toLowerCase() === 's' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setShowShare(prev => !prev);
      return;
    }
  }, [
    isRunning, 
    startRunning, 
    stopRunning, 
    setShowInfo,  // Make sure setShowInfo is in dependencies
    setShowCommands, 
    reset, 
    copyToClipboard,
    walletInfo,
    getTopMatches,
    setShowShare
  ]);

  return { handleKeyPress };
} 