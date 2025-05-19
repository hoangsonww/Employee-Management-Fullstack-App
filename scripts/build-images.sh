#!/usr/bin/env bash
set -euo pipefail
# Build both Docker images
echo "Building backend image..."
docker build -t employee-management-app-backend:latest ../backend
echo "Building frontend image..."
docker build -t employee-management-app-frontend:latest ../frontend
