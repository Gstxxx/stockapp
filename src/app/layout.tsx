import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle de Estoque",
  description: "Sistema de controle de estoque e vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.className} bg-gray-100 min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
