locals {
  //for main.vpc
  enable_dns_hostnames             = true
  enable_dns_support               = true
  enable_classiclink_dns_support   = true
  assign_generated_ipv6_cidr_block = true
  vpc_name                         = "${terraform.workspace}-csye6225-vpc1"

  //for sunbet
  map_public_ip_on_launch = true
  vpc_subnet_name         = "${terraform.workspace}-csye6225-vpc1-subnet123"

  //for internet_gateway
  internet_gateway_name = "${terraform.workspace}-csye6225-internet-gateway1"

  //for route_table
  route_table_name = "${terraform.workspace}-csye6225-public_route_table"

  //for app security group
  app_sg_name       = "application_security_group"
  app_sg_descr      = "ingress rule :TCP traffic on ports 22,80,443 and 3000"
  app_sg_http_descr = "HTTP Access"
  app_sg_http_port  = 80

  app_sg_https_descr = "HTTPS Access"
  app_sg_https_port  = 443

  app_sg_ssh_descr = "SSH Access"
  app_sg_ssh_port  = 22

  app_sg_app_descr = "APP Access"
  app_sg_app_port  = 3000

  app_sg_out_port = 0



  app_sg_protocol_tcp = "tcp"
  app_sg_protocol_all = "-1"

  app_sg_cidr      = ["0.0.0.0/0"]
  app_sg_ipv6_cidr = ["::/0"]

  //for db security group
  db_sg_name        = "database_security_group"
  db_sg_descr       = "Enable MYSQL access on port 3306"
  db_sg_mysql_descr = "MYSQL Access"
  db_sg_mysql_port  = 3306
  db_sgs            = ["${aws_security_group.app_security_group.id}"]

  //for s3 bucket 
  s3_bucket_name   = "${random_string.random.result}.${var.aws_profile}.taihao.me"
  s3_acl           = "private"
  s3_force_destroy = true

  //for s3 bucket lifecycle_rule
  lifecycle_rule_id               = "FullLifeCycle"
  lifecycle_rule_prefix           = ""
  lifecycle_rule_enabled          = true
  lifecycle_rule_transition_days  = 30
  lifecycle_rule_transition_class = "STANDARD_IA"

  //for kms_key mykey
  mykey_descr                   = "This key is used to encrypt bucket objects"
  mykey_deletion_window_in_days = 10
  mykey_algorithm               = "aws:kms"

  //for random string
  random_string_length  = 16
  random_string_special = false
  random_string_upper   = false

  //for ec2 instance
  ec2_ami         = "ami-04c12b1ed22f04905"
  ec2_key_name    = "csye6225"
  ec2_volume_size = 20
  ec2_volume_type = "gp2"

  //for rds-mysql
  rds_engine         = "mysql"
  rds_engine_version = "5.7"
  rds_name           = "csye6225"
  rds_username       = "csye6225"
  rds_password       = "hhkfljfu6rrd4"








}