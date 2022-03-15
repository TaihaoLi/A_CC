/* resource "aws_kms_key" "mykey" {
  description             = local.mykey_descr
  deletion_window_in_days = local.mykey_deletion_window_in_days
} */

resource "random_string" "random" {
  length  = local.random_string_length
  special = local.random_string_special
  upper   = local.random_string_upper
}

resource "aws_s3_bucket" "mybucket" {
  bucket        = local.s3_bucket_name
  acl           = local.s3_acl
  force_destroy = local.s3_force_destroy

  lifecycle_rule {
    id      = local.lifecycle_rule_id
    prefix  = local.lifecycle_rule_prefix
    enabled = local.lifecycle_rule_enabled



    transition {
      days          = local.lifecycle_rule_transition_days
      storage_class = local.lifecycle_rule_transition_class
    }


  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        //kms_master_key_id = aws_kms_key.mykey.arn
        sse_algorithm = local.mykey_algorithm
      }
    }
  }
  tags = {
    Name = local.s3_bucket_name
  }
}