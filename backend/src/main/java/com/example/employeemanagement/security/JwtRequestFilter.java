package com.example.employeemanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/** This class represents the JWT request filter. */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

  /** The user details service. */
  @Autowired private UserDetailsService userDetailsService;

  /** The JWT token util. */
  @Autowired private JwtTokenUtil jwtTokenUtil;

  /**
   * Do filter internal.
   *
   * @param request The HTTP servlet request
   * @param response The HTTP servlet response
   * @param chain The filter chain
   * @throws ServletException If an error occurs
   * @throws IOException If an error occurs
   */
  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    final String authorizationHeader = request.getHeader("Authorization");

    String username = null;
    String jwt = null;

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      jwt = authorizationHeader.substring(7);
      try {
        username = jwtTokenUtil.extractUsername(jwt);
      } catch (Exception e) {
        // Invalid token, continue without authentication
      }
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        // Extract user details from JWT token
        Long userId = jwtTokenUtil.extractUserId(jwt);
        List<String> roles = jwtTokenUtil.extractRoles(jwt);
        List<String> permissions = jwtTokenUtil.extractPermissions(jwt);
        Boolean impersonated = jwtTokenUtil.extractImpersonated(jwt);

        // Validate token
        if (jwtTokenUtil.validateToken(jwt, username)) {
          // Create UserDetails with JWT information
          JwtUserDetails userDetails = new JwtUserDetails(username, userId, roles, permissions, impersonated);

          UsernamePasswordAuthenticationToken authenticationToken =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());
          authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
      } catch (Exception e) {
        // Token parsing failed, try fallback to regular user details
        try {
          UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
          if (jwtTokenUtil.validateToken(jwt, userDetails.getUsername())) {
            UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
          }
        } catch (Exception ex) {
          // Both JWT and fallback failed, continue without authentication
        }
      }
    }
    chain.doFilter(request, response);
  }
}
