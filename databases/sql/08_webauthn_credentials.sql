-- ============================================================================
-- Employee Management — WebAuthn / Passkey Credentials
-- ============================================================================
-- Creates the table backing passwordless (FIDO2/WebAuthn) sign-in.
-- Matches the JPA entity:
--   com.example.employeemanagement.model.WebAuthnCredential
--
-- A user may register any number of passkeys (typically one per device).
-- Binary values (credential id, COSE public key) are persisted as base64url
-- strings so the schema stays portable across databases.
--
-- Run AFTER: 02_create_tables.sql (needs the `users` table for the FK)
-- ============================================================================

USE employee_management;

-- ---------------------------------------------------------------------------
-- webauthn_credentials
-- ---------------------------------------------------------------------------
-- Maps to: com.example.employeemanagement.model.WebAuthnCredential
-- JPA relationship: ManyToOne → User (FetchType.LAZY, required)
-- Used by: PasskeyController / PasskeyService (register, authenticate, rename)
--
-- Column notes:
--   credential_id    base64url WebAuthn credential id, globally unique
--   public_key_cose  base64url COSE public key (@Lob → LONGTEXT)
--   signature_count  monotonically increasing counter (clone detection)
--   aaguid           base64url authenticator model id, when available
--   transports       comma-separated list (e.g. "internal,hybrid")
--   discoverable     resident key usable for username-less login
--   backup_eligible  credential may be backed up (multi-device passkey)
--   backup_state     credential is currently backed up / synced
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  user_id         BIGINT       NOT NULL,
  credential_id   VARCHAR(512) NOT NULL,
  public_key_cose LONGTEXT     NOT NULL,
  signature_count BIGINT       NOT NULL DEFAULT 0,
  name            VARCHAR(100) NOT NULL,
  aaguid          VARCHAR(64)  DEFAULT NULL,
  transports      VARCHAR(255) DEFAULT NULL,
  discoverable    BOOLEAN      DEFAULT NULL,
  backup_eligible BOOLEAN      DEFAULT NULL,
  backup_state    BOOLEAN      DEFAULT NULL,
  created_at      DATETIME(6)  NOT NULL,
  last_used_at    DATETIME(6)  DEFAULT NULL,
  PRIMARY KEY (id),
  -- Unique constraint also serves as the lookup index for credential_id
  -- (matches @Index idx_webauthn_credential_id on the entity).
  CONSTRAINT uk_webauthn_credential_id UNIQUE (credential_id),
  -- Supports listing/deleting a user's passkeys and the assertion lookup.
  INDEX idx_webauthn_user_id (user_id),
  -- Passkeys are owned by a user; remove them when the user is deleted.
  CONSTRAINT fk_webauthn_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
