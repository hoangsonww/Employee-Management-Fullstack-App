#!/bin/bash

# Rollback Kubernetes Deployment Script
# Usage: ./rollback-deployment.sh <component>
# Example: ./rollback-deployment.sh backend

set -e

COMPONENT=$1

if [ -z "$COMPONENT" ]; then
    echo "Usage: $0 <component>"
    echo "Example: $0 backend"
    echo "         $0 frontend"
    echo "         $0 all"
    exit 1
fi

echo "==========================================="
echo "Rollback Deployment"
echo "==========================================="
echo "Component: $COMPONENT"
echo "==========================================="

rollback_component() {
    local comp=$1
    echo "Rolling back $comp deployment..."

    # Get current deployment names
    DEPLOYMENTS=$(kubectl get deployments -l app=$comp -o jsonpath='{.items[*].metadata.name}')

    if [ -z "$DEPLOYMENTS" ]; then
        echo "No deployments found for $comp"
        return
    fi

    for deployment in $DEPLOYMENTS; do
        echo "Rolling back $deployment..."
        kubectl rollout undo deployment/$deployment

        echo "Waiting for rollback to complete..."
        kubectl rollout status deployment/$deployment --timeout=300s

        echo "$deployment rolled back successfully"
    done
}

case $COMPONENT in
    backend)
        rollback_component "backend"
        ;;
    frontend)
        rollback_component "frontend"
        ;;
    all)
        rollback_component "backend"
        rollback_component "frontend"
        ;;
    *)
        echo "Error: Invalid component. Use 'backend', 'frontend', or 'all'"
        exit 1
        ;;
esac

echo ""
echo "==========================================="
echo "Rollback completed!"
echo ""
echo "Current deployment status:"
kubectl get deployments -l environment=production
echo ""
kubectl get pods -l environment=production
echo "==========================================="
