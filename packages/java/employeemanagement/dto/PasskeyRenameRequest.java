package com.example.employeemanagement.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/** Request body for renaming an existing passkey. */
public class PasskeyRenameRequest {

  /** The new human-friendly label. */
  @NotBlank
  @Size(max = 100)
  private String name;

  /**
   * Gets the new name.
   *
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the new name.
   *
   * @param name the name
   */
  public void setName(String name) {
    this.name = name;
  }
}
