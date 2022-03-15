resource "aws_route_table" "public" {
  depends_on = [aws_vpc.vpc1]
  vpc_id     = aws_vpc.vpc1.id
  route {
    cidr_block = var.route_table_cidr_block

    gateway_id = aws_internet_gateway.internet_gateway.id
  }
  tags = {
    Name = local.route_table_name
  }
}