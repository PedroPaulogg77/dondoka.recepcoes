import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dondoka Recepções — Celebre o essencial",
  description:
    "Espaço premium para eventos sociais e corporativos em Belo Horizonte. Capacidade para 70 pessoas, ambiente climatizado e decoração personalizada.",
  metadataBase: new URL(
    (() => {
      const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return raw.startsWith("http") ? raw : `https://${raw}`;
    })()
  ),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7F7957",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
