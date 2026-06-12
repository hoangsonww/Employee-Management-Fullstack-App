package com.example.employeemanagement.dto;

import com.example.employeemanagement.model.WebAuthnCredential;
import java.time.Instant;

/** A safe, client-facing summary of a registered passkey (never exposes key material). */
public class PasskeyDto {

  /** The passkey's database id. */
  private Long id;

  /** The human-friendly label. */
  private String name;

  /** Comma-separated authenticator transports. */
  private String transports;

  /** Base64url-encoded AAGUID of the authenticator model, when known. */
  private String aaguid;

  /** Whether the passkey is discoverable (usable for username-less login). */
  private Boolean discoverable;

  /** Whether the passkey is eligible to be backed up / synced. */
  private Boolean backupEligible;

  /** Whether the passkey is currently backed up / synced. */
  private Boolean backupState;

  /** When the passkey was registered. */
  private Instant createdAt;

  /** When the passkey was last used to authenticate. */
  private Instant lastUsedAt;

  /**
   * Builds a DTO from a persisted credential.
   *
   * @param credential the stored passkey
   * @return a client-facing summary
   */
  public static PasskeyDto from(WebAuthnCredential credential) {
    PasskeyDto dto = new PasskeyDto();
    dto.id = credential.getId();
    dto.name = credential.getName();
    dto.transports = credential.getTransports();
    dto.aaguid = credential.getAaguid();
    dto.discoverable = credential.getDiscoverable();
    dto.backupEligible = credential.getBackupEligible();
    dto.backupState = credential.getBackupState();
    dto.createdAt = credential.getCreatedAt();
    dto.lastUsedAt = credential.getLastUsedAt();
    return dto;
  }

  /**
   * Gets the id.
   *
   * @return the id
   */
  public Long getId() {
    return id;
  }

  /**
   * Gets the name.
   *
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * Gets the transports.
   *
   * @return the transports
   */
  public String getTransports() {
    return transports;
  }

  /**
   * Gets the AAGUID.
   *
   * @return the aaguid
   */
  public String getAaguid() {
    return aaguid;
  }

  /**
   * Gets the discoverable flag.
   *
   * @return the discoverable flag
   */
  public Boolean getDiscoverable() {
    return discoverable;
  }

  /**
   * Gets the backup eligible flag.
   *
   * @return the backup eligible flag
   */
  public Boolean getBackupEligible() {
    return backupEligible;
  }

  /**
   * Gets the backup state flag.
   *
   * @return the backup state flag
   */
  public Boolean getBackupState() {
    return backupState;
  }

  /**
   * Gets the creation timestamp.
   *
   * @return the created-at timestamp
   */
  public Instant getCreatedAt() {
    return createdAt;
  }

  /**
   * Gets the last-used timestamp.
   *
   * @return the last-used timestamp
   */
  public Instant getLastUsedAt() {
    return lastUsedAt;
  }
}
