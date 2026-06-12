package com.example.employeemanagement.webauthn;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility for generating WebAuthn user handles: stable, opaque, base64url-encoded identifiers used
 * by passkeys in place of the username. Centralised here so the handle format stays consistent
 * everywhere one is created.
 */
public final class UserHandles {

  /** Number of random bytes used for a user handle. */
  public static final int USER_HANDLE_BYTES = 32;

  /** Source of randomness for user handles. */
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private UserHandles() {}

  /**
   * Generates a fresh, random, base64url-encoded user handle.
   *
   * @return the new user handle
   */
  public static String generate() {
    byte[] bytes = new byte[USER_HANDLE_BYTES];
    SECURE_RANDOM.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}
