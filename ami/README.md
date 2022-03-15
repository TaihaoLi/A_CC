# ami

1.brew install packer

2.create "./buildAmi.sh" file

such as

```
#!/bin/bash

packer build \
    -var 'aws_access_key=youraccesskey' \
    -var 'aws_secret_key=yourskey' \
    -var 'aws_region=*' \
    -var 'instance_type=***' \
    -var 'subnet_id=**' \
    -var 'source_ami=**' \
    ami.json
```

then cd packer folder run "./buildAmi.sh"

3.cd into key folder

4.chmod 400 csye6225.pem

5.ssh -i "csye6225.pem" ubuntu@ec2-34-228-23-255.compute-1.amazonaws.com

6.exit to logout

# install mysql
1.sudo apt-get install mysql-server

if not running 

sudo service mysql start

2.sudo mysql_secure_installation

sudo mysql -u root -p

3.create user 'user'@'%' identified by '12345678';

4.grant all privileges on *.* to 'user'@'%';

5.flush privileges;

6.login by mysql -u user -p

show databases;

7.create database 6225webapp

8.exit

# install node

1.curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

2.sudo apt-get install -y nodejs

3.node -v

# install unzip

sudo apt install unzip

# deploy api
1.cd key

2.scp -i csye6225.pem webapp-main.zip ubuntu@ec2-54-242-49-8.compute-1.amazonaws.com:

copy file into ec2

unzip webapp-main.zip

3.cd and config database file

4.npm install

5.sudo npm install -g sequelize-cli

6.sequelize db:migrate

7.npm start

# update workflow

require AMI_ACCESSKEYID and AMI_ACCESSKEY

change subnet id


sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

# check if cloudwatch agent is running
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status

final test