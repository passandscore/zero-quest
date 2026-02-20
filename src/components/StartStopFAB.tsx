"use client";

interface StartStopFABProps {
  isRunning: boolean;
  hasWon: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function StartStopFAB({ isRunning, hasWon, onStart, onStop }: StartStopFABProps) {
  const handleClick = () => {
    if (hasWon) return;
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="md:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <button
        onClick={handleClick}
        disabled={hasWon}
        aria-label={isRunning ? "Stop generating" : "Start generating"}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          text-[11px] font-medium tracking-widest uppercase
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-1 focus:ring-steam/30
          disabled:opacity-40 disabled:cursor-not-allowed
          ${isRunning
            ? "bg-steam/10 text-steam border border-steam/30"
            : "bg-steam-bg text-steam-text-muted border border-steam-border hover:text-steam hover:border-steam/40"
          }
        `}
      >
        {isRunning ? "STOP" : "GO"}
      </button>
    </div>
  );
}
