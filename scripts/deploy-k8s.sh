#!/usr/bin/env bash
set -euo pipefail
# Apply all manifests in kubernetes/
echo "Deploying to Kubernetes..."
kubectl apply -f ../kubernetes
