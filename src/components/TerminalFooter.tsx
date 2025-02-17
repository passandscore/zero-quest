import { useEffect, useState } from 'react';
import { VAULT_URL } from '@/utils/constants';

interface TerminalFooterProps {
  setShowCommands: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  setShowShare: (show: boolean) => void;
}

export function TerminalFooter({ 
  setShowCommands,
  setShowInfo,
  setShowShare
}: TerminalFooterProps) {
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    setLastLogin(new Date().toLocaleString());
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#33ff00] h-14">
      <div className="px-20">
        <div className="py-2 flex items-center justify-between text-base">
          <div className="flex items-center justify-center w-full xl:w-auto">
            <span className="text-[#33ff00] mr-5 hidden xl:inline">root@zeroquest:~$ ls -la</span>
            <div className="flex gap-8 text-[#33ff00]">
              <button
                onClick={() => setShowCommands(true)}
              >
                COMMANDS.txt [CTRL+/]
              </button>
              <button
                onClick={() => window.open(VAULT_URL, '_blank')}
              >
                VAULT.exe [CTRL+V]
              </button>
              <button
                onClick={() => setShowInfo(true)}
              >
                HELP.txt [H]
              </button>
              <button
                onClick={() => setShowShare(true)}
              >
                SHARE.txt [CTRL+S]
              </button>
            </div>
          </div>
          <span className="text-[#33ff00] hidden xl:inline">Last login: {lastLogin}</span>
        </div>
      </div>
    </footer>
  );
} 