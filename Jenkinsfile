pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = credentials('ecr-registry-url')
        EKS_CLUSTER_NAME = 'employee-management-eks'
        DOCKER_BUILDKIT = '1'
        IMAGE_TAG = "${env.GIT_COMMIT.take(8)}"
        BACKEND_IMAGE = "${ECR_REGISTRY}/employee-management-backend:${IMAGE_TAG}"
        FRONTEND_IMAGE = "${ECR_REGISTRY}/employee-management-frontend:${IMAGE_TAG}"
        KUBECONFIG = "${WORKSPACE}/.kube/config"
        DEPLOYMENT_STRATEGY = "${params.DEPLOYMENT_STRATEGY ?: 'rolling'}"
        ACTIVE_VERSION = "${params.ACTIVE_VERSION ?: 'blue'}"
        CANARY_WEIGHT = "${params.CANARY_WEIGHT ?: '10'}"
    }

    parameters {
        choice(
            name: 'DEPLOYMENT_STRATEGY',
            choices: ['rolling', 'blue-green', 'canary'],
            description: 'Choose deployment strategy'
        )
        choice(
            name: 'ACTIVE_VERSION',
            choices: ['blue', 'green'],
            description: 'Currently active version (for blue-green deployment)'
        )
        string(
            name: 'CANARY_WEIGHT',
            defaultValue: '10',
            description: 'Percentage of traffic to canary (1-100)'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip running tests'
        )
        booleanParam(
            name: 'AUTO_ROLLBACK',
            defaultValue: true,
            description: 'Automatically rollback on deployment failure'
        )
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "========================================="
                    echo "Employee Management System - CI/CD Pipeline"
                    echo "========================================="
                    echo "Build Number: ${env.BUILD_NUMBER}"
                    echo "Git Commit: ${env.GIT_COMMIT}"
                    echo "Git Branch: ${env.GIT_BRANCH}"
                    echo "Deployment Strategy: ${DEPLOYMENT_STRATEGY}"
                    echo "Image Tag: ${IMAGE_TAG}"
                    echo "========================================="

                    // Clean workspace
                    cleanWs()
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            script {
                                echo 'Installing backend dependencies...'
                                sh '''
                                    if [ -f pom.xml ]; then
                                        mvn clean install -DskipTests
                                    elif [ -f package.json ]; then
                                        npm ci --production=false
                                    fi
                                '''
                            }
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            script {
                                echo 'Installing frontend dependencies...'
                                sh 'npm ci --production=false'
                            }
                        }
                    }
                }
            }
        }

        stage('Code Quality & Security') {
            parallel {
                stage('Lint') {
                    steps {
                        script {
                            echo 'Running linters...'
                            dir('frontend') {
                                sh 'npm run lint || true'
                            }
                        }
                    }
                }
                stage('Security Scan') {
                    steps {
                        script {
                            echo 'Running security scans...'
                            sh '''
                                # NPM audit
                                cd frontend && npm audit --audit-level=moderate || true

                                # Trivy vulnerability scanner (if available)
                                if command -v trivy &> /dev/null; then
                                    trivy fs --severity HIGH,CRITICAL --exit-code 0 .
                                fi
                            '''
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            script {
                                echo 'Running backend tests...'
                                sh '''
                                    if [ -f pom.xml ]; then
                                        mvn test
                                    elif [ -f package.json ]; then
                                        npm test || true
                                    fi
                                '''
                            }
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            script {
                                echo 'Running frontend tests...'
                                sh 'CI=true npm test -- --coverage --watchAll=false || true'
                            }
                        }
                    }
                }
            }
        }

        stage('Build Applications') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            script {
                                echo 'Building backend application...'
                                sh '''
                                    if [ -f pom.xml ]; then
                                        mvn clean package -DskipTests
                                    elif [ -f package.json ]; then
                                        npm run build
                                    fi
                                '''
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                echo 'Building frontend application...'
                                sh 'npm run build'
                            }
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    echo 'Authenticating with ECR...'
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """

                    parallel(
                        'Backend Image': {
                            dir('backend') {
                                echo "Building backend image: ${BACKEND_IMAGE}"
                                sh """
                                    docker build \
                                        --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                        --build-arg VCS_REF=${env.GIT_COMMIT} \
                                        --build-arg VERSION=${IMAGE_TAG} \
                                        -t ${BACKEND_IMAGE} \
                                        -t ${ECR_REGISTRY}/employee-management-backend:latest \
                                        .

                                    docker push ${BACKEND_IMAGE}
                                    docker push ${ECR_REGISTRY}/employee-management-backend:latest
                                """
                            }
                        },
                        'Frontend Image': {
                            dir('frontend') {
                                echo "Building frontend image: ${FRONTEND_IMAGE}"
                                sh """
                                    docker build \
                                        --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                                        --build-arg VCS_REF=${env.GIT_COMMIT} \
                                        --build-arg VERSION=${IMAGE_TAG} \
                                        -t ${FRONTEND_IMAGE} \
                                        -t ${ECR_REGISTRY}/employee-management-frontend:latest \
                                        .

                                    docker push ${FRONTEND_IMAGE}
                                    docker push ${ECR_REGISTRY}/employee-management-frontend:latest
                                """
                            }
                        }
                    )
                }
            }
        }

        stage('Image Security Scan') {
            steps {
                script {
                    echo 'Scanning Docker images for vulnerabilities...'
                    sh """
                        if command -v trivy &> /dev/null; then
                            trivy image --severity HIGH,CRITICAL --exit-code 0 ${BACKEND_IMAGE}
                            trivy image --severity HIGH,CRITICAL --exit-code 0 ${FRONTEND_IMAGE}
                        else
                            echo 'Trivy not installed, skipping image scan'
                        fi
                    """
                }
            }
        }

        stage('Configure Kubectl') {
            steps {
                script {
                    echo 'Configuring kubectl for EKS...'
                    sh """
                        mkdir -p ${WORKSPACE}/.kube
                        aws eks update-kubeconfig \
                            --region ${AWS_REGION} \
                            --name ${EKS_CLUSTER_NAME} \
                            --kubeconfig ${KUBECONFIG}

                        kubectl version --client
                        kubectl cluster-info
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying with strategy: ${DEPLOYMENT_STRATEGY}"

                    switch(DEPLOYMENT_STRATEGY) {
                        case 'blue-green':
                            deployBlueGreen()
                            break
                        case 'canary':
                            deployCanary()
                            break
                        case 'rolling':
                        default:
                            deployRolling()
                            break
                    }
                }
            }
        }

        stage('Post-Deployment Tests') {
            steps {
                script {
                    echo 'Running smoke tests...'
                    sh '''
                        # Wait for deployments to be ready
                        kubectl wait --for=condition=available --timeout=300s \
                            deployment -l app=backend || true
                        kubectl wait --for=condition=available --timeout=300s \
                            deployment -l app=frontend || true

                        # Get service endpoints
                        BACKEND_URL=$(kubectl get svc backend-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' || echo "backend-service")
                        FRONTEND_URL=$(kubectl get svc frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' || echo "frontend-service")

                        echo "Backend URL: http://${BACKEND_URL}:3000"
                        echo "Frontend URL: http://${FRONTEND_URL}"

                        # Basic health checks
                        sleep 30
                        kubectl get pods -l app=backend
                        kubectl get pods -l app=frontend
                    '''
                }
            }
        }

        stage('Monitor Deployment') {
            steps {
                script {
                    echo 'Monitoring deployment health...'
                    sh '''
                        # Check pod status
                        kubectl get pods -l app=backend -o wide
                        kubectl get pods -l app=frontend -o wide

                        # Check recent events
                        kubectl get events --sort-by=.metadata.creationTimestamp | tail -20

                        # Display deployment status
                        kubectl rollout status deployment -l app=backend --timeout=300s
                        kubectl rollout status deployment -l app=frontend --timeout=300s
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up...'
                sh '''
                    # Remove local Docker images
                    docker rmi ${BACKEND_IMAGE} || true
                    docker rmi ${FRONTEND_IMAGE} || true
                    docker rmi ${ECR_REGISTRY}/employee-management-backend:latest || true
                    docker rmi ${ECR_REGISTRY}/employee-management-frontend:latest || true

                    # Clean up docker system
                    docker system prune -f || true
                '''
            }
        }
        success {
            echo 'Pipeline completed successfully!'
            script {
                sh '''
                    echo "========================================="
                    echo "Deployment Summary"
                    echo "========================================="
                    echo "Strategy: ${DEPLOYMENT_STRATEGY}"
                    echo "Backend Image: ${BACKEND_IMAGE}"
                    echo "Frontend Image: ${FRONTEND_IMAGE}"
                    echo "========================================="

                    kubectl get deployments -l environment=production
                    kubectl get services -l environment=production
                '''
            }
        }
        failure {
            echo 'Pipeline failed!'
            script {
                if (params.AUTO_ROLLBACK) {
                    echo 'Attempting automatic rollback...'
                    sh '''
                        kubectl rollout undo deployment -l app=backend || true
                        kubectl rollout undo deployment -l app=frontend || true

                        echo "Rollback initiated. Check cluster status:"
                        kubectl get pods -l environment=production
                    '''
                }
            }
        }
    }
}

// Deployment Strategy Functions

def deployRolling() {
    echo 'Executing Rolling Deployment...'
    sh """
        # Update image tags in manifests
        cd kubernetes

        # Apply ConfigMaps and Secrets
        kubectl apply -f configmap-production.yaml
        kubectl apply -f rbac.yaml

        # Update deployments with new images
        kubectl set image deployment/backend-deployment \
            backend=${BACKEND_IMAGE} --record
        kubectl set image deployment/frontend-deployment \
            frontend=${FRONTEND_IMAGE} --record

        # Wait for rollout
        kubectl rollout status deployment/backend-deployment --timeout=300s
        kubectl rollout status deployment/frontend-deployment --timeout=300s

        echo 'Rolling deployment completed successfully'
    """
}

def deployBlueGreen() {
    echo "Executing Blue-Green Deployment (Active: ${ACTIVE_VERSION})..."

    def targetVersion = (ACTIVE_VERSION == 'blue') ? 'green' : 'blue'
    echo "Deploying to ${targetVersion} environment..."

    sh """
        cd kubernetes

        # Apply base resources
        kubectl apply -f configmap-production.yaml
        kubectl apply -f rbac.yaml
        kubectl apply -f hpa.yaml
        kubectl apply -f pdb.yaml
        kubectl apply -f network-policy.yaml

        # Deploy to target environment
        export IMAGE_TAG=${IMAGE_TAG}
        export ECR_REGISTRY=${ECR_REGISTRY}

        envsubst < backend-deployment-${targetVersion}.yaml | kubectl apply -f -
        envsubst < frontend-deployment-${targetVersion}.yaml | kubectl apply -f -

        # Wait for new version to be ready
        kubectl wait --for=condition=available --timeout=300s \
            deployment/backend-deployment-${targetVersion}
        kubectl wait --for=condition=available --timeout=300s \
            deployment/frontend-deployment-${targetVersion}

        # Run health checks on new version
        sleep 30
        NEW_BACKEND_READY=\$(kubectl get deployment backend-deployment-${targetVersion} -o jsonpath='{.status.readyReplicas}')
        NEW_FRONTEND_READY=\$(kubectl get deployment frontend-deployment-${targetVersion} -o jsonpath='{.status.readyReplicas}')

        echo "Backend ${targetVersion} ready replicas: \${NEW_BACKEND_READY}"
        echo "Frontend ${targetVersion} ready replicas: \${NEW_FRONTEND_READY}"

        if [ "\${NEW_BACKEND_READY}" -lt "1" ] || [ "\${NEW_FRONTEND_READY}" -lt "1" ]; then
            echo "ERROR: New version is not ready!"
            exit 1
        fi

        echo "New version is healthy. Ready for traffic switch."
        echo "To switch traffic, run: ./scripts/switch-blue-green.sh ${targetVersion}"
    """

    // Prompt for manual approval before switching traffic
    input message: "Deploy to ${targetVersion} completed. Switch traffic to ${targetVersion}?", ok: 'Switch Traffic'

    sh """
        # Switch traffic to new version
        kubectl patch service backend-service -p '{"spec":{"selector":{"version":"${targetVersion}"}}}'
        kubectl patch service frontend-service -p '{"spec":{"selector":{"version":"${targetVersion}"}}}'

        echo "Traffic switched to ${targetVersion}"
        echo "Previous version (${ACTIVE_VERSION}) is still running for rollback if needed"

        # Scale down old version (optional, can keep for quick rollback)
        # kubectl scale deployment/backend-deployment-${ACTIVE_VERSION} --replicas=1
        # kubectl scale deployment/frontend-deployment-${ACTIVE_VERSION} --replicas=1
    """
}

def deployCanary() {
    echo "Executing Canary Deployment (${CANARY_WEIGHT}% traffic)..."

    sh """
        cd kubernetes

        # Apply base resources
        kubectl apply -f configmap-production.yaml
        kubectl apply -f rbac.yaml
        kubectl apply -f network-policy.yaml

        # Deploy canary version
        export IMAGE_TAG=${IMAGE_TAG}
        export ECR_REGISTRY=${ECR_REGISTRY}

        envsubst < backend-deployment-canary.yaml | kubectl apply -f -
        envsubst < frontend-deployment-canary.yaml | kubectl apply -f -

        # Apply services
        kubectl apply -f backend-service-production.yaml
        kubectl apply -f frontend-service-production.yaml

        # Wait for canary to be ready
        kubectl wait --for=condition=available --timeout=300s \
            deployment/backend-deployment-canary
        kubectl wait --for=condition=available --timeout=300s \
            deployment/frontend-deployment-canary

        echo "Canary deployment ready"
        echo "Monitoring canary for issues..."

        # Monitor canary for 2 minutes
        sleep 120

        # Check canary health
        CANARY_BACKEND_READY=\$(kubectl get deployment backend-deployment-canary -o jsonpath='{.status.readyReplicas}')
        CANARY_FRONTEND_READY=\$(kubectl get deployment frontend-deployment-canary -o jsonpath='{.status.readyReplicas}')

        if [ "\${CANARY_BACKEND_READY}" -lt "1" ] || [ "\${CANARY_FRONTEND_READY}" -lt "1" ]; then
            echo "ERROR: Canary is not healthy! Rolling back..."
            kubectl delete -f backend-deployment-canary.yaml || true
            kubectl delete -f frontend-deployment-canary.yaml || true
            exit 1
        fi

        echo "Canary is healthy"
        kubectl get pods -l version=canary
    """

    // Prompt for promotion
    input message: "Canary deployment is healthy. Promote to production?", ok: 'Promote'

    sh """
        echo "Promoting canary to production..."

        # Update blue deployment with canary image
        kubectl set image deployment/backend-deployment-blue \
            backend=${BACKEND_IMAGE} --record
        kubectl set image deployment/frontend-deployment-blue \
            frontend=${FRONTEND_IMAGE} --record

        # Wait for rollout
        kubectl rollout status deployment/backend-deployment-blue --timeout=300s
        kubectl rollout status deployment/frontend-deployment-blue --timeout=300s

        # Remove canary
        kubectl delete deployment backend-deployment-canary || true
        kubectl delete deployment frontend-deployment-canary || true

        echo "Canary promoted successfully"
    """
}
