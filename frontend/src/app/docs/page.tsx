"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export default function DocsPage() {
  const { messages } = useI18n();
  const t = messages.docs;
  return (
    <main id="main-content" className="docs-layout">
      <aside className="docs-sidebar">
        <input aria-label={t.search} placeholder={t.searchPlaceholder} />
        {t.groups.map((group) => (
          <nav className="docs-nav-group" key={group.title}>
            <span>{group.title}</span>
            {group.items.map((item) => (
              <a
                className={
                  group === t.groups[0] && item === group.items[1]
                    ? "active"
                    : ""
                }
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        ))}
      </aside>
      <article className="docs-content">
        <span className="section-label">{t.label}</span>
        <h1>{t.title}</h1>
        <p className="docs-lead">{t.lead}</p>
        <div className="badges">
          <span className="tag">OpenAPI 3.0 / tested 3.1 subset</span>
          <span className="tag">{t.yamlJson}</span>
        </div>
        <section id="your-first-comparison">
          <h2>{t.firstTitle}</h2>
          <p>{t.firstCopy}</p>
          <Link className="button button-primary" href="/compare">
            {t.openWorkspace}
          </Link>
        </section>
        <section id="compatibility-rules">
          <h2>{t.compatibilityTitle}</h2>
          <p>{t.compatibilityCopy}</p>
          <table className="rules-table">
            <thead>
              <tr>
                <th>{t.change}</th>
                <th>{t.classification}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t.operationRemoved}</td>
                <td>
                  <span className="badge badge-breaking">
                    {messages.results.severities.breaking}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{t.optionalAdded}</td>
                <td>
                  <span className="badge badge-safe">
                    {messages.results.severities.nonBreaking}
                  </span>
                </td>
              </tr>
              <tr>
                <td>{t.enumAdded}</td>
                <td>
                  <span className="badge badge-review">
                    {messages.results.severities.review}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="cli-reference">
          <h2>{t.cliTitle}</h2>
          <p>{t.cliCopy}</p>
          <div className="code-block">
            <header>terminal</header>
            <pre>{`java -jar oasfuse-cli.jar compare \\\n  --baseline users-v1.yaml \\\n  --candidate users-v1.1.yaml \\\n  --format markdown --output report.md \\\n  --fail-on breaking`}</pre>
          </div>
          <p>{t.exitCodes}</p>
        </section>
        <section id="github-actions">
          <h2>{t.actionsTitle}</h2>
          <p>{t.actionsCopy}</p>
          <div className="code-block">
            <header>.github/workflows/api-compatibility.yml</header>
            <pre>{`permissions:\n  contents: read\njobs:\n  compare:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: java -jar oasfuse-cli.jar compare ...`}</pre>
          </div>
        </section>
        <section id="security">
          <h2>{t.securityTitle}</h2>
          <p>{t.securityCopy}</p>
          <p>{t.auditCopy}</p>
        </section>
      </article>
      <aside className="docs-toc">
        <span>{t.onThisPage}</span>
        <a href="#your-first-comparison">{t.toc[0]}</a>
        <a href="#compatibility-rules">{t.toc[1]}</a>
        <a href="#cli-reference">{t.toc[2]}</a>
        <a href="#github-actions">{t.toc[3]}</a>
        <a href="#security">{t.toc[4]}</a>
      </aside>
    </main>
  );
}
