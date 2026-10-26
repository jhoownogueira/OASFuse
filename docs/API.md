# HTTP API

## `POST /v1/comparisons`

```json
{
  "baseline": { "name": "baseline.yaml", "content": "openapi: 3.0.3\n..." },
  "candidate": { "name": "candidate.yaml", "content": "openapi: 3.0.3\n..." },
  "options": { "failOn": "breaking", "categories": [] }
}
```

Returns a deterministic comparison report. Invalid specifications return a safe `422` response; overload returns `429`; oversized HTTP requests return `413`.

## `GET /v1/rules`

Returns supported rule identifiers, severities, and categories.

Health endpoints are exposed at `/q/health/live` and `/q/health/ready`. The browser should use the Next.js `/api/v1/comparisons` same-origin bridge.
