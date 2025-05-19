#!/usr/bin/env bash
set -euo pipefail
# Run backend tests
cd "$(dirname "$0")/../backend"
echo "Running backend JUnit tests..."
mvn test
