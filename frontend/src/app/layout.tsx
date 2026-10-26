import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { I18nProvider } from "@/i18n/provider";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OASFuse - OpenAPI breaking change detector",
    template: "%s | OASFuse",
  },
  description:
    "Compare OpenAPI contracts and catch breaking changes before they ship.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className="dark">
      <body className={`${inter.variable} ${mono.variable}`}>
        <I18nProvider>
          <LocalizedShell>{children}</LocalizedShell>
        </I18nProvider>
      </body>
    </html>
  );
}

function LocalizedShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
