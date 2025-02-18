"use client";

import { useEffect } from 'react';
import { formatRuntime } from '@/utils/formatRuntime';

interface TabAnimationProps {
  runtime: number;
  isRunning: boolean;
}

export function TabAnimation({ runtime, isRunning }: TabAnimationProps) {
  useEffect(() => {
    const updateTitle = () => {
      const baseTitle = 'ZERO_QUEST';
      if (isRunning) {
        const formattedRuntime = formatRuntime(runtime);
        document.title = `[${formattedRuntime}] ${baseTitle}`;
      } else {
        document.title = baseTitle;
      }
    };

    updateTitle();

    return () => {
      document.title = 'ZERO_QUEST';
    };
  }, [runtime, isRunning]);

  return null;
} 