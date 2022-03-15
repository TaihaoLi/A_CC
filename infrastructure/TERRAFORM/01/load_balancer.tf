resource "aws_lb" "webapp-lb" {
  name               = "webapp-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.app_security_group.id]
  subnets            = [aws_subnet.subnet["us-east-1a"].id, aws_subnet.subnet["us-east-1b"].id, aws_subnet.subnet["us-east-1c"].id]
  ip_address_type    = "ipv4"

  enable_deletion_protection = false


}