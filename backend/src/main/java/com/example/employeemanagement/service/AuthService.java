package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.AuthRequestDto;
import com.example.employeemanagement.dto.ResetPasswordRequestDto;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import com.example.employeemanagement.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Register a new user.
     */
    public void registerUser(AuthRequestDto request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("EMPLOYEE");

        userRepository.save(user);
    }

    /**
     * Authenticate user and generate JWT token.
     */
    public String authenticate(AuthRequestDto request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getUsername());

        return jwtTokenUtil.generateToken(userDetails.getUsername());
    }

    /**
     * Verify if username exists.
     */
    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    /**
     * Reset password for a user.
     */
    public void resetPassword(ResetPasswordRequestDto request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Username not found: " + request.getUsername()
                        )
                );

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Assign role to users. From default EMPLOYEE to a certain role
    public void assignRole(Long userId, String role) {

        List<String> validRoles = List.of("ADMIN", "MANAGER", "EMPLOYEE", "HR");

        String normalizedRole = role.toUpperCase();

        if (!validRoles.contains(normalizedRole)) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + userId)
                );

        user.setRole(normalizedRole);
        userRepository.save(user);
    }

    // Get all the users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}