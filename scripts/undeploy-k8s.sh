#!/usr/bin/env bash
set -euo pipefail
# Delete all resources in kubernetes/
echo "Removing Kubernetes deployment..."
kubectl delete -f ../kubernetes
