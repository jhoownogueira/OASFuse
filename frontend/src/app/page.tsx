"use client";

import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Check,
  GitBranch,
  Github,
  ScanSearch,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

export default function HomePage() {
  const { messages } = useI18n();
  const t = messages.home;
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container">
          <div className="intro">
            <span className="tag">{messages.common.projectType}</span>
            <span>{t.intro}</span>
          </div>
          <h1>{t.title}</h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-actions">
            <Button asChild variant="primary">
              <Link href="/compare">
                <ArrowRight size={16} /> {t.start}
              </Link>
            </Button>
            <a
              className="button"
              href="https://github.com/jhoownogueira/OASFuse"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={16} /> {t.github}
            </a>
          </div>
          <p className="hero-note">{t.note}</p>
          <div className="demo-window" aria-label={t.exampleLabel}>
            <div className="demo-toolbar">
              <span>⌘ users-v1.yaml &nbsp;→&nbsp; users-v1.1.yaml</span>
              <span className="complete">{t.complete}</span>
            </div>
            <div className="demo-grid">
              <div className="demo-copy">
                <span className="mono eyebrow">{t.changes}</span>
                <div className="badges">
                  <span className="badge badge-breaking">{t.breaking}</span>
                  <span className="badge badge-safe">{t.safe}</span>
                  <span className="badge badge-review">{t.review}</span>
                </div>
                <h3>
                  <span className="badge badge-safe">GET</span> &nbsp;/users
                </h3>
                <strong>{t.findingTitle}</strong>
                <p>{t.findingText}</p>
                <span className="mono eyebrow">
                  response · 200 · application/json
                </span>
              </div>
              <div className="demo-diff">
                <div className="diff-meta">
                  components / schemas / User / properties / id
                </div>
                <div className="diff-meta">{t.baselineCandidate}</div>
                <div className="code-change code-remove">
                  id:{"\n"} - type: integer
                </div>
                <div className="code-change code-add">
                  id:{"\n"} + type: string
                </div>
              </div>
            </div>
            <div className="demo-toolbar">
              <span>{t.semantic}</span>
              <Link href="/compare">{t.explore}</Link>
            </div>
          </div>
          <div className="tech-line">
            <span>{t.builtFor}</span>
            <span>OpenAPI 3.0 / 3.1</span>
            <span>YAML / JSON</span>
            <span>Browser / CLI / CI</span>
          </div>
        </div>
      </section>

      <section className="marketing-section container">
        <span className="section-label">{t.workflowLabel}</span>
        <h2>{t.workflowTitle}</h2>
        <p className="section-copy">{t.workflowCopy}</p>
        <div className="steps">
          {t.steps.map((step, index) => (
            <article className="step" key={step.title}>
              <span className="step-num">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section container">
        <span className="section-label">{t.contractLabel}</span>
        <h2>{t.contractTitle}</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <ScanSearch size={22} />
            <h3>{t.features[0].title}</h3>
            <p>{t.features[0].description}</p>
          </article>
          <article className="feature-card">
            <GitBranch size={22} />
            <h3>{t.features[1].title}</h3>
            <p>{t.features[1].description}</p>
          </article>
          <article className="feature-card">
            <Terminal size={22} />
            <h3>{t.features[2].title}</h3>
            <p>{t.features[2].description}</p>
          </article>
        </div>
      </section>

      <section className="marketing-section container">
        <div className="privacy-grid">
          <div className="privacy-copy">
            <span className="section-label">{t.privacyLabel}</span>
            <h2>
              {t.privacyTitle.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>
            <p>{t.privacyCopy}</p>
            <Link href="/docs#security">{t.securityLink}</Link>
          </div>
          <div className="privacy-card">
            <div className="privacy-item">
              <Check size={17} />
              <div>
                <strong>{t.privacyItems[0].title}</strong>
                <p>{t.privacyItems[0].description}</p>
              </div>
            </div>
            <div className="privacy-item">
              <Check size={17} />
              <div>
                <strong>{t.privacyItems[1].title}</strong>
                <p>{t.privacyItems[1].description}</p>
              </div>
            </div>
            <div className="privacy-item">
              <ShieldCheck size={17} />
              <div>
                <strong>{t.privacyItems[2].title}</strong>
                <p>{t.privacyItems[2].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <h2>{t.ctaTitle}</h2>
        <p>{t.ctaCopy}</p>
        <Button asChild variant="primary">
          <Link href="/compare">
            <ArrowRight size={16} /> {t.start}
          </Link>
        </Button>
      </section>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo />
          <span>{t.footer}</span>
          <span>
            <Link href="/docs">{t.documentation}</Link> &nbsp;&nbsp;{" "}
            <Braces size={14} style={{ display: "inline" }} />{" "}
            {messages.common.projectType}
          </span>
        </div>
      </footer>
    </main>
  );
}
