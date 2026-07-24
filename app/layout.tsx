import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site-config";

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
  // Cada página do site define o próprio <title> por extenso, já com a marca
  // e o termo de busca. Este é só o fallback para rotas que não definem nada.
  title: "Dondoka Recepções — Espaço para eventos em BH",
  description: SITE.descricaoCurta,
  /**
   * Base de resolução de toda URL relativa: canonical, OG e sitemap.
   *
   * Fica fixo no domínio oficial de propósito. Se saísse do host da
   * requisição, o site servido em dondokarecepcoes.vercel.app emitiria
   * canonical apontando para si mesmo — e o Google trataria os dois endereços
   * como conteúdo duplicado, dividindo a autoridade entre eles.
   *
   * Em desenvolvimento, NEXT_PUBLIC_APP_URL aponta para o localhost.
   */
  metadataBase: new URL(
    (() => {
      const raw = process.env.NEXT_PUBLIC_APP_URL || SITE.dominio;
      return raw.startsWith("http") ? raw : `https://${raw}`;
    })()
  ),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
  },
  formatDetection: { telephone: true, address: true },
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
