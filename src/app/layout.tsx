import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSearchIndex } from "@/lib/hinos";
import { Header } from "@/components/Header";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Harpa Cristã Digital",
    template: "%s · Harpa Cristã Digital",
  },
  description:
    "Os 640 hinos da Harpa Cristã com busca, favoritos e modo offline. PWA instalável.",
  applicationName: "Harpa Cristã Digital",
  authors: [{ name: "Silas" }],
  keywords: [
    "harpa cristã",
    "hinos",
    "assembleia de deus",
    "hinário",
    "pwa",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Harpa Cristã",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "Harpa Cristã Digital",
    description:
      "Os 640 hinos da Harpa Cristã com busca, favoritos e modo offline.",
    type: "website",
    locale: "pt_BR",
    siteName: "Harpa Cristã Digital",
  },
  twitter: {
    card: "summary",
    title: "Harpa Cristã Digital",
    description:
      "Os 640 hinos da Harpa Cristã com busca, favoritos e modo offline.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Carrega índice leve (numero + titulo + coro) pra busca no header
  const searchIndex = getSearchIndex();

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header searchIndex={searchIndex} />
        <div className="flex-1">{children}</div>
        <ServiceWorkerRegistration />
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
