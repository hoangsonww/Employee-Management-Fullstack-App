package com.example.employeemanagement.webauthn;

import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Externalised configuration for the WebAuthn relying party. */
@ConfigurationProperties(prefix = "webauthn")
public class WebAuthnProperties {

  /** The relying party id: the effective domain of the frontend (no scheme, no port). */
  private String rpId = "localhost";

  /** Human-readable relying party name shown by some authenticators. */
  private String rpName = "Employee Management System";

  /** Exact frontend origins (scheme + host + port) allowed to run WebAuthn ceremonies. */
  private Set<String> allowedOrigins = new LinkedHashSet<>();

  /** How long a ceremony remains valid between its start and finish, in seconds. */
  private long ceremonyTimeoutSeconds = 300;

  /**
   * Gets the relying party id.
   *
   * @return the rp id
   */
  public String getRpId() {
    return rpId;
  }

  /**
   * Sets the relying party id.
   *
   * @param rpId the rp id
   */
  public void setRpId(String rpId) {
    this.rpId = rpId;
  }

  /**
   * Gets the relying party name.
   *
   * @return the rp name
   */
  public String getRpName() {
    return rpName;
  }

  /**
   * Sets the relying party name.
   *
   * @param rpName the rp name
   */
  public void setRpName(String rpName) {
    this.rpName = rpName;
  }

  /**
   * Gets the allowed frontend origins.
   *
   * @return the allowed origins
   */
  public Set<String> getAllowedOrigins() {
    return allowedOrigins;
  }

  /**
   * Sets the allowed frontend origins.
   *
   * @param allowedOrigins the allowed origins
   */
  public void setAllowedOrigins(Set<String> allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  /**
   * Gets the ceremony timeout in seconds.
   *
   * @return the ceremony timeout
   */
  public long getCeremonyTimeoutSeconds() {
    return ceremonyTimeoutSeconds;
  }

  /**
   * Sets the ceremony timeout in seconds.
   *
   * @param ceremonyTimeoutSeconds the ceremony timeout
   */
  public void setCeremonyTimeoutSeconds(long ceremonyTimeoutSeconds) {
    this.ceremonyTimeoutSeconds = ceremonyTimeoutSeconds;
  }
}
