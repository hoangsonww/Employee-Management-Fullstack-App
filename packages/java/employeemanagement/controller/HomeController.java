package com.example.employeemanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Controller to redirect the root path to Swagger UI. */
@Controller
public class HomeController {

  /**
   * Redirects the root path to Swagger UI.
   *
   * @return The redirect URL
   */
  @GetMapping("/")
  public String redirectToSwagger() {
    // Redirects to Swagger UI
    return "redirect:/swagger-ui.html";
  }
}
