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

  eks_managed_node_groups = {
    default = {
      name         = "${local.name_prefix}-nodes"
      instance_types = [var.eks_node_instance_type]
      desired_size    = var.eks_node_desired
      max_size        = var.eks_node_max
      min_size        = var.eks_node_min
      subnet_ids      = module.vpc.private_subnets
      tags            = local.tags
    }
  }

  tags = local.tags
}
