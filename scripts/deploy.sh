#!/usr/bin/env sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <web-image@sha256:digest> <api-image@sha256:digest>" >&2
  exit 64
fi

case "$1:$2" in
  *@sha256:*:@sha256:*) ;;
  *)
    echo "both images must be pinned by sha256 digest" >&2
    exit 64
    ;;
esac

export WEB_IMAGE="$1"
export API_IMAGE="$2"
docker compose -f infra/compose.prod.yml pull
docker compose -f infra/compose.prod.yml up -d --remove-orphans
docker compose -f infra/compose.prod.yml ps
