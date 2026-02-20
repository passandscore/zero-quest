"use client";

interface MilestoneToastProps {
  show: boolean;
  percentage: number;
}

export function MilestoneToast({ show, percentage }: MilestoneToastProps) {
  if (!show) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-[fadeIn_0.3s_ease-out]"
      role="status"
      aria-live="polite"
    >
      <div className="px-6 py-3 bg-steam-panel/95 text-sm tracking-widest uppercase text-steam">
        {percentage}% match
      </div>
    </div>
  );
}
