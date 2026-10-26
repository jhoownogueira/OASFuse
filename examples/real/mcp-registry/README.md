# MCP Registry API evolution example

These files are two historical revisions of the official OpenAPI 3.1 contract for the [Model Context Protocol Registry](https://github.com/modelcontextprotocol/registry). They are small enough for OASFuse's 2 MiB input limit and contain only local fragment references.

| Role | Upstream revision | Date | Source |
| --- | --- | --- | --- |
| Baseline | `9357e767c94204e97edb1683824765928bac8926` | 2025-12-12 | [`openapi.yaml`](https://github.com/modelcontextprotocol/registry/blob/9357e767c94204e97edb1683824765928bac8926/docs/reference/api/openapi.yaml) |
| Candidate | `13f90b283ae4303ee7b75081899e944851a385ab` | 2026-10-25 | [`openapi.yaml`](https://github.com/modelcontextprotocol/registry/blob/13f90b283ae4303ee7b75081899e944851a385ab/docs/reference/api/openapi.yaml) |

SHA-256 checksums:

```text
30d07d0fee00d8995ae85fbf019db5bf43438d0eafead8c14962f2eb19f3b3b8  baseline-2025-12-12.yaml
3cbfe1ca9cab45c82c0e094133c89adf07cbd6c4076b07201f5f0e595184a6aa  candidate-2026-10-25.yaml
```

Run the real-world comparison after packaging the CLI:

```bash
cd backend
mvn -pl cli -am package
cd ..

java -jar backend/cli/target/oasfuse-cli.jar compare \
  --baseline examples/real/mcp-registry/baseline-2025-12-12.yaml \
  --candidate examples/real/mcp-registry/candidate-2026-10-25.yaml \
  --format markdown \
  --fail-on never
```

The specifications retain their upstream Apache-2.0 license notices and are included only as reproducible test fixtures.
