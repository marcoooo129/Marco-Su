import type { Metadata, Viewport } from "next";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Marco Su — Independent Product Maker",
  description:
    "Marco Su is an independent product maker in Florence, building AI-assisted language tools, student products and creative web experiments.",
  applicationName: "Marco Su Portfolio",
  authors: [{ name: "Marco Su" }],
  creator: "Marco Su",
  category: "portfolio",
  openGraph: {
    type: "website",
    title: "Marco Su — Independent Product Maker",
    description:
      "From logistics and communication to AI-native products—turning curiosity into things people can open and use.",
    siteName: "Marco Su",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Su — Independent Product Maker",
    description:
      "From logistics and communication to AI-native products.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0C0F",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
