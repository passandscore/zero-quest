"use client";

import { useState, useRef } from "react";
import { VAULT_URL } from "@/utils/constants";

const TOP_MATCHES_KEY = "zero_quest_top_matches";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

interface MobileMenuProps {
  setShowCommands: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
  setShowShare: (show: boolean) => void;
  setShowResetConfirm: (show: boolean) => void;
  setShowFileImportConfirm: (show: boolean) => void;
  setShowExportConfirm: (show: boolean) => void;
  showResetConfirm: boolean;
  showFileImportConfirm: boolean;
  showFileExportConfirm: boolean;
  isRunning: boolean;
  setRuntime: (n: number) => void;
  runtimeRef: React.MutableRefObject<number>;
  setAttempts: (n: number) => void;
  attemptsRef: React.MutableRefObject<number>;
  reset: () => void;
  onExportConfirmYes: () => void;
}

export function MobileMenu({
  setShowCommands,
  setShowInfo,
  setShowShare,
  setShowResetConfirm,
  setShowFileImportConfirm,
  setShowExportConfirm,
  showResetConfirm,
  showFileImportConfirm,
  showFileExportConfirm,
  isRunning,
  setRuntime,
  runtimeRef,
  setAttempts,
  attemptsRef,
  reset,
  onExportConfirmYes,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          if (importData.matches && importData.globalState) {
            localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(importData.matches));
            localStorage.setItem("zero_quest_state", JSON.stringify(importData.globalState));
            setRuntime(importData.globalState.runtime);
            runtimeRef.current = importData.globalState.runtime;
            setAttempts(importData.globalState.attempts);
            attemptsRef.current = importData.globalState.attempts;
            setShowFileImportConfirm(false);
            window.location.reload();
          } else if (Array.isArray(importData)) {
            localStorage.setItem(TOP_MATCHES_KEY, JSON.stringify(importData));
            const globalState = importData.reduce(
              (acc: { runtime: number; attempts: number }, m: { matchRuntime?: number; matchAttempts?: number }) => ({
                runtime: Math.max(acc.runtime, m.matchRuntime ?? 0),
                attempts: Math.max(acc.attempts, m.matchAttempts ?? 0),
              }),
              { runtime: 0, attempts: 0 }
            );
            setRuntime(globalState.runtime);
            runtimeRef.current = globalState.runtime;
            setAttempts(globalState.attempts);
            attemptsRef.current = globalState.attempts;
            setShowFileImportConfirm(false);
            window.location.reload();
          } else {
            throw new Error("Invalid backup format");
          }
        } catch {
          alert("Error: Invalid backup file");
        }
      };
      reader.readAsText(file);
    }
  };

  const hasConfirmation =
    showResetConfirm || showFileImportConfirm || showFileExportConfirm;

  const handleAction = (fn: () => void) => {
    fn();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden fixed bottom-16 left-4 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="w-12 h-12 rounded-full bg-steam-panel border border-steam-border text-steam-text-muted flex items-center justify-center hover:text-steam hover:border-steam/40 focus:outline-none focus:ring-1 focus:ring-steam/30 transition-colors"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-steam-panel max-h-[70vh] overflow-y-auto animate-[slideUp_0.2s_ease-out]">
            <div className="p-6 text-sm">
              {isRunning && hasConfirmation ? (
                <p className="text-steam-text-muted mb-4">
                  Stop the hunt first to use these options.
                </p>
              ) : hasConfirmation ? (
                <div className="space-y-4">
                  {showResetConfirm && (
                    <div>
                      <p className="text-steam-text mb-4">Reset all progress?</p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            reset();
                            setShowResetConfirm(false);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            setShowResetConfirm(false);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                  {showFileImportConfirm && (
                    <div>
                      <p className="text-steam-text mb-4">Import progress from file?</p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam"
                        >
                          Choose file
                        </button>
                        <button
                          onClick={() => {
                            setShowFileImportConfirm(false);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {showFileExportConfirm && (
                    <div>
                      <p className="text-steam-text mb-4">Export progress to file?</p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            onExportConfirmYes();
                            setShowExportConfirm(false);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => {
                            setShowExportConfirm(false);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted mb-6">Menu</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleAction(() => setShowCommands(true))}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
                    >
                      Shortcuts
                    </button>
                    <button
                      onClick={() => handleAction(() => setShowInfo(true))}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
                    >
                      Help
                    </button>
                    <button
                      onClick={() => handleAction(() => setShowShare(true))}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
                    >
                      Post to X
                    </button>
                    <button
                      onClick={() => handleAction(() => setShowResetConfirm(true))}
                      disabled={isRunning}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Reset
                    </button>
                    <a
                      href="/leaderboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
                    >
                      Leaderboard
                    </a>
                    <a
                      href={VAULT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors"
                    >
                      Vault
                    </a>
                    <button
                      onClick={() => handleAction(() => setShowFileImportConfirm(true))}
                      disabled={isRunning}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => handleAction(() => setShowExportConfirm(true))}
                      disabled={isRunning}
                      className="w-full text-left py-3 px-0 text-[11px] font-medium tracking-widest uppercase text-steam-text-muted hover:text-steam transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Export
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
