package com.example.employeemanagement.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the Employee Management REST API.
 *
 * <p>Intercepts exceptions thrown by controllers and translates them into standardised JSON error
 * responses with appropriate HTTP status codes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Handles bean validation errors raised when {@code @Valid} annotated request bodies fail
   * constraint checks.
   *
   * @param ex the validation exception containing field-level error details
   * @return a {@code 400 Bad Request} response whose body maps each invalid field name to its error
   *     message
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {

    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult()
        .getFieldErrors()
        .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handles {@link ResourceNotFoundException} when a requested entity cannot be found.
   *
   * @param ex the exception containing the not-found message
   * @return a {@code 404 Not Found} response with the error message
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleResourceNotFoundException(
      ResourceNotFoundException ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", ex.getMessage());

    return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
  }

  /**
   * Handles data integrity violations such as unique-constraint or foreign-key conflicts.
   *
   * @param ex the data integrity violation exception
   * @return a {@code 400 Bad Request} response with a generic integrity-violation message
   */
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(
      DataIntegrityViolationException ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", "Data integrity violation: invalid reference or duplicate value");

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handles malformed or unreadable JSON request bodies.
   *
   * @param ex the exception thrown when the HTTP message cannot be parsed
   * @return a {@code 400 Bad Request} response indicating the JSON is malformed
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, String>> handleMalformedJson(
      HttpMessageNotReadableException ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", "Malformed JSON request");

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  /**
   * Handles access-denied errors when the authenticated user lacks the required permissions.
   *
   * @param ex the access denied exception
   * @return a {@code 403 Forbidden} response
   */
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", "Access denied");

    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
  }

  /**
   * Handles authentication failures such as missing or invalid credentials.
   *
   * @param ex the authentication exception
   * @return a {@code 401 Unauthorized} response
   */
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Map<String, String>> handleAuthentication(AuthenticationException ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", "Authentication required");

    return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Catch-all handler for any uncaught exceptions not matched by the more specific handlers above.
   *
   * @param ex the exception
   * @return a {@code 500 Internal Server Error} response with a generic error message
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {

    Map<String, String> error = new HashMap<>();
    error.put("message", "An unexpected error occurred");

    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
