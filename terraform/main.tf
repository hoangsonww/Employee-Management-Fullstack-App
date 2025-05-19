module "network" {
  source          = "./modules/network"
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

module "eks" {
  source                 = "./modules/eks"
  cluster_name           = var.cluster_name
  vpc_id                 = module.network.vpc_id
  public_subnet_ids      = module.network.public_subnet_ids
  private_subnet_ids     = module.network.private_subnet_ids
  node_instance_type     = var.node_instance_type
  node_desired_capacity  = var.node_desired_capacity
  node_max_capacity      = var.node_max_capacity
  node_min_capacity      = var.node_min_capacity
}

module "rds" {
  source                 = "./modules/rds"
  vpc_id                 = module.network.vpc_id
  private_subnet_ids     = module.network.private_subnet_ids
  db_identifier          = var.db_identifier
  db_engine_version      = var.db_engine_version
  db_instance_class      = var.db_instance_class
  db_allocated_storage   = var.db_allocated_storage
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
}

module "ecr" {
  source = "./modules/ecr"
}
