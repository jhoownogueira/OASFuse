package dev.oasfuse.core.parser;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.StreamReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import java.nio.charset.StandardCharsets;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;
import java.util.Map;
import org.yaml.snakeyaml.LoaderOptions;

public final class SecureOpenApiParser {
  public static final int MAX_SPEC_BYTES = 2 * 1024 * 1024;
  private static final int MAX_DEPTH = 100, MAX_NODES = 100_000, MAX_REFS = 10_000;
  private final ObjectMapper json;
  private final ObjectMapper yaml;

  public SecureOpenApiParser() {
    json =
        new ObjectMapper(
            JsonFactory.builder().enable(StreamReadFeature.STRICT_DUPLICATE_DETECTION).build());
    LoaderOptions limits = new LoaderOptions();
    limits.setMaxAliasesForCollections(50);
    limits.setNestingDepthLimit(MAX_DEPTH);
    limits.setCodePointLimit(MAX_SPEC_BYTES);
    yaml =
        new ObjectMapper(
            YAMLFactory.builder()
                .loaderOptions(limits)
                .enable(StreamReadFeature.STRICT_DUPLICATE_DETECTION)
                .build());
  }

  public ParsedSpecification parse(String fileName, String content) {
    if (content == null || content.isBlank())
      throw new InvalidSpecificationException("Specification is empty.");
    if (content.getBytes(StandardCharsets.UTF_8).length > MAX_SPEC_BYTES)
      throw new InvalidSpecificationException("Specification exceeds the 2 MiB limit.");
    try {
      boolean isJson =
          (fileName != null && fileName.toLowerCase().endsWith(".json"))
              || content.stripLeading().startsWith("{");
      JsonNode root = (isJson ? json : yaml).readTree(content);
      if (root == null || !root.isObject())
        throw new InvalidSpecificationException("OpenAPI document must be an object.");
      String version = root.path("openapi").asText();
      if (!(version.startsWith("3.0.") || version.startsWith("3.1.")))
        throw new InvalidSpecificationException(
            "Only OpenAPI 3.0.x and the tested 3.1.x subset are supported.");
      if (!root.path("info").isObject()
          || root.path("info").path("title").asText().isBlank()
          || root.path("info").path("version").asText().isBlank())
        throw new InvalidSpecificationException(
            "OpenAPI info.title and info.version are required.");
      validateTree(root);
      return new ParsedSpecification(root, version);
    } catch (InvalidSpecificationException e) {
      throw e;
    } catch (Exception e) {
      throw new InvalidSpecificationException("Specification is not valid JSON or safe YAML.", e);
    }
  }

  private void validateTree(JsonNode root) {
    record Entry(JsonNode node, int depth) {}
    Deque<Entry> stack = new ArrayDeque<>();
    stack.push(new Entry(root, 0));
    int nodes = 0, refs = 0;
    while (!stack.isEmpty()) {
      Entry entry = stack.pop();
      if (++nodes > MAX_NODES)
        throw new InvalidSpecificationException("Specification exceeds the node limit.");
      if (entry.depth > MAX_DEPTH)
        throw new InvalidSpecificationException("Specification exceeds the nesting limit.");
      JsonNode node = entry.node;
      if (node.isObject()) {
        Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
        while (fields.hasNext()) {
          Map.Entry<String, JsonNode> field = fields.next();
          if (field.getKey().equals("$ref")) {
            refs++;
            String value = field.getValue().asText();
            if (!value.startsWith("#/"))
              throw new InvalidSpecificationException(
                  "External and relative $ref values are not supported.");
          }
          stack.push(new Entry(field.getValue(), entry.depth + 1));
        }
      } else if (node.isArray())
        node.forEach(child -> stack.push(new Entry(child, entry.depth + 1)));
    }
    if (refs > MAX_REFS)
      throw new InvalidSpecificationException("Specification exceeds the reference limit.");
  }
}
