/* resource "aws_route53_record" "ec2_server" {
  zone_id = var.zone_id
  name    = "${var.aws_profile}.taihaoli.me"
  type    = "A"
  ttl     = "300"
  records = [aws_instance.ec2_instance.public_ip]
} */

resource "aws_route53_record" "ec2_server" {
  zone_id = var.zone_id
  name    = "${var.aws_profile}.taihaoli.me"
  type    = "A"

  alias {
    name                   = aws_lb.webapp-lb.dns_name
    zone_id                = aws_lb.webapp-lb.zone_id
    evaluate_target_health = true
  }
}