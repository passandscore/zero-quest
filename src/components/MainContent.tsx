import { FaKey, FaCopy, FaMoneyBillWave } from "react-icons/fa";
import { WalletInfo } from "@/types";
import { VAULT_URL } from "@/utils/constants";

interface MainContentProps {
  walletInfo: WalletInfo | null;
  generatePrivateKey: () => void;
  copyToClipboard: (text: string, id: string) => void;
  copyingId: string | null;
  attempts: number;
  isRunning: boolean;
  hasWon: boolean;
}

export function MainContent({ walletInfo, generatePrivateKey, copyToClipboard, copyingId, attempts, isRunning, hasWon }: MainContentProps) {
  return (
    <>
      <div className="text-center w-full">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-4 glitch-text">
          Zero Quest
        </h1>
        <p className="text-sm text-green-600">
          {hasWon ? 
            '> MISSION ACCOMPLISHED! 🎉' : 
            '> INITIALIZING ZERO ADDRESS HACK_'
          }
        </p>
        <p className="text-sm text-green-600/50 mt-1">
          {'>'} ATTEMPTS: {attempts}_{isRunning ? ' [RUNNING]' : ''}
        </p>
        {!hasWon && (
          <p className="text-xs text-green-600/30 mt-1">
            {'>'} HOLD [G] TO RUN
          </p>
        )}
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
          href={VAULT_URL}
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
  );
} 