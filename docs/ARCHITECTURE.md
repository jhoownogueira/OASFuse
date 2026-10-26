# Architecture

OASFuse has one deterministic comparison core and three adapters.

```text
Browser -> Next.js same-origin bridge -> Quarkus resource -> core
CLI -----------------------------------------------> core
```

The Java 21 `core` module owns parsing, normalization, rules, stable finding IDs, sorting, and policy evaluation. It performs no network calls and has no persistence dependency. The `api` module adds bounded concurrency and HTTP-safe errors. The `cli` module reads only explicitly supplied local files. The Next.js bridge prevents browsers from addressing the internal API directly in production.

Inputs are parsed into Jackson trees with strict duplicate detection, YAML alias limits, a 2 MiB per-document limit, depth and node budgets, and local-fragment-only reference resolution. Comparison output is sorted so the same inputs and options produce the same report.
