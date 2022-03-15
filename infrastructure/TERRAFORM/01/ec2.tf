/* resource "aws_instance" "ec2_instance" {
  depends_on           = [aws_db_instance.mydb]
  ami                  = local.ec2_ami
  instance_type        = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.EC2Profile.name

  key_name               = var.aws_ec2_key_pair
  vpc_security_group_ids = [aws_security_group.app_security_group.id]
  subnet_id              = aws_subnet.subnet["us-east-1a"].id
  root_block_device {
    delete_on_termination = true
    volume_size           = local.ec2_volume_size
    volume_type           = local.ec2_volume_type
  }

  user_data = <<EOF
#!/bin/bash
sudo echo "{\"development\":{\"username\":\"${local.rds_username}\",\"password\":\"${local.rds_password}\",\"database\":\"${local.rds_name}\",\"host\":\"${aws_db_instance.mydb.address}\",\"dialect\":\"mysql\"}}" >> /home/ubuntu/config.json
sudo echo "AWS_REGION=us-east-1" >> /home/ubuntu/.env
sudo echo "AWS_BUCKET_NAME=${aws_s3_bucket.mybucket.bucket}" >> /home/ubuntu/.env
json='{"agent": {"metrics_collection_interval":10,"logfile":"/var/logs/amazon-cloudwatch-agent.log"},"metrics":{"metrics_collected":{"statsd":{"service_address":":8125","metrics_collection_interval":10,"metrics_aggregation_interval":10}}},"logs": {"logs_collected": {"files": {"collect_list": [{"file_path": "/home/ubuntu/instance.log","log_group_name": "csye6225","log_stream_name": "instance"}]}},"log_stream_name": "cloudwatch_log_stream"}}'
echo $json > /home/ubuntu/cloudwatch-config.json
sudo echo "cloudwatch agent is running when instance launched" >>/home/ubuntu/instance.log
chmod 777 /home/ubuntu/instance.log
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/cloudwatch-config.json -s
  EOF

  tags = {
    Name = "custom_ec2"
  }
} */


