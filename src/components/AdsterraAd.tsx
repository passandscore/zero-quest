"use client";

const AD_UNITS = {
  "320x50": {
    key: "4f7091b3813f4d8331fc6d1a14789d26",
    width: 320,
    height: 50,
  },
  "300x250": {
    key: "589e1bd98e8a3d925b96e3ae9b8496a2",
    width: 300,
    height: 250,
  },
  "728x90": {
    key: "b7cc7fc54bd970a3f2d86ee9a41b5061",
    width: 728,
    height: 90,
  },
} as const;

export type AdFormat = keyof typeof AD_UNITS;

interface AdsterraAdProps {
  format: AdFormat;
  className?: string;
}

export function AdsterraAd({ format, className = "" }: AdsterraAdProps) {
  const unit = AD_UNITS[format];
  const adHTML = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;overflow:hidden}</style></head><body><script type="text/javascript">atOptions={'key':'${unit.key}','format':'iframe','height':${unit.height},'width':${unit.width},'params':{}};<\/script><script type="text/javascript" src="https://www.highperformanceformat.com/${unit.key}/invoke.js"><\/script></body></html>`;

  return (
    <div className={`overflow-hidden ${className}`} aria-label="Advertisement">
      <iframe
        srcDoc={adHTML}
        width={unit.width}
        height={unit.height}
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder={0}
        title="Advertisement"
      />
    </div>
  );
}
