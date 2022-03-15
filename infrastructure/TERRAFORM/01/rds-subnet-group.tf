resource "aws_db_subnet_group" "mydb_subnet" {
  name       = "mydb_subnet"
  subnet_ids = [aws_subnet.subnet["us-east-1a"].id, aws_subnet.subnet["us-east-1b"].id, aws_subnet.subnet["us-east-1c"].id]

  tags = {
    Name = "My DB subnet group"
  }
}

/* resource "aws_db_subnet_group" "mydb_replica_subnet" {
  name       = "mydb_replica_subnet"
  subnet_ids = [aws_subnet.subnet["us-east-1c"].id]

  tags = {
    Name = "My DB_replica subnet group"
  }
} */