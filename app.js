
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
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

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
            const isActive =
              link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // BACK TO TOP
  // =========================================

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "visible",
      window.scrollY > 500
    );
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

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
    if (/^https:\/\/(www\.)?(facebook\.com|instagram\.com|tiktok\.com)\//i.test(href)) {
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
        formStatus.textContent =
          "Please complete all required fields.";
        return;
      }

      // Basic email format validation.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        formStatus.textContent =
          "Please enter a valid email address.";
        return;
      }

      const emailSubject =
        `Tiong San Website Inquiry: ${subject}`;

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
        "Sent through the Tiong San website contact form."
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
