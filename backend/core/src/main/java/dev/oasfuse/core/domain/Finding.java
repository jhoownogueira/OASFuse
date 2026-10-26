package dev.oasfuse.core.domain;

public record Finding(
    String id,
    String ruleId,
    String severity,
    String category,
    String path,
    String method,
    String location,
    String title,
    String message,
    String rationale,
    String before,
    String after) {}
