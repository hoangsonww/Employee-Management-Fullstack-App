# Use Maven to build the application
FROM maven:3.8.6-openjdk-11 AS builder

# Set the working directory
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the entire project source
COPY src ./src

# Package the application
RUN mvn package -DskipTests

# Use a lightweight OpenJDK runtime for the final image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/target/employee-management-app-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

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
