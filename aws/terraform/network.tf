module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = local.name_prefix
  cidr = var.vpc_cidr

  azs             = local.azs
  public_subnets  = var.public_subnet_cidrs
  private_subnets = var.private_subnet_cidrs
  database_subnets = local.database_subnets

  create_database_subnet_group = true
  enable_nat_gateway           = true
  single_nat_gateway           = var.single_nat_gateway
  enable_dns_hostnames         = true
  enable_dns_support           = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }

  tags = local.tags
}
