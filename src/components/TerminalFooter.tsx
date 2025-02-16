import { useEffect, useState } from 'react';

interface TerminalFooterProps {
  showInfo: boolean;
  showTopMatches: boolean;
  setShowInfo: (show: boolean) => void;
  setShowTopMatches: (show: boolean) => void;
}

export function TerminalFooter({
  showInfo,
  showTopMatches,
  setShowInfo,
  setShowTopMatches
}: TerminalFooterProps) {
  const [lastLogin, setLastLogin] = useState('');

  useEffect(() => {
    setLastLogin(new Date().toLocaleString());
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-green-500/20">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-1 text-green-500/40 text-sm">
          <span>Last login: {lastLogin}</span>
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
              <span className="text-green-400 mr-8">ls -la</span>
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
  );
} 