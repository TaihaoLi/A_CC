#!/bin/bash

#create working directory if it donesn't exist
data >> /home/ubuntu/log.txt
sudo echo "run before install" >> /home/ubuntu/log.txt

DIR="/home/ubuntu/web-app"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} exists"
  mkdir ${DIR}
fi

