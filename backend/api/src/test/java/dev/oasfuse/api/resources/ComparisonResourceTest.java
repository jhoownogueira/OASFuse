package dev.oasfuse.api.resources;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

@QuarkusTest
class ComparisonResourceTest {
  private static final String BASE =
      "openapi: 3.0.3\ninfo: {title: Test, version: 1.0.0}\npaths:\n  /users:\n    get:\n      responses:\n        '200': {description: OK}";
  private static final String CANDIDATE =
      "openapi: 3.0.3\ninfo: {title: Test, version: 1.1.0}\npaths: {}";

  @Test
  void comparesRealDocuments() {
    given()
        .contentType("application/json")
        .body(request(BASE, CANDIDATE))
        .when()
        .post("/v1/comparisons")
        .then()
        .statusCode(200)
        .body("summary.countsBySeverity.breaking", greaterThan(0))
        .body("findings[0].ruleId", equalTo("operation.removed"));
  }

  @Test
  void returnsSafeErrorForExternalReference() {
    given()
        .contentType("application/json")
        .body(
            request(
                BASE, BASE + "\ncomponents: {schemas: {A: {$ref: 'https://example.invalid/a'}}}"))
        .when()
        .post("/v1/comparisons")
        .then()
        .statusCode(422)
        .body("code", equalTo("INVALID_OPENAPI_DOCUMENT"));
  }

  @Test
  void healthIsAvailable() {
    given().when().get("/q/health/ready").then().statusCode(200);
  }

  private String request(String baseline, String candidate) {
    return "{\"baseline\":{\"fileName\":\"before.yaml\",\"content\":"
        + quote(baseline)
        + "},\"candidate\":{\"fileName\":\"after.yaml\",\"content\":"
        + quote(candidate)
        + "},\"options\":{\"failOn\":\"breaking\",\"ignoreRules\":[]}}";
  }

  private String quote(String value) {
    return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
  }
}
