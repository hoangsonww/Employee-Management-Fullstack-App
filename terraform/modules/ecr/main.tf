resource "aws_ecr_repository" "backend" {
  name = "employee-management-backend"
}

resource "aws_ecr_repository" "frontend" {
  name = "employee-management-frontend"
}
