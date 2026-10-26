package dev.oasfuse.api.services;

import dev.oasfuse.api.dto.ComparisonRequestDto;
import dev.oasfuse.core.application.ComparisonOptions;
import dev.oasfuse.core.application.SpecificationSource;
import dev.oasfuse.core.comparison.ComparisonEngine;
import dev.oasfuse.core.domain.ComparisonReport;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Semaphore;

@ApplicationScoped
public class ComparisonApplicationService {
  private static final Set<String> FAIL_ON = Set.of("breaking", "review", "never");
  private final ComparisonEngine engine = new ComparisonEngine();
  private final Semaphore concurrency =
      new Semaphore(Math.max(2, Runtime.getRuntime().availableProcessors()));

  public ComparisonReport compare(ComparisonRequestDto request) {
    ComparisonRequestDto.OptionsDto raw = request.options();
    String failOn = raw == null || raw.failOn() == null ? "breaking" : raw.failOn();
    if (!FAIL_ON.contains(failOn))
      throw new IllegalArgumentException("options.failOn must be breaking, review, or never.");
    if (!concurrency.tryAcquire()) throw new ComparisonCapacityException();
    try {
      return engine.compare(
          new SpecificationSource(request.baseline().fileName(), request.baseline().content()),
          new SpecificationSource(request.candidate().fileName(), request.candidate().content()),
          new ComparisonOptions(failOn, raw == null ? List.of() : raw.ignoreRules()));
    } finally {
      concurrency.release();
    }
  }

  public static final class ComparisonCapacityException extends RuntimeException {}
}
