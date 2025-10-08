resource "random_id" "db_snapshot" {
  byte_length = 4
}

resource "aws_security_group" "rds" {
  name        = "${local.name_prefix}-mysql"
  description = "Allow MySQL from EKS nodes"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description      = "EKS worker nodes"
    from_port        = 3306
    to_port          = 3306
    protocol         = "tcp"
    security_groups  = [module.eks.node_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

module "mysql" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.3.0"

  identifier = var.db_identifier

  engine            = "mysql"
  engine_version    = var.db_engine_version
  family            = var.db_parameter_group_family
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 3306

  multi_az            = var.db_multi_az
  publicly_accessible = false
  storage_encrypted   = true

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids             = module.vpc.database_subnets

  create_cloudwatch_log_group = true
  backup_window               = var.db_backup_window
  maintenance_window          = var.db_maintenance_window
  backup_retention_period     = var.db_backup_retention

  deletion_protection       = var.db_deletion_protection
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.db_identifier}-${random_id.db_snapshot.hex}"

  tags = local.tags
}
