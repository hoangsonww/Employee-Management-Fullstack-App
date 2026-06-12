package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.PasskeyAuthenticationFinishRequest;
import com.example.employeemanagement.dto.PasskeyAuthenticationStartRequest;
import com.example.employeemanagement.dto.PasskeyCeremonyStartResponse;
import com.example.employeemanagement.dto.PasskeyDto;
import com.example.employeemanagement.dto.PasskeyRegistrationFinishRequest;
import com.example.employeemanagement.dto.PasskeyRenameRequest;
import com.example.employeemanagement.security.JwtTokenUtil;
import com.example.employeemanagement.webauthn.PasskeyException;
import com.example.employeemanagement.webauthn.PasskeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for registering, authenticating with, and managing passkeys (WebAuthn / FIDO2
 * credentials).
 *
 * <p>Management endpoints ({@code /register/**} and the list/rename/delete operations) require a
 * valid JWT (the global {@code bearerAuth} scheme). The login endpoints ({@code /authenticate/**})
 * are public so users can sign in with a passkey before they have a token.
 */
@RestController
@RequestMapping("/api/passkeys")
@Tag(name = "Passkey APIs", description = "WebAuthn passkey registration, login and management")
public class PasskeyController {

  /** The passkey orchestration service. */
  private final PasskeyService passkeyService;

  /** Utility for issuing JWTs after a successful passkey login. */
  private final JwtTokenUtil jwtTokenUtil;

  /**
   * Creates the controller.
   *
   * @param passkeyService the passkey service
   * @param jwtTokenUtil the JWT utility
   */
  public PasskeyController(PasskeyService passkeyService, JwtTokenUtil jwtTokenUtil) {
    this.passkeyService = passkeyService;
    this.jwtTokenUtil = jwtTokenUtil;
  }

  /**
   * Begins registering a new passkey for the authenticated user.
   *
   * @param principal the authenticated principal
   * @return the ceremony flow id and creation options
   */
  @Operation(
      summary = "Start passkey registration",
      description =
          "Begins a WebAuthn registration ceremony for the authenticated user and returns a flow id"
              + " plus the browser-ready PublicKeyCredentialCreationOptions to pass to"
              + " navigator.credentials.create().")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Registration options issued"),
    @ApiResponse(responseCode = "401", description = "Authentication required")
  })
  @PostMapping("/register/start")
  public ResponseEntity<PasskeyCeremonyStartResponse> startRegistration(Principal principal) {
    return ResponseEntity.ok(passkeyService.startRegistration(requireUsername(principal)));
  }

  /**
   * Completes registering a new passkey for the authenticated user.
   *
   * @param principal the authenticated principal
   * @param request the attestation response and optional label
   * @return the newly registered passkey
   */
  @Operation(
      summary = "Finish passkey registration",
      description =
          "Completes the registration ceremony: verifies the authenticator attestation against the"
              + " challenge issued by /register/start and stores the new passkey for the user.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Passkey registered successfully"),
    @ApiResponse(
        responseCode = "400",
        description = "Ceremony expired or the attestation response was malformed/unverifiable"),
    @ApiResponse(responseCode = "401", description = "Authentication required"),
    @ApiResponse(responseCode = "409", description = "This passkey is already registered")
  })
  @PostMapping("/register/finish")
  public ResponseEntity<PasskeyDto> finishRegistration(
      Principal principal, @Valid @RequestBody PasskeyRegistrationFinishRequest request) {
    PasskeyDto created =
        passkeyService.finishRegistration(
            requireUsername(principal), request.getFlowId(), request.getCredential(), request.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  /**
   * Lists the authenticated user's passkeys.
   *
   * @param principal the authenticated principal
   * @return the user's passkeys
   */
  @Operation(
      summary = "List my passkeys",
      description = "Returns all passkeys registered by the authenticated user, newest first.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Passkeys returned"),
    @ApiResponse(responseCode = "401", description = "Authentication required")
  })
  @GetMapping
  public ResponseEntity<List<PasskeyDto>> listPasskeys(Principal principal) {
    return ResponseEntity.ok(passkeyService.listPasskeys(requireUsername(principal)));
  }

  /**
   * Renames one of the authenticated user's passkeys.
   *
   * @param principal the authenticated principal
   * @param id the passkey id
   * @param request the new name
   * @return the updated passkey
   */
  @Operation(summary = "Rename a passkey", description = "Updates the friendly label of a passkey the user owns.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Passkey renamed"),
    @ApiResponse(responseCode = "400", description = "Invalid name"),
    @ApiResponse(responseCode = "401", description = "Authentication required"),
    @ApiResponse(responseCode = "404", description = "Passkey not found")
  })
  @PatchMapping("/{id}")
  public ResponseEntity<PasskeyDto> renamePasskey(
      Principal principal, @PathVariable Long id, @Valid @RequestBody PasskeyRenameRequest request) {
    return ResponseEntity.ok(
        passkeyService.renamePasskey(requireUsername(principal), id, request.getName()));
  }

  /**
   * Deletes one of the authenticated user's passkeys.
   *
   * @param principal the authenticated principal
   * @param id the passkey id
   * @return an empty {@code 204} response
   */
  @Operation(summary = "Delete a passkey", description = "Permanently removes a passkey the user owns.")
  @ApiResponses({
    @ApiResponse(responseCode = "204", description = "Passkey deleted"),
    @ApiResponse(responseCode = "401", description = "Authentication required"),
    @ApiResponse(responseCode = "404", description = "Passkey not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePasskey(Principal principal, @PathVariable Long id) {
    passkeyService.deletePasskey(requireUsername(principal), id);
    return ResponseEntity.noContent().build();
  }

  /**
   * Begins a passkey login. Public endpoint; an optional username scopes the ceremony.
   *
   * @param request the optional username
   * @return the ceremony flow id and request options
   */
  @Operation(
      summary = "Start passkey login",
      description =
          "Begins a WebAuthn assertion ceremony and returns a flow id plus the browser-ready"
              + " PublicKeyCredentialRequestOptions. Provide a username to scope the ceremony, or"
              + " omit the body for a username-less (discoverable credential) login. Public"
              + " endpoint — no authentication required.")
  @ApiResponses(
      @ApiResponse(responseCode = "200", description = "Assertion options issued"))
  @SecurityRequirements
  @PostMapping("/authenticate/start")
  public ResponseEntity<PasskeyCeremonyStartResponse> startAuthentication(
      @RequestBody(required = false) PasskeyAuthenticationStartRequest request) {
    String username = request == null ? null : request.getUsername();
    return ResponseEntity.ok(passkeyService.startAuthentication(username));
  }

  /**
   * Completes a passkey login and issues a JWT on success.
   *
   * @param request the assertion response and flow id
   * @return a JWT token and the authenticated username
   */
  @Operation(
      summary = "Finish passkey login",
      description =
          "Completes the assertion ceremony: verifies the authenticator signature and, on success,"
              + " returns a JWT and the authenticated username. Public endpoint — no authentication"
              + " required.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Authenticated; JWT issued"),
    @ApiResponse(
        responseCode = "400",
        description = "Ceremony expired or the assertion response was malformed"),
    @ApiResponse(responseCode = "401", description = "Passkey authentication failed")
  })
  @SecurityRequirements
  @PostMapping("/authenticate/finish")
  public ResponseEntity<Map<String, String>> finishAuthentication(
      @Valid @RequestBody PasskeyAuthenticationFinishRequest request) {
    String username = passkeyService.finishAuthentication(request.getFlowId(), request.getCredential());
    String token = jwtTokenUtil.generateToken(username);

    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    response.put("username", username);
    return ResponseEntity.ok(response);
  }

  /**
   * Resolves the authenticated username, failing with {@code 401} if the request is unauthenticated.
   *
   * @param principal the authenticated principal
   * @return the username
   */
  private String requireUsername(Principal principal) {
    if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
      throw new PasskeyException(HttpStatus.UNAUTHORIZED, "Authentication required");
    }
    return principal.getName();
  }
}
