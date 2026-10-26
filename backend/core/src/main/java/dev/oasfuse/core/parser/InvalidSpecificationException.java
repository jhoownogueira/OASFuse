package dev.oasfuse.core.parser;

public class InvalidSpecificationException extends RuntimeException {
  public InvalidSpecificationException(String message) {
    super(message);
  }

  public InvalidSpecificationException(String message, Throwable cause) {
    super(message, cause);
  }
}
