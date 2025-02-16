import { useCallback } from "react";
import { WalletInfo } from "@/types";
import { VAULT_URL } from "@/utils/constants";

interface KeyboardShortcutsProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  showTopMatches: boolean;
  setShowTopMatches: (show: boolean) => void;
  walletInfo: WalletInfo | null;
  generatePrivateKey: () => void;
  copyToClipboard: (text: string, id: string) => void;
  speedRun: (count: number) => void;
  isRunning: boolean;
  continuousRun: () => void;
  stopRunning: () => void;
}

export function useKeyboardShortcuts({
  showInfo,
  setShowInfo,
  showTopMatches,
  setShowTopMatches,
  walletInfo,
  generatePrivateKey,
  copyToClipboard,
  speedRun,
  isRunning,
  continuousRun,
  stopRunning
}: KeyboardShortcutsProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!showInfo && !showTopMatches && !isRunning) {
      if (event.key === 'g' && !event.repeat) {
        continuousRun();
      }
      if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
        event.preventDefault(); // Prevent browser shortcuts
        const multiplier = parseInt(event.key);
        speedRun(multiplier * 100);
      }
      if (event.key === 'a') {
        window.open(VAULT_URL, '_blank');
      }
      if (event.key === 'c' && walletInfo) {
        copyToClipboard(walletInfo.privateKey, walletInfo.address);
      }
    }
    if (event.key === 'h' && !showInfo && !showTopMatches) {
      setShowInfo(true);
    }
    if (event.key === 't' && !showInfo && !showTopMatches) {
      setShowTopMatches(true);
    }
    if (event.key === 'Escape' || event.key === 'Enter') {
      setShowInfo(false);
      setShowTopMatches(false);
    }
  }, [showInfo, showTopMatches, walletInfo, generatePrivateKey, copyToClipboard, setShowInfo, setShowTopMatches, speedRun, isRunning, continuousRun]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'g') {
      stopRunning();
    }
  }, [stopRunning]);

  return { handleKeyPress, handleKeyUp };
} 