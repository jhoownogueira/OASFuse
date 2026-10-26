package dev.oasfuse.core.application;

import java.util.List;

public record ComparisonOptions(String failOn, List<String> ignoreRules) {
  public ComparisonOptions {
    failOn = failOn == null ? "breaking" : failOn;
    ignoreRules = ignoreRules == null ? List.of() : List.copyOf(ignoreRules);
  }
}
