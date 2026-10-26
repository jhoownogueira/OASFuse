package dev.oasfuse.core.domain;

import java.util.List;
import java.util.Map;

public record ComparisonReport(
    String status,
    Summary summary,
    List<Finding> findings,
    List<String> warnings,
    Metadata metadata) {
  public record Summary(
      Map<String, Integer> countsBySeverity,
      Map<String, Integer> countsByCategory,
      int total,
      boolean shouldFail) {}

  public record Metadata(
      String engineVersion, String baselineOpenApiVersion, String candidateOpenApiVersion) {}
}
