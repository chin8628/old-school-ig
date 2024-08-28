import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Old School IG",
  description: "Old School IG",
};

export default function RootLayout({
  children,
  postModal,
}: Readonly<{
  children: React.ReactNode;
  postModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={inter.className}>
        <Providers>
          {children}
          {postModal}
        </Providers>
      </body>
    </html>
  );
}
