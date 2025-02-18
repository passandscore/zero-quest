"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { calculateZeroMatch, getTestAddress } from "@/utils/calculations";
import { getTopMatches } from "@/utils/storage";
import { WalletInfo } from "@/types";
import { CONFIG } from "@/config";

export const TOP_MATCHES_KEY = 'zero_quest_top_matches';
export const GLOBAL_STATE_KEY = 'zero_quest_state';

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
    // Reset state
    setWalletInfo(null);
    setAttempts(0);
    attemptsRef.current = 0;
    setIsRunning(false);
    setHasWon(false);
    isRunningRef.current = false;
    runtimeRef.current = 0;
    setRuntime(0);
    
    // Clear runtime interval if running
    if (runtimeInterval.current) {
      clearInterval(runtimeInterval.current);
      runtimeInterval.current = undefined;
    }

    // Clear all localStorage values
    localStorage.removeItem(TOP_MATCHES_KEY);
    localStorage.removeItem(GLOBAL_STATE_KEY);
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
      // Keep existing match stats for old entries
      const existingMatches = matches.filter(m => m.address !== newWallet.address);
      const updatedMatches = [...existingMatches, newWallet]
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
    
    // Load previous runtime and attempts from localStorage
    const savedState = localStorage.getItem(GLOBAL_STATE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.runtime && state.attempts) {
          const runtime = parseInt(state.runtime);
          const attempts = parseInt(state.attempts);
          
          // Update both refs and state
          runtimeRef.current = runtime;
          setRuntime(runtime);
          attemptsRef.current = attempts;
          setAttempts(attempts);
        }
      } catch (error) {
        console.error('Error restoring state:', error);
      }
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
    attemptsRef
  };
} 