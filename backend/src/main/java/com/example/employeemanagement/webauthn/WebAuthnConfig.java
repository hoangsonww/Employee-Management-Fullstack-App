package com.example.employeemanagement.webauthn;

import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Wires up the Yubico {@link RelyingParty} used to drive all WebAuthn ceremonies. */
@Configuration
@EnableConfigurationProperties(WebAuthnProperties.class)
public class WebAuthnConfig {

  /**
   * Builds the relying party from configuration and the JPA-backed credential repository.
   *
   * @param properties the WebAuthn configuration
   * @param credentialRepository the credential repository adapter
   * @return the configured relying party
   */
  @Bean
  public RelyingParty relyingParty(
      WebAuthnProperties properties, JpaCredentialRepository credentialRepository) {

    RelyingPartyIdentity identity =
        RelyingPartyIdentity.builder()
            .id(properties.getRpId())
            .name(properties.getRpName())
            .build();

    Set<String> origins = new LinkedHashSet<>(properties.getAllowedOrigins());
    if (origins.isEmpty()) {
      // Fall back to the canonical https origin for the configured domain so the relying party is
      // never constructed with an empty (deny-all) origin set.
      origins.add("https://" + properties.getRpId());
    }

    return RelyingParty.builder()
        .identity(identity)
        .credentialRepository(credentialRepository)
        .origins(origins)
        .allowOriginPort(true)
        .build();
  }
}
