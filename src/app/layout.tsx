import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <CustomCursor />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Animated Aurora Background */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none no-print">
            <div className="absolute -top-[5%] -left-[5%] w-[30vw] h-[30vw] rounded-full bg-[var(--aurora-1)] mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-aurora-1" />
            <div className="absolute top-[10%] -right-[5%] w-[25vw] h-[25vw] rounded-full bg-[var(--aurora-2)] mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-aurora-2" />
            <div className="absolute -bottom-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[var(--aurora-3)] mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-aurora-3" />
            
            {/* Additional orbs for large screens */}
            <div className="hidden xl:block absolute bottom-[5%] -right-[5%] w-[25vw] h-[25vw] rounded-full bg-[var(--aurora-1)] mix-blend-multiply dark:mix-blend-screen filter blur-[90px] opacity-50 animate-aurora-4" />
            <div className="hidden 2xl:block absolute top-[25%] left-[35%] w-[20vw] h-[20vw] rounded-full bg-[var(--aurora-2)] mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 animate-aurora-5" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
