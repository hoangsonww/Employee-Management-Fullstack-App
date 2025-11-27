#!/bin/bash

# Blue-Green Deployment Script
# Usage: ./deploy-blue-green.sh <target-version> <image-tag>
# Example: ./deploy-blue-green.sh green v1.2.3

set -e

TARGET_VERSION=$1
IMAGE_TAG=$2

if [ -z "$TARGET_VERSION" ] || [ -z "$IMAGE_TAG" ]; then
    echo "Usage: $0 <target-version> <image-tag>"
    echo "Example: $0 green v1.2.3"
    exit 1
fi

if [ "$TARGET_VERSION" != "blue" ] && [ "$TARGET_VERSION" != "green" ]; then
    echo "Error: Target version must be either 'blue' or 'green'"
    exit 1
fi

# Get ECR registry from environment or default
ECR_REGISTRY=${ECR_REGISTRY:-"YOUR_ECR_REGISTRY_URL"}

echo "==========================================="
echo "Blue-Green Deployment"
echo "==========================================="
echo "Target Version: $TARGET_VERSION"
echo "Image Tag: $IMAGE_TAG"
echo "ECR Registry: $ECR_REGISTRY"
echo "==========================================="

cd "$(dirname "$0")/../kubernetes"

# Apply base resources
echo "Applying base Kubernetes resources..."
kubectl apply -f configmap-production.yaml
kubectl apply -f rbac.yaml
kubectl apply -f hpa.yaml
kubectl apply -f pdb.yaml
kubectl apply -f network-policy.yaml

# Apply services
echo "Applying services..."
kubectl apply -f backend-service-production.yaml
kubectl apply -f frontend-service-production.yaml

# Deploy to target version
echo "Deploying to $TARGET_VERSION environment..."
export IMAGE_TAG=$IMAGE_TAG
export ECR_REGISTRY=$ECR_REGISTRY

envsubst < backend-deployment-$TARGET_VERSION.yaml | kubectl apply -f -
envsubst < frontend-deployment-$TARGET_VERSION.yaml | kubectl apply -f -

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
    deployment/backend-deployment-$TARGET_VERSION

kubectl wait --for=condition=available --timeout=300s \
    deployment/frontend-deployment-$TARGET_VERSION

# Health check
echo "Running health checks..."
sleep 30

BACKEND_READY=$(kubectl get deployment backend-deployment-$TARGET_VERSION -o jsonpath='{.status.readyReplicas}')
FRONTEND_READY=$(kubectl get deployment frontend-deployment-$TARGET_VERSION -o jsonpath='{.status.readyReplicas}')

echo "Backend $TARGET_VERSION ready replicas: $BACKEND_READY"
echo "Frontend $TARGET_VERSION ready replicas: $FRONTEND_READY"

if [ "$BACKEND_READY" -lt "1" ] || [ "$FRONTEND_READY" -lt "1" ]; then
    echo "Error: Deployment failed! Not enough ready replicas."
    exit 1
fi

echo ""
echo "==========================================="
echo "Deployment to $TARGET_VERSION completed!"
echo "To switch traffic, run:"
echo "  ./switch-blue-green.sh $TARGET_VERSION"
echo "==========================================="
