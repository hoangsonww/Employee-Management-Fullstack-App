package com.example.employeemanagement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lightweight, dependency-free liveness endpoint.
 *
 * <p>It intentionally touches no database or downstream service so it stays fast and cheap. Its
 * primary purpose is to let the frontend "wake" the instance on page load: on Render's free tier a
 * service spins down after inactivity, and the first request after a spin-down pays a cold start.
 * Pinging this endpoint as soon as a visitor opens the app starts the JVM/Spring context warming
 * while the user is still reading the landing page, so the cold start is hidden rather than felt.
 */
@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Health API", description = "Lightweight liveness/warm-up probe")
public class HealthController {

  /**
   * Reports that the instance is up. Performs no I/O.
   *
   * @return a small JSON body indicating the service is reachable
   */
  @Operation(
      summary = "Liveness probe",
      description = "Returns 200 with a minimal body once the instance is serving requests")
  @GetMapping
  public ResponseEntity<Map<String, String>> health() {
    return ResponseEntity.ok(Map.of("status", "UP"));
  }
}
