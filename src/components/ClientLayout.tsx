"use client";

import { useEffect } from 'react';
import { Toaster } from 'sonner';

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
      <Toaster
        theme="dark"
        toastOptions={{
          style: { background: '#1a1a1a', border: '1px solid #2d2d2d', color: '#e5e5e5' },
        }}
      />
    </body>
  );
} 