import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getNav } from '@/lib/content';
import { AppShell } from '@/components/layout/AppShell';
import { THEME_SCRIPT } from '@/components/layout/Toggles';

export const metadata: Metadata = {
  title: { default: 'DSA Samjho — Hinglish mein DSA, animation ke saath', template: '%s · DSA Samjho' },
  description: 'Data Structures & Algorithms simple Hinglish mein, step-by-step animations aur Kotlin/Java code ke saath. Interview ki taiyari.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <AppShell nav={getNav()}>{children}</AppShell>
      </body>
    </html>
  );
}
