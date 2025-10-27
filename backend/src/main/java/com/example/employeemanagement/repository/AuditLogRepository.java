package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/** This interface represents the repository for the AuditLog entity. */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

  /**
   * Finds audit logs by actor user ID.
   *
   * @param actorUserId The actor user ID
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  Page<AuditLog> findByActorUserId(Long actorUserId, Pageable pageable);

  /**
   * Finds audit logs by action.
   *
   * @param action The action
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  Page<AuditLog> findByAction(String action, Pageable pageable);

  /**
   * Finds audit logs by resource type.
   *
   * @param resourceType The resource type
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  Page<AuditLog> findByResourceType(String resourceType, Pageable pageable);

  /**
   * Finds audit logs within a date range.
   *
   * @param startDate The start date
   * @param endDate The end date
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  Page<AuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

  /**
   * Finds audit logs by multiple criteria.
   *
   * @param actorUserId The actor user ID (optional)
   * @param action The action (optional)
   * @param resourceType The resource type (optional)
   * @param startDate The start date (optional)
   * @param endDate The end date (optional)
   * @param pageable Pagination information
   * @return Page of audit logs
   */
  @Query("SELECT a FROM AuditLog a WHERE " +
         "(:actorUserId IS NULL OR a.actorUserId = :actorUserId) AND " +
         "(:action IS NULL OR a.action = :action) AND " +
         "(:resourceType IS NULL OR a.resourceType = :resourceType) AND " +
         "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
         "(:endDate IS NULL OR a.timestamp <= :endDate)")
  Page<AuditLog> findByCriteria(
      @Param("actorUserId") Long actorUserId,
      @Param("action") String action,
      @Param("resourceType") String resourceType,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);
}