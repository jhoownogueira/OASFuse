"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Download, Search } from "lucide-react";
import type { ComparisonReport, Finding, Severity } from "./types";
import { useI18n } from "@/i18n/provider";
import type { Messages } from "@/i18n/messages";
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
function markdown(report: ComparisonReport, t: Messages["results"]) {
  return [
    `# ${t.markdownTitle}`,
    ``,
    `${t.totalFindings}: ${report.summary.total}`,
    ``,
    ...report.findings.flatMap((f) => [
      `## ${f.title}`,
      `- ${t.severity}: ${f.severity}`,
      `- ${t.rule}: ${f.ruleId}`,
      `- ${t.location}: ${f.location}`,
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
  const { messages } = useI18n();
  const t = messages.results;
  const severityName: Record<Severity, string> = {
    breaking: t.severities.breaking,
    "non-breaking": t.severities.nonBreaking,
    review: t.severities.review,
  };
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
            {t.back}
          </span>
          <h1>{t.title}</h1>
          <p>
            Users API &nbsp; <span className="mono">1.0.0 → 1.1.0</span> &nbsp;{" "}
            <span className="complete">{t.complete}</span>
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
              download(
                markdown(report, t),
                "oasfuse-report.md",
                "text/markdown",
              )
            }
          >
            <Download size={15} />
            Markdown
          </button>
          <button className="button" onClick={onNew}>
            {t.newComparison}
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
                ? t.severityHelp.breaking
                : s === "non-breaking"
                  ? t.severityHelp.nonBreaking
                  : t.severityHelp.review}
            </p>
          </article>
        ))}
      </div>
      <div className="filter-row">
        <label>
          <Search size={17} />
          <span className="sr-only">{t.search}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </label>
        <select
          aria-label={t.filter}
          value={severity}
          onChange={(e) => setSeverity(e.target.value as "all" | Severity)}
        >
          <option value="all">{t.all}</option>
          <option value="breaking">{t.severities.breaking}</option>
          <option value="non-breaking">{t.severities.nonBreaking}</option>
          <option value="review">{t.severities.review}</option>
        </select>
        <span>
          {t.showing
            .replace("{shown}", String(filtered.length))
            .replace("{total}", String(report.findings.length))}
        </span>
      </div>
      <div className="finding-list">
        {filtered.length === 0 ? (
          <div className="empty">
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyCopy}</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setSeverity("all");
              }}
            >
              {t.clear}
            </button>
          </div>
        ) : (
          filtered.map((f) => (
            <FindingRow
              key={f.id}
              finding={f}
              expanded={open === f.id}
              toggle={() => setOpen(open === f.id ? undefined : f.id)}
              labels={t}
              severityName={severityName}
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
  labels,
  severityName,
}: {
  finding: Finding;
  expanded: boolean;
  toggle(): void;
  labels: Messages["results"];
  severityName: Record<Severity, string>;
}) {
  const translatedTitles: Record<string, string> = {
    "operation.added": labels.findingTitles.operationAdded,
    "operation.id_changed": labels.findingTitles.operationIdChanged,
    "response.property.removed": labels.findingTitles.responsePropertyRemoved,
    "response.type.changed": labels.findingTitles.responseTypeChanged,
  };
  return (
    <article className="finding">
      <button
        className="finding-head"
        onClick={toggle}
        aria-expanded={expanded}
      >
        {expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
        <span>
          <strong>{translatedTitles[finding.ruleId] ?? finding.title}</strong>
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
              {labels.baseline}
              {"\n"}
              {finding.before ?? labels.present}
            </pre>
            <pre className="code-add">
              {labels.candidate}
              {"\n"}
              {finding.after ?? labels.absent}
            </pre>
          </div>
          <div className="rationale">💡 {finding.rationale}</div>
        </div>
      )}
    </article>
  );
}
