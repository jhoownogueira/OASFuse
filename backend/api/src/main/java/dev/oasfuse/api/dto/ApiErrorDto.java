package dev.oasfuse.api.dto;

import java.util.List;

public record ApiErrorDto(String code, String message, List<Detail> details, String requestId) {
  public record Detail(String field, String reason) {}
}
