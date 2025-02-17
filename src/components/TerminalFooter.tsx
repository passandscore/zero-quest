import { useEffect, useState } from 'react';
import { VAULT_URL } from '@/utils/constants';

interface TerminalFooterProps {
  setShowCommands: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  setShowShare: (show: boolean) => void;
  showResetConfirm?: boolean;
  showVaultConfirm?: boolean;
}

export function TerminalFooter({ 
  setShowCommands,
  setShowInfo,
  setShowShare,
  showResetConfirm,
  showVaultConfirm
}: TerminalFooterProps) {
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    setLastLogin(new Date().toLocaleString());
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#33ff00] h-8">
      <div className="px-4">
        <div className="py-1 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {showResetConfirm ? (
              <span className="text-[#33ff00]">{'>'} Reset all progress? [Y/N]_</span>
            ) : showVaultConfirm ? (
              <span className="text-[#33ff00]">{'>'} View vault balance on Etherscan? [Y/N]_</span>
            ) : (
              <>
                <span className="text-[#f0f]">root@zeroquest</span>
                <span className="text-[#33ff00]">:~$</span>
                <div className="flex gap-4 text-[#33ff00]">
                  <button onClick={() => setShowCommands(true)}>
                    COMMANDS.txt [CTRL+/]
                  </button>
                  <button onClick={() => setShowInfo(true)}>
                    HELP.txt [H]
                  </button>
                </div>
              </>
            )}
          </div>
          {!showResetConfirm && !showVaultConfirm && (
            <span className="text-[#f0f]">Last login: {lastLogin}</span>
          )}
        </div>
      </div>
    </footer>
  );
} 