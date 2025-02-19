import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// 📘 ShadCN UI library - theme-provider => uses next-themes under the hood
import { ThemeProvider } from "@/components/theme-provider";
// 📘 Simple background effect
import { DotPattern } from "@/components/ui/dot-pattern";
// Global header
import Header from "@/components/header";
// 📘 Toaster for notifications
import { Toaster } from "@/components/ui/sonner";
// 📘 Global state & Data fetching
import { ReactQueryClientProvider } from "@/context/store";
// 📘 Fancy loading-ux for page transitions
import NextTopLoader from "nextjs-toploader";
// 📘 Type-safe search params state manager for React frameworks. Like useState, but stored in the URL query string.
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Footer from "@/components/footer";
// ⭐ using local font (custom farsi font - not available in fonts.google)
const myFont = localFont({
  src: "./fonts/local_font.woff2",
  display: "swap",
});
// Also numbers in Farsi (Font)
const font_numbers = localFont({
  src: "./fonts/numbers.ttf",
  variable: "--font-numbers",
});
// ⭐ Static Metadata - We have an example of Dynamic Metadata in the router as well
export const metadata: Metadata = {
  title: {
    default: "Harchi",
    // ✅ using %s for child component title => eg. Harchi - Products
    template: "%s - Harchi",
  },
  description: "We have harchi you want!",
  icons: {
    icon: "/favicon.ico",
  },
  // ❗ openGraph will give errors in localhost usage
  // ⭐ open-graph-image will automatically be added to the metadata in parent - (child could have their own images) - no need to use openGraph key here
  // ⭐ for social medias eg. twitter, linkedin, etc.
  twitter: {
    card: "summary_large_image",
  },
  keywords: ["harchi", "harchi store", "harchi shop", "harchi online store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${myFont.className} ${font_numbers.variable} antialiased flex justify-between items-center flex-col gap-3 size-full `}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <DotPattern className='top-0 fixed opacity-30 w-full h-screen' />
          <NextTopLoader color='red' showSpinner={false} />
          <ReactQueryClientProvider>
            <Header />
            <NuqsAdapter>{children}</NuqsAdapter>
            <Footer />
            <Toaster />
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
