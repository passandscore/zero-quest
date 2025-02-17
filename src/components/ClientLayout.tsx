"use client";

import { useEffect } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
  geistSans: string;
  geistMono: string;
  spaceGrotesk: string;
}

export function ClientLayout({ children, geistSans, geistMono, spaceGrotesk }: ClientLayoutProps) {
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  return (
    <body
      className={`${geistSans} ${geistMono} ${spaceGrotesk} antialiased`}
      suppressHydrationWarning
    >
      {children}
    </body>
  );
} 