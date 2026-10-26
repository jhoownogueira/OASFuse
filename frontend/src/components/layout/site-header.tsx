import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          <Logo />
          <span className="open-source">OPEN SOURCE</span>
        </div>
        <nav aria-label="Primary navigation">
          <Link href="/compare">Compare</Link>
          <Link href="/docs">Docs</Link>
          <a
            href="https://github.com/jhoownogueira/OASFuse"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> GitHub <ExternalLink size={12} />
          </a>
        </nav>
      </div>
    </header>
  );
}
