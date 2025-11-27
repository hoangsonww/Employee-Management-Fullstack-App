#!/bin/bash

# Canary Deployment Script
# Usage: ./deploy-canary.sh <image-tag>
# Example: ./deploy-canary.sh v1.2.3

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
echo "Canary Deployment"
echo "==========================================="
echo "Image Tag: $IMAGE_TAG"
echo "ECR Registry: $ECR_REGISTRY"
echo "==========================================="

cd "$(dirname "$0")/../kubernetes"

# Apply base resources
echo "Applying base Kubernetes resources..."
kubectl apply -f configmap-production.yaml
kubectl apply -f rbac.yaml
kubectl apply -f network-policy.yaml

# Apply services
echo "Applying services..."
kubectl apply -f backend-service-production.yaml
kubectl apply -f frontend-service-production.yaml

# Deploy canary version
echo "Deploying canary version..."
export IMAGE_TAG=$IMAGE_TAG
export ECR_REGISTRY=$ECR_REGISTRY

envsubst < backend-deployment-canary.yaml | kubectl apply -f -
envsubst < frontend-deployment-canary.yaml | kubectl apply -f -

# Wait for canary to be ready
echo "Waiting for canary deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
    deployment/backend-deployment-canary

kubectl wait --for=condition=available --timeout=300s \
    deployment/frontend-deployment-canary

# Health check
echo "Running health checks..."
sleep 30

BACKEND_READY=$(kubectl get deployment backend-deployment-canary -o jsonpath='{.status.readyReplicas}')
FRONTEND_READY=$(kubectl get deployment frontend-deployment-canary -o jsonpath='{.status.readyReplicas}')

echo "Canary backend ready replicas: $BACKEND_READY"
echo "Canary frontend ready replicas: $FRONTEND_READY"

if [ "$BACKEND_READY" -lt "1" ] || [ "$FRONTEND_READY" -lt "1" ]; then
    echo "Error: Canary deployment failed! Not enough ready replicas."
    exit 1
fi

echo ""
echo "==========================================="
echo "Canary deployment completed!"
echo ""
echo "Monitor canary metrics and logs."
echo ""
echo "To promote canary to production:"
echo "  ./promote-canary.sh $IMAGE_TAG"
echo ""
echo "To rollback canary:"
echo "  ./rollback-canary.sh"
echo "==========================================="
