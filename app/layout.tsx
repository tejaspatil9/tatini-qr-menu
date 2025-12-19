import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import type { ReactNode } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Tatini",
  description: "Tatini – Contemporary dining experience",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} bg-[var(--tatini-bg)] text-[var(--tatini-text)]`}
      >
        {children}
      </body>
    </html>
  );
}
