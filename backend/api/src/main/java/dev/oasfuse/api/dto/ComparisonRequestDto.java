package dev.oasfuse.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ComparisonRequestDto(
    @NotNull @Valid SpecificationDto baseline,
    @NotNull @Valid SpecificationDto candidate,
    OptionsDto options) {
  public record SpecificationDto(@NotBlank String fileName, @NotBlank String content) {}

  public record OptionsDto(String failOn, List<String> ignoreRules) {}
}
