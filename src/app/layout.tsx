import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TVDex — The Smartest Way to Explore TV Channels",
  description:
    "Search by number or name, filter by language and genre, and stay up to date with the latest TV channel lineups across Indian DTH and cable platforms.",
  keywords: [
    "TV channels",
    "Jio",
    "STB",
    "channel list",
    "DTH",
    "set-top box",
    "India",
    "channel guide",
  ],
  openGraph: {
    title: "TVDex — TV Channel Database",
    description:
      "Search, filter, and explore 800+ TV channels across 12 languages.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
