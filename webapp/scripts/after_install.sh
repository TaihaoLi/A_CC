#!/bin/bash

sudo echo "App installed" >>/home/ubuntu/instance.log
#restart cloudwatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/web-app/cloudwatch-config.json -s