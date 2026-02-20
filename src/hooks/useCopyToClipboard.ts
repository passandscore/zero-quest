import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopyingId(id);
    toast.success("PK copied");
    setTimeout(() => setCopyingId(null), 500);
  };

  return { copyingId, copyToClipboard };
} 