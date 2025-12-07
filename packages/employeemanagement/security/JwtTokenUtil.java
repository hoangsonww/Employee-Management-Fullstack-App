package com.example.employeemanagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

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
   * Generate JWT token.
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
