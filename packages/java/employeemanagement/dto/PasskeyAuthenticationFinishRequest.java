package com.example.employeemanagement.dto;

import com.fasterxml.jackson.databind.JsonNode;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/** Request body submitted by the client to finish a passkey login. */
public class PasskeyAuthenticationFinishRequest {

  /** The flow id returned by the start step. */
  @NotBlank private String flowId;

  /** The raw WebAuthn assertion response produced by {@code navigator.credentials.get}. */
  @NotNull private JsonNode credential;

  /**
   * Gets the flow id.
   *
   * @return the flow id
   */
  public String getFlowId() {
    return flowId;
  }

  /**
   * Sets the flow id.
   *
   * @param flowId the flow id
   */
  public void setFlowId(String flowId) {
    this.flowId = flowId;
  }

  /**
   * Gets the assertion response.
   *
   * @return the credential
   */
  public JsonNode getCredential() {
    return credential;
  }

  /**
   * Sets the assertion response.
   *
   * @param credential the credential
   */
  public void setCredential(JsonNode credential) {
    this.credential = credential;
  }
}
