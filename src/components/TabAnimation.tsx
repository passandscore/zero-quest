"use client";

import { useEffect } from 'react';

interface TabAnimationProps {
  runtime: number;
  isRunning: boolean;
}

export function TabAnimation({ runtime, isRunning }: TabAnimationProps) {
  useEffect(() => {
    const formatRuntime = (seconds: number) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      let result = '';
      if (days > 0) result += `${days.toString().padStart(2, '0')}:`;
      if (days > 0 || hours > 0) result += `${hours.toString().padStart(2, '0')}:`;
      if (days > 0 || hours > 0 || minutes > 0) result += `${minutes.toString().padStart(2, '0')}:`;
      result += `${secs.toString().padStart(2, '0')}`;
      
      return result;
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