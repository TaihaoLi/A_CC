#!/bin/bash
#give permission
sudo chmod -R 777 /home/ubuntu/web-app
#navigate into dir

data >> /home/ubuntu/log.txt



cd /home/ubuntu/web-app

cd /home/ubuntu
cp {config.json,.env} /home/ubuntu/web-app/Server/
cd /home/ubuntu/web-app/Server
sudo rm -rf ./config/config.json
cp config.json config/

npm install
sequelize db:migrate

ls -al /home/ubuntu/web-app/Server >> /home/ubuntu/log.txt

sudo echo "run start" >> /home/ubuntu/instance.log

#start at backgroup
nohup node server.js > /dev/null 2>&1 &






