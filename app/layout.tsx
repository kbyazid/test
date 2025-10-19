import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BudgetTrack - Suivi de Budget",
  description: "Application de gestion et suivi de budget personnel",
  icons: {
    icon: ['/favicon.ico', '/favicon.svg'],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="fr">
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
