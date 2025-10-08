resource "aws_secretsmanager_secret" "mysql" {
  name                    = var.db_secret_name
  description             = "MySQL credentials for ${local.name_prefix}"
  recovery_window_in_days = var.db_secret_recovery_window
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "mysql" {
  secret_id = aws_secretsmanager_secret.mysql.id
  depends_on = [module.mysql]

  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    host     = module.mysql.db_instance_address
    port     = module.mysql.db_instance_port
    database = var.db_name
  })
}
