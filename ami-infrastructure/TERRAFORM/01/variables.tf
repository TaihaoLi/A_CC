variable "vpc_cidr_block" {
  type        = string
  description = "CIDR for vpc"
}



//for subnet


variable "subent_az_cidr" {
  type        = map(any)
  description = "az and cidr for subnet"
}





//for route-table


variable "route_table_cidr_block" {
  type        = string
  description = "cidr_block for route-table"
}


//for credential
variable "aws_region" {
  type        = string
  description = "region"
}

variable "aws_profile" {
  type        = string
  description = "profile"
}

variable "aws_access_key" {
  type        = string
  description = "access_key"
}

variable "aws_access_password" {
  type        = string
  description = "access_password"
}

variable "aws_ec2_key_pair" {
  type        = string
  description = "ec2_key_pair"
}

variable "account_id" {
  type        = string
  description = "account_id"
}