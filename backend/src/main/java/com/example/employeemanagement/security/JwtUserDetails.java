package com.example.employeemanagement.security;

import com.example.employeemanagement.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/** Custom UserDetails implementation that includes roles and permissions from JWT. */
public class JwtUserDetails implements UserDetails {

  private final String username;
  private final Long userId;
  private final List<String> roles;
  private final List<String> permissions;
  private final Boolean impersonated;

  /**
   * Constructor for JWT-based user details.
   *
   * @param username The username
   * @param userId The user ID
   * @param roles List of role names
   * @param permissions List of permission names
   * @param impersonated Whether this is an impersonation session
   */
  public JwtUserDetails(String username, Long userId, List<String> roles, List<String> permissions, Boolean impersonated) {
    this.username = username;
    this.userId = userId;
    this.roles = roles;
    this.permissions = permissions;
    this.impersonated = impersonated != null ? impersonated : false;
  }

  /**
   * Constructor from User entity (for non-JWT authentication).
   *
   * @param user The user entity
   */
  public JwtUserDetails(User user) {
    this.username = user.getUsername();
    this.userId = user.getId();
    this.roles = user.getRoles().stream()
        .map(role -> role.getName())
        .collect(Collectors.toList());
    this.permissions = user.getAllPermissions().stream()
        .map(permission -> permission.getName())
        .collect(Collectors.toList());
    this.impersonated = false;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return permissions.stream()
        .map(SimpleGrantedAuthority::new)
        .collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return null; // Not needed for JWT-based authentication
  }

  @Override
  public String getUsername() {
    return username;
  }

  public Long getUserId() {
    return userId;
  }

  public List<String> getRoles() {
    return roles;
  }

  public List<String> getPermissions() {
    return permissions;
  }

  public Boolean getImpersonated() {
    return impersonated;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}