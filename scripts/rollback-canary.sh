#!/bin/bash

# Rollback Canary Deployment Script
# Usage: ./rollback-canary.sh

set -e

echo "==========================================="
echo "Rollback Canary Deployment"
echo "==========================================="

# Confirm rollback
read -p "Delete canary deployments? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Rollback cancelled"
    exit 0
fi

# Delete canary deployments
echo "Removing canary deployments..."
kubectl delete deployment backend-deployment-canary || true
kubectl delete deployment frontend-deployment-canary || true

echo ""
echo "==========================================="
echo "Canary rollback completed!"
echo "Production traffic remains on stable version."
echo "==========================================="
