package dev.oasfuse.core.domain;

public enum Severity {
  BREAKING("breaking"),
  NON_BREAKING("non-breaking"),
  REVIEW("review");
  public final String value;

  Severity(String value) {
    this.value = value;
  }
}
