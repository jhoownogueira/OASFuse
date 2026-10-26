import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { ComparisonResults } from "./comparison-results";
import type { ComparisonReport } from "./types";
import { I18nProvider } from "@/i18n/provider";

const report: ComparisonReport = {
  status: "completed",
  summary: {
    countsBySeverity: { breaking: 1, "non-breaking": 1, review: 0 },
    countsByCategory: { compatibility: 2, documentation: 0 },
    total: 2,
    shouldFail: true,
  },
  findings: [
    {
      id: "a",
      ruleId: "operation.removed",
      severity: "breaking",
      category: "compatibility",
      path: "/users",
      method: "GET",
      location: "#/paths/~1users/get",
      title: "Operation removed",
      message: "GET /users was removed.",
      rationale: "Existing clients may still call it.",
      before: "present",
      after: "absent",
    },
    {
      id: "b",
      ruleId: "operation.added",
      severity: "non-breaking",
      category: "compatibility",
      path: "/health",
      method: "GET",
      location: "#/paths/~1health/get",
      title: "Operation added",
      message: "GET /health was added.",
      rationale: "Existing calls are unaffected.",
      before: "absent",
      after: "present",
    },
  ],
  warnings: [],
  metadata: {
    engineVersion: "0.1.0",
    baselineOpenApiVersion: "3.0.3",
    candidateOpenApiVersion: "3.0.3",
  },
};

it("filters findings using the real report fields", async () => {
  const user = userEvent.setup();
  render(
    <I18nProvider>
      <ComparisonResults report={report} onNew={() => undefined} />
    </I18nProvider>,
  );
  expect(screen.getByText("Operation removed")).toBeInTheDocument();
  await user.type(screen.getByPlaceholderText(/Search findings/), "health");
  expect(screen.queryByText("Operation removed")).not.toBeInTheDocument();
  expect(screen.getByText("Operation added")).toBeInTheDocument();
});
