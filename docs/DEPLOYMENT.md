# Deployment

## Single-command VPS deployment

Create the production environment file and choose the loopback port used by the host NGINX:

```sh
cp .env.example .env
```

The default is `WEB_PORT=3200`. Build and start both services with one command:

```sh
docker compose --env-file .env -f infra/compose.prod.yml up -d --build --remove-orphans
```

The web service binds to `127.0.0.1:${WEB_PORT}`. The API remains private on the Compose network, and the Next.js BFF reaches it through `http://api:8080`.

Point the host NGINX to `http://127.0.0.1:${WEB_PORT}`. Copy `infra/nginx/oasfuse.conf`, replace the example hostname and port when needed, and configure TLS.

## Registry deployment

For immutable releases, build and publish the web and API images to a private or authenticated registry, then deploy by digest:

```sh
./scripts/deploy.sh \
  ghcr.io/example/oasfuse-web@sha256:... \
  ghcr.io/example/oasfuse-api@sha256:...
```

The deployment script does not build images and requires both digest-pinned references. Rollback accepts the prior known-good digests and uses the same idempotent deployment path.
