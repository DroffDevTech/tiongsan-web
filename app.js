
/* =========================================================
   TIONG SAN WEBSITE - JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const currentYear = document.getElementById("currentYear");

  // Automatically update the copyright year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    mainNav.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the mobile menu after choosing a section.
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when clicking outside the navigation.
    document.addEventListener("click", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Restore the normal desktop navigation after resizing.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // Highlight the navigation link for the visible section.
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleEntries.length === 0) return;

        const activeId = visibleEntries[0].target.id;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Keep broken remote images from showing a broken-image icon.
  // The HTML alt text remains available to assistive technology.
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    });
  });

  console.log("Tiong San website initialized.");
});
