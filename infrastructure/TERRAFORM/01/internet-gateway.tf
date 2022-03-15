resource "aws_internet_gateway" "internet_gateway" {

  depends_on = [aws_vpc.vpc1]

  vpc_id = aws_vpc.vpc1.id

  tags = {
    Name = local.internet_gateway_name
  }
}