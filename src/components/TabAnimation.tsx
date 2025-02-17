import { useEffect } from 'react';

interface TabAnimationProps {
  runtime: number;
  isRunning: boolean;
}

export function TabAnimation({ runtime, isRunning }: TabAnimationProps) {
  useEffect(() => {
    const formatRuntime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const updateTitle = () => {
      if (document.hidden && isRunning) {
        document.title = `[${formatRuntime(runtime)}] Zero Quest`;
      } else {
        document.title = 'Zero Quest';
      }
    };

    updateTitle();
    document.addEventListener('visibilitychange', updateTitle);

    return () => {
      document.removeEventListener('visibilitychange', updateTitle);
      document.title = 'Zero Quest';
    };
  }, [runtime, isRunning]);

  return null;
} 