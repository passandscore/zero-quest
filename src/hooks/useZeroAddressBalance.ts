"use client";

import { useState, useEffect } from "react";
import { JsonRpcProvider, formatEther } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const RPC_URL = "https://ethereum-rpc.publicnode.com";
const REFRESH_MS = 60_000; // refresh every minute

function formatBalance(wei: bigint): string {
  const eth = parseFloat(formatEther(wei));
  if (eth >= 1_000_000) return `${(eth / 1_000_000).toFixed(1)}M ETH`;
  if (eth >= 1_000) return `${(eth / 1_000).toFixed(1)}K ETH`;
  if (eth >= 1) return eth.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " ETH";
  if (eth >= 0.001) return eth.toFixed(4) + " ETH";
  return eth.toFixed(6) + " ETH";
}

export function useZeroAddressBalance() {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new JsonRpcProvider(RPC_URL);
        const wei = await provider.getBalance(ZERO_ADDRESS);
        setBalance(formatBalance(wei));
        setError(false);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return { balance, isLoading, error };
}
