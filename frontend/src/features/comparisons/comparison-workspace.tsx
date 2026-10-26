"use client";

import { useState } from "react";
import { ArrowRight, FileJson, RefreshCw, ShieldCheck } from "lucide-react";
import { baselineExample, candidateExample } from "./examples";
import { useCompareSpecifications } from "./use-compare-specifications";
import { SpecificationEditor } from "./specification-editor";
import { ComparisonResults } from "./comparison-results";
import { useI18n } from "@/i18n/provider";

export function ComparisonWorkspace() {
  const { messages } = useI18n();
  const t = messages.workspace;
  const [baseline, setBaseline] = useState(baselineExample);
  const [candidate, setCandidate] = useState(candidateExample);
  const [baselineName, setBaselineName] = useState("users-v1.yaml");
  const [candidateName, setCandidateName] = useState("users-v1.1.yaml");
  const [localError, setLocalError] = useState<string | null>(null);
  const { report, error, isLoading, compare, invalidate, clearError } =
    useCompareSpecifications();
  const change = (
    kind: "baseline" | "candidate",
    value: string,
    name?: string,
  ) => {
    invalidate();
    clearError();
    setLocalError(null);
    if (kind === "baseline") {
      setBaseline(value);
      if (name) setBaselineName(name);
    } else {
      setCandidate(value);
      if (name) setCandidateName(name);
    }
  };
  const submit = () => {
    if (!baseline.trim() || !candidate.trim()) return setLocalError(t.missing);
    compare({
      baseline: { fileName: baselineName, content: baseline },
      candidate: { fileName: candidateName, content: candidate },
      options: { failOn: "breaking", ignoreRules: [] },
    });
  };
  if (report)
    return (
      <main id="main-content" className="compare-shell">
        <ComparisonResults report={report} onNew={invalidate} />
      </main>
    );
  return (
    <main id="main-content" className="compare-shell">
      <div className="workspace-heading">
        <div>
          <span className="kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="example-line">
            <span className="tag">{t.example}</span> Users API &nbsp;{" "}
            <span className="mono">1.0.0 → 1.1.0</span>
          </div>
        </div>
        <div className="workspace-actions">
          <button
            className="button"
            onClick={() => {
              change("baseline", baselineExample, "users-v1.yaml");
              change("candidate", candidateExample, "users-v1.1.yaml");
            }}
          >
            <FileJson size={16} /> {t.loadExample}
          </button>
          <button
            className="button"
            onClick={() => {
              const bv = baseline,
                bn = baselineName;
              change("baseline", candidate, candidateName);
              change("candidate", bv, bn);
            }}
          >
            <RefreshCw size={16} /> {t.swap}
          </button>
        </div>
      </div>
      {(error || localError) && (
        <div className="error-banner" role="alert">
          {error || localError}
        </div>
      )}
      <div className="editors-grid">
        <SpecificationEditor
          label={t.baseline}
          fileName={baselineName}
          version="1.0.0"
          value={baseline}
          onChange={(v, n) => change("baseline", v, n)}
          onError={setLocalError}
        />
        <SpecificationEditor
          label={t.candidate}
          fileName={candidateName}
          version="1.1.0"
          value={candidate}
          onChange={(v, n) => change("candidate", v, n)}
          onError={setLocalError}
        />
      </div>
      <div className="compare-footer">
        <span>
          <ShieldCheck size={17} /> {t.privacy}
        </span>
        <button
          className="button button-primary"
          disabled={isLoading}
          onClick={submit}
        >
          {isLoading ? t.comparing : t.compare}
          <ArrowRight size={17} />
        </button>
      </div>
    </main>
  );
}
