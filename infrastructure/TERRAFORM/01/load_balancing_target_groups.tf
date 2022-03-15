resource "aws_lb_target_group" "webapp-3000" {
  name     = "webapp-3000"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc1.id
}