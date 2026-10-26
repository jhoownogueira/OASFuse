export type Severity = "breaking" | "non-breaking" | "review";

export interface Finding {
  id: string;
  ruleId: string;
  severity: Severity;
  category: "compatibility" | "documentation";
  path: string;
  method?: string;
  location: string;
  title: string;
  message: string;
  rationale: string;
  before?: string;
  after?: string;
}

export interface ComparisonReport {
  status: "completed";
  summary: {
    countsBySeverity: Record<Severity, number>;
    countsByCategory: Record<"compatibility" | "documentation", number>;
    total: number;
    shouldFail: boolean;
  };
  findings: Finding[];
  warnings: string[];
  metadata: {
    engineVersion: string;
    baselineOpenApiVersion: string;
    candidateOpenApiVersion: string;
  };
}

export interface ComparisonRequest {
  baseline: { fileName: string; content: string };
  candidate: { fileName: string; content: string };
  options: { failOn: "breaking" | "review" | "never"; ignoreRules: string[] };
}

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; reason: string }[];
  requestId?: string;
}
