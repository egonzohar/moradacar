import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MORADACAR Araraquara | Mobilidade Cooperativa — Chegou a hora de cooperar & progredir",
  description:
    "O aplicativo de mobilidade urbana feito por e para quem vive em Araraquara - SP. Preço justo para passageiros de apps como Uber e 99, e até 94% de repasse para motoristas cooperados na Morada do Sol.",
  keywords: [
    "MORADACAR",
    "Araraquara",
    "Mobilidade Urbana Araraquara",
    "Motorista de Aplicativo Araraquara",
    "Uber Araraquara",
    "Cooperativa de Motoristas Araraquara",
    "Morada do Sol",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#FFD200] selection:text-[#0A0E17]">
        {children}
      </body>
    </html>
  );
}

