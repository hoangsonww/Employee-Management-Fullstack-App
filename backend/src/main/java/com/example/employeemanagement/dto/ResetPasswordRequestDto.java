package com.example.employeemanagement.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for password reset requests.
 *
 * <p>Contains the username whose password should be reset and the new password value.
 */
@Data
@NoArgsConstructor
public class ResetPasswordRequestDto {

  /** The username of the account whose password is being reset. Must not be blank. */
  @NotBlank(message = "Username is required")
  private String username;

  /** The new password to set for the account. Must not be blank. */
  @NotBlank(message = "New password is required")
  private String newPassword;
}
