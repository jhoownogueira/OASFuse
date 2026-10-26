#!/usr/bin/env sh
set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <previous-web-image@sha256:digest> <previous-api-image@sha256:digest>" >&2
  exit 64
fi

exec "$(dirname "$0")/deploy.sh" "$1" "$2"
