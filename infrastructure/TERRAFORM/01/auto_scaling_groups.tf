resource "aws_autoscaling_group" "asg1" {
  name                      = "asg1"
  max_size                  = 5
  min_size                  = 3
  health_check_grace_period = 120
  health_check_type         = "EC2"
  desired_capacity          = 3
  force_delete              = true
  //placement_group           = aws_placement_group.test.id
  launch_configuration = aws_launch_configuration.as_conf.name
  vpc_zone_identifier  = [aws_subnet.subnet["us-east-1a"].id, aws_subnet.subnet["us-east-1b"].id, aws_subnet.subnet["us-east-1c"].id]
  default_cooldown     = 60
  target_group_arns    = [aws_lb_target_group.webapp-3000.arn]

  tag {
    key                 = "Name"
    value               = "custom_ec2"
    propagate_at_launch = true
  }


}

resource "aws_autoscaling_policy" "asg1_scaling_up_policy" {
  name                   = "asg1_scaling_up_policy"
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 60
  autoscaling_group_name = aws_autoscaling_group.asg1.name
  scaling_adjustment     = 1
}

resource "aws_autoscaling_policy" "asg1_scaling_down_policy" {
  name                   = "asg1_scaling_down_policy"
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 60
  autoscaling_group_name = aws_autoscaling_group.asg1.name
  scaling_adjustment     = -1
}

resource "aws_cloudwatch_metric_alarm" "cpu_usage_high" {
  alarm_name          = "cpu_usage_high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "60"
  statistic           = "Average"
  threshold           = "5"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.asg1.name
  }

  alarm_description = "This metric monitors ec2 cpu utilization is above 5%,scale-up"
  alarm_actions     = [aws_autoscaling_policy.asg1_scaling_up_policy.arn]
}

resource "aws_cloudwatch_metric_alarm" "cpu_usage_low" {
  alarm_name          = "cpu_usage_low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "60"
  statistic           = "Average"
  threshold           = "3"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.asg1.name
  }

  alarm_description = "This metric monitors ec2 cpu utilization is below 3%, scale-down"
  alarm_actions     = [aws_autoscaling_policy.asg1_scaling_down_policy.arn]
}