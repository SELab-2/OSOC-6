# Back end

## Development

We use the [Spring framework](https://spring.io/) to implement our back end.

### plugins

#### CheckStyle

We use the checkstyle linter configured with the Sun configuration.
We added minimal suppresions, seen in `./config/checkstyle/suppresions.xml`.
This configuration doesn't allow us to shadow fields, because of this we will not use `this` to refer to a class field.

#### Lombok

We use project Lombok to write cleaner code. More precicelly we will be using the following annotations.
* [@NonNull](https://projectlombok.org/features/NonNull)
* [@Getter](https://projectlombok.org/features/GetterSetter)
* [@Setter](https://projectlombok.org/features/GetterSetter)
* [@ToString](https://projectlombok.org/features/ToString)
* [Constructor](https://projectlombok.org/features/constructor)
* [@Data](https://projectlombok.org/features/Data)
* [@Builder](https://projectlombok.org/features/Builder)

#### Jacoco

We use Jacococ to generate test coverage.
The report is created in `build/reports/jacoco/test/html` here you can find an `index.html` file.
There are a lot of options to open this file.
* Open it with your ide, that might help you render the web page.
* Call `npx serve` in the directory.