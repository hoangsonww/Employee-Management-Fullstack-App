package com.example.employeemanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/** This class represents the security configuration. */
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  /** The user details service. */
  @Autowired private UserDetailsService userDetailsService;

  /** The JWT request filter that authenticates requests carrying a Bearer token. */
  @Autowired private JwtRequestFilter jwtRequestFilter;

  /**
   * Configure authentication.
   *
   * @param auth The authentication manager builder
   * @throws Exception If an error occurs
   */
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
  }

  /**
   * Password encoder.
   *
   * @return The password encoder
   */
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * Authentication manager bean.
   *
   * @return The authentication manager
   * @throws Exception If an error occurs
   */
  @Override
  @Bean
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  /**
   * Prevents the {@link JwtRequestFilter} {@code @Component} from being auto-registered with the
   * servlet container, so it executes only once — inside the Spring Security filter chain.
   *
   * @param filter the JWT request filter
   * @return a disabled registration bean
   */
  @Bean
  public FilterRegistrationBean<JwtRequestFilter> jwtRequestFilterRegistration(
      JwtRequestFilter filter) {
    FilterRegistrationBean<JwtRequestFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false);
    return registration;
  }

  /**
   * Configure security.
   *
   * <p>Passkey management endpoints require an authenticated user (resolved from the JWT), while
   * passkey login endpoints and all pre-existing endpoints remain public to preserve current
   * application behaviour. CORS pre-flight requests are always permitted.
   *
   * @param http The HTTP security
   * @throws Exception If an error occurs
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.csrf()
        .disable()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeRequests()
        .antMatchers(HttpMethod.OPTIONS, "/**")
        .permitAll()
        .antMatchers("/api/passkeys/authenticate/**")
        .permitAll()
        .antMatchers("/api/passkeys/register/**")
        .authenticated()
        .antMatchers(HttpMethod.GET, "/api/passkeys")
        .authenticated()
        .antMatchers(HttpMethod.PATCH, "/api/passkeys/**")
        .authenticated()
        .antMatchers(HttpMethod.DELETE, "/api/passkeys/**")
        .authenticated()
        .anyRequest()
        .permitAll()
        .and()
        .exceptionHandling()
        .authenticationEntryPoint(
            (request, response, authException) -> {
              response.setStatus(HttpStatus.UNAUTHORIZED.value());
              response.setContentType("application/json");
              response.getWriter().write("{\"message\":\"Authentication required\"}");
            });

    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
  }
}
