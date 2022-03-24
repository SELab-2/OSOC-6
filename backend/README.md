# Back end

We use the [Spring framework](https://spring.io/) to implement our back end.

## Setup

### The Database

First, install PostgreSQL using the following command.
This will be the software used for the database.
```
sudo apt install postgresql
```
Next, we have to switch to the postgres user in our console.
```
sudo -u postgres psql
```
For security purposes, we need to change the password of our database user.
Run the following command and set up your new password.
```
\password
```
Now, we will create our database that will be used in our project.
Change 'dbname' to the desired name of the database.
```
CREATE DATABASE dbname;
```

### Java 17
For this project we will be using Java 17.
This is (at the time of writing) the latest LTS release of Java.
To install this, run the command below.
```
sudo apt-get install openjdk-17-jdk
```

### The Project

We assume you cloned the repository on your local machine.
If you did not please refer to [the root README](../README.md#installation) to close this repository.
We need to link our database with our project.
Go to `./src/main/resources`, here you will find a file named `application.properties.example`.
Open the file and change the username to postgres.
```
spring.datasource.username = postgres
```
Fill in the password you put in earlier in the following line.
```
spring.datasource.password = password
```
We now need to change the url to the right database.
Change `osoc-test` at the end of the file, to the name of the database you made earlier.
```
spring.datasource.url=jdbc:postgresql://localhost:5432/osoc-test
```
The final step, save this file and rename `application.properties.example` to `application.properties`.
Now you should be able to sync gradle and run the program.

You should be set up now.
If you want to run the program just run `./gradlew run bootRun`.
Your backend will be served on the base path `/api/`.

## Tests

To run the tests we use gradle.
You can run `./gradlew task test` to run the test.
A coverage report will be generated in `build/reports/jacoco/test/html`.
To run both the linter and the tests please run `./gradlew task check`.

## Plugins

### CheckStyle

We use the checkstyle linter configured with the Sun configuration.
We added minimal suppression, seen in `./config/checkstyle/suppresions.xml`.
This configuration doesn't allow us to shadow fields, because of this we will not use `this` to refer to a class field.

### Lombok

We use project Lombok to write cleaner code. More precisely we will be using the following annotations.
* [@NonNull](https://projectlombok.org/features/NonNull)
* [@Getter](https://projectlombok.org/features/GetterSetter)
* [@Setter](https://projectlombok.org/features/GetterSetter)
* [@ToString](https://projectlombok.org/features/ToString)
* [Constructor](https://projectlombok.org/features/constructor)
* [@Data](https://projectlombok.org/features/Data)
* [@Builder](https://projectlombok.org/features/Builder)

### Jacoco

We use Jacoco to generate test coverage.
The report is created in `build/reports/jacoco/test/html` here you can find an `index.html` file.
There are a lot of options to open this file.
* Open it with your ide, that might help you render the web page.
* Call `npx serve` in the directory.
* 