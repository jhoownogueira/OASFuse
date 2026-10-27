# OASFuse

OASFuse is a deterministic, stateless OpenAPI 3 comparison engine for release gates and human review. It compares a baseline contract with a candidate contract, classifies compatibility findings, and provides the same rule engine through a web workspace, HTTP API, and offline CLI.

This is a feature-complete, proprietary portfolio project. The source is available for evaluation only; no reuse or redistribution license is granted.

## Why OASFuse

- No database, uploads, external `$ref` fetching, analytics, or telemetry.
- Deterministic output designed for reproducible CI checks.
- Secure JSON/YAML parsing with strict size, depth, alias, node, and reference limits.
- Breaking, review, and informational severities with category filters.
- Dark developer-focused interface based on the supplied design references.
- Markdown, JSON, and text output for reviews and automation.
- Interface localization for Brazilian Portuguese, English, and Spanish.

## Repository layout

```text
backend/    Java 21 core, Quarkus API, and shaded CLI
frontend/   Next.js web application and same-origin API bridge
examples/   Safe sample OpenAPI contracts
infra/      Development and hardened production Compose files
scripts/    Digest-pinned deploy and rollback helpers
```

## Quick start

Requirements: Node.js 24, npm, Java 21, Maven 3.9+, and optionally Docker Compose.

```bash
cd backend
mvn verify

cd ../frontend
npm ci
npm run dev
```

Run the API separately with `cd backend && mvn -pl api -am quarkus:dev`. The web app uses `http://localhost:8080` by default, or `INTERNAL_API_URL` when set.

With containers:

```bash
cp .env.example .env
docker compose --env-file .env -f infra/compose.prod.yml up -d --build --remove-orphans
```

Open `http://localhost:3200`, or the port selected through `FRONTEND_PORT`. `FRONTEND_BIND_ADDRESS` defaults to `0.0.0.0` so a containerized reverse proxy can reach the frontend through the host. The production API remains private on the Compose network.

## CLI

```bash
cd backend
mvn -pl cli -am package
java -jar cli/target/oasfuse-cli.jar compare \
  --baseline ../examples/basic/baseline.yaml \
  --candidate ../examples/basic/candidate.yaml \
  --format markdown \
  --fail-on breaking
```

Exit code `0` means the selected policy passed, `1` means findings crossed the `--fail-on` threshold, and `2` means the input or invocation was invalid.

## API

`POST /v1/comparisons` accepts baseline and candidate documents as strings plus comparison options. `GET /v1/rules` describes the supported rule set. The Quarkus health endpoints are available under `/q/health`.

Input is limited to 2 MiB per specification. OASFuse rejects external and relative references; only local fragment references such as `#/components/schemas/Pet` are resolved.

## Quality checks

```bash
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build

cd ../backend
mvn -Pformat spotless:check
mvn verify
```

See [SECURITY.md](SECURITY.md) for the private vulnerability reporting policy.

## Copyright

Copyright (c) 2026 Jhonata Nogueira. All rights reserved.
