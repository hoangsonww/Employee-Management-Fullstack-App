#!/bin/bash

# Blue-Green Deployment Traffic Switch Script
# Usage: ./switch-blue-green.sh <target-version>
# Example: ./switch-blue-green.sh green

set -e

TARGET_VERSION=$1

if [ -z "$TARGET_VERSION" ]; then
    echo "Usage: $0 <target-version>"
    echo "Example: $0 green"
    exit 1
fi

if [ "$TARGET_VERSION" != "blue" ] && [ "$TARGET_VERSION" != "green" ]; then
    echo "Error: Target version must be either 'blue' or 'green'"
    exit 1
fi

echo "==========================================="
echo "Blue-Green Deployment Traffic Switch"
echo "==========================================="
echo "Target Version: $TARGET_VERSION"
echo "==========================================="

# Check if target deployments are healthy
echo "Checking target deployment health..."
BACKEND_READY=$(kubectl get deployment backend-deployment-$TARGET_VERSION -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
FRONTEND_READY=$(kubectl get deployment frontend-deployment-$TARGET_VERSION -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")

echo "Backend $TARGET_VERSION ready replicas: $BACKEND_READY"
echo "Frontend $TARGET_VERSION ready replicas: $FRONTEND_READY"

if [ "$BACKEND_READY" -lt "1" ] || [ "$FRONTEND_READY" -lt "1" ]; then
    echo "Error: Target version is not ready!"
    exit 1
fi

# Get current version
CURRENT_BACKEND_VERSION=$(kubectl get service backend-service -o jsonpath='{.spec.selector.version}' 2>/dev/null || echo "none")
CURRENT_FRONTEND_VERSION=$(kubectl get service frontend-service -o jsonpath='{.spec.selector.version}' 2>/dev/null || echo "none")

echo ""
echo "Current backend version: $CURRENT_BACKEND_VERSION"
echo "Current frontend version: $CURRENT_FRONTEND_VERSION"
echo ""

# Confirm switch
read -p "Switch traffic to $TARGET_VERSION? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Traffic switch cancelled"
    exit 0
fi

# Switch traffic
echo "Switching traffic to $TARGET_VERSION..."

kubectl patch service backend-service -p "{\"spec\":{\"selector\":{\"version\":\"$TARGET_VERSION\"}}}"
kubectl patch service frontend-service -p "{\"spec\":{\"selector\":{\"version\":\"$TARGET_VERSION\"}}}"

echo ""
echo "Traffic switched successfully!"
echo ""

# Display status
echo "Current service status:"
kubectl get services backend-service frontend-service

echo ""
echo "Active pods:"
kubectl get pods -l version=$TARGET_VERSION

echo ""
echo "==========================================="
echo "Traffic switch completed!"
echo "Old version is still running for rollback."
echo "To rollback, run: $0 $CURRENT_BACKEND_VERSION"
echo "==========================================="
