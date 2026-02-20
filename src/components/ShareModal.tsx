import { Modal } from "./Modal";
import { useMemo, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";

function ShareIcon({ className }: { className?: string }) {
  return <FaXTwitter className={className} aria-hidden />;
}
import { getTopMatches } from "@/utils/storage";
import { ZEROQUEST_X_URL } from "@/utils/constants";

interface ShareModalProps {
  show: boolean;
  onClose: () => void;
}

export function ShareModal({ show, onClose }: ShareModalProps) {
  const topMatch = useMemo(() => {
    const matches = getTopMatches();
    return matches.length > 0 ? matches[0] : null;
  }, [show]);

  const formatRuntime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(" ");
  };

  const tweetText = useMemo(() => {
    if (!topMatch) return "";
    return `Hunting the zero address.

Best match: ${topMatch.zeroMatchPercentage.toFixed(3)}%
Runtime: ${formatRuntime(topMatch.matchRuntime)}
Attempts: ${topMatch.matchAttempts.toLocaleString()}

@zeroquest #ZeroQuest #Ethereum`;
  }, [topMatch]);

  const tweetUrl = useMemo(() => {
    if (!tweetText) return "";
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  }, [tweetText]);

  const postToX = () => {
    window.open(tweetUrl, "_blank", "noopener,noreferrer,width=550,height=420");
    onClose();
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (show) window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [show, onClose]);

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-8">
        <h2 className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted mb-6 flex items-center gap-2">
          <ShareIcon className="w-4 h-4" />
          Post to X
        </h2>
        <div className="mb-8">
          <p className="text-steam-text text-sm leading-relaxed whitespace-pre-line">{tweetText || "No progress to share yet."}</p>
        </div>
        <div className="flex items-center justify-between">
          <a
            href={ZEROQUEST_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-steam-text-muted tracking-widest uppercase hover:text-steam transition-colors"
          >
            @zeroquest
          </a>
          <button
            onClick={postToX}
            disabled={!topMatch}
            className="px-6 py-2.5 text-[11px] font-medium tracking-widest uppercase bg-steam text-steam-bg disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Post
          </button>
        </div>
      </div>
    </Modal>
  );
}
