package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.AssignRoleRequestDto;
import com.example.employeemanagement.dto.AuthRequestDto;
import com.example.employeemanagement.dto.ResetPasswordRequestDto;
import com.example.employeemanagement.dto.UserResponseDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** REST API controller for authentication and user management operations. */
@RestController
@Tag(name = "Authentication APIs", description = "API Operations related to user authentication")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user.
     *
     * @param request the registration request containing username and password
     * @return success message
     */
    @Operation(summary = "Register user", description = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @Valid @RequestBody AuthRequestDto request) {

        authService.registerUser(request);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully"
        ));
    }

    /**
     * Authenticate user and generate JWT token.
     *
     * @param request the authentication request
     * @return JWT token
     */
    @Operation(
            summary = "Authenticate user",
            description = "Authenticate a user and generate a JWT token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid username or password")
    })
    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> createAuthenticationToken(
            @Valid @RequestBody AuthRequestDto request) {

        String jwt = authService.authenticate(request);

        return ResponseEntity.ok(Map.of(
                "token", jwt
        ));
    }

    /**
     * Verify if a username exists.
     *
     * @param username the username to check
     * @return existence message
     */
    @Operation(
            summary = "Verify username",
            description = "Verify if a username exists in the system"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Username exists"),
            @ApiResponse(responseCode = "404", description = "Username not found")
    })
    @GetMapping("/verify-username/{username}")
    public ResponseEntity<Map<String, String>> verifyUsername(@PathVariable String username) {

        if (authService.usernameExists(username)) {
            return ResponseEntity.ok(Map.of(
                    "message", "Username exists"
            ));
        }

        throw new ResourceNotFoundException("Username not found");
    }

    /**
     * Reset user password.
     *
     * @param request the password reset request
     * @return success message
     */
    @Operation(
            summary = "Reset password",
            description = "Reset the password for the given username"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "404", description = "Username not found")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDto request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully"
        ));
    }

    /**
     * Assign or update a user's role.
     *
     * @param id the user ID
     * @param request the role assignment request
     * @return success message
     */
    @Operation(
            summary = "Assign role to user",
            description = "Assign or update a user's role (ADMIN only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role assigned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid role"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/api/admin/users/{id}/role")
    public ResponseEntity<Map<String, String>> assignRole(
            @PathVariable Long id,
            @Valid @RequestBody AssignRoleRequestDto request) {

        authService.assignRole(id, request.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "Role updated successfully"
        ));
    }

    /**
     * Retrieve all users (ADMIN only).
     *
     * @return list of users
     */
    @Operation(
            summary = "Get all users",
            description = "Retrieve a list of all registered users (accessible only to ADMIN)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/api/admin/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {

        List<UserResponseDto> users = authService.getAllUsers().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    /**
     * Convert User entity to DTO.
     *
     * @param user the user entity
     * @return user response DTO
     */
    private UserResponseDto convertToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        return dto;
    }
}