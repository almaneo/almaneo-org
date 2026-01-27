import type { Metadata } from 'next';
import { Orbitron, Exo_2 } from 'next/font/google';
import './globals.css';
import { Web3AuthProvider } from '@/contexts/Web3AuthProvider';
import I18nProvider from '@/components/I18nProvider';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const exo2 = Exo_2({ 
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AlmaNEO Kindness Game',
  description: 'Spread kindness, reduce AI inequality, and earn ALMAN tokens!',
  keywords: 'kindness game, AI democratization, blockchain game, AlmaNEO, ALMAN, tap game, 정(情)',
  authors: [{ name: 'AlmaNEO Team' }],
  themeColor: '#0A0F1A',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AlmaNEO Kindness" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            height: 100dvh;
            overflow: hidden;
            overscroll-behavior: none;
          }
        `}</style>
      </head>
      <body className={`${orbitron.variable} ${exo2.variable}`}>
        <Web3AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </Web3AuthProvider>
      </body>
    </html>
  );
}
