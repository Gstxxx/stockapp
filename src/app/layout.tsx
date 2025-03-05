import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";

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
      <body className={`${nunito.className} min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900`}>
        <div className="relative min-h-screen">
          {/* Efeitos de fundo */}
          <div className="fixed inset-0 overflow-hidden">
            {/* Gradiente principal */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-sm" />

            {/* Efeito de luz laranja */}
            <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full transform -translate-y-1/2 pointer-events-none" />

            {/* Efeito de luz azul */}
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full transform translate-y-1/2 pointer-events-none" />

            {/* Efeito de ruído */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="relative">
            <main className="p-6">
              <Navbar username="Usuário" />
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
