package dev.oasfuse.core.comparison;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import dev.oasfuse.core.application.ComparisonOptions;
import dev.oasfuse.core.application.SpecificationSource;
import dev.oasfuse.core.domain.ComparisonReport;
import dev.oasfuse.core.parser.InvalidSpecificationException;
import java.util.List;
import org.junit.jupiter.api.Test;

class ComparisonEngineTest {
  private final ComparisonEngine engine = new ComparisonEngine();

  @Test
  void identicalSpecificationsHaveNoFindings() {
    ComparisonReport report =
        compare(spec("/users", "integer", true), spec("/users", "integer", true));
    assertEquals(0, report.summary().total());
    assertFalse(report.summary().shouldFail());
  }

  @Test
  void removedOperationIsBreaking() {
    ComparisonReport report =
        compare(spec("/users", "integer", true), spec("/health", "integer", true));
    assertTrue(
        report.findings().stream()
            .anyMatch(
                f -> f.ruleId().equals("operation.removed") && f.severity().equals("breaking")));
    assertTrue(report.summary().shouldFail());
  }

  @Test
  void responsePropertyRemovalAndTypeChangeAreBreaking() {
    ComparisonReport report =
        compare(spec("/users", "integer", true), spec("/users", "string", false));
    assertTrue(
        report.findings().stream().anyMatch(f -> f.ruleId().equals("response.type.changed")));
    assertTrue(
        report.findings().stream().anyMatch(f -> f.ruleId().equals("response.property.removed")));
  }

  @Test
  void optionalParameterAdditionIsNonBreaking() {
    String before = spec("/users", "integer", true);
    String after =
        before.replace(
            "responses:",
            "parameters:\n        - in: query\n          name: page\n          required: false\n          schema: { type: integer }\n      responses:");
    ComparisonReport report = compare(before, after);
    assertTrue(
        report.findings().stream()
            .anyMatch(
                f ->
                    f.ruleId().equals("request.parameter.optional_added")
                        && f.severity().equals("non-breaking")));
  }

  @Test
  void externalReferencesAreRejectedWithoutFetching() {
    String document =
        spec("/users", "integer", true)
            .replace("type: integer", "$ref: https://attacker.invalid/schema.yaml");
    assertThrows(InvalidSpecificationException.class, () -> compare(document, document));
  }

  @Test
  void keyOrderingDoesNotCreateFindings() {
    String before = spec("/users", "integer", true);
    String after =
        before.replace(
            "id:\n                type: integer\n              email:\n                type: string",
            "email:\n                type: string\n              id:\n                type: integer");
    assertEquals(0, compare(before, after).summary().total());
  }

  private ComparisonReport compare(String before, String after) {
    return engine.compare(
        new SpecificationSource("before.yaml", before),
        new SpecificationSource("after.yaml", after),
        new ComparisonOptions("breaking", List.of()));
  }

  private String spec(String path, String idType, boolean includeEmail) {
    return """
                openapi: 3.0.3
                info:
                  title: Test API
                  version: 1.0.0
                paths:
                  %s:
                    get:
                      responses:
                        "200":
                          description: OK
                          content:
                            application/json:
                              schema:
                                type: object
                                required: [id]
                                properties:
                                  id:
                                    type: %s
                %s
                """
        .formatted(
            path,
            idType,
            includeEmail ? "                  email:\n                    type: string" : "");
  }
}
