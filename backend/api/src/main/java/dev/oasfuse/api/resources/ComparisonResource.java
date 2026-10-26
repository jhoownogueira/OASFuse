package dev.oasfuse.api.resources;

import dev.oasfuse.api.dto.ComparisonRequestDto;
import dev.oasfuse.api.services.ComparisonApplicationService;
import dev.oasfuse.core.domain.ComparisonReport;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/v1/comparisons")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ComparisonResource {
  private final ComparisonApplicationService service;

  public ComparisonResource(ComparisonApplicationService service) {
    this.service = service;
  }

  @POST
  public ComparisonReport compare(@Valid ComparisonRequestDto request) {
    return service.compare(request);
  }
}
