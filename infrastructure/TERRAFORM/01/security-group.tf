#A6 terraform aws create security group:for load balancer
resource "aws_security_group" "app_security_group" {
  name        = local.app_sg_name
  description = local.app_sg_descr
  vpc_id      = aws_vpc.vpc1.id

  ingress {
    description      = local.app_sg_http_descr
    from_port        = local.app_sg_http_port
    to_port          = local.app_sg_http_port
    protocol         = local.app_sg_protocol_tcp
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  ingress {
    description      = local.app_sg_https_descr
    from_port        = local.app_sg_https_port
    to_port          = local.app_sg_https_port
    protocol         = local.app_sg_protocol_tcp
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  ingress {
    description      = local.app_sg_ssh_descr
    from_port        = local.app_sg_ssh_port
    to_port          = local.app_sg_ssh_port
    protocol         = local.app_sg_protocol_tcp
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  ingress {
    description      = local.app_sg_app_descr
    from_port        = local.app_sg_app_port
    to_port          = local.app_sg_app_port
    protocol         = local.app_sg_protocol_tcp
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  egress {
    from_port        = local.app_sg_out_port
    to_port          = local.app_sg_out_port
    protocol         = local.app_sg_protocol_all
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  tags = {
    Name = local.app_sg_name
  }
}



resource "aws_security_group" "db_security_group" {
  name        = local.db_sg_name
  description = local.db_sg_descr
  vpc_id      = aws_vpc.vpc1.id

  ingress {
    description     = local.db_sg_mysql_descr
    from_port       = local.db_sg_mysql_port
    to_port         = local.db_sg_mysql_port
    protocol        = local.app_sg_protocol_tcp
    security_groups = [aws_security_group.ec2_security_group.id]
  }


  egress {
    from_port        = local.app_sg_out_port
    to_port          = local.app_sg_out_port
    protocol         = local.app_sg_protocol_all
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  tags = {
    Name = local.db_sg_name
  }
}

#A6 terraform aws create ec2 instance security group:only allows traffic from the load balancer
resource "aws_security_group" "ec2_security_group" {
  name        = "ec2_security_group"
  description = "ec2 only allows traffic from the load balancer"
  vpc_id      = aws_vpc.vpc1.id

  ingress {
    description     = local.app_sg_http_descr
    from_port       = local.app_sg_http_port
    to_port         = local.app_sg_http_port
    protocol        = local.app_sg_protocol_tcp
    security_groups = [aws_security_group.app_security_group.id]
  }


  ingress {
    description     = local.app_sg_https_descr
    from_port       = local.app_sg_https_port
    to_port         = local.app_sg_https_port
    protocol        = local.app_sg_protocol_tcp
    security_groups = [aws_security_group.app_security_group.id]
  }

  //for demo purpose
   /*   ingress {
    description      = local.app_sg_ssh_descr
    from_port        = local.app_sg_ssh_port
    to_port          = local.app_sg_ssh_port
    protocol         = local.app_sg_protocol_tcp
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }  */


  ingress {
    description     = local.app_sg_app_descr
    from_port       = local.app_sg_app_port
    to_port         = local.app_sg_app_port
    protocol        = local.app_sg_protocol_tcp
    security_groups = [aws_security_group.app_security_group.id]
  }


  egress {
    from_port        = local.app_sg_out_port
    to_port          = local.app_sg_out_port
    protocol         = local.app_sg_protocol_all
    cidr_blocks      = local.app_sg_cidr
    ipv6_cidr_blocks = local.app_sg_ipv6_cidr
  }


  tags = {
    Name = "ec2_security_group"
  }
}