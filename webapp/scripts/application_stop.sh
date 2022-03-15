#!/bin/bash
#Stopping existing node servers
data >> /home/ubuntu/log.txt

echo "Stopping any existing node servers"
pkill node

sudo rm -rf /home/ubuntu/web-app/*

sudo echo "run stop" >> /home/ubuntu/instance.log
