import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow-condensed/900.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

import { ToastProvider, ToastViewport } from "@/components/ui/Toast";
import { CommerceProvider } from "@/providers/CommerceProvider";

const title = "Coringão Loko | Roupas com identidade old school";
const description =
  "Roupas e acessórios com identidade corinthiana e estética old school, criados de corinthiano para corinthiano.";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(configuredUrl ?? "http://localhost:3000"),
  title,
  description,
  applicationName: "Coringão Loko",
  icons: { icon: "/brand/icon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/brand/og-placeholder.svg", width: 1200, height: 630, alt: "Coringão Loko" }],
  },
  ...(configuredUrl
    ? {
        alternates: { canonical: configuredUrl },
      }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#080808" },
  ],
};

const themeScript = `
  (() => {
    try {
      const key = "coringao-loko-theme";
      const stored = localStorage.getItem(key);
      const resolved = stored === "light" || stored === "dark"
        ? stored
        : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#conteudo-principal">
          Pular para o conteúdo
        </a>
        <ToastProvider>
          <CommerceProvider>{children}</CommerceProvider>
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
