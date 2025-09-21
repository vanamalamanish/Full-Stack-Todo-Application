# Stage 1: Build React app
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY todo-frontend/todo-frontend/package*.json ./
RUN npm install
COPY todo-frontend/todo-frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend + copy React build
FROM maven:3.9.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app
COPY todo-backend/pom.xml .
COPY todo-backend/src ./src
# Copy React build into Spring Boot static resources
COPY --from=frontend-builder /app/build ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Run the app
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]