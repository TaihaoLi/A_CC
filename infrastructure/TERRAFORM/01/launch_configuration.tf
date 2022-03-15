resource "aws_launch_configuration" "as_conf" {
  name                        = "asg_launch_config"
  image_id                    = local.ec2_ami
  instance_type               = "t2.micro"
  iam_instance_profile        = aws_iam_instance_profile.EC2Profile.name
  key_name                    = var.aws_ec2_key_pair
  security_groups             = [aws_security_group.ec2_security_group.id]
  associate_public_ip_address = true
   root_block_device {
    volume_type           = "gp2"
    volume_size           = 8
    delete_on_termination = true
    encrypted             = true



  } 
  user_data = <<EOF
#!/bin/bash
jsonzero='{"development":{"dialect":"mysql","dialectOptions":{"ssl":"Amazon RDS"},"port":3306,"database":"${local.rds_name}","replication":{"read":[{"host":"${aws_db_instance.mydb_read_replica.address}","username":"${local.rds_username}","password":"${local.rds_password}"}],"write":{"host":"${aws_db_instance.mydb.address}","username":"${local.rds_username}","password":"${local.rds_password}"}}}}'
echo $jsonzero > /home/ubuntu/config.json
sudo echo "AWS_REGION=us-east-1" >> /home/ubuntu/.env
sudo echo "AWS_BUCKET_NAME=${aws_s3_bucket.mybucket.bucket}" >> /home/ubuntu/.env
sudo echo "AWS_SNS=${aws_sns_topic.default.arn}" >> /home/ubuntu/.env
json='{"agent": {"metrics_collection_interval":10,"logfile":"/var/logs/amazon-cloudwatch-agent.log"},"metrics":{"metrics_collected":{"statsd":{"service_address":":8125","metrics_collection_interval":10,"metrics_aggregation_interval":10}}},"logs": {"logs_collected": {"files": {"collect_list": [{"file_path": "/home/ubuntu/instance.log","log_group_name": "csye6225","log_stream_name": "instance"}]}},"log_stream_name": "cloudwatch_log_stream"}}'
echo $json > /home/ubuntu/cloudwatch-config.json
sudo echo "cloudwatch agent is running when instance launched" >>/home/ubuntu/instance.log
chmod 777 /home/ubuntu/instance.log
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/cloudwatch-config.json -s
  EOF
}