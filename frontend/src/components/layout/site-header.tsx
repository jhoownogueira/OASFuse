"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { Logo } from "./logo";
import { supportedLocales, type Locale } from "@/i18n/messages";
import { useI18n } from "@/i18n/provider";

export function SiteHeader() {
  const { locale, setLocale, messages } = useI18n();
  const t = messages.common;
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-brand">
            <Logo />
            <span className="project-type">{t.projectType}</span>
          </div>
          <nav aria-label={t.primaryNavigation}>
            <Link href="/compare">{t.compare}</Link>
            <Link href="/docs">{t.docs}</Link>
            <a
              href="https://github.com/jhoownogueira/OASFuse"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} /> GitHub <ExternalLink size={12} />
            </a>
            <label className="language-select">
              <span className="sr-only">{t.language}</span>
              <select
                aria-label={t.language}
                value={locale}
                onChange={(event) => setLocale(event.target.value as Locale)}
              >
                {supportedLocales.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </nav>
        </div>
      </header>
    </>
  );
}
