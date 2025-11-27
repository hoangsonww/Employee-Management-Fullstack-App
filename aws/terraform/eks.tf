module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"

  cluster_name    = "${local.name_prefix}-eks"
  cluster_version = var.cluster_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true
  enable_irsa                     = true

  # Cluster addons for production readiness
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent              = true
      service_account_role_arn = module.ebs_csi_irsa_role.iam_role_arn
    }
  }

  eks_managed_node_groups = {
    # Primary node group for production workloads
    production = {
      name            = "${local.name_prefix}-production-nodes"
      instance_types  = [var.eks_node_instance_type]
      capacity_type   = "ON_DEMAND"
      desired_size    = var.eks_node_desired
      max_size        = var.eks_node_max
      min_size        = var.eks_node_min
      subnet_ids      = module.vpc.private_subnets

      labels = {
        Environment = var.environment
        NodeGroup   = "production"
      }

      taints = []

      tags = merge(local.tags, {
        "k8s.io/cluster-autoscaler/${local.name_prefix}-eks" = "owned"
        "k8s.io/cluster-autoscaler/enabled"                   = "true"
      })

      # Enable IMDSv2
      metadata_options = {
        http_endpoint               = "enabled"
        http_tokens                 = "required"
        http_put_response_hop_limit = 2
      }

      # EBS volume configuration
      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = 100
            volume_type           = "gp3"
            iops                  = 3000
            throughput            = 125
            encrypted             = true
            delete_on_termination = true
          }
        }
      }
    }

    # Spot instance node group for non-critical workloads (optional)
    spot = {
      name            = "${local.name_prefix}-spot-nodes"
      instance_types  = var.eks_spot_instance_types
      capacity_type   = "SPOT"
      desired_size    = var.eks_spot_desired
      max_size        = var.eks_spot_max
      min_size        = var.eks_spot_min
      subnet_ids      = module.vpc.private_subnets

      labels = {
        Environment = var.environment
        NodeGroup   = "spot"
        Workload    = "non-critical"
      }

      taints = [{
        key    = "spot"
        value  = "true"
        effect = "NoSchedule"
      }]

      tags = merge(local.tags, {
        "k8s.io/cluster-autoscaler/${local.name_prefix}-eks" = "owned"
        "k8s.io/cluster-autoscaler/enabled"                   = "true"
      })

      metadata_options = {
        http_endpoint               = "enabled"
        http_tokens                 = "required"
        http_put_response_hop_limit = 2
      }
    }
  }

  # Enable cluster encryption
  cluster_encryption_config = {
    provider_key_arn = aws_kms_key.eks.arn
    resources        = ["secrets"]
  }

  # Enable control plane logging
  cluster_enabled_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]

  tags = local.tags
}

# KMS key for EKS cluster encryption
resource "aws_kms_key" "eks" {
  description             = "KMS key for EKS cluster ${local.name_prefix}"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(local.tags, {
    Name = "${local.name_prefix}-eks-kms"
  })
}

resource "aws_kms_alias" "eks" {
  name          = "alias/${local.name_prefix}-eks"
  target_key_id = aws_kms_key.eks.key_id
}

# EBS CSI Driver IAM Role
module "ebs_csi_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name             = "${local.name_prefix}-ebs-csi-driver"
  attach_ebs_csi_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }

  tags = local.tags
}

# AWS Load Balancer Controller IAM Role
module "aws_load_balancer_controller_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name                              = "${local.name_prefix}-aws-load-balancer-controller"
  attach_load_balancer_controller_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }

  tags = local.tags
}

# CloudWatch Container Insights IAM Role
module "cloudwatch_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "${local.name_prefix}-cloudwatch-agent"

  role_policy_arns = {
    CloudWatchAgentServerPolicy = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  }

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["amazon-cloudwatch:cloudwatch-agent"]
    }
  }

  tags = local.tags
}

# Cluster Autoscaler IAM Role
module "cluster_autoscaler_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name                        = "${local.name_prefix}-cluster-autoscaler"
  attach_cluster_autoscaler_policy = true
  cluster_autoscaler_cluster_names = [module.eks.cluster_name]

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:cluster-autoscaler"]
    }
  }

  tags = local.tags
}

# Backend application IAM Role (for accessing AWS services)
module "backend_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "${local.name_prefix}-backend-app"

  role_policy_arns = {
    SecretsManagerRead = aws_iam_policy.backend_secrets_access.arn
    S3Access           = aws_iam_policy.backend_s3_access.arn
  }

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["default:backend-sa"]
    }
  }

  tags = local.tags
}

# IAM policy for backend to access Secrets Manager
resource "aws_iam_policy" "backend_secrets_access" {
  name        = "${local.name_prefix}-backend-secrets-access"
  description = "Allow backend application to read secrets from Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.db_credentials.arn
        ]
      }
    ]
  })

  tags = local.tags
}

# IAM policy for backend S3 access (if needed)
resource "aws_iam_policy" "backend_s3_access" {
  name        = "${local.name_prefix}-backend-s3-access"
  description = "Allow backend application to access S3 buckets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${local.name_prefix}-uploads/*",
          "arn:aws:s3:::${local.name_prefix}-uploads"
        ]
      }
    ]
  })

  tags = local.tags
}
