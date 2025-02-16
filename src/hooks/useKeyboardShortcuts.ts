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
    if (!showInfo && !showTopMatches) {
      if (event.key === 'g') {
        generatePrivateKey();
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
  }, [showInfo, showTopMatches, walletInfo, generatePrivateKey, copyToClipboard, setShowInfo, setShowTopMatches]);

  return { handleKeyPress };
} 