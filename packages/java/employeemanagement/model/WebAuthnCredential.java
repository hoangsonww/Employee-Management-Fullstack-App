package com.example.employeemanagement.model;

import java.time.Instant;
import javax.persistence.*;

/**
 * Represents a single WebAuthn / FIDO2 passkey credential registered by a {@link User}.
 *
 * <p>A user may register any number of passkeys (for example, one per device). Binary values such
 * as the credential id and the COSE-encoded public key are persisted as base64url strings so the
 * schema stays portable across databases.
 */
@Entity
@Table(
    name = "webauthn_credentials",
    indexes = {
      @Index(name = "idx_webauthn_credential_id", columnList = "credential_id"),
      @Index(name = "idx_webauthn_user_id", columnList = "user_id")
    })
public class WebAuthnCredential {

  /** Surrogate primary key. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The user that owns this passkey. */
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  /** Base64url-encoded WebAuthn credential id. Globally unique. */
  @Column(name = "credential_id", nullable = false, unique = true, length = 512)
  private String credentialId;

  /** Base64url-encoded COSE public key used to verify assertions. */
  @Lob
  @Column(name = "public_key_cose", nullable = false)
  private String publicKeyCose;

  /** Signature counter used to detect cloned authenticators. */
  @Column(name = "signature_count", nullable = false)
  private long signatureCount;

  /** Human-friendly label chosen by the user (e.g. "MacBook Touch ID"). */
  @Column(name = "name", nullable = false, length = 100)
  private String name;

  /** Base64url-encoded AAGUID identifying the authenticator model, when available. */
  @Column(name = "aaguid", length = 64)
  private String aaguid;

  /** Comma-separated list of authenticator transports (e.g. "internal,hybrid"). */
  @Column(name = "transports", length = 255)
  private String transports;

  /** Whether the credential is discoverable (a resident key usable for username-less login). */
  @Column(name = "discoverable")
  private Boolean discoverable;

  /** Whether the credential is eligible to be backed up (multi-device passkey). */
  @Column(name = "backup_eligible")
  private Boolean backupEligible;

  /** Whether the credential is currently backed up / synced. */
  @Column(name = "backup_state")
  private Boolean backupState;

  /** Timestamp the passkey was registered. */
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  /** Timestamp the passkey was last used to authenticate. */
  @Column(name = "last_used_at")
  private Instant lastUsedAt;

  /** Initialise the creation timestamp before the row is first persisted. */
  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }

  /**
   * Gets the surrogate primary key.
   *
   * @return the id
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the surrogate primary key.
   *
   * @param id the id
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the owning user.
   *
   * @return the user
   */
  public User getUser() {
    return user;
  }

  /**
   * Sets the owning user.
   *
   * @param user the user
   */
  public void setUser(User user) {
    this.user = user;
  }

  /**
   * Gets the base64url-encoded credential id.
   *
   * @return the credential id
   */
  public String getCredentialId() {
    return credentialId;
  }

  /**
   * Sets the base64url-encoded credential id.
   *
   * @param credentialId the credential id
   */
  public void setCredentialId(String credentialId) {
    this.credentialId = credentialId;
  }

  /**
   * Gets the base64url-encoded COSE public key.
   *
   * @return the public key
   */
  public String getPublicKeyCose() {
    return publicKeyCose;
  }

  /**
   * Sets the base64url-encoded COSE public key.
   *
   * @param publicKeyCose the public key
   */
  public void setPublicKeyCose(String publicKeyCose) {
    this.publicKeyCose = publicKeyCose;
  }

  /**
   * Gets the signature counter.
   *
   * @return the signature count
   */
  public long getSignatureCount() {
    return signatureCount;
  }

  /**
   * Sets the signature counter.
   *
   * @param signatureCount the signature count
   */
  public void setSignatureCount(long signatureCount) {
    this.signatureCount = signatureCount;
  }

  /**
   * Gets the human-friendly label.
   *
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the human-friendly label.
   *
   * @param name the name
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Gets the base64url-encoded AAGUID.
   *
   * @return the aaguid
   */
  public String getAaguid() {
    return aaguid;
  }

  /**
   * Sets the base64url-encoded AAGUID.
   *
   * @param aaguid the aaguid
   */
  public void setAaguid(String aaguid) {
    this.aaguid = aaguid;
  }

  /**
   * Gets the comma-separated transports.
   *
   * @return the transports
   */
  public String getTransports() {
    return transports;
  }

  /**
   * Sets the comma-separated transports.
   *
   * @param transports the transports
   */
  public void setTransports(String transports) {
    this.transports = transports;
  }

  /**
   * Gets whether the credential is discoverable.
   *
   * @return the discoverable flag
   */
  public Boolean getDiscoverable() {
    return discoverable;
  }

  /**
   * Sets whether the credential is discoverable.
   *
   * @param discoverable the discoverable flag
   */
  public void setDiscoverable(Boolean discoverable) {
    this.discoverable = discoverable;
  }

  /**
   * Gets whether the credential is backup eligible.
   *
   * @return the backup eligible flag
   */
  public Boolean getBackupEligible() {
    return backupEligible;
  }

  /**
   * Sets whether the credential is backup eligible.
   *
   * @param backupEligible the backup eligible flag
   */
  public void setBackupEligible(Boolean backupEligible) {
    this.backupEligible = backupEligible;
  }

  /**
   * Gets whether the credential is currently backed up.
   *
   * @return the backup state flag
   */
  public Boolean getBackupState() {
    return backupState;
  }

  /**
   * Sets whether the credential is currently backed up.
   *
   * @param backupState the backup state flag
   */
  public void setBackupState(Boolean backupState) {
    this.backupState = backupState;
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
   * Sets the creation timestamp.
   *
   * @param createdAt the created-at timestamp
   */
  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  /**
   * Gets the last-used timestamp.
   *
   * @return the last-used timestamp
   */
  public Instant getLastUsedAt() {
    return lastUsedAt;
  }

  /**
   * Sets the last-used timestamp.
   *
   * @param lastUsedAt the last-used timestamp
   */
  public void setLastUsedAt(Instant lastUsedAt) {
    this.lastUsedAt = lastUsedAt;
  }
}
