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
If you did not please refer to [the root README](../README.md#installation) to clone this repository.
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
You will also need to create an api token. You can do this by using the `crypto.randomUUID()` function in the browser 
(see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID). Once you have your api token, replace the 
placeholder in `application.properties.example` with it.
```
webhook.token=your_secret_token_here
```

Next, you'll need to configure the email settings needed to send password reset mails automatically. 
In this guide, we will be using gmail for sending the automatic mails (other mail servers can also be used, you will need to change the `spring.mail.host` property in application.properties to the used smtp host). 

First, create a new [Google account](https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp) (or use an existing one).
Replace the placeholder username with your email.
```
spring.mail.username=your_mail_here
```
Then, follow [this guide](https://support.google.com/accounts/answer/185833?hl=en) to set up an app password. Copy the password and replace the placeholder password with it.
```
spring.mail.password=application_password_here
```

To make sure that the forgot password mail contains a url to the website, 
you will need to replace the following placeholder with your base domain (for example the base domain of google is google.com).
```
domain=domain.com
```

The final step, save this file and rename `application.properties.example` to `application.properties`.

In the same `./src/main/resources` folder you'll also find a file named `initial-user.properties.example`.
Open the file and set the email and password of the base admin user.
This is the base user that will be created upon running the program for the first time.
The same user will also be created/reset when you restart the program and there are no enabled admin users remaining.
This is to make sure you don't lock yourself out of the application.

Now save this file and rename `initial-user.properties.example` to `initial-user.properties`.

Now you should be able to sync gradle and run the program.

You should be set up now.
If you want to run the program just run `./gradlew task build && ./gradlew task bootRun`.
Your backend will be served on the base path `/api/`.

### Tally webhook

To configure automatic Tally form submissions, first go to your tally form. There, go
to the `Integrations` tab and click `Connect` next to `Webhooks`. If your server domain is for example `test.com`,
then fill in the following for endpoint URL, replacing `your_token_here` with the api token you generated earlier:
```
https://test.com/api/webhook?token=your_token_here&edition=edition_name_here
```

Later, once you have created an edition, replace `edition_name_here` with the name of the edition.
Replacing spaces in the name with `%20`. `My edition` becomes `My%20edition`
This allows you to have multiple forms, each linked to a different edition.

Because the ids of the questions from the tally form differ for each owner of the form, you will need to fill these in yourself.
In `./src/main/resources/tally-ids.properties.example` you can find all of the question names that need to be mapped to their ids. 
Just above each mapping you can find the full question. In this file all occurences of `question_id_here` will need to be replaced with the corresponding question id.
You can get these ids by going to the webhook integration on your tally form and sending a test request. Then you should be able to see the following json (with different values):
```json
{
  "eventId": "eb3e6aee-c64f-4e23-a39d-bbbd4018145a",
  "eventType": "FORM_RESPONSE",
  "createdAt": "2022-04-11T12:52:28.736Z",
  "data": {
    "responseId": "mR2o8P",
    "submissionId": "mR2o8P",
    "respondentId": "mexYPe",
    "formId": "wMBOEn",
    "formName": "(UGent) #osoc22 student application form",
    "createdAt": "2022-04-11T12:52:28.000Z",
    "fields": [
      {
        "key": "question_wAveXB",
        "label": "Will you live in Belgium in July 2022?*",
        "type": "MULTIPLE_CHOICE",
        "value": "3095d1bf-41ba-42eb-a12c-d53b8ba242ea",
        "options": [
          {
            "id": "3095d1bf-41ba-42eb-a12c-d53b8ba242ea",
            "text": "Yes"
          },
          {
            "id": "b456ab1d-3c73-4fc2-b56f-903690878239",
            "text": "No"
          }
        ]
      },
      ...
```

The fields section is the important part here. This section contains all questions and their corresponding keys. 
For each question that is defined in the `tally-ids.properties.example` file you will need to look up the corresponding key, copy it and place it in the file.
An example:

In `tally-ids.properties.example`:
```
# Are you able to work 128 hours with a student employment agreement, or as a volunteer?.
tally.ids.WORK_TYPE=question_id_here
```

From the json above, we see that this question has id `question_wAveXB`, so we replace the placeholder with this id:
```
# Are you able to work 128 hours with a student employment agreement, or as a volunteer?.
tally.ids.WORK_TYPE=question_wAveXB
```


## Developers

We use the Java Spring Framework and within this framework we use
[Data Rest](https://docs.spring.io/spring-data/rest/docs/current/reference/html/).
This allows us to export our entities in a RESTful manner without many problems.
Spring data Rest can feel like magic at times though.
In this paragraph we aim to give you an overview of some annotations we use and how they work together.
Some of the annotations we use are dependent on our persistence layer being driven by postgres.

### Entity annotations

```java
@Column(columnDefinition = "text")
```
Allows us to use postgres text fields. These are fields that contain plain text and are not restricted by size.

```java
@OneToMany(cascade = {CascadeType.REMOVE})
```
Makes sure the remove operation is cascaded to the linked entity.
Many Cascade types are available and can be used together. 

```java
@JsonIgnore @RestResource(exported = false)
```
A field with this annotation will not be exported to the JSON representation of the entity.

```java
@ReadOnlyProperty
```
Fields with this annotation will not be altered when asked.
Altering the field will NOT throw an exception, it will just be ignored.

```java
@JoinColumn(name = "student_id", referencedColumnName = "id")
```
This annotation makes sure related entities are correctly linked.
The strings provided to this entity are the columns of the field in the persistence layer.

All string fields we use are non-optional in the persistence layer.
When they are semantically optional, we provide a default value, mostly the empty string.  

### Repository annotations

This is where the magic begins.
With Spring Data Rest there is no need to write complex services, controllers and repositories.
You just add a few annotations to construct yourself a secured endpoint.

```java
@PreAuthorize
```
An annotation that allows you to implement authentication for your repository.
Within the annotation you use the [Spring Expression Language (SpEL)](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html)
SpEL allows you to use things like `authentication.principal` which refers to the userDetails of the authenticated user.
You can access any bean from within your SpEL by using the `@` operator like `@spelUtil`.
You can also reference your arguments using the `#` operator like `#email`.

```java
@RepositoryRestResource(collectionResourceRel = "/appel", path = "/appel")
```
This annotation tells Spring to host the endpoints on the path `/appel`.
It enables all basic endpoint operations like: get all, get by id, save (POST/PATCH), delete, ...

You can also create your own search endpoints, like for example `findByEmail`.
Spring will know what this means and create the endpoint for you.
In addition, you can still create custom endpoints if you want with the `@Query` annotation.

```java
@Query(value= "someJPQLQuery")
```
This annotation will allow u to write a custom query using Java Persistence Query Language (JPQL), a part of
[the Java Persistence API (JPA)](https://docs.spring.io/spring-integration/reference/html/jpa.html).
The [BNF form](https://en.wikibooks.org/wiki/Java_Persistence/JPQL_BNF) of JPQL is also available.
JPQL helps you write queries without having to worry about how to join tables.
JPQL also makes sure Spring and your persistence layer are not tightly coupled.
With JPQL you have a lot of expressive power but the syntax can be painful.

* Place the `@Param(paramName)` annotation before a parameter of your repository function to be able to access it within the Query annotation by using `:paramName`.
* Use the `:#{}` syntax to write SpEL within the curly-braces.

```java
@Query(value= "someNativeQuery", native = true)
```
Allows you to write a query native to your persistence layer, postgres in our case.
Using a native query you can often write more powerful queries. This is however at the expense of the independency from your persistence layer.
You should try to avoid using native queries.
From within a native query you can also use the `:` and `:#{}` syntax.

### Webhook

Should the tally form ever get new questions or get recreated, you will need to update/add/remove some parts of the 
`QuestionKey` enum and update/add/remove the corresponding properties in `./src/main/resources/tally-ids.properties`. To test whether your changes work on your local machine, you have two options:

* Use the provided tests in `WebhookEndpointTests`. You can easily replace the testfiles in the `./src/test/resources/testdata`
directory and then load them in the mentioned test file. To acquire the testdata, first add a webhook to the tally form 
(does not have to be a valid one). Next, fill in and submit the form. Now you can go to the events log of the webhook in 
tally. Here the request body can be copied and placed in your .json test file.
* Use https://my.webhookrelay.com. This service allows you to take incoming requests and send them to your localhost 
server. You will need to install a command line tool to get this working. Their website provides a tutorial on the 
complete setup. The only downside is that you are limited to 150 requests per month.

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
