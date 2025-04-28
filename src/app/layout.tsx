import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FrameInit } from "@/components/FrameInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Two Truths and a Lie",
  description:
    "A fun mini-app for Farcaster users to play Two Truths and a Lie",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl:
        "https://placehold.co/1200x800/FFB6C1/000000?text=Two+Truths+and+a+Lie",
      button: {
        title: "Play Now!",
        action: {
          type: "launch_frame",
          name: "two-truths-and-a-lie",
          url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          splashImageUrl:
            "https://placehold.co/1200x800/FFB6C1/000000?text=Loading...",
          splashBackgroundColor: "#FFB6C1",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FrameInit />
      </body>
    </html>
  );
}
