package com.example.employeemanagement.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    /** Unique identifier for the user. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Username used for authentication. Must be unique. */
    @Column(nullable = false, unique = true)
    private String username;

    /** Encrypted password for authentication. */
    @Column(nullable = false)
    private String password;

    /**
     * Role assigned to the user.
     * Example values: ADMIN, EMPLOYEE, MANAGER, HR
     * Used for role-based access control (RBAC).
     */
    @Column(nullable = false)
    private String role;
}