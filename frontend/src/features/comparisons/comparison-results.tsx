"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Download, Search } from "lucide-react";
import type { ComparisonReport, Finding, Severity } from "./types";

const severityName: Record<Severity, string> = {
  breaking: "Breaking",
  "non-breaking": "Non-breaking",
  review: "Needs review",
};
const severityClass: Record<Severity, string> = {
  breaking: "badge-breaking",
  "non-breaking": "badge-safe",
  review: "badge-review",
};

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function markdown(report: ComparisonReport) {
  return [
    `# OASFuse comparison report`,
    ``,
    `Total findings: ${report.summary.total}`,
    ``,
    ...report.findings.flatMap((f) => [
      `## ${f.title}`,
      `- Severity: ${f.severity}`,
      `- Rule: ${f.ruleId}`,
      `- Location: ${f.location}`,
      ``,
      f.message,
      ``,
      f.rationale,
      ``,
    ]),
  ].join("\n");
}

export function ComparisonResults({
  report,
  onNew,
}: {
  report: ComparisonReport;
  onNew(): void;
}) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [open, setOpen] = useState<string | undefined>(report.findings[0]?.id);
  const filtered = useMemo(
    () =>
      report.findings.filter(
        (f) =>
          (severity === "all" || f.severity === severity) &&
          `${f.title} ${f.path} ${f.ruleId}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [report, query, severity],
  );
  return (
    <section className="results" aria-live="polite">
      <div className="results-title">
        <div>
          <span className="mono back" onClick={onNew}>
            ← Back to workspace
          </span>
          <h1>Comparison results</h1>
          <p>
            Users API &nbsp; <span className="mono">1.0.0 → 1.1.0</span> &nbsp;{" "}
            <span className="complete">COMPLETE</span>
          </p>
        </div>
        <div className="results-actions">
          <button
            className="button"
            onClick={() =>
              download(
                JSON.stringify(report, null, 2),
                "oasfuse-report.json",
                "application/json",
              )
            }
          >
            <Download size={15} />
            JSON
          </button>
          <button
            className="button"
            onClick={() =>
              download(markdown(report), "oasfuse-report.md", "text/markdown")
            }
          >
            <Download size={15} />
            Markdown
          </button>
          <button className="button" onClick={onNew}>
            New comparison
          </button>
        </div>
      </div>
      <div className="summary-grid">
        {(["breaking", "non-breaking", "review"] as Severity[]).map((s) => (
          <article className={`summary-card ${s}`} key={s}>
            <span>{severityName[s]}</span>
            <strong>{report.summary.countsBySeverity[s]}</strong>
            <p>
              {s === "breaking"
                ? "Existing consumers may be affected"
                : s === "non-breaking"
                  ? "Additive changes to your contract"
                  : "Impact depends on your workflow"}
            </p>
          </article>
        ))}
      </div>
      <div className="filter-row">
        <label>
          <Search size={17} />
          <span className="sr-only">Search findings</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search findings or schema paths…"
          />
        </label>
        <select
          aria-label="Filter by severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as "all" | Severity)}
        >
          <option value="all">All severities</option>
          <option value="breaking">Breaking</option>
          <option value="non-breaking">Non-breaking</option>
          <option value="review">Needs review</option>
        </select>
        <span>
          Showing {filtered.length} of {report.findings.length} changes
        </span>
      </div>
      <div className="finding-list">
        {filtered.length === 0 ? (
          <div className="empty">
            <h2>No findings match your filters.</h2>
            <p>Try another schema path or clear your filters.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setSeverity("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((f) => (
            <FindingRow
              key={f.id}
              finding={f}
              expanded={open === f.id}
              toggle={() => setOpen(open === f.id ? undefined : f.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function FindingRow({
  finding,
  expanded,
  toggle,
}: {
  finding: Finding;
  expanded: boolean;
  toggle(): void;
}) {
  return (
    <article className="finding">
      <button
        className="finding-head"
        onClick={toggle}
        aria-expanded={expanded}
      >
        {expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
        <span>
          <strong>{finding.title}</strong>
          <span className={`badge ${severityClass[finding.severity]}`}>
            {severityName[finding.severity]}
          </span>
          <small>
            <span className="badge badge-safe">
              {finding.method ?? "SCHEMA"}
            </span>{" "}
            {finding.path}
          </small>
        </span>
        <code>{finding.ruleId}</code>
      </button>
      {expanded && (
        <div className="finding-body">
          <p>{finding.message}</p>
          <div className="finding-meta">{finding.location}</div>
          <div className="finding-diff">
            <pre className="code-remove">
              BASELINE{"\n"}
              {finding.before ?? "present"}
            </pre>
            <pre className="code-add">
              CANDIDATE{"\n"}
              {finding.after ?? "absent"}
            </pre>
          </div>
          <div className="rationale">💡 {finding.rationale}</div>
        </div>
      )}
    </article>
  );
}
