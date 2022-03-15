output "vpc_id" {
  value = aws_vpc.vpc1.id
}

output "subnet_ids" {

  value = {
    for k, v in aws_subnet.subnet : k => v.id
  }
}

output "internet_gateway_id" {
  value = aws_internet_gateway.internet_gateway.id
}

output "route_table_id" {
  value = aws_route_table.public.id
}

output "app_security_group_id" {
  value = aws_security_group.app_security_group.id
}

output "db_security_group_id" {
  value = aws_security_group.db_security_group.id
}

output "s3_bucket_id" {
  value = aws_s3_bucket.mybucket.id
}

output "rds_mysql_id" {
  value = aws_db_instance.mydb.id
}

/* output "ec2_instance_id" {
  value = aws_instance.ec2_instance.id
} */