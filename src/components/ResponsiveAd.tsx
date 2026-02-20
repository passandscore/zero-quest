"use client";

import { AdsterraAd } from "./AdsterraAd";

export function ResponsiveAd() {
  return (
    <div className="flex justify-center shrink-0 w-full min-h-[50px] md:min-h-[90px]">
      <div className="block md:hidden">
        <AdsterraAd format="320x50" className="max-w-[320px] min-h-[50px] max-h-[50px] w-full" />
      </div>
      <div className="hidden md:block">
        <AdsterraAd format="728x90" className="max-w-[728px] min-h-[90px] max-h-[90px] w-full" />
      </div>
    </div>
  );
}
