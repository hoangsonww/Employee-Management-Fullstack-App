#!/usr/bin/env bash
set -euo pipefail
# Run frontend tests
cd "$(dirname "$0")/../frontend"
echo "Running frontend tests..."
npm test
