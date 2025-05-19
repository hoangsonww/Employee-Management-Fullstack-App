output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_ca_certificate" {
  description = "Base64 CA for EKS"
  value       = module.eks.cluster_ca_certificate
}

output "cluster_token" {
  description = "Auth token for EKS"
  value       = module.eks.cluster_token
}

output "db_endpoint" {
  description = "RDS MySQL endpoint"
  value       = module.rds.db_endpoint
}

output "backend_ecr_repository" {
  description = "ECR repo URL for backend"
  value       = module.ecr.backend_repo_url
}

output "frontend_ecr_repository" {
  description = "ECR repo URL for frontend"
  value       = module.ecr.frontend_repo_url
}
