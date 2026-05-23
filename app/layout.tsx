import type { Metadata } from 'next';
import { Newsreader, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

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
  title: 'Sesonki.AI — Anti-Food Waste Planner',
  description: 'AI-powered food ops for restaurants. Three agents plan your day: order right, buy cheapest, rescue every gram of surplus.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${ibmPlexMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
