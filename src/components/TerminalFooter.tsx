import { VAULT_URL } from '@/utils/constants';

const TOP_MATCHES_KEY = 'zero_quest_top_matches';

interface TerminalFooterProps {
  setShowCommands: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  setShowShare?: (show: boolean) => void;
  showResetConfirm?: boolean;
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
  setShowShare,
  showResetConfirm,
  showFileImportConfirm,
  showFileExportConfirm,
  isRunning,
  setRuntime,
  runtimeRef,
  setAttempts,
  attemptsRef
}: TerminalFooterProps) {
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
    <footer className="hidden md:flex fixed bottom-0 left-0 right-0 bg-steam-bg/80 backdrop-blur-md h-14 items-center justify-center z-10">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] tracking-widest uppercase text-steam-text-muted">
        {isRunning && (showResetConfirm || showFileImportConfirm || showFileExportConfirm) ? (
          <span className="text-steam-text-muted">Stop the hunt first to continue</span>
        ) : showResetConfirm ? (
          <span className="text-steam-text">Reset all progress? (Y/N)</span>
        ) : showFileImportConfirm ? (
          <span className="text-steam-text">Import from file? (Y/N)</span>
        ) : showFileExportConfirm ? (
          <span className="text-steam-text">Export to file? (Y/N)</span>
        ) : (
          <>
            <button
              onClick={() => setShowCommands(true)}
              className="text-steam-text-muted hover:text-steam-text transition-colors"
              aria-label="Shortcuts"
            >
              Shortcuts
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="text-steam-text-muted hover:text-steam-text transition-colors"
              aria-label="Help"
            >
              Help
            </button>
            {setShowShare && (
              <button
                onClick={() => setShowShare(true)}
                className="text-steam-text-muted hover:text-steam-text transition-colors"
                aria-label="Post to X"
              >
                Post to X
              </button>
            )}
            <a
              href={VAULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steam-text-muted hover:text-steam-text transition-colors"
              aria-label="View vault"
            >
              Vault
            </a>
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-steam-text-muted hover:text-steam-text transition-colors"
            >
              Leaderboard
            </a>
          </>
        )}
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