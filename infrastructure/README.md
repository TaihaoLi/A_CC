# infrastructure

In order to deploy this infrastructure

1.set aws configure --profile

2.create and set terraform.tfvars

3.terraform fmt

4.terraform plan

5.terraform apply

# deploy app
0.change ec2_ami at locals.tf

terraform apply -var-file prod.tfvars

then connect instance

1.scp -i prodkey.pem webapp-A4test.zip ubuntu@ec2-3-86-115-182.compute-1.amazonaws.com:

2.unzip webapp-A4.zip

3.cp {config.json,.env} webapp-A4/Server/

4.cd Server

5.npm install

6.sudo npm install -g sequelize-cli

7.mkdir config

8.cp config.json config/

9.sequelize db:migrate

10.npm start

# A8
import certificate command line
aws acm import-certificate --certificate fileb://prod_taihaoli_me.crt \
      --certificate-chain fileb://prod_taihaoli_me.ca-bundle \
      --private-key fileb://PK.txt 

update sequelize config.json add to security Database Connections
{
    host: 'xxxxx.xxxxxxxxxxxx.region.rds.amazonaws.com',
    dialect: 'mysql',
    dialectOptions: {
        ssl: 'Amazon RDS'
    },
    .......
}
