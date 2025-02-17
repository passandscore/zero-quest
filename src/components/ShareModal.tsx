import { Modal } from './Modal';
import { useMemo, useState, useEffect } from 'react';
import { getTopMatches } from '@/utils/storage';

interface ShareModalProps {
  show: boolean;
  onClose: () => void;
}

export function ShareModal({ show, onClose }: ShareModalProps) {
  const [copyStatus, setCopyStatus] = useState('');

  const topMatch = useMemo(() => {
    const matches = getTopMatches();
    return matches.length > 0 ? matches[0] : null;
  }, [show]);

  const formatRuntime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${secs}s`;
    
    return result.trim();
  };

  const shareText = useMemo(() => {
    if (!topMatch) return '';
    
    const text = 
`┌─────────────── ZERO_QUEST ───────────────┐

🎯 Hunting Zero Address Private Key...

> BEST_MATCH: ${topMatch.zeroMatchPercentage.toFixed(3)}%
> RUNTIME: ${formatRuntime(topMatch.matchRuntime)}
> ATTEMPT: ${topMatch.matchAttempts.toLocaleString()}

> zeroquest.io
> #ZeroQuest #Ethereum #Web3

└──────────────────────────────────────┘`;

    return text;
  }, [topMatch]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopyStatus('OK');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Handle ESC
      if (event.key === 'Escape') {
        onClose();
      }
      
      // Handle 'c' key (changed from Ctrl+C)
      if (event.key === 'c' || event.key === 'C') {
        event.preventDefault();
        copyToClipboard();
      }
    };

    if (show) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [show, onClose, copyToClipboard]);

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-4 font-mono text-base">
        <div className="text-[#33ff00] mb-4 text-left">
          {'>'} cat SHARE.txt
        </div>
        <div className="space-y-4">
          <div className="bg-[#001100] p-4 border border-[#33ff00]/20 rounded flex justify-center">
            <pre className="whitespace-pre text-[#33ff00] text-sm">
              {shareText}
            </pre>
          </div>
          <div className="flex justify-end">
            <button
              onClick={copyToClipboard}
              className="text-[#33ff00] hover:text-[#33ff00]/80 transition-colors"
            >
              [{copyStatus || 'COPY'}]
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
