"use client";
import { FaKey, FaCopy, FaMoneyBillWave } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
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
  const [topMatches, setTopMatches] = useState<Array<{ address: string; percentage: number; privateKey: string }>>([
    { address: "0x0000000000000000000000000000000000000001", percentage: 15.625, privateKey: "0x123..." },
    { address: "0x0000000000000000000000000000000000000002", percentage: 12.5, privateKey: "0x456..." },
    { address: "0x0000000000000000000000000000000000000003", percentage: 10.0, privateKey: "0x789..." },
    { address: "0x0000000000000000000000000000000000000004", percentage: 8.75, privateKey: "0xabc..." },
    { address: "0x0000000000000000000000000000000000000005", percentage: 7.5, privateKey: "0xdef..." },
    { address: "0x0000000000000000000000000000000000000006", percentage: 6.25, privateKey: "0xghi..." },
    { address: "0x0000000000000000000000000000000000000007", percentage: 5.0, privateKey: "0xjkl..." },
    { address: "0x0000000000000000000000000000000000000008", percentage: 4.375, privateKey: "0xmno..." },
    { address: "0x0000000000000000000000000000000000000009", percentage: 3.75, privateKey: "0xpqr..." },
    { address: "0x000000000000000000000000000000000000000a", percentage: 3.125, privateKey: "0xstu..." },
  ]);

  const [copyNotification, setCopyNotification] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopyingId(id);
    setCopyNotification(">> Key copied to clipboard <<");
    setTimeout(() => {
      setCopyingId(null);
      setCopyNotification(null);
    }, 2000);
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

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Handle Enter key
    if (event.key === 'Enter') {
      if (showInfo || showTopMatches) {
        setShowInfo(false);
        setShowTopMatches(false);
        return;
      }
    }

    // Handle Tab key
    if (event.key === 'Tab') {
      event.preventDefault();
      if (!showInfo && !showTopMatches) {
        // Toggle between available commands
        if (event.shiftKey) {
          setShowInfo(true);
        } else {
          setShowTopMatches(true);
        }
      }
    }

    // Handle Escape key
    if (event.key === 'Escape') {
      setShowInfo(false);
      setShowTopMatches(false);
    }

    // Handle ls command
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setShowInfo(false);
      setShowTopMatches(false);
    }

    // New shortcuts for main actions
    if (!showInfo && !showTopMatches) {
      if (event.key === 'g') {
        generatePrivateKey();
      }
      if (event.key === 'a') {
        window.open('https://etherscan.io/address/0x0000000000000000000000000000000000000000#multichain-portfolio', '_blank');
      }
      if (event.key === 't') {
        setShowTopMatches(true);
      }
      if (event.key === 'h') {
        setShowInfo(true);
      }
    }

    // Handle copy command
    if (event.key === 'c') {
      if (walletInfo && !showInfo && !showTopMatches) {
        // Copy main wallet key
        copyToClipboard(walletInfo.privateKey, walletInfo.address);
      } else if (showTopMatches && topMatches.length > 0) {
        // Copy first top match key
        copyToClipboard(topMatches[0].privateKey, topMatches[0].address);
      }
    }
  }, [showInfo, showTopMatches, walletInfo, topMatches, copyToClipboard]);

  useEffect(() => {
    fetchZeroAddressBalances();
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <div className="grid grid-rows-[20px_1fr_20px] min-h-screen gap-8">
        <main className="flex flex-col gap-8 row-start-2 items-center max-w-4xl mx-auto w-full">
          {!showInfo && !showTopMatches ? (
            <>
              <div className="text-center w-full">
                <h1 className="text-6xl font-bold text-green-400 glitch-text mb-4">
                  Zero Quest
                </h1>
                <p className="text-sm text-green-600">
                  {'>'} INITIALIZING ZERO ADDRESS HACK_
                </p>
              </div>

              <div className="flex gap-4 items-center flex-col sm:flex-row">
                <button
                  onClick={generatePrivateKey}
                  className="px-6 py-2 bg-green-500/10 border border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all flex items-center gap-2"
                >
                  <FaKey className="w-4 h-4" />
                  GENERATE_KEY.exe [G]
                </button>
                <a
                  href="https://etherscan.io/address/0x0000000000000000000000000000000000000000#multichain-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-green-500/10 border border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all flex items-center gap-2"
                >
                  <FaMoneyBillWave className="w-4 h-4" />
                  ACCESS_VAULT.sys [A]
                </a>
              </div>

              {walletInfo && (
                <div className="w-full p-4 bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm break-all flex-1">
                      {'>'} PRIVATE_KEY: {"••••••••••••••••"}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(walletInfo.privateKey, walletInfo.address)}
                        className="p-2 hover:bg-green-500/20 transition-all w-[32px] h-[32px] flex items-center justify-center"
                      >
                        {copyingId === walletInfo.address ? (
                          <span className="text-xs">OK_</span>
                        ) : (
                          <FaCopy size={12} />
                        )}
                      </button>
                      <span className="text-green-500/50 text-xs">[C]</span>
                    </div>
                  </div>
                  <p className="text-sm break-all mb-2">
                    {'>'} ADDRESS: {walletInfo.address}
                  </p>
                  <p className="text-sm">
                    {'>'} MATCH: {walletInfo.zeroMatchPercentage.toFixed(2)}%_
                  </p>
                </div>
              )}
            </>
          ) : showInfo ? (
            <div className="w-full p-6 bg-green-500/5 border border-green-500/20">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg mb-2">{'>'} MISSION_BRIEFING.txt</h3>
                  <p className="text-sm text-green-400 leading-relaxed">
                    {'>'} TARGET: Generate private key for 0x0000...0000<br/>
                    {'>'} STATUS: Not impossible. Highly improbable.<br/>
                    {'>'} ODDS: 1 in 2¹⁶⁰
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg mb-2">{'>'} HOW_IT_WORKS.md</h3>
                  <div className="text-sm text-green-400 leading-relaxed space-y-2">
                    <p>{'>'} 1. Generate random private key</p>
                    <p>{'>'} 2. Derive Ethereum address</p>
                    <p>{'>'} 3. Count leading zeros</p>
                    <p>{'>'} 4. Calculate match percentage</p>
                    <p>{'>'} 5. Save if better than previous</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-2">{'>'} TECHNICAL_DETAILS.txt</h3>
                  <div className="text-sm text-green-400 leading-relaxed space-y-2">
                    <p>{'>'} Private Key: 32 bytes (256 bits)</p>
                    <p>{'>'} Address: 20 bytes (160 bits)</p>
                    <p>{'>'} Match: Leading zero bits / 160 * 100</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-6 bg-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">{'>'} TOP_MATCHES.log</h3>
                {copyNotification && (
                  <span className="text-sm bg-green-500/10 border border-green-500/50 px-4 py-1 animate-fade-up">
                    {copyNotification}
                  </span>
                )}
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-500/20">
                    <th className="py-2 px-4 text-left text-green-400">#</th>
                    <th className="py-2 px-4 text-left text-green-400">Address</th>
                    <th className="py-2 px-4 text-right text-green-400">Match</th>
                    <th className="py-2 px-4 text-right text-green-400">Key</th>
                  </tr>
                </thead>
                <tbody>
                  {topMatches.map((match, index) => (
                    <tr key={match.address} className="border-t border-green-500/20">
                      <td className="py-3 px-4 text-green-400">#{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-mono">{match.address}</td>
                      <td className="py-3 px-4 text-sm text-right">{match.percentage.toFixed(3)}%</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(match.privateKey, match.address)}
                            className="w-[32px] h-[32px] bg-green-500/10 hover:bg-green-500/20 transition-all flex items-center justify-center"
                          >
                            {copyingId === match.address ? (
                              <span className="text-xs">OK_</span>
                            ) : (
                              <FaCopy size={12} />
                            )}
                          </button>
                          <span className="text-green-500/50 text-xs">[C]</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

       

        <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-green-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="px-4 py-1 text-green-500/40 text-sm flex justify-between">
              <span>Last login: {new Date().toLocaleString()}</span>
              <span>Press [Tab] for commands, [Esc] to clear</span>
            </div>
            
            <div className="px-4 py-2 flex items-center text-sm bg-black">
              <span className="text-green-500/50 mr-2">root@zeroquest:~$</span>
              {showInfo || showTopMatches ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-400">cd ..</span>
                  <span className="text-green-500/50 ml-2">[Enter]</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-green-400 mr-8">
                    {showTopMatches ? 'cat TOP_MATCHES.log' : 'ls -la'}
                  </span>
                  <div className="flex gap-8 text-green-500/50">
                    <button
                      onClick={() => setShowTopMatches(true)}
                      className="hover:text-green-300"
                    >
                      TOP_MATCHES.log [T]
                    </button>
                    <button
                      onClick={() => setShowInfo(true)}
                      className="hover:text-green-300"
                    >
                      HELP.txt [H]
                    </button>
                  </div>
                </div>
              )}
              <span className="animate-pulse ml-2">█</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
