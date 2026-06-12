package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.User;
import com.example.employeemanagement.model.WebAuthnCredential;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for {@link WebAuthnCredential} (passkey) entities. */
public interface WebAuthnCredentialRepository extends JpaRepository<WebAuthnCredential, Long> {

  /**
   * Finds all passkeys owned by the given user, newest first.
   *
   * @param user the owning user
   * @return the user's passkeys
   */
  List<WebAuthnCredential> findByUserOrderByCreatedAtDesc(User user);

  /**
   * Finds all passkeys owned by the user with the given username.
   *
   * @param username the owner's username
   * @return the user's passkeys
   */
  List<WebAuthnCredential> findByUserUsername(String username);

  /**
   * Finds a passkey by its base64url-encoded credential id.
   *
   * @param credentialId the base64url credential id
   * @return the credential if present
   */
  Optional<WebAuthnCredential> findByCredentialId(String credentialId);

  /**
   * Finds a passkey by its database id scoped to a username, so a user can only ever act on their
   * own credentials.
   *
   * @param id the credential primary key
   * @param username the owner's username
   * @return the credential if it exists and belongs to the user
   */
  Optional<WebAuthnCredential> findByIdAndUserUsername(Long id, String username);

  /**
   * Counts how many passkeys a user has registered.
   *
   * @param username the owner's username
   * @return the number of passkeys
   */
  long countByUserUsername(String username);
}
