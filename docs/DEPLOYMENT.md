# Deployment

Build immutable web and API images, publish them to a private or authenticated registry, and deploy by digest:

```sh
./scripts/deploy.sh \
  ghcr.io/example/oasfuse-web@sha256:... \
  ghcr.io/example/oasfuse-api@sha256:...
```

Copy `infra/nginx/oasfuse.conf`, replace the example hostname, configure TLS, and keep port 3200 loopback-only. The production Compose file exposes no API host port. Rollback accepts the prior known-good digests and uses the same idempotent deployment path.
