"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const [runtime, setRuntime] = useState(0);
  const runtimeInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isRunningRef.current && !hasWon) {
      runtimeInterval.current = setInterval(() => {
        setRuntime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (runtimeInterval.current) {
        clearInterval(runtimeInterval.current);
        runtimeInterval.current = undefined;
      }
    };
  }, [isRunningRef.current, hasWon]);

  const reset = useCallback(() => {
    setWalletInfo(null);
    setAttempts(0);
    setIsRunning(false);
    setHasWon(false);
    isRunningRef.current = false;
    localStorage.removeItem('zero_quest_top_matches');
    if (runtimeInterval.current) {
      clearInterval(runtimeInterval.current);
      runtimeInterval.current = undefined;
    }
    setRuntime(0);
  }, []);

  const checkForWin = useCallback((percentage: number) => {
    if (percentage >= WINNING_PERCENTAGE) {
      setHasWon(true);
      isRunningRef.current = false;
      setIsRunning(false);
      if (runtimeInterval.current) {
        clearInterval(runtimeInterval.current);
        runtimeInterval.current = undefined;
      }
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

  const startRunning = useCallback(async () => {
    if (isRunningRef.current || hasWon) {
      if (hasWon && walletInfo) {
        alert(`🎉 You've already won with a ${walletInfo.zeroMatchPercentage.toFixed(2)}% match!\n\nPrivate key is in your clipboard.`);
        navigator.clipboard.writeText(walletInfo.privateKey);
      }
      return;
    }
    
    setIsRunning(true);
    isRunningRef.current = true;
    
    while (isRunningRef.current && !hasWon) {
      generatePrivateKey();
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }, [generatePrivateKey, hasWon, walletInfo]);

  const stopRunning = useCallback(() => {
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  return { 
    walletInfo, 
    generatePrivateKey, 
    attempts, 
    isRunning, 
    startRunning,
    stopRunning,
    hasWon,
    reset,
    runtime 
  };
} 