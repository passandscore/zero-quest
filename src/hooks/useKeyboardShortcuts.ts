import { useCallback } from "react";
import { WalletInfo } from "@/types";

interface KeyboardShortcutsProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  showTopMatches: boolean;
  setShowTopMatches: (show: boolean) => void;
  walletInfo: WalletInfo | null;
  generatePrivateKey: () => void;
  copyToClipboard: (text: string, id: string) => void;
}

export function useKeyboardShortcuts({
  showInfo,
  setShowInfo,
  showTopMatches,
  setShowTopMatches,
  walletInfo,
  generatePrivateKey,
  copyToClipboard,
}: KeyboardShortcutsProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'g' && !showInfo && !showTopMatches) {
      generatePrivateKey();
    }
    if (event.key === 'c' && walletInfo && !showInfo && !showTopMatches) {
      copyToClipboard(walletInfo.privateKey, walletInfo.address);
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
  }, [showInfo, showTopMatches, walletInfo, generatePrivateKey, copyToClipboard, setShowInfo, setShowTopMatches]);

  return { handleKeyPress };
} 