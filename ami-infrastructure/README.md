# ami-infrastructure

create policy for ami-cicd user

terraform apply -var-file prod.tfvars
# DEMO Steps



1.pre-build AMI for demo by hand not cicd(remember change ami_id at local)

2.terraform apply

3.verify CI/CD workflow for webapp

4.demo and terminate the ec2 instance

5.run workflow of AMIs (built in prod account)

6.re-run terraform apply with new AMI(built in prod account)

7.Launch the EC2 instance with new AMI

8.Deploy the app on the new Ec2 using AWS console

CodeDeploy > Deployments > Select the last deployment > click on retry deployment

9.make code change by v1 to v2(remember change unit test api as well)