package com.example.employeemanagement.webauthn;

import org.springframework.http.HttpStatus;

/**
 * Domain exception for passkey operations. Carries the HTTP status that should be returned to the
 * client so the global exception handler can translate it into a clean error response.
 */
public class PasskeyException extends RuntimeException {

  /** The HTTP status to return for this error. */
  private final HttpStatus status;

  /**
   * Creates a passkey exception.
   *
   * @param status the HTTP status to return
   * @param message a client-safe error message
   */
  public PasskeyException(HttpStatus status, String message) {
    super(message);
    this.status = status;
  }

  /**
   * Creates a passkey exception with an underlying cause.
   *
   * @param status the HTTP status to return
   * @param message a client-safe error message
   * @param cause the underlying cause
   */
  public PasskeyException(HttpStatus status, String message, Throwable cause) {
    super(message, cause);
    this.status = status;
  }

  /**
   * Gets the HTTP status to return.
   *
   * @return the status
   */
  public HttpStatus getStatus() {
    return status;
  }
}
