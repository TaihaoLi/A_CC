
//create new role  CodeDeployEC2ServiceRole for A5
resource "aws_iam_role" "CodeDeployEC2ServiceRole" {
  name = "CodeDeployEC2ServiceRole"

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

//for cd-ec2-s3 policy
resource "aws_iam_policy" "CodeDeploy-EC2-S3" {
  name        = "CodeDeploy-EC2-S3"
  description = "CodeDeploy-EC2-S3 access policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement":  [
        {
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Effect": "Allow",
            "Resource": [ 
                "arn:aws:s3:::codedeploy.${var.aws_profile}.taihaoli.me",
                "arn:aws:s3:::codedeploy.${var.aws_profile}.taihaoli.me/*"
            ]
        }
    ]
}
EOF
}

//for gh-upload-to-s3 policy
resource "aws_iam_policy" "GH-Upload-To-S3" {
  name        = "GH-Upload-To-S3"
  description = "GH-Upload-To-S3 access policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement":  [
        {
            "Action": [
                "s3:Get*",
                "s3:List*",
                "s3:PutObject"
            ],
            "Effect": "Allow",
            "Resource": [ 
                "arn:aws:s3:::codedeploy.${var.aws_profile}.taihaoli.me",
                "arn:aws:s3:::codedeploy.${var.aws_profile}.taihaoli.me/*"
            ]
        }
    ]
}
EOF
}

//for GH-Code-Deploy policy
resource "aws_iam_policy" "GH-Code-Deploy" {
  name        = "GH-Code-Deploy"
  description = "GH-Code-Deploy3 access policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:GetApplicationRevision"
      ],
      "Resource": [
        "arn:aws:codedeploy:${var.aws_region}:${var.account_id}:application:csye6225-webapp"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetDeployment"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:GetDeploymentConfig"
      ],
      "Resource": [
        "arn:aws:codedeploy:${var.aws_region}:${var.account_id}:deploymentconfig:CodeDeployDefault.OneAtATime",
        "arn:aws:codedeploy:${var.aws_region}:${var.account_id}:deploymentconfig:CodeDeployDefault.HalfAtATime",
        "arn:aws:codedeploy:${var.aws_region}:${var.account_id}:deploymentconfig:CodeDeployDefault.AllAtOnce"
      ]
    }
  ]
}
EOF
}



//attach  policy for CodeDeployEC2ServiceRole


resource "aws_iam_role_policy_attachment" "CodeDeploy-EC2-S3-attach-CodeDeployEC2ServiceRole" {
  role       = aws_iam_role.CodeDeployEC2ServiceRole.name
  policy_arn = aws_iam_policy.CodeDeploy-EC2-S3.arn
}





//attach for app user
resource "aws_iam_user_policy_attachment" "CodeDeploy-EC2-S3-attach" {
  user       = "ghactions-app"
  policy_arn = aws_iam_policy.CodeDeploy-EC2-S3.arn
}

resource "aws_iam_user_policy_attachment" "GH-Upload-To-S3-attach" {
  user       = "ghactions-app"
  policy_arn = aws_iam_policy.GH-Upload-To-S3.arn
}

resource "aws_iam_user_policy_attachment" "GH-Code-Deploy-attach" {
  user       = "ghactions-app"
  policy_arn = aws_iam_policy.GH-Code-Deploy.arn
}
//A7
resource "aws_iam_user_policy_attachment" "LambdaExecution-attachment" {
  user       = "ghactions-app"
  policy_arn = "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
}