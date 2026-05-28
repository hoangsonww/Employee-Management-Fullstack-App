package com.example.employeemanagement.webauthn;

import com.example.employeemanagement.model.WebAuthnCredential;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.repository.WebAuthnCredentialRepository;
import com.yubico.webauthn.CredentialRepository;
import com.yubico.webauthn.RegisteredCredential;
import com.yubico.webauthn.data.AuthenticatorTransport;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor;
import com.yubico.webauthn.data.PublicKeyCredentialType;
import com.yubico.webauthn.data.exception.Base64UrlException;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bridges the Yubico {@link CredentialRepository} contract to this application's JPA persistence so
 * the {@link com.yubico.webauthn.RelyingParty} can resolve users and their passkeys during
 * registration and assertion ceremonies.
 */
@Component
public class JpaCredentialRepository implements CredentialRepository {

  /** Repository for users. */
  private final UserRepository userRepository;

  /** Repository for stored passkeys. */
  private final WebAuthnCredentialRepository credentialRepository;

  /**
   * Creates the credential repository adapter.
   *
   * @param userRepository repository for users
   * @param credentialRepository repository for stored passkeys
   */
  public JpaCredentialRepository(
      UserRepository userRepository, WebAuthnCredentialRepository credentialRepository) {
    this.userRepository = userRepository;
    this.credentialRepository = credentialRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
    Set<PublicKeyCredentialDescriptor> descriptors = new LinkedHashSet<>();
    for (WebAuthnCredential credential : credentialRepository.findByUserUsername(username)) {
      descriptors.add(
          PublicKeyCredentialDescriptor.builder()
              .id(decode(credential.getCredentialId()))
              .transports(parseTransports(credential.getTransports()))
              .type(PublicKeyCredentialType.PUBLIC_KEY)
              .build());
    }
    return descriptors;
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<ByteArray> getUserHandleForUsername(String username) {
    return userRepository
        .findByUsername(username)
        .map(user -> user.getUserHandle())
        .filter(handle -> handle != null && !handle.isEmpty())
        .map(JpaCredentialRepository::decode);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
    return userRepository.findByUserHandle(userHandle.getBase64Url()).map(user -> user.getUsername());
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
    return credentialRepository
        .findByCredentialId(credentialId.getBase64Url())
        .filter(credential -> credential.getUser() != null)
        .filter(credential -> userHandle.getBase64Url().equals(credential.getUser().getUserHandle()))
        .map(credential -> toRegisteredCredential(credential, userHandle));
  }

  @Override
  @Transactional(readOnly = true)
  public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
    return credentialRepository
        .findByCredentialId(credentialId.getBase64Url())
        .filter(credential -> credential.getUser() != null && credential.getUser().getUserHandle() != null)
        .map(
            credential ->
                Collections.singleton(
                    toRegisteredCredential(credential, decode(credential.getUser().getUserHandle()))))
        .orElseGet(Collections::emptySet);
  }

  /**
   * Maps a stored credential to the Yubico {@link RegisteredCredential} value object.
   *
   * @param credential the stored passkey
   * @param userHandle the owning user's handle
   * @return the Yubico registered credential
   */
  private RegisteredCredential toRegisteredCredential(
      WebAuthnCredential credential, ByteArray userHandle) {
    return RegisteredCredential.builder()
        .credentialId(decode(credential.getCredentialId()))
        .userHandle(userHandle)
        .publicKeyCose(decode(credential.getPublicKeyCose()))
        .signatureCount(credential.getSignatureCount())
        .build();
  }

  /**
   * Parses a comma-separated transports string into Yubico transport enums, ignoring unknown
   * values.
   *
   * @param transports the comma-separated transports (may be {@code null})
   * @return the parsed transports, possibly empty
   */
  private static Set<AuthenticatorTransport> parseTransports(String transports) {
    Set<AuthenticatorTransport> result = new TreeSet<>();
    if (transports == null || transports.isEmpty()) {
      return result;
    }
    for (String token : transports.split(",")) {
      String trimmed = token.trim();
      if (!trimmed.isEmpty()) {
        result.add(AuthenticatorTransport.of(trimmed));
      }
    }
    return result;
  }

  /**
   * Decodes a base64url string into a {@link ByteArray}, rethrowing the checked decoding error as an
   * unchecked exception since stored values are always valid base64url.
   *
   * @param base64Url the base64url-encoded value
   * @return the decoded byte array
   */
  private static ByteArray decode(String base64Url) {
    try {
      return ByteArray.fromBase64Url(base64Url);
    } catch (Base64UrlException e) {
      throw new IllegalStateException("Stored WebAuthn value is not valid base64url", e);
    }
  }
}
