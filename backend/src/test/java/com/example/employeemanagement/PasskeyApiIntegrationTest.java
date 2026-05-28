package com.example.employeemanagement;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Full-context integration tests for the passkey API. Runs against an in-memory H2 database with
 * MongoDB auto-configuration excluded so the whole Spring (and Spring Security) wiring — including
 * the {@code RelyingParty} bean and the JWT-secured routes — is exercised end to end.
 */
@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:passkeytest;DB_CLOSE_DELAY=-1;MODE=MySQL",
      "spring.datasource.driver-class-name=org.h2.Driver",
      "spring.datasource.username=sa",
      "spring.datasource.password=",
      "spring.jpa.hibernate.ddl-auto=create-drop",
      "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
      "jwt.secret=integration-test-secret-key-please-do-not-use-in-production-0001",
      "webauthn.rp-id=localhost",
      "webauthn.rp-name=Employee Management System",
      "webauthn.allowed-origins=http://localhost:3000",
      "spring.autoconfigure.exclude="
          + "org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.mongo.MongoReactiveAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.data.mongo.MongoReactiveDataAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.data.mongo.MongoRepositoriesAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.data.mongo.MongoReactiveRepositoriesAutoConfiguration"
    })
@AutoConfigureMockMvc
class PasskeyApiIntegrationTest {

  /** MockMvc for issuing requests against the running context. */
  @Autowired private MockMvc mockMvc;

  /** A username-less login ceremony should start successfully and return browser-ready options. */
  @Test
  void startUsernamelessAuthenticationReturnsPublicKeyOptions() throws Exception {
    mockMvc
        .perform(post("/api/passkeys/authenticate/start").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.flowId").isNotEmpty())
        .andExpect(jsonPath("$.options.publicKey.challenge").isNotEmpty());
  }

  /** Listing passkeys without a JWT must be rejected by the security layer. */
  @Test
  void listingPasskeysWithoutAuthIsUnauthorized() throws Exception {
    mockMvc.perform(get("/api/passkeys")).andExpect(status().isUnauthorized());
  }

  /** Starting registration without a JWT must be rejected by the security layer. */
  @Test
  void startingRegistrationWithoutAuthIsUnauthorized() throws Exception {
    mockMvc
        .perform(post("/api/passkeys/register/start").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized());
  }
}
