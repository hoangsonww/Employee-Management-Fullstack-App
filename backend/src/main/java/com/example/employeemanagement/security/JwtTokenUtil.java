package com.example.employeemanagement.security;

import com.example.employeemanagement.model.Permission;
import com.example.employeemanagement.model.Role;
import com.example.employeemanagement.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/** This class represents the JWT token utility. */
@Component
public class JwtTokenUtil {

  /** The secret key. */
  private String secret = "secretKey";

  /**
   * Extract username.
   *
   * @param token The token
   * @return The username
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extract user ID.
   *
   * @param token The token
   * @return The user ID
   */
  public Long extractUserId(String token) {
    return extractClaim(token, claims -> Long.parseLong(claims.get("userId").toString()));
  }

  /**
   * Extract roles.
   *
   * @param token The token
   * @return List of role names
   */
  @SuppressWarnings("unchecked")
  public List<String> extractRoles(String token) {
    return extractClaim(token, claims -> (List<String>) claims.get("roles"));
  }

  /**
   * Extract permissions.
   *
   * @param token The token
   * @return List of permission names
   */
  @SuppressWarnings("unchecked")
  public List<String> extractPermissions(String token) {
    return extractClaim(token, claims -> (List<String>) claims.get("permissions"));
  }

  /**
   * Extract impersonation status.
   *
   * @param token The token
   * @return True if impersonated, false otherwise
   */
  public Boolean extractImpersonated(String token) {
    return extractClaim(token, claims -> Boolean.valueOf(claims.get("impersonated", Boolean.class)));
  }

  /**
   * Extract expiration.
   *
   * @param token The token
   * @return The expiration date
   */
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /**
   * Extract claim.
   *
   * @param token The token
   * @param claimsResolver The claims resolver
   * @return The claim
   * @param <T> The type of the claim
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /**
   * Extract all claims.
   *
   * @param token The token
   * @return The claims
   */
  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
  }

  /**
   * Determine if the token is expired.
   *
   * @param token The token
   * @return True if the token is expired, false otherwise
   */
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  /**
   * Generate JWT token with user details including roles and permissions.
   *
   * @param user The user for whom to generate the token
   * @return The JWT token
   */
  public String generateToken(User user) {
    List<String> roles = user.getRoles().stream()
        .map(Role::getName)
        .collect(Collectors.toList());

    List<String> permissions = user.getAllPermissions().stream()
        .map(Permission::getName)
        .collect(Collectors.toList());

    return Jwts.builder()
        .setSubject(user.getUsername())
        .claim("userId", user.getId())
        .claim("roles", roles)
        .claim("permissions", permissions)
        .claim("impersonated", false)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 1 week validity
        .signWith(SignatureAlgorithm.HS256, secret)
        .compact();
  }

  /**
   * Generate JWT token with username (legacy method for backward compatibility).
   *
   * @param username The username
   * @return The JWT token
   */
  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 1 week validity
        .signWith(SignatureAlgorithm.HS256, secret)
        .compact();
  }

  /**
   * Generate impersonation JWT token.
   *
   * @param user The user being impersonated
   * @param impersonatorId The ID of the user performing impersonation
   * @return The JWT token with impersonation flag
   */
  public String generateImpersonationToken(User user, Long impersonatorId) {
    List<String> roles = user.getRoles().stream()
        .map(Role::getName)
        .collect(Collectors.toList());

    List<String> permissions = user.getAllPermissions().stream()
        .map(Permission::getName)
        .collect(Collectors.toList());

    return Jwts.builder()
        .setSubject(user.getUsername())
        .claim("userId", user.getId())
        .claim("roles", roles)
        .claim("permissions", permissions)
        .claim("impersonated", true)
        .claim("impersonatorId", impersonatorId)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 2)) // 2 hours for impersonation
        .signWith(SignatureAlgorithm.HS256, secret)
        .compact();
  }

  /**
   * Validate token.
   *
   * @param token The token
   * @param username The username
   * @return True if the token is valid, false otherwise
   */
  public Boolean validateToken(String token, String username) {
    final String extractedUsername = extractUsername(token);
    return (extractedUsername.equals(username) && !isTokenExpired(token));
  }
}
