import type { Metadata } from "next";
import { Urbanist, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Majen Admin",
    template: "%s | Majen Admin",
  },
  description:
    "Majen Admin is the internal control center for managing designers, products, orders, and marketplace analytics.",
  icons: {
    icon: "/majenIcon.png",
    shortcut: "/majenIcon.png",
    apple: "/majenIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${urbanist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
