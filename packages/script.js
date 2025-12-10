/**
 * Employee Management System - Wiki Page Scripts
 * Handles interactivity, animations, and dynamic content
 */

// Initialize Mermaid
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Mermaid for diagrams
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#667eea",
        primaryTextColor: "#1e3c72",
        primaryBorderColor: "#764ba2",
        lineColor: "#667eea",
        secondaryColor: "#10b981",
        tertiaryColor: "#f59e0b",
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#f3f4f6",
        clusterBkg: "#e0e7ff",
        clusterBorder: "#667eea",
        titleColor: "#1e3c72",
        edgeLabelBackground: "#ffffff",
        nodeTextColor: "#1e3c72",
        fontSize: "18px",
      },
      flowchart: {
        curve: "basis",
        padding: 30,
        nodeSpacing: 80,
        rankSpacing: 80,
        useMaxWidth: true,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 20,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
    });

    // Apply custom styling to large diagrams after rendering
    setTimeout(() => {
      document.querySelectorAll(".mermaid-large svg").forEach((svg) => {
        svg.style.width = "100%";
        svg.style.height = "auto";
      });
    }, 1000);
  }

  // Initialize all interactive features
  initScrollProgress();
  initHamburgerMenu();
  initActiveSection();
  initSmoothScrolling();
  initTabSwitching();
  initAnimations();
  initLazyLoading();
  initNavbarScroll();
  initStatCounters();
  initCodeBlockCopy();
  initSearchHighlight();
});

/**
 * Scroll progress bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById("progressBar");

  if (!progressBar) return;

  let ticking = false;

  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const scrollPercentage =
      (scrollTop / (documentHeight - windowHeight)) * 100;

    // Update progress bar width
    progressBar.style.width =
      Math.min(100, Math.max(0, scrollPercentage)) + "%";

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateProgressBar);
      ticking = true;
    }
  });

  // Trigger once on load
  updateProgressBar();
}

/**
 * Hamburger menu toggle
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const navOverlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburger || !nav) return;

  // Toggle menu
  const toggleMenu = (show) => {
    if (show) {
      hamburger.classList.add("active");
      nav.classList.add("active");
      if (navOverlay) navOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      if (navOverlay) navOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // Toggle on hamburger click
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = nav.classList.contains("active");
    toggleMenu(!isActive);
  });

  // Close menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1200) {
        toggleMenu(false);
      }
    });
  });

  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener("click", () => {
      toggleMenu(false);
    });
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      toggleMenu(false);
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      toggleMenu(false);
    }
  });
}

/**
 * Active section highlighting in navigation
 */
function initActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -80% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        // Remove active class from all links
        navLinks.forEach((link) => {
          link.classList.remove("active-section");
        });

        // Add active class to current section link
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add("active-section");
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's just "#"
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without jumping
      history.pushState(null, null, targetId);
    });
  });
}

/**
 * Tab switching functionality
 */
function initTabSwitching() {
  // Tab button click handlers
  const tabButtons = document.querySelectorAll(".tab-button");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.textContent
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      showTab(tabName.split("-")[0]); // Get first word (local, docker, kubernetes)
    });
  });
}

/**
 * Show specific tab
 */
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.remove("active");
  });

  // Deactivate all tab buttons
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Show selected tab content
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Activate corresponding button
  const buttonText = tabName.charAt(0).toUpperCase() + tabName.slice(1);
  tabButtons.forEach((button) => {
    if (button.textContent.toLowerCase().includes(tabName)) {
      button.classList.add("active");
    }
  });
}

/**
 * Intersection Observer for scroll animations
 */
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate cards and sections
  const animatedElements = document.querySelectorAll(`
        .card,
        .feature-card,
        .deployment-card,
        .stage-card,
        .step,
        .api-section,
        .tech-category
    `);

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
  });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
  const header = document.querySelector(".header");
  const logo = document.querySelector(".logo");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
}

/**
 * Animated counter for statistics
 */
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-value");
  const speed = 200; // Animation speed

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const target = stat.textContent.replace(/\D/g, "");

        if (target) {
          animateCounter(stat, 0, parseInt(target), speed);
          observer.unobserve(stat);
        }
      }
    });
  }, observerOptions);

  stats.forEach((stat) => observer.observe(stat));
}

/**
 * Animate number counter
 */
function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  const suffix = element.textContent.replace(/[0-9]/g, "");

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = end + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

/**
 * Copy code block to clipboard
 */
function initCodeBlockCopy() {
  const codeBlocks = document.querySelectorAll(".code-block");

  codeBlocks.forEach((block) => {
    // Wrap the block if not already wrapped
    if (!block.parentElement.classList.contains("code-block-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);

      // Create copy button
      const copyButton = document.createElement("button");
      copyButton.className = "copy-button";
      copyButton.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
      copyButton.title = "Copy to clipboard";

      // Add button to wrapper (not the scrolling block)
      wrapper.appendChild(copyButton);

      // Copy functionality
      copyButton.addEventListener("click", () => {
        const code = block.querySelector("code, pre").textContent;

        navigator.clipboard
          .writeText(code)
          .then(() => {
            copyButton.innerHTML = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
            copyButton.style.background = "rgba(16, 185, 129, 0.2)";
            copyButton.style.borderColor = "rgba(16, 185, 129, 0.4)";

            setTimeout(() => {
              copyButton.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
              copyButton.style.background = "rgba(255, 255, 255, 0.15)";
              copyButton.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
          });
      });
    }
  });
}

/**
 * Highlight current section in navigation (legacy - now using IntersectionObserver)
 */
function initSearchHighlight() {
  // This function is kept for backwards compatibility
  // Active section highlighting is now handled by initActiveSection()
  console.log(
    "Active section highlighting initialized via IntersectionObserver",
  );
}

/**
 * Add tooltip functionality
 */
function initTooltips() {
  const elements = document.querySelectorAll("[data-tooltip]");

  elements.forEach((element) => {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = element.getAttribute("data-tooltip");
    tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;

    document.body.appendChild(tooltip);

    element.addEventListener("mouseenter", (e) => {
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      tooltip.style.opacity = "1";
    });

    element.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
}

/**
 * Keyboard shortcuts
 */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K to focus search (if implemented)
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    // Focus search if exists
  }

  // Escape to close modals/overlays
  if (e.key === "Escape") {
    // Close any open modals
  }
});

/**
 * Back to top button
 */
function initBackToTop() {
  const button = document.createElement("button");
  button.className = "back-to-top";
  button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
  button.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 999;
    `;

  document.body.appendChild(button);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      button.style.opacity = "1";
      button.style.visibility = "visible";
    } else {
      button.style.opacity = "0";
      button.style.visibility = "hidden";
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-5px) scale(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0) scale(1)";
  });
}

// Initialize back to top button
initBackToTop();

/**
 * Dark mode toggle (optional)
 */
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  if (!darkModeToggle) return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark" || (!currentTheme && prefersDark.matches)) {
    document.body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", theme);
  });
}

/**
 * Performance monitoring
 */
if ("PerformanceObserver" in window) {
  const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "navigation") {
        console.log(
          "Page load time:",
          entry.loadEventEnd - entry.fetchStart,
          "ms",
        );
      }
    });
  });

  perfObserver.observe({ entryTypes: ["navigation"] });
}

/**
 * Error handling
 */
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

/**
 * Service Worker registration (for PWA support)
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
  });
}

/**
 * Analytics tracking (placeholder)
 */
function trackEvent(category, action, label) {
  // Implement analytics tracking here
  console.log("Event tracked:", { category, action, label });
}

// Track button clicks
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    trackEvent("Button", "Click", btn.textContent.trim());
  });
});

// Export functions for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initScrollProgress,
    initHamburgerMenu,
    initActiveSection,
    showTab,
    animateCounter,
    trackEvent,
  };
}

console.log("🚀 Employee Management Wiki loaded successfully!");
