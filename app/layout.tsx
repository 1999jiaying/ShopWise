import type { Metadata } from 'next';
import { Inter, Newsreader, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { WasteProvider } from '@/context/WasteContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GATHER — Anti-Food Waste Planner',
  description: 'AI-powered food ops for restaurants. Four agents plan your day: order right, buy cheapest, analyse waste, rescue every gram of surplus.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${ibmPlexMono.variable}`}>
      <body>
        <WasteProvider>{children}</WasteProvider>
      </body>
    </html>
  );
}
