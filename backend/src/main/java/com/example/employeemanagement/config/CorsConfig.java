package com.example.employeemanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** This class represents the configuration for CORS. */
@Configuration
public class CorsConfig {

  /**
   * Configure CORS. This is done by adding a CORS mapping that allows requests from <a
   * href="http://localhost:3000">...</a> (the React frontend) to the backend.
   *
   * @return WebMvcConfigurer
   */
  @Bean
  public WebMvcConfigurer corsConfigurer() {

    // Add CORS mappings
    return new WebMvcConfigurer() {

      /**
       * Add CORS mappings.
       *
       * @param registry CORS registry
       */
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
      }
    };
  }
}
