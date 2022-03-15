# webapp

This is for assignment 1

sequelize model:generate --name Test --attributes verified:boolean
used to create table

To run this application,you should do follow things

1.cd Server

2.npm install

3.sequelize db:migrate(this command aims to create database user table,you can change it at a file under migrations,you also should change config as your own database config )

4.npm start

5.test api

Create user:POST localhost:3000/user get Token

login:Post localhost:3000/user/logIn  get Token

get user info:GET localhost:3000/user/self ps:add Token at head

update user:PUT localhost:3000/user/self ps:add Token at head

# webapp CI/CD 

github actions

require dev accout DEV_AWS_ACCESS_KEY_ID and DEV_AWS_ACCESS_KEY and DEV_S3_CODEDEPLOY_BUCKET

and prod account as well

remember change v1 to v2 and test file

# A6 jmeter test

cd /Users/litaihao/Desktop/csye6225fork/apache-jmeter-5.4.1/bin

sh jmeter.sh

test5

# A6 DEMO Steps

1.ami-infrastructure terraform apply -var-file prod.tfvars

2.build ami by ghaction

3.change ami_id at infrastructure repo

4 app-cicd terraform apply -var-file prod.tfvars

5.infrastructure terraform apply -var-file prod.tfvars

6.code cicd

7.watch log and target group

8.demo

9 cd /Users/litaihao/Desktop/csye6225fork/apache-jmeter-5.4.1/bin

10.sh jmeter.sh

update3

# A8 connect to DB with ssl (manual))

sudo mkdir -p /var/mysql-certs/
cd /var/mysql-certs/
sudo curl -O https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
sudo DEBIAN_FRONTEND=noninteractive apt-get install -qy --no-install-recommends mysql-server
mysql -h terraform-20211208022001438400000009.cbh6lucdppty.us-east-1.rds.amazonaws.com --ssl-ca=/var/mysql-certs/rds-combined-ca-bundle.pem --ssl-mode=VERIFY_IDENTITY -u csye6225 -P 3306 -p





