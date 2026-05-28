package com.example.employeemanagement.webauthn;

import com.example.employeemanagement.dto.PasskeyCeremonyStartResponse;
import com.example.employeemanagement.dto.PasskeyDto;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.model.WebAuthnCredential;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.repository.WebAuthnCredentialRepository;
import com.example.employeemanagement.webauthn.WebAuthnCeremonyStore.RegistrationCeremony;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.AssertionResult;
import com.yubico.webauthn.FinishAssertionOptions;
import com.yubico.webauthn.FinishRegistrationOptions;
import com.yubico.webauthn.RegistrationResult;
import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.StartAssertionOptions;
import com.yubico.webauthn.StartRegistrationOptions;
import com.yubico.webauthn.data.AuthenticatorSelectionCriteria;
import com.yubico.webauthn.data.AuthenticatorTransport;
import com.yubico.webauthn.data.ByteArray;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.ResidentKeyRequirement;
import com.yubico.webauthn.data.UserIdentity;
import com.yubico.webauthn.data.UserVerificationRequirement;
import com.yubico.webauthn.data.exception.Base64UrlException;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.RegistrationFailedException;
import java.io.IOException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.SortedSet;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orchestrates passkey (WebAuthn) registration, authentication and management on top of the Yubico
 * {@link RelyingParty}.
 */
@Service
public class PasskeyService {

  /** Logger. */
  private static final Logger log = LoggerFactory.getLogger(PasskeyService.class);

  /** Number of random bytes used for a user handle. */
  private static final int USER_HANDLE_BYTES = 32;

  /** Default label applied to a passkey when the user does not provide one. */
  private static final String DEFAULT_PASSKEY_NAME = "Passkey";

  /** Source of randomness for user handles. */
  private final SecureRandom secureRandom = new SecureRandom();

  /** The Yubico relying party. */
  private final RelyingParty relyingParty;

  /** Short-lived ceremony state store. */
  private final WebAuthnCeremonyStore ceremonyStore;

  /** Repository for users. */
  private final UserRepository userRepository;

  /** Repository for stored passkeys. */
  private final WebAuthnCredentialRepository credentialRepository;

  /** JSON mapper for converting Yubico option strings into response nodes. */
  private final ObjectMapper objectMapper;

  /**
   * Creates the passkey service.
   *
   * @param relyingParty the Yubico relying party
   * @param ceremonyStore the ceremony state store
   * @param userRepository repository for users
   * @param credentialRepository repository for stored passkeys
   * @param objectMapper JSON mapper
   */
  public PasskeyService(
      RelyingParty relyingParty,
      WebAuthnCeremonyStore ceremonyStore,
      UserRepository userRepository,
      WebAuthnCredentialRepository credentialRepository,
      ObjectMapper objectMapper) {
    this.relyingParty = relyingParty;
    this.ceremonyStore = ceremonyStore;
    this.userRepository = userRepository;
    this.credentialRepository = credentialRepository;
    this.objectMapper = objectMapper;
  }

  // ---------------------------------------------------------------------------
  // Registration
  // ---------------------------------------------------------------------------

  /**
   * Starts a passkey registration ceremony for the authenticated user.
   *
   * @param username the authenticated user's username
   * @return the flow id and browser-ready creation options
   */
  @Transactional
  public PasskeyCeremonyStartResponse startRegistration(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new PasskeyException(HttpStatus.UNAUTHORIZED, "User not found"));

    ByteArray userHandle = ensureUserHandle(user);

    UserIdentity userIdentity =
        UserIdentity.builder().name(user.getUsername()).displayName(user.getUsername()).id(userHandle).build();

    StartRegistrationOptions options =
        StartRegistrationOptions.builder()
            .user(userIdentity)
            .authenticatorSelection(
                AuthenticatorSelectionCriteria.builder()
                    .residentKey(ResidentKeyRequirement.PREFERRED)
                    .userVerification(UserVerificationRequirement.PREFERRED)
                    .build())
            .build();

    var creationOptions = relyingParty.startRegistration(options);
    String flowId = ceremonyStore.storeRegistration(username, creationOptions);

    try {
      JsonNode optionsNode = objectMapper.readTree(creationOptions.toCredentialsCreateJson());
      return new PasskeyCeremonyStartResponse(flowId, optionsNode);
    } catch (JsonProcessingException e) {
      throw new PasskeyException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to serialise registration options", e);
    }
  }

  /**
   * Finishes a passkey registration ceremony, persisting the new credential.
   *
   * @param username the authenticated user's username
   * @param flowId the flow id from the start step
   * @param credentialJson the WebAuthn attestation response as JSON
   * @param requestedName the user-supplied label (may be blank)
   * @return a summary of the newly registered passkey
   */
  @Transactional
  public PasskeyDto finishRegistration(
      String username, String flowId, JsonNode credentialJson, String requestedName) {

    RegistrationCeremony ceremony =
        ceremonyStore
            .consumeRegistration(flowId)
            .orElseThrow(
                () ->
                    new PasskeyException(
                        HttpStatus.BAD_REQUEST, "Registration session expired. Please try again."));

    if (!ceremony.getUsername().equals(username)) {
      throw new PasskeyException(HttpStatus.FORBIDDEN, "Registration session does not belong to you.");
    }

    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new PasskeyException(HttpStatus.UNAUTHORIZED, "User not found"));

    PublicKeyCredential<
            com.yubico.webauthn.data.AuthenticatorAttestationResponse,
            com.yubico.webauthn.data.ClientRegistrationExtensionOutputs>
        pkc;
    try {
      pkc = PublicKeyCredential.parseRegistrationResponseJson(credentialJson.toString());
    } catch (IOException e) {
      throw new PasskeyException(HttpStatus.BAD_REQUEST, "Malformed passkey registration response", e);
    }

    RegistrationResult result;
    try {
      result =
          relyingParty.finishRegistration(
              FinishRegistrationOptions.builder()
                  .request(ceremony.getOptions())
                  .response(pkc)
                  .build());
    } catch (RegistrationFailedException e) {
      log.warn("Passkey registration failed for user {}: {}", username, e.getMessage());
      throw new PasskeyException(
          HttpStatus.BAD_REQUEST, "Passkey registration could not be verified.", e);
    }

    String credentialId = result.getKeyId().getId().getBase64Url();
    if (credentialRepository.findByCredentialId(credentialId).isPresent()) {
      throw new PasskeyException(
          HttpStatus.CONFLICT, "This passkey is already registered to an account.");
    }

    WebAuthnCredential credential = new WebAuthnCredential();
    credential.setUser(user);
    credential.setCredentialId(credentialId);
    credential.setPublicKeyCose(result.getPublicKeyCose().getBase64Url());
    credential.setSignatureCount(result.getSignatureCount());
    credential.setName(normaliseName(requestedName));
    credential.setDiscoverable(result.isDiscoverable().orElse(null));
    credential.setTransports(extractTransports(result));
    credential.setAaguid(extractAaguid(pkc));
    applyBackupFlags(credential, pkc);

    credential = credentialRepository.save(credential);
    log.info("Registered new passkey '{}' for user {}", credential.getName(), username);
    return PasskeyDto.from(credential);
  }

  // ---------------------------------------------------------------------------
  // Authentication (login)
  // ---------------------------------------------------------------------------

  /**
   * Starts a passkey login ceremony. If a username is supplied the ceremony is scoped to that
   * account; otherwise a username-less (discoverable credential) ceremony is started.
   *
   * @param username the optional username
   * @return the flow id and browser-ready request options
   */
  public PasskeyCeremonyStartResponse startAuthentication(String username) {
    StartAssertionOptions.StartAssertionOptionsBuilder builder =
        StartAssertionOptions.builder().userVerification(UserVerificationRequirement.PREFERRED);
    if (username != null && !username.isBlank()) {
      builder.username(username);
    }

    AssertionRequest request = relyingParty.startAssertion(builder.build());
    String flowId = ceremonyStore.storeAssertion(request);

    try {
      JsonNode optionsNode = objectMapper.readTree(request.toCredentialsGetJson());
      return new PasskeyCeremonyStartResponse(flowId, optionsNode);
    } catch (JsonProcessingException e) {
      throw new PasskeyException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Failed to serialise authentication options", e);
    }
  }

  /**
   * Finishes a passkey login ceremony and returns the authenticated username.
   *
   * @param flowId the flow id from the start step
   * @param credentialJson the WebAuthn assertion response as JSON
   * @return the username of the authenticated user
   */
  @Transactional
  public String finishAuthentication(String flowId, JsonNode credentialJson) {
    AssertionRequest request =
        ceremonyStore
            .consumeAssertion(flowId)
            .orElseThrow(
                () ->
                    new PasskeyException(
                        HttpStatus.BAD_REQUEST, "Login session expired. Please try again."));

    PublicKeyCredential<
            com.yubico.webauthn.data.AuthenticatorAssertionResponse,
            com.yubico.webauthn.data.ClientAssertionExtensionOutputs>
        pkc;
    try {
      pkc = PublicKeyCredential.parseAssertionResponseJson(credentialJson.toString());
    } catch (IOException e) {
      throw new PasskeyException(HttpStatus.BAD_REQUEST, "Malformed passkey login response", e);
    }

    AssertionResult result;
    try {
      result =
          relyingParty.finishAssertion(
              FinishAssertionOptions.builder().request(request).response(pkc).build());
    } catch (AssertionFailedException e) {
      log.warn("Passkey authentication failed: {}", e.getMessage());
      throw new PasskeyException(HttpStatus.UNAUTHORIZED, "Passkey authentication failed.", e);
    }

    if (!result.isSuccess()) {
      throw new PasskeyException(HttpStatus.UNAUTHORIZED, "Passkey authentication failed.");
    }

    updateCredentialUsage(result);
    return result.getUsername();
  }

  // ---------------------------------------------------------------------------
  // Management
  // ---------------------------------------------------------------------------

  /**
   * Lists all passkeys belonging to the given user, newest first.
   *
   * @param username the owner's username
   * @return the user's passkeys
   */
  @Transactional(readOnly = true)
  public List<PasskeyDto> listPasskeys(String username) {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new PasskeyException(HttpStatus.UNAUTHORIZED, "User not found"));
    return credentialRepository.findByUserOrderByCreatedAtDesc(user).stream()
        .map(PasskeyDto::from)
        .collect(Collectors.toList());
  }

  /**
   * Renames a passkey owned by the given user.
   *
   * @param username the owner's username
   * @param id the passkey's database id
   * @param newName the new label
   * @return the updated passkey summary
   */
  @Transactional
  public PasskeyDto renamePasskey(String username, Long id, String newName) {
    WebAuthnCredential credential =
        credentialRepository
            .findByIdAndUserUsername(id, username)
            .orElseThrow(() -> new PasskeyException(HttpStatus.NOT_FOUND, "Passkey not found"));
    credential.setName(normaliseName(newName));
    return PasskeyDto.from(credentialRepository.save(credential));
  }

  /**
   * Deletes a passkey owned by the given user.
   *
   * @param username the owner's username
   * @param id the passkey's database id
   */
  @Transactional
  public void deletePasskey(String username, Long id) {
    WebAuthnCredential credential =
        credentialRepository
            .findByIdAndUserUsername(id, username)
            .orElseThrow(() -> new PasskeyException(HttpStatus.NOT_FOUND, "Passkey not found"));
    credentialRepository.delete(credential);
    log.info("Deleted passkey '{}' for user {}", credential.getName(), username);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Returns the user's stable WebAuthn handle, generating and persisting one if absent.
   *
   * @param user the user
   * @return the user's handle as a {@link ByteArray}
   */
  private ByteArray ensureUserHandle(User user) {
    String handle = user.getUserHandle();
    if (handle == null || handle.isEmpty()) {
      handle = generateUserHandle();
      user.setUserHandle(handle);
      userRepository.save(user);
    }
    try {
      return ByteArray.fromBase64Url(handle);
    } catch (Base64UrlException e) {
      throw new PasskeyException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Corrupt user handle for account", e);
    }
  }

  /**
   * Generates a fresh, random, base64url-encoded user handle.
   *
   * @return the new user handle
   */
  private String generateUserHandle() {
    byte[] bytes = new byte[USER_HANDLE_BYTES];
    secureRandom.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  /**
   * Updates the signature counter and last-used timestamp of the credential that satisfied an
   * assertion.
   *
   * @param result the successful assertion result
   */
  private void updateCredentialUsage(AssertionResult result) {
    String credentialId = result.getCredential().getCredentialId().getBase64Url();
    credentialRepository
        .findByCredentialId(credentialId)
        .ifPresent(
            credential -> {
              credential.setSignatureCount(result.getSignatureCount());
              credential.setLastUsedAt(Instant.now());
              credentialRepository.save(credential);
            });
  }

  /**
   * Normalises a user-supplied passkey label, falling back to a default and capping the length.
   *
   * @param name the requested name (may be {@code null} or blank)
   * @return a safe, non-empty label
   */
  private String normaliseName(String name) {
    if (name == null || name.isBlank()) {
      return DEFAULT_PASSKEY_NAME;
    }
    String trimmed = name.trim();
    return trimmed.length() > 100 ? trimmed.substring(0, 100) : trimmed;
  }

  /**
   * Extracts the comma-separated transports advertised by the new credential.
   *
   * @param result the registration result
   * @return the transports as a comma-separated string, or {@code null} if none
   */
  private String extractTransports(RegistrationResult result) {
    SortedSet<AuthenticatorTransport> transports = result.getKeyId().getTransports().orElse(null);
    if (transports == null || transports.isEmpty()) {
      return null;
    }
    return transports.stream().map(AuthenticatorTransport::getId).collect(Collectors.joining(","));
  }

  /**
   * Best-effort extraction of the authenticator AAGUID from the attestation response.
   *
   * @param pkc the parsed attestation credential
   * @return the base64url-encoded AAGUID, or {@code null} if unavailable
   */
  private String extractAaguid(
      PublicKeyCredential<
              com.yubico.webauthn.data.AuthenticatorAttestationResponse,
              com.yubico.webauthn.data.ClientRegistrationExtensionOutputs>
          pkc) {
    try {
      return pkc.getResponse()
          .getAttestation()
          .getAuthenticatorData()
          .getAttestedCredentialData()
          .map(data -> data.getAaguid().getBase64Url())
          .orElse(null);
    } catch (RuntimeException e) {
      log.debug("Could not extract AAGUID from attestation", e);
      return null;
    }
  }

  /**
   * Best-effort extraction of the backup-eligibility / backup-state flags from the attestation
   * response.
   *
   * @param credential the credential being populated
   * @param pkc the parsed attestation credential
   */
  private void applyBackupFlags(
      WebAuthnCredential credential,
      PublicKeyCredential<
              com.yubico.webauthn.data.AuthenticatorAttestationResponse,
              com.yubico.webauthn.data.ClientRegistrationExtensionOutputs>
          pkc) {
    try {
      var flags = pkc.getResponse().getParsedAuthenticatorData().getFlags();
      credential.setBackupEligible(flags.BE);
      credential.setBackupState(flags.BS);
    } catch (RuntimeException e) {
      log.debug("Could not extract backup flags from attestation", e);
    }
  }
}
