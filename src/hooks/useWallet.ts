"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { calculateZeroMatch, getTestAddress } from "@/utils/calculations";
import { getTopMatches } from "@/utils/storage";
import { WalletInfo } from "@/types";
import { CONFIG } from "@/config";

const TOP_MATCHES_KEY = 'zero_quest_top_matches';

const WINNING_PERCENTAGE = 25; // For testing - normally this would be much higher

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const [hasWon, setHasWon] = useState(false);
  const [runtime, setRuntime] = useState(0);
  const runtimeRef = useRef(0);
  const runtimeInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isRunningRef.current && !hasWon) {
      runtimeInterval.current = setInterval(() => {
        setRuntime(prev => {
          const newRuntime = prev + 1;
          runtimeRef.current = newRuntime;
          return newRuntime;
        });
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
    attemptsRef.current = 0;
    setIsRunning(false);
    setHasWon(false);
    isRunningRef.current = false;
    runtimeRef.current = 0;
    if (runtimeInterval.current) {
      clearInterval(runtimeInterval.current);
      runtimeInterval.current = undefined;
    }
    setRuntime(0);
    localStorage.removeItem(TOP_MATCHES_KEY);
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

    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    
    const key = "0x" + randomBytes(32).toString("hex");
    const wallet = new Wallet(key);
    const zeroMatchPercentage = calculateZeroMatch(wallet.address);

    const newWallet = {
      privateKey: key,
      address: CONFIG.TEST_MODE ? getTestAddress() : wallet.address,
      zeroMatchPercentage,
      matchRuntime: runtimeRef.current,
      matchAttempts: attemptsRef.current
    };

    setWalletInfo(newWallet);
    
    const matches = getTopMatches();
    if (matches.length < 10 || zeroMatchPercentage > matches[matches.length - 1].zeroMatchPercentage) {
      const updatedMatches = [...matches, newWallet]
        .sort((a, b) => b.zeroMatchPercentage - a.zeroMatchPercentage)
        .slice(0, 10);

      localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(updatedMatches));
    }
    
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

  const updateTopMatches = useCallback((newWallet: WalletInfo) => {
    const matches = getTopMatches();
    const updatedWallet = {
      ...newWallet,
      matchRuntime: runtime // Add runtime when match is saved
    };
    
    // Add to matches if better than existing or if less than 10 matches
    if (matches.length < 10 || newWallet.zeroMatchPercentage > matches[matches.length - 1].zeroMatchPercentage) {
      matches.push(updatedWallet);
      matches.sort((a, b) => b.zeroMatchPercentage - a.zeroMatchPercentage);
      matches.splice(10); // Keep only top 10
      localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(matches));
    }
  }, [runtime]);

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