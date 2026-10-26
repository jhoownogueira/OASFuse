package dev.oasfuse.api.exception;

import dev.oasfuse.api.dto.ApiErrorDto;
import dev.oasfuse.api.services.ComparisonApplicationService.ComparisonCapacityException;
import dev.oasfuse.core.parser.InvalidSpecificationException;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.UUID;

@Provider
public class ApiExceptionMapper implements ExceptionMapper<Exception> {
  @Override
  public Response toResponse(Exception exception) {
    String requestId = UUID.randomUUID().toString();
    if (exception instanceof InvalidSpecificationException invalid)
      return response(422, "INVALID_OPENAPI_DOCUMENT", invalid.getMessage(), requestId);
    if (exception instanceof ConstraintViolationException)
      return response(400, "INVALID_REQUEST", "The comparison request is invalid.", requestId);
    if (exception instanceof IllegalArgumentException invalid)
      return response(400, "INVALID_REQUEST", invalid.getMessage(), requestId);
    if (exception instanceof ComparisonCapacityException)
      return response(
          429,
          "COMPARISON_CAPACITY_REACHED",
          "Too many comparisons are running. Try again shortly.",
          requestId);
    return response(500, "INTERNAL_ERROR", "The comparison could not be completed.", requestId);
  }

  private Response response(int status, String code, String message, String requestId) {
    return Response.status(status)
        .entity(new ApiErrorDto(code, message, List.of(), requestId))
        .build();
  }
}
