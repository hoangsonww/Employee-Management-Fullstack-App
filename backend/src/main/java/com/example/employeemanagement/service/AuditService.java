package com.example.employeemanagement.service;

import com.example.employeemanagement.model.AuditLog;
import com.example.employeemanagement.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

/** This service handles audit logging functionality. */
@Service
public class AuditService {

  @Autowired private AuditLogRepository auditLogRepository;

  /**
   * Logs an audit event.
   *
   * @param actorUserId The ID of the user performing the action
   * @param action The action being performed
   * @param resourceType The type of resource being acted upon
   * @param resourceId The ID of the resource (optional)
   * @param details Additional details in JSON format (optional)
   * @param request The HTTP request for extracting IP and user agent (optional)
   * @param impersonated Whether the action is being performed during impersonation
   */
  public void logAuditEvent(
      Long actorUserId,
      String action,
      String resourceType,
      String resourceId,
      String details,
      HttpServletRequest request,
      boolean impersonated) {

    AuditLog auditLog = new AuditLog(actorUserId, action, resourceType, resourceId);
    auditLog.setDetails(details);
    auditLog.setImpersonated(impersonated);

    if (request != null) {
      auditLog.setIp(getClientIpAddress(request));
      auditLog.setUserAgent(request.getHeader("User-Agent"));
    }

    auditLogRepository.save(auditLog);
  }

  /**
   * Logs an audit event with minimal information.
   *
   * @param actorUserId The ID of the user performing the action
   * @param action The action being performed
   * @param resourceType The type of resource being acted upon
   * @param resourceId The ID of the resource (optional)
   */
  public void logAuditEvent(Long actorUserId, String action, String resourceType, String resourceId) {
    logAuditEvent(actorUserId, action, resourceType, resourceId, null, null, false);
  }

  /**
   * Gets audit logs based on various criteria.
   *
   * @param actorUserId Filter by actor user ID (optional)
   * @param action Filter by action (optional)
   * @param resourceType Filter by resource type (optional)
   * @param startDate Filter by start date (optional)
   * @param endDate Filter by end date (optional)
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  public Page<AuditLog> getAuditLogs(
      Long actorUserId,
      String action,
      String resourceType,
      LocalDateTime startDate,
      LocalDateTime endDate,
      Pageable pageable) {

    return auditLogRepository.findByCriteria(
        actorUserId, action, resourceType, startDate, endDate, pageable);
  }

  /**
   * Gets all audit logs with pagination.
   *
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  public Page<AuditLog> getAllAuditLogs(Pageable pageable) {
    return auditLogRepository.findAll(pageable);
  }

  /**
   * Extracts the client IP address from the HTTP request.
   *
   * @param request The HTTP request
   * @return The client IP address
   */
  private String getClientIpAddress(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
      return xForwardedFor.split(",")[0];
    }

    String xRealIp = request.getHeader("X-Real-IP");
    if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
      return xRealIp;
    }

    return request.getRemoteAddr();
  }
}