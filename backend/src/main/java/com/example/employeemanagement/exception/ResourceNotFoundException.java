package com.example.employeemanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** This class represents a custom exception for when a resource is not found. */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

  /**
   * Constructor for the exception.
   *
   * @param message The exception's message
   */
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
