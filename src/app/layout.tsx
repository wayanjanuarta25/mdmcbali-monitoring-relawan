import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MDMC Volunteer Management System",
    template: "%s | MDMC Volunteer Management System",
  },
  description:
    "Sistem informasi pengelolaan relawan kesiapsiagaan bencana MDMC.",
  icons: {
    icon: "/logo-mdmc.png",
    shortcut: "/logo-mdmc.png",
    apple: "/logo-mdmc.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
