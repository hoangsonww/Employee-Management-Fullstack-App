locals {
  name_prefix = "${var.project_name}-${var.environment}"

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  availability_zones_requested = min(var.availability_zone_count, length(data.aws_availability_zones.available.names))

  azs = slice(data.aws_availability_zones.available.names, 0, local.availability_zones_requested)

  database_subnets = length(var.database_subnet_cidrs) > 0 ? var.database_subnet_cidrs : var.private_subnet_cidrs
}
