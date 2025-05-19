#!/usr/bin/env bash
set -euo pipefail
# Navigate to backend and run Spring Boot
cd "$(dirname "$0")/../backend"
echo "Starting backend server on http://localhost:8080"
mvn spring-boot:run
