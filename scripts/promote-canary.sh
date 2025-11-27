#!/bin/bash

# Promote Canary to Production Script
# Usage: ./promote-canary.sh <image-tag>
# Example: ./promote-canary.sh v1.2.3

set -e

IMAGE_TAG=$1

if [ -z "$IMAGE_TAG" ]; then
    echo "Usage: $0 <image-tag>"
    echo "Example: $0 v1.2.3"
    exit 1
fi

# Get ECR registry from environment or default
ECR_REGISTRY=${ECR_REGISTRY:-"YOUR_ECR_REGISTRY_URL"}

echo "==========================================="
echo "Promote Canary to Production"
echo "==========================================="
echo "Image Tag: $IMAGE_TAG"
echo "==========================================="

# Check if canary is healthy
echo "Checking canary health..."
BACKEND_READY=$(kubectl get deployment backend-deployment-canary -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
FRONTEND_READY=$(kubectl get deployment frontend-deployment-canary -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")

echo "Canary backend ready replicas: $BACKEND_READY"
echo "Canary frontend ready replicas: $FRONTEND_READY"

if [ "$BACKEND_READY" -lt "1" ] || [ "$FRONTEND_READY" -lt "1" ]; then
    echo "Error: Canary is not healthy!"
    exit 1
fi

# Confirm promotion
read -p "Promote canary to production? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Promotion cancelled"
    exit 0
fi

# Update blue deployment with canary image
echo "Promoting canary to production (blue)..."

kubectl set image deployment/backend-deployment-blue \
    backend=$ECR_REGISTRY/employee-management-backend:$IMAGE_TAG --record

kubectl set image deployment/frontend-deployment-blue \
    frontend=$ECR_REGISTRY/employee-management-frontend:$IMAGE_TAG --record

# Wait for rollout
echo "Waiting for production rollout..."
kubectl rollout status deployment/backend-deployment-blue --timeout=300s
kubectl rollout status deployment/frontend-deployment-blue --timeout=300s

# Remove canary
echo "Removing canary deployments..."
kubectl delete deployment backend-deployment-canary || true
kubectl delete deployment frontend-deployment-canary || true

echo ""
echo "==========================================="
echo "Canary promoted successfully!"
echo "Production is now running version: $IMAGE_TAG"
echo "==========================================="
