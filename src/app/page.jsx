"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';

// This disables SSR for the legacy React code, preventing hydration mismatches.
const PortfolioApp = dynamic(() => import('./AppClient'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Inject Tailwind CDN to restore the missing styles from the deleted index.html */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <PortfolioApp />
    </>
  );
}