import { useEffect, useState } from 'react';

const TOP_MATCHES_KEY = 'zero_quest_top_matches';

interface TerminalFooterProps {
  setShowCommands: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  showResetConfirm?: boolean;
  showVaultConfirm?: boolean;
  showFileImportConfirm?: boolean;
  showFileExportConfirm?: boolean;
  isRunning?: boolean;
  setRuntime: (runtime: number) => void;
  runtimeRef: React.MutableRefObject<number>;
  setAttempts: (attempts: number) => void;
  attemptsRef: React.MutableRefObject<number>;
}

export function TerminalFooter({ 
  setShowCommands,
  setShowInfo,
  showResetConfirm,
  showVaultConfirm,
  showFileImportConfirm,
  showFileExportConfirm,
  isRunning,
  setRuntime,
  runtimeRef,
  setAttempts,
  attemptsRef
}: TerminalFooterProps) {
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    setLastLogin(new Date().toLocaleString());
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const matches = JSON.parse(event.target?.result as string);
          
          if (Array.isArray(matches)) {
            localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(matches));
            
            const globalState = matches.reduce((acc, match) => ({
              runtime: Math.max(acc.runtime, match.matchRuntime || 0),
              attempts: Math.max(acc.attempts, match.matchAttempts || 0)
            }), { runtime: 0, attempts: 0 });

            setRuntime(globalState.runtime);
            runtimeRef.current = globalState.runtime;
            setAttempts(globalState.attempts);
            attemptsRef.current = globalState.attempts;

            window.location.reload();
          } else {
            throw new Error('Invalid backup format');
          }
        } catch {
          alert('Error: Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#33ff00] h-8">
      <div className="px-4">
        <div className="py-1 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {isRunning && (showResetConfirm || showVaultConfirm || showFileImportConfirm || showFileExportConfirm) ? (
              <span className="text-[#33ff00]">{'>'} Program needs to be stopped to continue [SPACE]_</span>
            ) : showResetConfirm ? (
              <span className="text-[#33ff00]">{'>'} Reset all progress? [Y/N]_</span>
            ) : showVaultConfirm ? (
              <span className="text-[#33ff00]">{'>'} View vault balance on Etherscan? [Y/N]_</span>
            ) : showFileImportConfirm ? (
              <span className="text-[#33ff00]">{'>'} Import existing progress from file? [Y/N]_</span>
            ) : showFileExportConfirm ? (
              <span className="text-[#33ff00]">{'>'} Export existing progress to file? [Y/N]_</span>
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
          {!showResetConfirm && !showVaultConfirm && !showFileImportConfirm && !showFileExportConfirm && (
            <span className="text-[#f0f]">Last login: {lastLogin}</span>
          )}
        </div>
      </div>
      {showFileImportConfirm && (
        <input
          type="file"
          onChange={handleImport}
          style={{ display: 'none' }}
          id="file-input"
        />
      )}
    </footer>
  );
} 