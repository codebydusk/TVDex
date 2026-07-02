import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jio STB Channel List & Guide — TVDex",
  description:
    "Complete and updated Jio STB (Set-Top Box) channel list and guide. Search by number or name, find channel PDFs, and filter by language and genre for JioFiber and JioAirFiber TV channels.",
  keywords: [
    "Jio STB channel list",
    "Jio guide",
    "Jio channel pdf",
    "Jio set-top box channels",
    "JioFiber STB channels",
    "JioAirFiber STB channels",
    "Jio TV channels list",
    "Jio DTH channel numbers",
    "Jio setup box channel guide",
  ],
  authors: [{ name: "TVDex Contributors" }],
  creator: "TVDex",
  publisher: "TVDex",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "📺 TVDex — Jio STB Channel Guide",
    description:
      "Search 800+ channels across 12 languages. Get the complete and updated Jio STB & JioFiber channel list.",
    url: "/",
    siteName: "TVDex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "📺 TVDex — Jio STB Channel Guide",
    description:
      "Search 800+ channels across 12 languages. Get the complete and updated Jio STB & JioFiber channel list.",
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
