import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from 'next/link';
import Intro from "./components/Intro";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vincent Chan's Website",
  description: "Vincent Chan's Portfolio Website",
  icons: {
      icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <Header />
        <main className="flex-grow">
        {children}
        </main>
        <Footer />
      </body>
      
    </html>
  );
}
