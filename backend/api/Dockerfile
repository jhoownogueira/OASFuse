FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY core/pom.xml core/pom.xml
COPY api/pom.xml api/pom.xml
COPY cli/pom.xml cli/pom.xml
COPY core/src core/src
COPY api/src api/src
COPY cli/src cli/src
RUN mvn -B -pl api -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S oasfuse \
    && adduser -S -G oasfuse -u 10001 oasfuse
COPY --from=build --chown=oasfuse:oasfuse /workspace/api/target/quarkus-app/lib/ ./lib/
COPY --from=build --chown=oasfuse:oasfuse /workspace/api/target/quarkus-app/*.jar ./
COPY --from=build --chown=oasfuse:oasfuse /workspace/api/target/quarkus-app/app/ ./app/
COPY --from=build --chown=oasfuse:oasfuse /workspace/api/target/quarkus-app/quarkus/ ./quarkus/
USER oasfuse
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "quarkus-run.jar"]
