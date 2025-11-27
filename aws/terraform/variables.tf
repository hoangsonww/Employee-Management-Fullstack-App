variable "project_name" {
  description = "Base name used for tagging and resource naming"
  type        = string
  default     = "employee-management"
}

variable "environment" {
  description = "Deployment environment identifier"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "availability_zone_count" {
  description = "Number of availability zones to spread subnets across"
  type        = number
  default     = 3
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = [
    "10.20.0.0/20",
    "10.20.16.0/20",
    "10.20.32.0/20"
  ]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = [
    "10.20.128.0/20",
    "10.20.144.0/20",
    "10.20.160.0/20"
  ]
}

variable "database_subnet_cidrs" {
  description = "Optional dedicated subnet CIDRs for database resources"
  type        = list(string)
  default     = []
}

variable "single_nat_gateway" {
  description = "Whether to provision a single shared NAT gateway"
  type        = bool
  default     = true
}

variable "cluster_version" {
  description = "EKS Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "eks_node_instance_type" {
  description = "Instance type for the EKS managed node group"
  type        = string
  default     = "t3.medium"
}

variable "eks_node_desired" {
  description = "Desired node count"
  type        = number
  default     = 2
}

variable "eks_node_max" {
  description = "Maximum node count"
  type        = number
  default     = 4
}

variable "eks_node_min" {
  description = "Minimum node count"
  type        = number
  default     = 2
}

variable "eks_spot_instance_types" {
  description = "Instance types for the EKS spot node group"
  type        = list(string)
  default     = ["t3.medium", "t3a.medium", "t2.medium"]
}

variable "eks_spot_desired" {
  description = "Desired spot node count"
  type        = number
  default     = 0
}

variable "eks_spot_max" {
  description = "Maximum spot node count"
  type        = number
  default     = 3
}

variable "eks_spot_min" {
  description = "Minimum spot node count"
  type        = number
  default     = 0
}

variable "db_identifier" {
  description = "Identifier for the MySQL instance"
  type        = string
  default     = "employee-mgmt-mysql"
}

variable "db_engine_version" {
  description = "MySQL engine version"
  type        = string
  default     = "8.0.34"
}

variable "db_parameter_group_family" {
  description = "MySQL parameter group family"
  type        = string
  default     = "mysql8.0"
}

variable "db_instance_class" {
  description = "Instance class for MySQL"
  type        = string
  default     = "db.m5.large"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 50
}

variable "db_max_allocated_storage" {
  description = "Maximum storage in GB for autoscaling"
  type        = number
  default     = 200
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "employee_management"
}

variable "db_username" {
  description = "Master username for MySQL"
  type        = string
  default     = "empmgr"
}

variable "db_password" {
  description = "Master password for MySQL"
  type        = string
  sensitive   = true
}

variable "db_multi_az" {
  description = "Whether to provision a Multi-AZ database instance"
  type        = bool
  default     = true
}

variable "db_backup_window" {
  description = "Preferred automated backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "db_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "Sun:05:00-Sun:06:00"
}

variable "db_backup_retention" {
  description = "Number of days to retain automatic backups"
  type        = number
  default     = 14
}

variable "db_deletion_protection" {
  description = "Enable deletion protection on the database"
  type        = bool
  default     = true
}

variable "db_secret_name" {
  description = "Name for the Secrets Manager entry that stores MySQL credentials"
  type        = string
  default     = "employee-management/mysql"
}

variable "db_secret_recovery_window" {
  description = "Secrets Manager recovery window in days"
  type        = number
  default     = 30
}

variable "ecr_image_tag_mutability" {
  description = "Image tag mutability setting for ECR repositories"
  type        = string
  default     = "IMMUTABLE"
}

variable "ecr_image_retain_count" {
  description = "Number of images to retain in ECR lifecycle policies"
  type        = number
  default     = 10
}
