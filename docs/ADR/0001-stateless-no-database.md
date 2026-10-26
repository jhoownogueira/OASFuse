# ADR 0001: Stateless comparison without a database

## Status

Accepted.

## Decision

OASFuse compares two contracts entirely in memory. The browser calls a same-origin Next.js route handler, which forwards to a fixed Quarkus service URL. The Quarkus application invokes a pure Java comparison core. The CLI invokes the same core directly.

No database, ORM, repository abstraction, comparison history, or uploaded-file persistence is included.

## Consequences

- Submitted specifications leave process memory after a request.
- Horizontal scaling does not require shared application state.
- A future history feature must make storage, retention, privacy, and deletion explicit before introducing persistence.
