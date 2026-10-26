package dev.oasfuse.core.comparison;

import com.fasterxml.jackson.databind.JsonNode;
import dev.oasfuse.core.application.ComparisonOptions;
import dev.oasfuse.core.application.SpecificationSource;
import dev.oasfuse.core.domain.ComparisonReport;
import dev.oasfuse.core.domain.Finding;
import dev.oasfuse.core.domain.Severity;
import dev.oasfuse.core.parser.ParsedSpecification;
import dev.oasfuse.core.parser.SecureOpenApiParser;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public final class ComparisonEngine {
  private static final Set<String> METHODS =
      Set.of("get", "put", "post", "delete", "options", "head", "patch", "trace");
  private final SecureOpenApiParser parser;

  public ComparisonEngine() {
    this(new SecureOpenApiParser());
  }

  public ComparisonEngine(SecureOpenApiParser parser) {
    this.parser = parser;
  }

  public ComparisonReport compare(
      SpecificationSource baselineSource,
      SpecificationSource candidateSource,
      ComparisonOptions options) {
    ParsedSpecification baseline =
        parser.parse(baselineSource.fileName(), baselineSource.content());
    ParsedSpecification candidate =
        parser.parse(candidateSource.fileName(), candidateSource.content());
    List<Finding> all = new ArrayList<>();
    compareOperations(baseline.root(), candidate.root(), all);

    List<Finding> findings =
        all.stream()
            .filter(finding -> !options.ignoreRules().contains(finding.ruleId()))
            .sorted(
                Comparator.comparing(Finding::location)
                    .thenComparing(Finding::ruleId)
                    .thenComparing(Finding::id))
            .toList();
    List<String> warnings =
        options.ignoreRules().isEmpty()
            ? List.of()
            : List.of("Ignored rules: " + String.join(", ", options.ignoreRules()));

    Map<String, Integer> bySeverity = new LinkedHashMap<>();
    bySeverity.put("breaking", count(findings, "breaking"));
    bySeverity.put("non-breaking", count(findings, "non-breaking"));
    bySeverity.put("review", count(findings, "review"));
    Map<String, Integer> byCategory = new LinkedHashMap<>();
    byCategory.put(
        "compatibility",
        (int) findings.stream().filter(f -> f.category().equals("compatibility")).count());
    byCategory.put(
        "documentation",
        (int) findings.stream().filter(f -> f.category().equals("documentation")).count());
    boolean shouldFail = shouldFail(findings, options.failOn());

    return new ComparisonReport(
        "completed",
        new ComparisonReport.Summary(bySeverity, byCategory, findings.size(), shouldFail),
        findings,
        warnings,
        new ComparisonReport.Metadata(
            "0.1.0", baseline.openApiVersion(), candidate.openApiVersion()));
  }

  private void compareOperations(JsonNode baseline, JsonNode candidate, List<Finding> out) {
    Map<OperationKey, JsonNode> before = operations(baseline);
    Map<OperationKey, JsonNode> after = operations(candidate);
    Set<OperationKey> keys = new TreeSet<>(before.keySet());
    keys.addAll(after.keySet());
    for (OperationKey key : keys) {
      JsonNode left = before.get(key);
      JsonNode right = after.get(key);
      String location = operationLocation(key);
      if (left == null) {
        out.add(
            finding(
                "operation.added",
                Severity.NON_BREAKING,
                key,
                location,
                "Operation added",
                key.method.toUpperCase() + " " + key.path + " was added.",
                "Existing client requests are unaffected by an additive operation.",
                "absent",
                "present"));
        continue;
      }
      if (right == null) {
        out.add(
            finding(
                "operation.removed",
                Severity.BREAKING,
                key,
                location,
                "Operation removed",
                key.method.toUpperCase() + " " + key.path + " was removed.",
                "Existing clients may still call this operation.",
                "present",
                "absent"));
        continue;
      }
      compareOperation(key, left, right, baseline, candidate, out);
    }
  }

  private void compareOperation(
      OperationKey key,
      JsonNode before,
      JsonNode after,
      JsonNode beforeRoot,
      JsonNode afterRoot,
      List<Finding> out) {
    String location = operationLocation(key);
    String beforeId = before.path("operationId").asText();
    String afterId = after.path("operationId").asText();
    if (!beforeId.equals(afterId) && !beforeId.isBlank() && !afterId.isBlank()) {
      out.add(
          finding(
              "operation.id_changed",
              Severity.REVIEW,
              key,
              location + "/operationId",
              "Operation identifier changed",
              "The operationId changed from " + beforeId + " to " + afterId + ".",
              "HTTP behavior may be unchanged, but generated SDK method names can change.",
              beforeId,
              afterId));
    }
    compareParameters(
        key,
        mergedParameters(beforeRoot, key, before),
        mergedParameters(afterRoot, key, after),
        out);
    compareRequestBody(
        key, before.path("requestBody"), after.path("requestBody"), beforeRoot, afterRoot, out);
    compareResponses(
        key, before.path("responses"), after.path("responses"), beforeRoot, afterRoot, out);
    compareDocumentation(key, before, after, out);
    if (!before.path("security").equals(after.path("security"))) {
      out.add(
          finding(
              "security.requirement.changed",
              Severity.REVIEW,
              key,
              location + "/security",
              "Security requirement changed",
              "The operation security requirement changed.",
              "Authentication changes require application context.",
              compact(before.path("security")),
              compact(after.path("security"))));
    }
  }

  private void compareParameters(
      OperationKey key,
      Map<String, JsonNode> before,
      Map<String, JsonNode> after,
      List<Finding> out) {
    Set<String> names = new TreeSet<>(before.keySet());
    names.addAll(after.keySet());
    for (String name : names) {
      JsonNode left = before.get(name);
      JsonNode right = after.get(name);
      String location = operationLocation(key) + "/parameters/" + pointer(name);
      if (left == null) {
        boolean required =
            right.path("required").asBoolean(false) || right.path("in").asText().equals("path");
        out.add(
            finding(
                required ? "request.parameter.required_added" : "request.parameter.optional_added",
                required ? Severity.BREAKING : Severity.NON_BREAKING,
                key,
                location,
                required ? "Required parameter added" : "Optional parameter added",
                "The " + name + " parameter was added.",
                required
                    ? "Existing requests do not provide this value."
                    : "Existing requests remain valid.",
                "absent",
                "present"));
      } else if (right == null) {
        out.add(
            finding(
                "request.parameter.removed",
                Severity.REVIEW,
                key,
                location,
                "Request parameter removed",
                "The " + name + " parameter is no longer declared.",
                "Servers may still depend on or reject the previously documented value.",
                "present",
                "absent"));
      } else {
        if (!left.path("required").asBoolean(false) && right.path("required").asBoolean(false)) {
          out.add(
              finding(
                  "request.parameter.optional_to_required",
                  Severity.BREAKING,
                  key,
                  location + "/required",
                  "Parameter became required",
                  "The " + name + " parameter changed from optional to required.",
                  "Existing requests may omit it.",
                  "optional",
                  "required"));
        }
        compareInputSchema(
            key,
            location + "/schema",
            left.path("schema"),
            right.path("schema"),
            null,
            null,
            out,
            name);
      }
    }
  }

  private void compareRequestBody(
      OperationKey key,
      JsonNode before,
      JsonNode after,
      JsonNode beforeRoot,
      JsonNode afterRoot,
      List<Finding> out) {
    String location = operationLocation(key) + "/requestBody";
    if ((!before.isObject() || !before.path("required").asBoolean(false))
        && after.path("required").asBoolean(false)) {
      out.add(
          finding(
              "request.body.required_added",
              Severity.BREAKING,
              key,
              location,
              "Required request body added",
              "The operation now requires a request body.",
              "Existing requests may send no body.",
              "optional or absent",
              "required"));
    }
    JsonNode left = mediaSchema(beforeRoot, before);
    JsonNode right = mediaSchema(afterRoot, after);
    if (!left.isMissingNode() && !right.isMissingNode())
      compareObjectSchema(
          key,
          location + "/content",
          left,
          right,
          beforeRoot,
          afterRoot,
          Direction.REQUEST,
          out,
          new HashSet<>());
  }

  private void compareResponses(
      OperationKey key,
      JsonNode before,
      JsonNode after,
      JsonNode beforeRoot,
      JsonNode afterRoot,
      List<Finding> out) {
    Set<String> statuses = new TreeSet<>();
    before.fieldNames().forEachRemaining(statuses::add);
    after.fieldNames().forEachRemaining(statuses::add);
    for (String status : statuses) {
      JsonNode left = before.path(status);
      JsonNode right = after.path(status);
      String location = operationLocation(key) + "/responses/" + pointer(status);
      if (!left.isMissingNode()
          && right.isMissingNode()
          && (status.startsWith("2") || status.equals("default"))) {
        out.add(
            finding(
                "response.status.removed",
                Severity.REVIEW,
                key,
                location,
                "Response status removed",
                "The " + status + " response is no longer documented.",
                "Consumers may rely on this response contract.",
                "present",
                "absent"));
        continue;
      }
      if (!left.isMissingNode() && !right.isMissingNode()) {
        JsonNode leftSchema = mediaSchema(beforeRoot, left);
        JsonNode rightSchema = mediaSchema(afterRoot, right);
        if (!leftSchema.isMissingNode() && !rightSchema.isMissingNode())
          compareObjectSchema(
              key,
              location + "/content",
              leftSchema,
              rightSchema,
              beforeRoot,
              afterRoot,
              Direction.RESPONSE,
              out,
              new HashSet<>());
      }
    }
  }

  private void compareObjectSchema(
      OperationKey key,
      String location,
      JsonNode before,
      JsonNode after,
      JsonNode beforeRoot,
      JsonNode afterRoot,
      Direction direction,
      List<Finding> out,
      Set<String> visited) {
    before = resolve(beforeRoot, before, visited);
    after = resolve(afterRoot, after, visited);
    if (before.isMissingNode() || after.isMissingNode()) return;
    if (before.has("oneOf")
        || before.has("anyOf")
        || before.has("allOf")
        || after.has("oneOf")
        || after.has("anyOf")
        || after.has("allOf")) {
      if (!before.equals(after))
        out.add(
            finding(
                "schema.composition.changed",
                Severity.REVIEW,
                key,
                location,
                "Schema composition changed",
                "A oneOf, anyOf, or allOf expression changed.",
                "Composition changes require contextual review.",
                compact(before),
                compact(after)));
      return;
    }
    String leftType = effectiveType(before), rightType = effectiveType(after);
    if (!leftType.equals(rightType) && !leftType.isBlank() && !rightType.isBlank()) {
      String rule =
          direction == Direction.REQUEST ? "request.type.changed" : "response.type.changed";
      out.add(
          finding(
              rule,
              Severity.BREAKING,
              key,
              location + "/type",
              direction == Direction.REQUEST ? "Request type changed" : "Response type changed",
              "Schema type changed from " + leftType + " to " + rightType + ".",
              "Existing consumers may serialize or deserialize a different type.",
              leftType,
              rightType));
      return;
    }
    compareEnums(key, location, before.path("enum"), after.path("enum"), direction, out);
    JsonNode leftProps = before.path("properties"), rightProps = after.path("properties");
    Set<String> names = new TreeSet<>();
    leftProps.fieldNames().forEachRemaining(names::add);
    rightProps.fieldNames().forEachRemaining(names::add);
    Set<String> leftRequired = strings(before.path("required")),
        rightRequired = strings(after.path("required"));
    for (String name : names) {
      JsonNode left = leftProps.path(name), right = rightProps.path(name);
      boolean leftVisible = visible(left, direction), rightVisible = visible(right, direction);
      String propertyLocation = location + "/properties/" + pointer(name);
      if ((!leftVisible || left.isMissingNode())
          && rightVisible
          && !right.isMissingNode()
          && direction == Direction.REQUEST) {
        boolean required = rightRequired.contains(name);
        out.add(
            finding(
                required ? "request.property.required_added" : "request.property.optional_added",
                required ? Severity.BREAKING : Severity.NON_BREAKING,
                key,
                propertyLocation,
                required ? "Required request property added" : "Optional request property added",
                "Request property " + name + " was added.",
                required
                    ? "Existing clients do not send this required value."
                    : "Existing request bodies remain valid.",
                "absent",
                "present"));
      } else if (leftVisible
          && !left.isMissingNode()
          && (!rightVisible || right.isMissingNode())
          && direction == Direction.RESPONSE) {
        out.add(
            finding(
                "response.property.removed",
                Severity.BREAKING,
                key,
                propertyLocation,
                "Response property removed",
                "Response property " + name + " was removed.",
                "Existing clients may deserialize or read this property.",
                "present",
                "absent"));
      } else if (leftVisible && rightVisible && !left.isMissingNode() && !right.isMissingNode()) {
        if (direction == Direction.RESPONSE
            && leftRequired.contains(name)
            && !rightRequired.contains(name))
          out.add(
              finding(
                  "response.property.required_to_optional",
                  Severity.BREAKING,
                  key,
                  propertyLocation + "/required",
                  "Response property is no longer guaranteed",
                  "Response property " + name + " changed from required to optional.",
                  "Clients may assume the property is always present.",
                  "required",
                  "optional"));
        if (direction == Direction.REQUEST
            && !leftRequired.contains(name)
            && rightRequired.contains(name))
          out.add(
              finding(
                  "request.property.required_added",
                  Severity.BREAKING,
                  key,
                  propertyLocation + "/required",
                  "Request property became required",
                  "Request property " + name + " changed from optional to required.",
                  "Existing request bodies may omit it.",
                  "optional",
                  "required"));
        compareObjectSchema(
            key,
            propertyLocation,
            left,
            right,
            beforeRoot,
            afterRoot,
            direction,
            out,
            new HashSet<>(visited));
      }
    }
  }

  private void compareInputSchema(
      OperationKey key,
      String location,
      JsonNode before,
      JsonNode after,
      JsonNode beforeRoot,
      JsonNode afterRoot,
      List<Finding> out,
      String name) {
    String leftType = effectiveType(before), rightType = effectiveType(after);
    if (!leftType.equals(rightType) && !leftType.isBlank() && !rightType.isBlank())
      out.add(
          finding(
              "request.type.changed",
              Severity.BREAKING,
              key,
              location,
              "Request parameter type changed",
              "Parameter " + name + " changed from " + leftType + " to " + rightType + ".",
              "Existing clients serialize the previous type.",
              leftType,
              rightType));
    compareEnums(key, location, before.path("enum"), after.path("enum"), Direction.REQUEST, out);
  }

  private void compareEnums(
      OperationKey key,
      String location,
      JsonNode before,
      JsonNode after,
      Direction direction,
      List<Finding> out) {
    Set<String> left = strings(before), right = strings(after);
    Set<String> changed = new TreeSet<>(direction == Direction.REQUEST ? left : right);
    changed.removeAll(direction == Direction.REQUEST ? right : left);
    if (!changed.isEmpty()) {
      String rule =
          direction == Direction.REQUEST
              ? "request.enum.value_removed"
              : "response.enum.value_added";
      Severity severity = direction == Direction.REQUEST ? Severity.BREAKING : Severity.REVIEW;
      out.add(
          finding(
              rule,
              severity,
              key,
              location + "/enum",
              direction == Direction.REQUEST
                  ? "Accepted enum value removed"
                  : "Response enum value added",
              "Enum values changed: " + String.join(", ", changed) + ".",
              direction == Direction.REQUEST
                  ? "Existing clients may send a value that is no longer accepted."
                  : "Strict consumers may not handle a new response value.",
              String.join(", ", left),
              String.join(", ", right)));
    }
  }

  private void compareDocumentation(
      OperationKey key, JsonNode before, JsonNode after, List<Finding> out) {
    for (String field : List.of("summary", "description")) {
      if (!before.path(field).asText().equals(after.path(field).asText()))
        out.add(
            finding(
                "documentation.changed",
                Severity.NON_BREAKING,
                key,
                operationLocation(key) + "/" + field,
                "Documentation changed",
                "The operation " + field + " changed.",
                "Documentation-only changes do not alter the known wire contract.",
                before.path(field).asText(),
                after.path(field).asText(),
                "documentation"));
    }
  }

  private Map<OperationKey, JsonNode> operations(JsonNode root) {
    Map<OperationKey, JsonNode> result = new HashMap<>();
    root.path("paths")
        .fields()
        .forEachRemaining(
            path ->
                path.getValue()
                    .fields()
                    .forEachRemaining(
                        operation -> {
                          if (METHODS.contains(operation.getKey()))
                            result.put(
                                new OperationKey(path.getKey(), operation.getKey()),
                                operation.getValue());
                        }));
    return result;
  }

  private Map<String, JsonNode> mergedParameters(
      JsonNode root, OperationKey key, JsonNode operation) {
    Map<String, JsonNode> result = new LinkedHashMap<>();
    addParameters(result, root.path("paths").path(key.path).path("parameters"));
    addParameters(result, operation.path("parameters"));
    return result;
  }

  private void addParameters(Map<String, JsonNode> result, JsonNode parameters) {
    if (!parameters.isArray()) return;
    parameters.forEach(
        parameter -> {
          String id = parameter.path("name").asText() + "@" + parameter.path("in").asText();
          result.put(id, parameter);
        });
  }

  private JsonNode mediaSchema(JsonNode root, JsonNode container) {
    JsonNode content = resolve(root, container, new HashSet<>()).path("content");
    if (!content.isObject()) return content.path("__missing__");
    JsonNode json = content.path("application/json").path("schema");
    if (!json.isMissingNode()) return resolve(root, json, new HashSet<>());
    Iterator<JsonNode> values = content.elements();
    return values.hasNext()
        ? resolve(root, values.next().path("schema"), new HashSet<>())
        : content.path("__missing__");
  }

  private JsonNode resolve(JsonNode root, JsonNode node, Set<String> visited) {
    JsonNode current = node;
    for (int depth = 0; depth < 50 && current.isObject() && current.has("$ref"); depth++) {
      String ref = current.path("$ref").asText();
      if (!visited.add(ref)) return current;
      current = root.at(ref.substring(1));
    }
    return current;
  }

  private boolean visible(JsonNode schema, Direction direction) {
    return direction == Direction.REQUEST
        ? !schema.path("readOnly").asBoolean(false)
        : !schema.path("writeOnly").asBoolean(false);
  }

  private String effectiveType(JsonNode schema) {
    if (schema.path("type").isArray()) {
      List<String> types = new ArrayList<>();
      schema
          .path("type")
          .forEach(
              item -> {
                if (!item.asText().equals("null")) types.add(item.asText());
              });
      return String.join("|", types);
    }
    return schema.path("type").asText();
  }

  private Set<String> strings(JsonNode array) {
    Set<String> values = new TreeSet<>();
    if (array.isArray()) array.forEach(item -> values.add(item.asText()));
    return values;
  }

  private Finding finding(
      String rule,
      Severity severity,
      OperationKey key,
      String location,
      String title,
      String message,
      String rationale,
      String before,
      String after) {
    return finding(
        rule, severity, key, location, title, message, rationale, before, after, "compatibility");
  }

  private Finding finding(
      String rule,
      Severity severity,
      OperationKey key,
      String location,
      String title,
      String message,
      String rationale,
      String before,
      String after,
      String category) {
    String id = stableId(rule + "|" + location + "|" + before + "|" + after);
    return new Finding(
        id,
        rule,
        severity.value,
        category,
        key.path,
        key.method.toUpperCase(),
        location,
        title,
        message,
        rationale,
        before,
        after);
  }

  private String stableId(String input) {
    try {
      byte[] digest =
          MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8));
      return java.util.HexFormat.of().formatHex(digest, 0, 8);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  private static int count(List<Finding> findings, String severity) {
    return (int) findings.stream().filter(f -> f.severity().equals(severity)).count();
  }

  private static boolean shouldFail(List<Finding> findings, String failOn) {
    return switch (failOn) {
      case "never" -> false;
      case "review" ->
          findings.stream()
              .anyMatch(f -> f.severity().equals("breaking") || f.severity().equals("review"));
      default -> findings.stream().anyMatch(f -> f.severity().equals("breaking"));
    };
  }

  private static String compact(JsonNode value) {
    String text = value.toString();
    return text.length() > 300 ? text.substring(0, 300) + "…" : text;
  }

  private static String pointer(String value) {
    return value.replace("~", "~0").replace("/", "~1");
  }

  private static String operationLocation(OperationKey key) {
    return "#/paths/" + pointer(key.path) + "/" + key.method;
  }

  private enum Direction {
    REQUEST,
    RESPONSE
  }

  private record OperationKey(String path, String method) implements Comparable<OperationKey> {
    public int compareTo(OperationKey other) {
      int byPath = path.compareTo(other.path);
      return byPath != 0 ? byPath : method.compareTo(other.method);
    }
  }
}
