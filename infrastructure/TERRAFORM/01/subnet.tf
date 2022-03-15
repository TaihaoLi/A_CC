resource "aws_subnet" "subnet" {

  depends_on = [aws_vpc.vpc1]

  for_each = var.subent_az_cidr

  cidr_block              = each.value
  vpc_id                  = aws_vpc.vpc1.id
  availability_zone       = each.key
  map_public_ip_on_launch = local.map_public_ip_on_launch
  tags = {
    Name = local.vpc_subnet_name
  }
}