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

/** REST API for registering, authenticating with, and managing passkeys (WebAuthn credentials). */
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
  @Operation(summary = "Start passkey registration")
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
  @Operation(summary = "Finish passkey registration")
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
  @Operation(summary = "List my passkeys")
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
  @Operation(summary = "Rename a passkey")
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
  @Operation(summary = "Delete a passkey")
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
  @Operation(summary = "Start passkey login")
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
  @Operation(summary = "Finish passkey login")
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
