import { useState } from "react";

export function useCopyToClipboard() {
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopyingId(id);
    setCopyNotification(">> Key copied to clipboard <<");
    setTimeout(() => {
      setCopyingId(null);
      setCopyNotification(null);
    }, 2000);
  };

  return { copyingId, copyNotification, copyToClipboard };
} 