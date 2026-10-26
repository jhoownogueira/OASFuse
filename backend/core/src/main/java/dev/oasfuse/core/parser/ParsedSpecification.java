package dev.oasfuse.core.parser;

import com.fasterxml.jackson.databind.JsonNode;

public record ParsedSpecification(JsonNode root, String openApiVersion) {}
