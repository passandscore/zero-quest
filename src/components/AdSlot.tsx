"use client";

export type AdFormat = "banner" | "rectangle" | "skyscraper" | "leaderboard";
export type AdPlacement = "left" | "right" | "top" | "bottom";

interface AdSlotProps {
  slotId: string;
  format?: AdFormat;
  placement?: AdPlacement;
  className?: string;
}

const DIMENSIONS: Record<AdFormat, { w: number; h: number }> = {
  banner: { w: 320, h: 50 },
  rectangle: { w: 300, h: 250 },
  skyscraper: { w: 160, h: 600 },
  leaderboard: { w: 728, h: 90 },
};

export function AdSlot({ slotId, format = "rectangle", placement = "top", className = "" }: AdSlotProps) {
  const dims = DIMENSIONS[format];

  return (
    <aside
      id={`ad-slot-${slotId}`}
      className={`flex items-center justify-center bg-steam-panel/50 border border-steam-border rounded min-w-0 ${className}`}
      style={{ minHeight: dims.h, minWidth: format === "skyscraper" ? dims.w : "100%" }}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-ad-placement={placement}
      aria-label="Advertisement"
    >
      <div
        className="w-full flex items-center justify-center"
        style={{
          width: format === "skyscraper" ? dims.w : "100%",
          maxWidth: dims.w,
          height: dims.h,
        }}
      >
        {/* Coinzilla/AdSense injects here via data-ad-slot; placeholder for layout stability */}
        <div className="text-steam-text-muted/30 text-xs font-mono">
          {format === "skyscraper" ? "160×600" : `${dims.w}×${dims.h}`}
        </div>
      </div>
    </aside>
  );
}
