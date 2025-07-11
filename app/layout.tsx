import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastExample";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teste Frontend - Login",
  description: "Aplicação de teste com login e cadastro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}