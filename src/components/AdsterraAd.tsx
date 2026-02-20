"use client";

import Script from "next/script";

const ADSTERRA_SCRIPT_URL =
  "https://pl28750098.effectivegatecpm.com/550d2462f2b3553d3564719f363d5100/invoke.js";
const ADSTERRA_CONTAINER_ID = "container-550d2462f2b3553d3564719f363d5100";

interface AdsterraAdProps {
  className?: string;
}

export function AdsterraAd({ className = "" }: AdsterraAdProps) {
  return (
    <>
      <Script
        src={ADSTERRA_SCRIPT_URL}
        strategy="afterInteractive"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ "data-cfasync": "false" } as any)}
      />
      <div
        id={ADSTERRA_CONTAINER_ID}
        className={className}
        aria-label="Advertisement"
      />
    </>
  );
}
