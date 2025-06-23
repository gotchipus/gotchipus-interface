import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@providers/providers";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: 'Gotchipus',
    template: '%s | Gotchipus ',
  },
  description: 'An AI-powered dNFT virtual pet platform! ',
  keywords: ['cryptocurrency', 'blockchain', 'Gotchipus', 'gotchipus', 'BNB', 'PancakeSwap', "AIPet", "Pet"],
  authors: [{ name: 'Gotchipus' }],
  creator: 'Gotchipus',
  publisher: 'Gotchipus',
  openGraph: {
    title: 'Gotchipus',
    description: 'An AI-powered dNFT virtual pet platform! ',
    images: "https://images.gotchipus.com/preview.png",
    type: 'website',
    url: 'https://gotchipus.com'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gotchipus',
    creator: '@gotchipus',
    title: 'Gotchipus',
    description: 'An AI-powered dNFT virtual pet platform! ',
    images: "https://images.gotchipus.com/preview.png",
  },
  icons: {
    icon: 'https://images.gotchipus.com/favicon.ico',
    apple: 'https://images.gotchipus.com/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://gotchipus.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-vt323">
        <GoogleAnalytics />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
