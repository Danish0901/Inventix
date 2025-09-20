# Use lightweight JDK 21 image
FROM eclipse-temurin:21-jdk

# Set timezone (system + JVM level)
ENV TZ=Asia/Kolkata

# Set working directory
WORKDIR /app

# Copy the built JAR
COPY ./target/Inventix.jar app.jar

# Expose your app port
EXPOSE 5050

# Run Spring Boot with timezone set
ENTRYPOINT ["java", "-Duser.timezone=Asia/Kolkata", "-jar", "app.jar"]
