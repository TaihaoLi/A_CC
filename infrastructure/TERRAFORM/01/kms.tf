#KMS -key for ebs volume
resource "aws_kms_key" "ebs" {
  description             = "ebs kms key"
  deletion_window_in_days = 7
  policy                  = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
     {
   "Sid": "Allow service-linked role use of the CMK",
   "Effect": "Allow",
   "Principal": {
       "AWS": [
           "arn:aws:iam::${var.account_id}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
       ]
   },
   "Action": [
       "kms:Encrypt",
       "kms:Decrypt",
       "kms:ReEncrypt*",
       "kms:GenerateDataKey*",
       "kms:DescribeKey"
   ],
   "Resource": "*"
},{
   "Sid": "Allow attachment of persistent resources",
   "Effect": "Allow",
   "Principal": {
       "AWS": [
           "arn:aws:iam::${var.account_id}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
       ]
   },
   "Action": [
       "kms:CreateGrant"
   ],
   "Resource": "*",
   "Condition": {
       "Bool": {
           "kms:GrantIsForAWSResource": true
       }
    }
},{
            "Sid": "Enable IAM User Permissions",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${var.account_id}:root"
            },
            "Action": "kms:*",
            "Resource": "*"
        }
  ]
}
EOF
}

## KMS key for rds
resource "aws_kms_key" "rds" {
  description             = "rds kms key"
  deletion_window_in_days = 7
}
//manage default key
  resource "aws_ebs_default_kms_key" "example" {
  key_arn = aws_kms_key.ebs.arn
}  
/* //set enable encryption
resource "aws_ebs_encryption_by_default" "enabled" {
  enabled = true
}   */

