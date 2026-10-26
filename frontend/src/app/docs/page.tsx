import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Documentation" };

const groups = [
  ["GET STARTED", ["Overview", "Quickstart", "Your first comparison"]],
  [
    "CORE CONCEPTS",
    [
      "Compatibility rules",
      "Understanding findings",
      "Supported specifications",
    ],
  ],
  ["AUTOMATION", ["CLI reference", "GitHub Actions", "Export formats"]],
  ["PROJECT", ["Security & privacy", "Contributing"]],
];

export default function DocsPage() {
  return (
    <main id="main-content" className="docs-layout">
      <aside className="docs-sidebar">
        <input
          aria-label="Search documentation"
          placeholder="Search docs…  ⌘ K"
        />
        {groups.map(([title, items]) => (
          <nav className="docs-nav-group" key={title as string}>
            <span>{title}</span>
            {(items as string[]).map((item) => (
              <a
                className={item === "Quickstart" ? "active" : ""}
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
        <span className="section-label">GET STARTED / QUICKSTART</span>
        <h1>A safer API release starts here.</h1>
        <p className="docs-lead">
          Compare two OpenAPI contracts, understand the impact, and bring
          compatibility checks into your development workflow.
        </p>
        <div className="badges">
          <span className="tag">OpenAPI 3.0 / tested 3.1 subset</span>
          <span className="tag">YAML and JSON</span>
        </div>
        <section id="your-first-comparison">
          <h2>01. Run your first comparison</h2>
          <p>
            Open the workspace and load the Users API example, or paste your own
            specifications. Baseline is the contract consumers use today.
            Candidate is the version you plan to release.
          </p>
          <Link className="button button-primary" href="/compare">
            Open comparison workspace →
          </Link>
        </section>
        <section id="compatibility-rules">
          <h2>02. Understand compatibility</h2>
          <p>
            Compatibility is evaluated from the consumer&apos;s perspective. A
            valid specification can still break an existing client. Review both
            the classification and the affected schema location.
          </p>
          <table className="rules-table">
            <thead>
              <tr>
                <th>CHANGE</th>
                <th>CLASSIFICATION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operation removed</td>
                <td>
                  <span className="badge badge-breaking">Breaking</span>
                </td>
              </tr>
              <tr>
                <td>Optional request parameter added</td>
                <td>
                  <span className="badge badge-safe">Non-breaking</span>
                </td>
              </tr>
              <tr>
                <td>Response enum value added</td>
                <td>
                  <span className="badge badge-review">Needs review</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section id="cli-reference">
          <h2>03. Use the CLI</h2>
          <p>
            The Java CLI invokes the same comparison core without sending
            contracts over the network.
          </p>
          <div className="code-block">
            <header>terminal</header>
            <pre>{`java -jar oasfuse-cli.jar compare \\\n  --baseline users-v1.yaml \\\n  --candidate users-v1.1.yaml \\\n  --format markdown --output report.md \\\n  --fail-on breaking`}</pre>
          </div>
          <p>
            Exit code 0 means the chosen threshold was not met, 1 means findings
            met it, and 2 means invalid input or a comparison error.
          </p>
        </section>
        <section id="github-actions">
          <h2>04. Add a pull-request check</h2>
          <p>
            Use the CLI on a GitHub-hosted runner. Keep production secrets and
            self-hosted deployment runners away from untrusted pull-request
            code.
          </p>
          <div className="code-block">
            <header>.github/workflows/api-compatibility.yml</header>
            <pre>{`permissions:\n  contents: read\njobs:\n  compare:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: java -jar oasfuse-cli.jar compare ...`}</pre>
          </div>
        </section>
        <section id="security">
          <h2>Security & privacy by intention</h2>
          <p>
            Comparisons are stateless and inputs are not saved by the
            application. External <code>$ref</code> values are rejected and
            never fetched. Public deployments must enforce body, concurrency,
            and rate limits.
          </p>
          <p>
            This is a design claim backed by the repository implementation, not
            a third-party audit or a guarantee about a host you do not control.
          </p>
        </section>
      </article>
      <aside className="docs-toc">
        <span>ON THIS PAGE</span>
        <a href="#your-first-comparison">First comparison</a>
        <a href="#compatibility-rules">Compatibility rules</a>
        <a href="#cli-reference">CLI usage</a>
        <a href="#github-actions">GitHub Actions</a>
        <a href="#security">Security & privacy</a>
      </aside>
    </main>
  );
}
