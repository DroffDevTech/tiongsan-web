/* =========================================
   TIONG SAN WEBSITE
   MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");
  const backToTop = document.getElementById("backToTop");

  /*
    CONTACT EMAIL SETUP

    Replace the empty string with Tiong San's
    official email address when available.

    Example:
    const CONTACT_EMAIL = "info@example.com";
  */
  const CONTACT_EMAIL = "";

  // Update copyright year automatically.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // =========================================
  // MOBILE NAVIGATION
  // =========================================

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        mainNav.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // =========================================
  // ACTIVE NAVIGATION SECTION
  // =========================================

  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =========================================
   TIONG SAN — LOADING SKELETON CONTROLLER
   ========================================= */

  (() => {
    "use strict";

    const loader = document.getElementById("pageLoader");

    if (!loader) return;

    let dismissed = false;

    function hideLoader() {
      if (dismissed) return;
      dismissed = true;

      loader.classList.add("is-hidden");
      loader.setAttribute("aria-hidden", "true");
      loader.removeAttribute("role");

      // Remove the overlay after its fade-out.
      window.setTimeout(() => {
        loader.remove();
      }, 400);
    }

    // Wait for images, stylesheets, and other page resources.
    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }

    // Safety fallback if a resource takes too long.
    // The website should not remain covered indefinitely.
    window.setTimeout(hideLoader, 8000);
  })();

  // =========================================
  // BACK TO TOP
  // =========================================

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true,
  });

  updateBackToTop();

  /* =========================================
   TIONG SAN — SCROLL REVEAL ANIMATIONS
   Add to the END of app.js
   ========================================= */

  document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Respect the visitor's motion preference.
    if (reducedMotion.matches) return;

    const revealSelectors = [
      ".section-heading",
      ".highlight",
      ".department-card",
      ".promo-panel",
      ".about-copy",
      ".about-visual",
    ];

    const elements = document.querySelectorAll(revealSelectors.join(", "));

    if (!elements.length) return;

    // If IntersectionObserver isn't supported, show everything normally.
    if (!("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("motion-ready");

    elements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");

      // Small stagger between neighboring elements.
      element.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    // If the visitor enables reduced motion while the page is open,
    // reveal all content immediately.
    function handleMotionPreference(event) {
      if (!event.matches) return;

      document.documentElement.classList.remove("motion-ready");

      elements.forEach((element) => {
        element.classList.add("is-visible");
        element.style.removeProperty("--reveal-delay");
      });

      observer.disconnect();
    }

    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", handleMotionPreference);
    } else {
      reducedMotion.addListener(handleMotionPreference);
    }
  });

  // =========================================
  // IMAGE ERROR HANDLING
  // =========================================

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    });

    if (img.complete && img.naturalWidth === 0) {
      img.classList.add("image-unavailable");
    }
  });

  // =========================================
  // SOCIAL MEDIA LINKS
  // =========================================

  document.querySelectorAll(".social-card").forEach((link) => {
    const href = link.getAttribute("href");

    // Prevent placeholder links from sending visitors nowhere.
    if (
      !href ||
      href.startsWith("#") ||
      href.includes("YOUR_FACEBOOK") ||
      href.includes("YOUR_INSTAGRAM") ||
      href.includes("YOUR_TIKTOK")
    ) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
      });

      link.setAttribute("aria-disabled", "true");
      link.title = "Social media profile link has not been configured yet.";
      link.classList.add("social-link-unavailable");
      return;
    }

    // Open external social profiles in a separate tab.
    if (
      /^https:\/\/(www\.)?(facebook\.com|instagram\.com|tiktok\.com)\//i.test(
        href,
      )
    ) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  // =========================================
  // CONTACT FORM
  // =========================================

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "";

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !subject || !message) {
        formStatus.textContent = "Please complete all required fields.";
        return;
      }

      // Basic email format validation.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        return;
      }

      const emailSubject = `Tiong San Website Inquiry: ${subject}`;

      const emailBody = [
        "Hello Tiong San Team,",
        "",
        "I would like to make an inquiry.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        "Sent through the Tiong San website contact form.",
      ].join("\n");

      const recipient = CONTACT_EMAIL.trim();

      const mailtoUrl =
        `mailto:${encodeURIComponent(recipient)}` +
        `?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      if (!recipient) {
        formStatus.textContent =
          "The website email recipient has not been configured yet. " +
          "Please contact Tiong San using the phone numbers listed on this website.";
        return;
      }

      formStatus.textContent =
        "Opening your email application. Please review and send your message.";

      window.location.href = mailtoUrl;
    });
  }
});
