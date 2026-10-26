package dev.oasfuse.api.resources;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

@Path("/v1/rules")
@Produces(MediaType.APPLICATION_JSON)
public class RulesResource {
  @GET
  public List<Map<String, String>> rules() {
    return List.of(
        rule("operation.removed", "breaking"), rule("operation.added", "non-breaking"),
        rule("request.parameter.required_added", "breaking"),
            rule("request.parameter.optional_added", "non-breaking"),
        rule("request.property.required_added", "breaking"),
            rule("response.property.removed", "breaking"),
        rule("response.enum.value_added", "review"), rule("schema.composition.changed", "review"));
  }

  private Map<String, String> rule(String id, String severity) {
    return Map.of("id", id, "defaultSeverity", severity);
  }
}
