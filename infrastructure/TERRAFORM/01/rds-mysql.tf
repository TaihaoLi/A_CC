resource "aws_db_instance" "mydb" {
  allocated_storage       = 10
  engine                  = local.rds_engine
  engine_version          = local.rds_engine_version
  instance_class          = "db.t3.micro"
  name                    = local.rds_name
  username                = local.rds_username
  password                = local.rds_password
  skip_final_snapshot     = true
  publicly_accessible     = false
  vpc_security_group_ids  = [aws_security_group.db_security_group.id]
  db_subnet_group_name    = aws_db_subnet_group.mydb_subnet.name
  parameter_group_name    = aws_db_parameter_group.mydb_para_group.name
  availability_zone       = "us-east-1b"
  backup_retention_period = 5
  //A8
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn
}

//A7
resource "aws_db_instance" "mydb_read_replica" {
  //allocated_storage      = 10
  engine         = local.rds_engine
  engine_version = local.rds_engine_version
  instance_class = "db.t3.micro"

  //username               = local.rds_username
  //password               = local.rds_password
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.db_security_group.id]
  //db_subnet_group_name   = aws_db_subnet_group.mydb_replica_subnet.name
  parameter_group_name = aws_db_parameter_group.mydb_para_group.name
  replicate_source_db  = aws_db_instance.mydb.id
  //replica_mode         = "open-read-only"
  availability_zone = "us-east-1c"
  //A8
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn
}