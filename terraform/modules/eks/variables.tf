variable "cluster_name"       { type = string }
variable "vpc_id"             { type = string }
variable "public_subnet_ids"  { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "node_instance_type" { type = string }
variable "node_desired_capacity" { type = number }
variable "node_max_capacity"  { type = number }
variable "node_min_capacity"  { type = number }
