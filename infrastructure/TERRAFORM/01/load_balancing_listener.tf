resource "aws_lb_listener" "lb-listener" {
  load_balancer_arn = aws_lb.webapp-lb.arn
  port              = "443"
  protocol          = "HTTPS"

  //A8
  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = var.cert_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.webapp-3000.arn
  }
}