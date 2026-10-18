
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

    Replace the empty string below with the official
    Tiong San email address before publishing.

    Example:
    const CONTACT_EMAIL = "your-official-email@example.com";

    No email address has been supplied yet, so the form
    will prepare an email without a recipient. The customer
    must enter the recipient before sending.
  */
  const CONTACT_EMAIL = "";

  // Update the copyright year automatically.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
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

  // Highlight the navigation link for the visible section.
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

  // Show the back-to-top button after scrolling.
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

  // Hide images that fail to load.
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    });

    if (img.complete && img.naturalWidth === 0) {
      img.classList.add("image-unavailable");
    }
  });

  // Contact form: prepare a message in the user's email application.
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

      formStatus.textContent =
        "Opening your email application. Please review and send your message.";

      // Open the user's configured email application.
      window.location.href = mailtoUrl;
    });
  }
});
