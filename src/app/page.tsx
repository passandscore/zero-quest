"use client";
import { FaKey, FaCopy, FaArrowLeft, FaTrophy, FaQuestionCircle, FaMoneyBillWave } from "react-icons/fa";
import { useState, useEffect } from "react";
import { randomBytes } from "crypto";
import { Wallet, JsonRpcProvider } from "ethers";
import { ethers } from "ethers";

interface WalletInfo {
  privateKey: string;
  address: string;
  zeroMatchPercentage: number;
}

interface ChainBalance {
  name: string;
  balance: string;
  error?: string;
}

const CHAINS = [
  {
    name: "Ethereum",
    rpc: "https://eth.llamarpc.com",
  },
  {
    name: "BSC",
    rpc: "https://bsc-dataseed.binance.org",
  },
  {
    name: "Polygon",
    rpc: "https://polygon-rpc.com",
  },
  {
    name: "Arbitrum",
    rpc: "https://arb1.arbitrum.io/rpc",
  },
];

export default function Home() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [zeroAddressBalances, setZeroAddressBalances] = useState<ChainBalance[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showTopMatches, setShowTopMatches] = useState(false);
  const [topMatches, setTopMatches] = useState<Array<{ address: string; percentage: number }>>([
    // Example data - you can replace this with actual storage/fetching logic
    { address: "0x0000000000000000000000000000000000000001", percentage: 15.625 },
    { address: "0x0000000000000000000000000000000000000002", percentage: 12.5 },
    { address: "0x0000000000000000000000000000000000000003", percentage: 10.0 },
    { address: "0x0000000000000000000000000000000000000004", percentage: 8.75 },
  ]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const calculateZeroMatch = (address: string): number => {
    // Remove '0x' prefix and count leading zeros
    const addressWithoutPrefix = address.slice(2).toLowerCase();
    let matchingBits = 0;

    // Count matching zero nibbles (4 bits each)
    for (let i = 0; i < addressWithoutPrefix.length; i++) {
      if (addressWithoutPrefix[i] === "0") {
        matchingBits += 4;
      } else {
        // For the first non-zero character, count matching bits
        const nibble = parseInt(addressWithoutPrefix[i], 16);
        const leadingZeros = Math.clz32(nibble) - 28; // -28 because clz32 works with 32 bits
        matchingBits += leadingZeros;
        break;
      }
    }

    // Convert to percentage (Ethereum address is 160 bits)
    return (matchingBits / 160) * 100;
  };

  const generatePrivateKey = () => {
    const key = "0x" + randomBytes(32).toString("hex");
    const wallet = new Wallet(key);
    const zeroMatchPercentage = calculateZeroMatch(wallet.address);

    setWalletInfo({
      privateKey: key,
      address: wallet.address,
      zeroMatchPercentage: zeroMatchPercentage,
    });
  };

  const fetchZeroAddressBalances = async () => {
    const results = await Promise.all(
      CHAINS.map(async (chain) => {
        try {
          const provider = new JsonRpcProvider(chain.rpc);
          const balance = await provider.getBalance("0x0000000000000000000000000000000000000000");
          return {
            name: chain.name,
            balance: ethers.formatEther(balance),
          };
        } catch (error) {
          return {
            name: chain.name,
            balance: "0",
            error: "Failed to fetch",
          };
        }
      })
    );
    setZeroAddressBalances(results);
  };

  useEffect(() => {
    fetchZeroAddressBalances();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        {!showInfo && !showTopMatches ? (
          <>
            <div className="text-center w-full">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4">
                Zero Quest
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-mono">
                The hunt for the impossible key
              </p>
            </div>

            <div className="flex gap-4 items-center flex-col sm:flex-row self-center">
              <button
                onClick={generatePrivateKey}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                <FaKey className="w-5 h-5" />
                Generate Key
              </button>
              <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                href="#vault"
              >
                <FaMoneyBillWave className="w-5 h-5 mr-2" />
                Vault
              </a>
            </div>

            {walletInfo && (
              <div className="mt-4 p-4 bg-black/[.05] dark:bg-white/[.06] rounded-lg flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono break-all flex-1">
                    Private Key: {"••••••••••••••••"}
                  </p>

                  <button
                    onClick={() => copyToClipboard(walletInfo.privateKey)}
                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                    title="Copy private key"
                  >
                    <FaCopy size={14} />
                  </button>
                </div>
                <p className="text-sm font-mono break-all">
                  Address: {walletInfo.address}
                </p>
                <p className="text-sm font-mono">
                  Match with zero address: {walletInfo.zeroMatchPercentage.toFixed(2)}
                  %
                </p>
              </div>
            )}
          </>
        ) : showInfo ? (
          <div className="w-full max-w-2xl mx-auto bg-black/[.05] dark:bg-white/[.06] backdrop-blur-sm rounded-xl p-6 space-y-6 border border-black/[.08] dark:border-white/[.145]">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400 font-mono">THE QUEST</h3>
              <p className="font-mono leading-relaxed">
                Generate the private key that unlocks the fortune within the zero address 
                (0x0000...0000) across all EVM chains. Not impossible, just highly improbable.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400 font-mono">THE PRIZE</h3>
              <p className="font-mono leading-relaxed">
                All funds ever sent to the zero/burn/dead address across every EVM chain. 
                A fortune locked away, waiting for its key.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400 font-mono">THE ODDS</h3>
              <p className="font-mono leading-relaxed">
                1 in 2¹⁶⁰ (approximately). Each attempt brings you closer to the impossible.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto bg-black/[.05] dark:bg-white/[.06] backdrop-blur-sm rounded-xl p-6 space-y-6 border border-black/[.08] dark:border-white/[.145]">
            <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400 font-mono">TOP MATCHES</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
              
                <tbody>
                  {topMatches.map((match, index) => (
                    <tr 
                      key={match.address}
                      className="border-t border-black/[.05] dark:border-white/[.06]"
                    >
                      <td className="px-4 font-mono text-emerald-500 dark:text-emerald-400">
                        #{index + 1}
                      </td>
                      <td className="px-4 font-mono text-sm">
                        {match.address}
                      </td>
                      <td className="px-4 font-mono text-sm text-right">
                        {match.percentage.toFixed(3)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {showInfo || showTopMatches ? (
          <button
            onClick={() => {
              setShowInfo(false);
              setShowTopMatches(false);
            }}
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <>
            <button
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              onClick={() => setShowTopMatches(true)}
            >
              <FaTrophy className="w-4 h-4" />
              Top Matches
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            >
              <FaQuestionCircle className="w-4 h-4" />
              How it works
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
