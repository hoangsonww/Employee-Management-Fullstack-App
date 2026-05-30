package com.example.employeemanagement.dto;

/**
 * Optional request body when starting a passkey login. If a username is supplied the server scopes
 * the allowed credentials to that account; if omitted, a username-less (discoverable credential)
 * ceremony is started.
 */
public class PasskeyAuthenticationStartRequest {

  /** Optional username to scope the ceremony to. */
  private String username;

  /**
   * Gets the username.
   *
   * @return the username, possibly {@code null}
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the username.
   *
   * @param username the username
   */
  public void setUsername(String username) {
    this.username = username;
  }
}
