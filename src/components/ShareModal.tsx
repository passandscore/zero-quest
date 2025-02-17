import { Modal } from './Modal';
import { WalletInfo } from '@/types';
import { useMemo, useState } from 'react';
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
    
    const text = `🎯 Hunting the Ethereum Zero Address!\n\n` +
      `🏆 Best Match: ${topMatch.zeroMatchPercentage.toFixed(3)}% \n` +
      `⏱️ Found at Runtime: ${formatRuntime(topMatch.matchRuntime)}\n` +
      `🔄 Found at Attempt: ${topMatch.matchAttempts.toLocaleString()}\n\n` +
      `Join the quest at https://zeroquest.io\n\n` +
      `#ZeroQuest #Ethereum #Web3`;

    return text;
  }, [topMatch]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopyStatus('OK');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-4 font-mono text-base">
        <div className="text-[#33ff00] mb-4">
          {'>'} cat SHARE.txt
        </div>
        <div className="space-y-4">
          <div className="bg-[#001100] p-4 border border-[#33ff00]/20 rounded">
            <pre className="whitespace-pre-wrap text-[#33ff00] text-sm">
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
