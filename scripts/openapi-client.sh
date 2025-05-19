#!/usr/bin/env bash
set -euo pipefail
# Generate OpenAPI client; default language = javascript
LANG=${1:-javascript}
OUT_DIR=${2:-./client}
echo "Generating OpenAPI client ($LANG) → $OUT_DIR"
openapi-generator-cli generate -i ../openapi.yaml -g "$LANG" -o "$OUT_DIR"
