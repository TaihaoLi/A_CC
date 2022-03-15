/* resource "aws_iam_role" "EC2-CSYE6225" {
  name = "EC2-CSYE6225"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "WebAppS3" {
  name        = "WebAppS3"
  description = "S3 access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement":  [
        {
            "Action": [
                "s3:DeleteObject",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.mybucket.bucket}",
                "arn:aws:s3:::${aws_s3_bucket.mybucket.bucket}/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "EC2-S3-attach" {
  role       = aws_iam_role.EC2-CSYE6225.name
  policy_arn = aws_iam_policy.WebAppS3.arn
}
 */


resource "aws_iam_policy" "WebAppS3" {
  name        = "WebAppS3"
  description = "S3 access"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement":  [
        {
            "Action": [
                "s3:DeleteObject",
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.mybucket.bucket}",
                "arn:aws:s3:::${aws_s3_bucket.mybucket.bucket}/*"
            ]
        }
    ]
}
EOF
}
//A7 policy sns
resource "aws_iam_policy" "SNS_policy" {
  name        = "SNS_policy"
  description = "SNS_policy"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": 
   [
     {
      "Effect":"Allow",
      "Action":[
          "SNS:Subscribe",
          "SNS:SetTopicAttributes",
          "SNS:RemovePermission",
          "SNS:Receive",
          "SNS:Publish",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:AddPermission"
      ],
      "Resource":"${aws_sns_topic.default.arn}"
     }
    ]
}
EOF

}


resource "aws_iam_role_policy_attachment" "EC2-S3-attach" {
  role       = "CodeDeployEC2ServiceRole"
  policy_arn = aws_iam_policy.WebAppS3.arn
}
//attach  policy for CodeDeployEC2ServiceRole at A6 for cloudwatch
resource "aws_iam_role_policy_attachment" "cloudWatchpolicy_attach_EC2ServiceRole" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  role       = "CodeDeployEC2ServiceRole"
}
//A7
resource "aws_iam_role_policy_attachment" "SNSTopicPolicy" {
  policy_arn = aws_iam_policy.SNS_policy.arn
  role       = "CodeDeployEC2ServiceRole"
}

resource "aws_iam_role_policy_attachment" "AmazonDynamoDBFullAccesswithEC2" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = "CodeDeployEC2ServiceRole"
}

#Creating EC2 instance profile
resource "aws_iam_instance_profile" "EC2Profile" {
  name = "EC2Profile"
  role = "CodeDeployEC2ServiceRole"
}

//A7 lambdaRole
resource "aws_iam_role" "lambdaRole" {
  name = "lambdaRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "AmazonSESFullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
  role       = aws_iam_role.lambdaRole.name
}
resource "aws_iam_role_policy_attachment" "AWSLambdaBasicExecutionRole" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambdaRole.name
}
resource "aws_iam_role_policy_attachment" "AmazonDynamoDBFullAccess" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role       = aws_iam_role.lambdaRole.name
}