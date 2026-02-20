"use client";

import { Modal } from "./Modal";
import { LeaderboardContent } from "./LeaderboardContent";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface Top10ModalProps {
  show: boolean;
  onClose: () => void;
}

export function Top10Modal({ show, onClose }: Top10ModalProps) {
  const { copyToClipboard, copyingId } = useCopyToClipboard();

  return (
    <Modal isOpen={show} onClose={onClose} size="xl">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-light tracking-tight text-steam-text mb-2">
          Top 10
        </h2>
        <p className="text-[11px] text-steam-text-muted tracking-widest uppercase mb-6">
          Addresses closest to zero
        </p>
        <LeaderboardContent
          copyToClipboard={copyToClipboard}
          copyingId={copyingId}
          onCloseGenerator={onClose}
        />
      </div>
    </Modal>
  );
}
