resource "aws_dynamodb_table" "csye6225-dynamoDb" {
  name = "csye6225-dynamoDb"

  read_capacity  = 5
  write_capacity = 5
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
  ttl {
    attribute_name = "TimeToExist"
    enabled        = true
  }


}
 