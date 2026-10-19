
/* =========================================
   TIONG SAN — AMBIENT BACKGROUND
   Creates glass bubbles and floating particles.
   No external libraries required.
   ========================================= */

(() => {
  "use strict";

  function initializeAmbientBackground() {
    // Prevent duplicate background layers.
    if (document.querySelector(".ambient-background")) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const background = document.createElement("div");
    background.className = "ambient-background";
    background.setAttribute("aria-hidden", "true");

    // Insert first so the layer stays behind the website content.
    document.body.prepend(background);

    // Keep the static cream and gradient background, but do not
    // create moving decorative elements for reduced-motion users.
    if (reducedMotion.matches) {
      return;
    }

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    // -----------------------------------------
    // GLASS BUBBLES
    // -----------------------------------------

    const bubbleCount = window.innerWidth <= 768 ? 5 : 9;

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("span");

      bubble.className = "ambient-bubble";

      bubble.style.setProperty(
        "--bubble-size",
        `${Math.round(random(35, 125))}px`
      );

      bubble.style.setProperty(
        "--bubble-left",
        `${random(2, 94)}%`
      );

      bubble.style.setProperty(
        "--bubble-top",
        `${random(5, 95)}%`
      );

      bubble.style.setProperty(
        "--bubble-duration",
        `${Math.round(random(18, 32))}s`
      );

      bubble.style.setProperty(
        "--bubble-delay",
        `${-random(0, 25)}s`
      );

      bubble.style.setProperty(
        "--bubble-opacity",
        random(0.16, 0.34).toFixed(2)
      );

      background.appendChild(bubble);
    }

    // -----------------------------------------
    // FLOATING GOLD AND BURGUNDY PARTICLES
    // -----------------------------------------

    const particleCount = window.innerWidth <= 768 ? 10 : 22;

    const particleColors = [
      "#c79a2b",
      "#a90000",
      "#e0bd69",
      "#780000"
    ];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");

      particle.className = "ambient-particle";

      particle.style.setProperty(
        "--particle-left",
        `${random(1, 99)}%`
      );

      particle.style.setProperty(
        "--particle-top",
        `${random(10, 100)}%`
      );

      particle.style.setProperty(
        "--particle-size",
        `${random(2, 4).toFixed(1)}px`
      );

      particle.style.setProperty(
        "--particle-color",
        particleColors[
          Math.floor(Math.random() * particleColors.length)
        ]
      );

      particle.style.setProperty(
        "--particle-opacity",
        random(0.18, 0.42).toFixed(2)
      );

      particle.style.setProperty(
        "--particle-duration",
        `${Math.round(random(16, 28))}s`
      );

      particle.style.setProperty(
        "--particle-delay",
        `${-random(0, 25)}s`
      );

      background.appendChild(particle);
    }

    // If the visitor changes their OS accessibility preference
    // while the page is open, stop or resume decorative motion.
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        background
          .querySelectorAll(".ambient-bubble, .ambient-particle")
          .forEach((element) => element.remove());
      } else if (!background.querySelector(".ambient-bubble")) {
        // Rebuild once if motion is enabled again.
        background.remove();
        initializeAmbientBackground();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAmbientBackground,
      { once: true }
    );
  } else {
    initializeAmbientBackground();
  }
})();
