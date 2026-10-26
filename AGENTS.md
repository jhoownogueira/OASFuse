# OASFuse contributor instructions

- Read `instrucoes.md` before changing the project.
- Keep public UI, code, comments, and documentation in English.
- Preserve the stateless architecture: Next.js BFF, Quarkus API, shared Java core, and CLI.
- Never fetch external OpenAPI references or persist submitted specifications.
- Keep browser-to-server calls same-origin through `/api/v1/comparisons`.
- Validate changes with the relevant lint, typecheck, tests, and build.
- Keep `docs/ROADMAP.md` and `docs/PROGRESS.md` current, but do not commit or push `docs/` until the owner authorizes it.
- Use Conventional Commits. Stage only files relevant to the milestone.
- Never commit credentials, deploy keys, environment files, or user contracts.
- Do not claim deployment, coverage, security guarantees, or integrations that were not verified.

