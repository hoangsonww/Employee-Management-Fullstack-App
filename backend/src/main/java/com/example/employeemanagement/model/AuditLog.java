package com.example.employeemanagement.model;

import javax.persistence.*;
import java.time.LocalDateTime;

/** This class represents the audit log entity for tracking user actions. */
@Entity
@Table(name = "audit_logs")
public class AuditLog {

  /** The audit log ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** The timestamp of the action. */
  @Column(nullable = false)
  private LocalDateTime timestamp;

  /** The user ID who performed the action. */
  @Column(name = "actor_user_id")
  private Long actorUserId;

  /** The action performed. */
  @Column(nullable = false, length = 64)
  private String action;

  /** The type of resource acted upon. */
  @Column(nullable = false, length = 64, name = "resource_type")
  private String resourceType;

  /** The ID of the resource acted upon. */
  @Column(length = 64, name = "resource_id")
  private String resourceId;

  /** Additional details about the action in JSON format. */
  @Column(columnDefinition = "TEXT")
  private String details;

  /** The IP address from which the action was performed. */
  @Column(length = 64)
  private String ip;

  /** The user agent of the client. */
  @Column(length = 255, name = "user_agent")
  private String userAgent;

  /** Whether the action was performed during impersonation. */
  @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
  private Boolean impersonated = false;

  // Constructors

  /** Default constructor. */
  public AuditLog() {
    this.timestamp = LocalDateTime.now();
  }

  /**
   * Constructor with basic audit information.
   *
   * @param actorUserId The ID of the user performing the action
   * @param action The action performed
   * @param resourceType The type of resource
   * @param resourceId The ID of the resource
   */
  public AuditLog(Long actorUserId, String action, String resourceType, String resourceId) {
    this();
    this.actorUserId = actorUserId;
    this.action = action;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  // Getters and Setters

  /**
   * Gets the audit log ID.
   *
   * @return The audit log ID
   */
  public Long getId() {
    return id;
  }

  /**
   * Sets the audit log ID.
   *
   * @param id The audit log ID
   */
  public void setId(Long id) {
    this.id = id;
  }

  /**
   * Gets the timestamp.
   *
   * @return The timestamp
   */
  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  /**
   * Sets the timestamp.
   *
   * @param timestamp The timestamp
   */
  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  /**
   * Gets the actor user ID.
   *
   * @return The actor user ID
   */
  public Long getActorUserId() {
    return actorUserId;
  }

  /**
   * Sets the actor user ID.
   *
   * @param actorUserId The actor user ID
   */
  public void setActorUserId(Long actorUserId) {
    this.actorUserId = actorUserId;
  }

  /**
   * Gets the action.
   *
   * @return The action
   */
  public String getAction() {
    return action;
  }

  /**
   * Sets the action.
   *
   * @param action The action
   */
  public void setAction(String action) {
    this.action = action;
  }

  /**
   * Gets the resource type.
   *
   * @return The resource type
   */
  public String getResourceType() {
    return resourceType;
  }

  /**
   * Sets the resource type.
   *
   * @param resourceType The resource type
   */
  public void setResourceType(String resourceType) {
    this.resourceType = resourceType;
  }

  /**
   * Gets the resource ID.
   *
   * @return The resource ID
   */
  public String getResourceId() {
    return resourceId;
  }

  /**
   * Sets the resource ID.
   *
   * @param resourceId The resource ID
   */
  public void setResourceId(String resourceId) {
    this.resourceId = resourceId;
  }

  /**
   * Gets the details.
   *
   * @return The details
   */
  public String getDetails() {
    return details;
  }

  /**
   * Sets the details.
   *
   * @param details The details
   */
  public void setDetails(String details) {
    this.details = details;
  }

  /**
   * Gets the IP address.
   *
   * @return The IP address
   */
  public String getIp() {
    return ip;
  }

  /**
   * Sets the IP address.
   *
   * @param ip The IP address
   */
  public void setIp(String ip) {
    this.ip = ip;
  }

  /**
   * Gets the user agent.
   *
   * @return The user agent
   */
  public String getUserAgent() {
    return userAgent;
  }

  /**
   * Sets the user agent.
   *
   * @param userAgent The user agent
   */
  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
  }

  /**
   * Gets whether the action was performed during impersonation.
   *
   * @return True if impersonated, false otherwise
   */
  public Boolean getImpersonated() {
    return impersonated;
  }

  /**
   * Sets whether the action was performed during impersonation.
   *
   * @param impersonated True if impersonated, false otherwise
   */
  public void setImpersonated(Boolean impersonated) {
    this.impersonated = impersonated;
  }
}