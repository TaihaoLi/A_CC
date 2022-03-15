
//for gh-ec2-ami policy
resource "aws_iam_policy" "GH-EC2-AMI" {
  name        = "GH-EC2-AMI"
  description = "GH-EC2-AMI access policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement":  [
        {
            "Action": [
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CopyImage",
                "ec2:CreateImage",
                "ec2:CreateKeypair",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSnapshot",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:DeleteKeyPair",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSnapshot",
                "ec2:DeleteVolume",
                "ec2:DeregisterImage",
                "ec2:DescribeImageAttribute",
                "ec2:DescribeImages",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceStatus",
                "ec2:DescribeRegions",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSnapshots",
                "ec2:DescribeSubnets",
                "ec2:DescribeTags",
                "ec2:DescribeVolumes",
                "ec2:DetachVolume",
                "ec2:GetPasswordData",
                "ec2:ModifyImageAttribute",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifySnapshotAttribute",
                "ec2:RegisterImage",
                "ec2:RunInstances",
                "ec2:StopInstances",
                "ec2:TerminateInstances",
                "ec2:DescribeVpcs"
            ],
            "Effect": "Allow",
            "Resource": [ 
                "*"
            ]
        }
    ]
}
EOF
}


//attach for ami user
resource "aws_iam_user_policy_attachment" "GH-EC2-AMI-attach" {
  user       = "ghactions-ami"
  policy_arn = aws_iam_policy.GH-EC2-AMI.arn
}

