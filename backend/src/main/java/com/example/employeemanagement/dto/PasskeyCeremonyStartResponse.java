package com.example.employeemanagement.dto;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Response returned when a registration or assertion ceremony is started. Carries the opaque flow
 * id the client must echo back, plus the browser-ready public key options.
 */
public class PasskeyCeremonyStartResponse {

  /** Opaque, single-use id identifying this ceremony. */
  private final String flowId;

  /** The {@code navigator.credentials} options ({@code {"publicKey": {...}}}). */
  private final JsonNode options;

  /**
   * Creates the response.
   *
   * @param flowId the flow id
   * @param options the browser-ready options
   */
  public PasskeyCeremonyStartResponse(String flowId, JsonNode options) {
    this.flowId = flowId;
    this.options = options;
  }

  /**
   * Gets the flow id.
   *
   * @return the flow id
   */
  public String getFlowId() {
    return flowId;
  }

  /**
   * Gets the browser-ready options.
   *
   * @return the options
   */
  public JsonNode getOptions() {
    return options;
  }
}
