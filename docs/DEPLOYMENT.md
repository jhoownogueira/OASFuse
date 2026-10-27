# Deployment

## Single-command VPS deployment

Create the production environment file and choose the address and port used by the reverse proxy:

```sh
cp .env.example .env
```

The defaults are `FRONTEND_BIND_ADDRESS=0.0.0.0` and `FRONTEND_PORT=3200`. Build and start both services with one command:

```sh
docker compose --env-file .env -f infra/compose.prod.yml up -d --build --remove-orphans
```

The web service binds to `${FRONTEND_BIND_ADDRESS}:${FRONTEND_PORT}`. The API remains private on the Compose network, and the Next.js BFF reaches it through `http://api:8080`.

For Nginx Proxy Manager running in Docker, configure an HTTP upstream with the host address reachable from the NPM container, such as `172.17.0.1`, and `FRONTEND_PORT`. For NGINX installed directly on the host, use `127.0.0.1` and the same port. Restrict direct access to the frontend port with the host firewall, replace the example hostname in `infra/nginx/oasfuse.conf`, and configure TLS.

## Registry deployment

For immutable releases, build and publish the web and API images to a private or authenticated registry, then deploy by digest:

```sh
./scripts/deploy.sh \
  ghcr.io/example/oasfuse-web@sha256:... \
  ghcr.io/example/oasfuse-api@sha256:...
```

The deployment script does not build images and requires both digest-pinned references. Rollback accepts the prior known-good digests and uses the same idempotent deployment path.
