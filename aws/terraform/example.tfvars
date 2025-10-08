# Copy this file to terraform.tfvars and customise for your environment.
project_name = "employee-management"
environment  = "prod"
aws_region   = "us-east-1"

db_password = "change-me"

# Uncomment to use dedicated database subnets
# database_subnet_cidrs = [
#   "10.20.192.0/20",
#   "10.20.208.0/20",
#   "10.20.224.0/20"
# ]

# Uncomment to increase or decrease cluster capacity
# eks_node_instance_type = "m5.large"
# eks_node_desired       = 3
# eks_node_max           = 6
# eks_node_min           = 2
