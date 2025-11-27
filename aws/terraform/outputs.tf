output "vpc_id" {
  description = "ID of the provisioned VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet identifiers"
  value       = module.vpc.public_subnets
}

output "private_subnet_ids" {
  description = "Private subnet identifiers"
  value       = module.vpc.private_subnets
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS cluster API server endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_certificate" {
  description = "Base64 encoded certificate authority data"
  value       = module.eks.cluster_certificate_authority_data
}

output "eks_node_security_group_id" {
  description = "Security group id attached to worker nodes"
  value       = module.eks.node_security_group_id
}

output "mysql_endpoint" {
  description = "RDS MySQL writer endpoint"
  value       = module.mysql.db_instance_endpoint
}

output "mysql_secret_name" {
  description = "Secrets Manager entry storing MySQL credentials"
  value       = aws_secretsmanager_secret.mysql.name
}

output "backend_ecr_repository" {
  description = "ECR repository URI for backend images"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repository" {
  description = "ECR repository URI for frontend images"
  value       = aws_ecr_repository.frontend.repository_url
}

output "eks_update_kubeconfig_command" {
  description = "Convenience command to update local kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "mysql_secret_arn" {
  description = "ARN of the Secrets Manager entry storing database credentials"
  value       = aws_secretsmanager_secret.mysql.arn
}

# IAM Role ARNs for Kubernetes Service Accounts
output "backend_irsa_role_arn" {
  description = "IAM role ARN for backend service account"
  value       = module.backend_irsa_role.iam_role_arn
}

output "aws_load_balancer_controller_role_arn" {
  description = "IAM role ARN for AWS Load Balancer Controller"
  value       = module.aws_load_balancer_controller_irsa_role.iam_role_arn
}

output "cluster_autoscaler_role_arn" {
  description = "IAM role ARN for Cluster Autoscaler"
  value       = module.cluster_autoscaler_irsa_role.iam_role_arn
}

output "cloudwatch_role_arn" {
  description = "IAM role ARN for CloudWatch agent"
  value       = module.cloudwatch_irsa_role.iam_role_arn
}

output "ebs_csi_driver_role_arn" {
  description = "IAM role ARN for EBS CSI driver"
  value       = module.ebs_csi_irsa_role.iam_role_arn
}

# KMS Key
output "eks_kms_key_id" {
  description = "KMS key ID used for EKS cluster encryption"
  value       = aws_kms_key.eks.key_id
}

output "eks_kms_key_arn" {
  description = "KMS key ARN used for EKS cluster encryption"
  value       = aws_kms_key.eks.arn
}

# OIDC Provider
output "eks_oidc_provider_arn" {
  description = "ARN of the OIDC Provider for EKS"
  value       = module.eks.oidc_provider_arn
}
