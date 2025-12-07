package com.example.employeemanagement.security;

import com.example.employeemanagement.model.User;
import com.example.employeemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/** This class represents the custom user details service. */
@Service
public class CustomUserDetailsService implements UserDetailsService {

  /** The user repository. */
  @Autowired
  private UserRepository userRepository;

  /**
   * Load user by username.
   *
   * @param username The username
   * @return The user details
   * @throws UsernameNotFoundException If the username is not found
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

    return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
  }
}
