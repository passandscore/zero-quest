import { useState, useCallback, useRef } from "react";
import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { calculateZeroMatch, getTestAddress } from "@/utils/calculations";
import { updateTopMatches } from "@/utils/storage";
import { WalletInfo } from "@/types";
import { CONFIG } from "@/config";

const WINNING_PERCENTAGE = 25; // For testing - normally this would be much higher

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const isRunningRef = useRef(false);

  const checkForWin = useCallback((percentage: number) => {
    if (percentage >= WINNING_PERCENTAGE) {
      setHasWon(true);
      isRunningRef.current = false;
      setIsRunning(false);
      alert(`🎉 CONGRATULATIONS! You found a ${percentage.toFixed(2)}% match!\n\nPrivate key has been copied to clipboard.`);
      return true;
    }
    return false;
  }, []);

  const generatePrivateKey = useCallback(() => {
    if (hasWon) {
      alert(`🎉 You've already won with a ${walletInfo?.zeroMatchPercentage.toFixed(2)}% match!\n\nPrivate key is in your clipboard.`);
      if (walletInfo) {
        navigator.clipboard.writeText(walletInfo.privateKey);
      }
      return;
    }

    setAttempts(prev => prev + 1);
    
    const key = "0x" + randomBytes(32).toString("hex");
    const wallet = new Wallet(key);
    const zeroMatchPercentage = calculateZeroMatch(wallet.address);

    const newWallet = {
      privateKey: key,
      address: CONFIG.TEST_MODE ? getTestAddress() : wallet.address,
      zeroMatchPercentage
    };

    setWalletInfo(newWallet);
    updateTopMatches(newWallet);
    
    if (checkForWin(zeroMatchPercentage)) {
      navigator.clipboard.writeText(key);
    }
  }, [hasWon, checkForWin, walletInfo]);

  const continuousRun = useCallback(async () => {
    if (isRunningRef.current || hasWon) return;
    
    setIsRunning(true);
    isRunningRef.current = true;
    
    while (isRunningRef.current && !hasWon) {
      generatePrivateKey();
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }, [generatePrivateKey, hasWon]);

  const stopRunning = useCallback(() => {
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  return { 
    walletInfo, 
    generatePrivateKey, 
    attempts, 
    isRunning, 
    continuousRun, 
    stopRunning,
    hasWon 
  };
} 