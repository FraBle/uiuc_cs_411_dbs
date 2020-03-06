# Getting Started

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.2.4.RELEASE/maven-plugin/)
* [MyBatis Framework](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)

### Guides
The following guides illustrate how to use some features concretely:

* [MyBatis Quick Start](https://github.com/mybatis/spring-boot-starter/wiki/Quick-Start)

### Start the application
```mvn spring-boot:run```

* [Fetch all players with pagination and sort](http://localhost:8080/player?order=name&pageSize=10&page=1)
* [Fetch player by ID example](http://localhost:8080/player/467)

### Docker
- Build the image: `./mvnw spring-boot:build-image`
- Run the image: `docker run -it -p 8080:8080 nbastats:latest`
- Reference: https://spring.io/blog/2020/01/27/creating-docker-images-with-spring-boot-2-3-0-m1
