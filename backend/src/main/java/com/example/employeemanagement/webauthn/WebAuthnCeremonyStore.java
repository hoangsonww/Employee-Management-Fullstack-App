package com.example.employeemanagement.webauthn;

import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Holds the short-lived, server-side state of in-flight WebAuthn ceremonies between their "start"
 * and "finish" requests.
 *
 * <p>Entries are single-use (consumed on retrieval) and expire after a configurable timeout, which
 * mitigates replay of stale challenges. The store is in-memory; a multi-instance deployment should
 * back this with a shared store (e.g. Redis) so ceremonies survive load balancing and restarts.
 */
@Component
public class WebAuthnCeremonyStore {

  /** Pending registration ceremonies keyed by flow id. */
  private final ConcurrentHashMap<String, Pending<RegistrationCeremony>> registrations =
      new ConcurrentHashMap<>();

  /** Pending assertion ceremonies keyed by flow id. */
  private final ConcurrentHashMap<String, Pending<AssertionRequest>> assertions =
      new ConcurrentHashMap<>();

  /** How long an entry remains valid. */
  private final Duration timeout;

  /**
   * Creates the store.
   *
   * @param properties the WebAuthn configuration providing the ceremony timeout
   */
  public WebAuthnCeremonyStore(WebAuthnProperties properties) {
    this.timeout = Duration.ofSeconds(properties.getCeremonyTimeoutSeconds());
  }

  /**
   * Stores a pending registration ceremony.
   *
   * @param username the authenticated user the credential is being registered for
   * @param options the creation options issued to the client
   * @return a flow id the client must echo back when finishing
   */
  public String storeRegistration(String username, PublicKeyCredentialCreationOptions options) {
    evictExpired();
    String flowId = newFlowId();
    registrations.put(
        flowId, new Pending<>(new RegistrationCeremony(username, options), Instant.now().plus(timeout)));
    return flowId;
  }

  /**
   * Atomically retrieves and removes a pending registration ceremony.
   *
   * @param flowId the flow id returned by {@link #storeRegistration}
   * @return the ceremony if present and unexpired
   */
  public Optional<RegistrationCeremony> consumeRegistration(String flowId) {
    return consume(registrations, flowId);
  }

  /**
   * Stores a pending assertion (login) ceremony.
   *
   * @param request the assertion request issued to the client
   * @return a flow id the client must echo back when finishing
   */
  public String storeAssertion(AssertionRequest request) {
    evictExpired();
    String flowId = newFlowId();
    assertions.put(flowId, new Pending<>(request, Instant.now().plus(timeout)));
    return flowId;
  }

  /**
   * Atomically retrieves and removes a pending assertion ceremony.
   *
   * @param flowId the flow id returned by {@link #storeAssertion}
   * @return the assertion request if present and unexpired
   */
  public Optional<AssertionRequest> consumeAssertion(String flowId) {
    return consume(assertions, flowId);
  }

  /**
   * Removes and returns a still-valid entry from the given map.
   *
   * @param map the backing map
   * @param flowId the flow id
   * @param <T> the payload type
   * @return the payload if present and unexpired
   */
  private <T> Optional<T> consume(ConcurrentHashMap<String, Pending<T>> map, String flowId) {
    if (flowId == null) {
      return Optional.empty();
    }
    Pending<T> pending = map.remove(flowId);
    if (pending == null || pending.isExpired()) {
      return Optional.empty();
    }
    return Optional.of(pending.payload);
  }

  /** Removes expired entries from both maps. */
  private void evictExpired() {
    registrations.values().removeIf(Pending::isExpired);
    assertions.values().removeIf(Pending::isExpired);
  }

  /**
   * Generates a new random flow id.
   *
   * @return a random flow id
   */
  private static String newFlowId() {
    return UUID.randomUUID().toString();
  }

  /** A pending registration ceremony bound to the authenticated user that started it. */
  public static final class RegistrationCeremony {

    /** The username the credential is being registered for. */
    private final String username;

    /** The creation options issued to the client. */
    private final PublicKeyCredentialCreationOptions options;

    /**
     * Creates a registration ceremony.
     *
     * @param username the username
     * @param options the creation options
     */
    public RegistrationCeremony(String username, PublicKeyCredentialCreationOptions options) {
      this.username = username;
      this.options = options;
    }

    /**
     * Gets the username.
     *
     * @return the username
     */
    public String getUsername() {
      return username;
    }

    /**
     * Gets the creation options.
     *
     * @return the creation options
     */
    public PublicKeyCredentialCreationOptions getOptions() {
      return options;
    }
  }

  /**
   * A timestamped, expiring wrapper around a ceremony payload.
   *
   * @param <T> the payload type
   */
  private static final class Pending<T> {

    /** The wrapped payload. */
    private final T payload;

    /** The instant after which this entry is invalid. */
    private final Instant expiresAt;

    /**
     * Wraps a payload with an expiry.
     *
     * @param payload the payload
     * @param expiresAt the expiry instant
     */
    private Pending(T payload, Instant expiresAt) {
      this.payload = payload;
      this.expiresAt = expiresAt;
    }

    /**
     * Indicates whether this entry has expired.
     *
     * @return {@code true} if expired
     */
    private boolean isExpired() {
      return Instant.now().isAfter(expiresAt);
    }
  }
}
