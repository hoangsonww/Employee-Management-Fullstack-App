package com.example.employeemanagement.dto;

import com.fasterxml.jackson.databind.JsonNode;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/** Request body submitted by the client to finish registering a passkey. */
public class PasskeyRegistrationFinishRequest {

  /** The flow id returned by the start step. */
  @NotBlank private String flowId;

  /** The raw WebAuthn attestation response produced by {@code navigator.credentials.create}. */
  @NotNull private JsonNode credential;

  /** Optional human-friendly label for the new passkey. */
  @Size(max = 100)
  private String name;

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
   * Gets the attestation response.
   *
   * @return the credential
   */
  public JsonNode getCredential() {
    return credential;
  }

  /**
   * Sets the attestation response.
   *
   * @param credential the credential
   */
  public void setCredential(JsonNode credential) {
    this.credential = credential;
  }

  /**
   * Gets the requested name.
   *
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * Sets the requested name.
   *
   * @param name the name
   */
  public void setName(String name) {
    this.name = name;
  }
}
