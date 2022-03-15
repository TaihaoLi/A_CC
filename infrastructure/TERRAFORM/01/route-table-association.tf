resource "aws_route_table_association" "public1" {
  for_each = var.subent_az_cidr

  subnet_id      = aws_subnet.subnet[each.key].id
  route_table_id = aws_route_table.public.id
}