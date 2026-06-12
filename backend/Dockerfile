# Use Maven to build the application
FROM maven:3.8.6-openjdk-11 AS builder

# Set the working directory
WORKDIR /app

# Copy the pom.xml and pre-fetch dependencies into a cached layer.
#
# We deliberately do NOT use `mvn dependency:go-offline` here. The Yubico WebAuthn library's
# parent POM imports the Jackson BOM with a version RANGE (`jackson-bom:[2.13.2.1,3)`). go-offline
# eagerly resolves that range to the newest release (currently jackson-bom 2.22.0) and then tries
# to pre-download every module jar that BOM references — but jackson-core is only published up to
# 2.21.4, so `jackson-core:jar:2.22.0` is absent and the build fails. `dependency:resolve` instead
# downloads only the *mediated* graph, where our pinned jackson-bom (2.19.4) wins, so Jackson
# resolves to 2.19.4 and never touches the unpublished 2.22.0 jars. resolve-plugins caches the
# build plugins the same way go-offline did.
COPY pom.xml ./
RUN mvn -B dependency:resolve dependency:resolve-plugins

# Copy the entire project source
COPY src ./src

# Package the application
RUN mvn package -DskipTests

# Use a lightweight Eclipse Temurin JRE for the final image
FROM eclipse-temurin:11-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/target/employee-management-app-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application.
#
# The JVM flags below shrink cold-start time, which matters on hosts that spin the instance down
# after inactivity (e.g. Render's free tier) and pay a cold start on the next request:
#   -XX:TieredStopAtLevel=1     stop JIT at C1; skips slow C2 compilation we don't benefit from on
#                               a short-lived, low-traffic process, so startup is quicker.
#   -XX:+UseSerialGC            single-threaded GC with the smallest startup/footprint overhead,
#                               appropriate for a small heap on a free/shared instance.
#   -Dspring.main.lazy-initialization=true  defer bean creation until first use, so the context
#                                           comes up faster (first request to each bean is slightly
#                                           slower, which the frontend warm-up ping absorbs).
#   -Dspring.jmx.enabled=false  skip JMX bean export we don't use, trimming a little more startup.
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-XX:+UseSerialGC", "-Dspring.main.lazy-initialization=true", "-Dspring.jmx.enabled=false", "-jar", "app.jar"]

# Commands for building and running the Docker container:
#
# cd IdeaProjects/Employee-Management/backend
# (Fix the path to your project directory)
#
# docker build --platform linux/amd64 -t hoangsonw/employee-management-app .
# This builds the Docker image ready for Render deployment.
#
# docker run -p 8080:8080 \
  #  -e MYSQL_HOST=mysql-host \
  #  -e MYSQL_PORT=3306 \
  #  -e MYSQL_DB=your-db \
  #  -e MYSQL_USER=root \
  #  -e MYSQL_PASSWORD=your-password \
  #  hoangsonw/employee-management-app
# This runs the Docker container locally. Replace the environment variables with your own MySQL database details.
#
# docker push hoangsonw/employee-management-app
# This pushes the Docker image to Docker Hub.
