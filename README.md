# OSOC-6

## Setup

#### The Database
First, install postgresql using the following command. This will be the software used for the database.
```
sudo apt install postgresql
```
Next, we have to switch to the postgres user in our console.
```
sudo -u postgres psql
```
For security purposes, we need to change the password of our database user. Run the following command and set up your new password.
```
\password
```
Now, we will create our database that will be used in our project. Change 'dbname' to the desired name of the database.
```
CREATE DATABASE dbname;
```

#### Java 17
For this project we will be using Java 17, as this is the latest LTS release of Java. To install this, run the command below.
```
sudo apt-get install openjdk-17-jdk
```

#### The Project
Last but not least, we need to pull this project from Github. The easiest way is by just cloning the repository over https, but this might not work.
```
git clone https://github.com/SELab-2/OSOC-6.git
```
To fix this, we will need to clone via SSH. Go to your account settings (https://github.com/settings/keys) and add your public ssh key (`~/.ssh/id_rsa.pub`).
Now we can use the following command to clone the repository.
```
git clone git@github.com:SELab-2/OSOC-6.git
```

Now that we have cloned the repository, the last thing we need to do link our database with our project.
Go to `./src/main/resources`, here you will find a file named `application.properties.example`.
Open the file and change the username to postgres.
```
spring.datasource.username = postgres
```
Fill in the password you put in earlier in the following line.
```
spring.datasource.password = password
```
We now need to change the url to the right database. Change `osoc-test` at the end of the file, to the name of the database you made earlier.
```
spring.datasource.url=jdbc:postgresql://localhost:5432/osoc-test
```
The final step, save this file and rename `application.properties.example` to `application.properties`. Now you should be able to sync gradle and run the program.
