package com.example.employeemanagement.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for authentication requests.
 *
 * <p>Used for both user registration and login operations. Contains the username and password
 * credentials submitted by the client.
 */
@Data
@NoArgsConstructor
public class AuthRequestDto {

  /** The username for authentication. Must not be blank. */
  @NotBlank(message = "Username is required")
  private String username;

  /** The password for authentication. Must not be blank. */
  @NotBlank(message = "Password is required")
  private String password;
}
