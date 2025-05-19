module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "18.0.0"
  cluster_name    = var.cluster_name
  cluster_version = "1.26"

  vpc_id     = var.vpc_id
  subnets    = concat(var.public_subnet_ids, var.private_subnet_ids)

  node_groups = {
    default = {
      desired_capacity = var.node_desired_capacity
      max_capacity     = var.node_max_capacity
      min_capacity     = var.node_min_capacity
      instance_types   = [var.node_instance_type]
    }
  }
}
