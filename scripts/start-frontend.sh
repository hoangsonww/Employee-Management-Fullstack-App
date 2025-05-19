#!/usr/bin/env bash
set -euo pipefail
# Navigate to frontend and run React dev server
cd "$(dirname "$0")/../frontend"
echo "Starting frontend dev server on http://localhost:3000"
npm start
