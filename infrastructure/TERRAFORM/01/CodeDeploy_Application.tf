//for CodeDeploy app
resource "aws_codedeploy_app" "csye6225-webapp" {
  compute_platform = "Server"
  //warn : this name is related to a policy at app-cicd,dont change if no necessary
  name = "csye6225-webapp"
}

// create CodeDeployServiceRole
resource "aws_iam_role" "CodeDeployServiceRole" {
  name = "CodeDeployServiceRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

//attach policy for role
resource "aws_iam_role_policy_attachment" "AWSCodeDeployRole" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = aws_iam_role.CodeDeployServiceRole.name
}

//trigger topic for codedeploy_deployment_group
resource "aws_sns_topic" "example" {
  name = "example-topic"
}

//codedeploy_deployment_group
resource "aws_codedeploy_deployment_group" "csye6225-webapp-deployment" {
  app_name              = aws_codedeploy_app.csye6225-webapp.name
  deployment_group_name = "csye6225-webapp-deployment"
  service_role_arn      = aws_iam_role.CodeDeployServiceRole.arn
  autoscaling_groups    = [aws_autoscaling_group.asg1.id]

  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "custom_ec2"
    }
  }

  trigger_configuration {
    trigger_events     = ["DeploymentFailure"]
    trigger_name       = "example-trigger"
    trigger_target_arn = aws_sns_topic.example.arn
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  alarm_configuration {
    alarms  = ["my-alarm-name"]
    enabled = true
  }
}