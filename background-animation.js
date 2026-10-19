
/* =========================================
   TIONG SAN — AMBIENT BACKGROUND SCRIPT
   ========================================= */

(() => {
  "use strict";

  const BACKGROUND_CLASS = "ambient-background";
  const BUBBLE_CLASS = "ambient-bubble";
  const PARTICLE_CLASS = "ambient-particle";

  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let background = null;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clearEffects() {
    if (!background) return;

    background
      .querySelectorAll(`.${BUBBLE_CLASS}, .${PARTICLE_CLASS}`)
      .forEach((element) => element.remove());
  }

  function createBubble(index) {
    const bubble = document.createElement("span");
    bubble.className = BUBBLE_CLASS;
    bubble.setAttribute("aria-hidden", "true");

    const size = random(45, 150);

    bubble.style.setProperty("--left", `${random(2, 95)}%`);
    bubble.style.setProperty("--top", `${random(3, 95)}%`);
    bubble.style.setProperty("--size", `${size}px`);
    bubble.style.setProperty("--opacity", random(0.15, 0.35).toFixed(2));
    bubble.style.setProperty("--duration", `${random(18, 32)}s`);
    bubble.style.setProperty("--delay", `${-random(0, 25)}s`);

    return bubble;
  }

  function createParticle(index) {
    const particle = document.createElement("span");
    particle.className = PARTICLE_CLASS;
    particle.setAttribute("aria-hidden", "true");

    const size = random(2, 5);
    const goldOrRed = Math.random() > 0.25
      ? "#c79a2b"
      : "#a90000";

    particle.style.setProperty("--left", `${random(1, 99)}%`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--opacity", random(0.15, 0.4).toFixed(2));
    particle.style.setProperty("--particle-color", goldOrRed);
    particle.style.setProperty("--duration", `${random(14, 27)}s`);
    particle.style.setProperty("--delay", `${-random(0, 25)}s`);

    return particle;
  }

  function buildEffects() {
    if (!background) return;

    clearEffects();

    // Keep the background still for visitors who prefer reduced motion.
    if (motionQuery.matches) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const bubbleCount = isMobile ? 4 : 8;
    const particleCount = isMobile ? 8 : 16;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < bubbleCount; i++) {
      fragment.appendChild(createBubble(i));
    }

    for (let i = 0; i < particleCount; i++) {
      fragment.appendChild(createParticle(i));
    }

    background.appendChild(fragment);
  }

  function initializeBackground() {
    if (!document.body) return;

    background = document.querySelector(`.${BACKGROUND_CLASS}`);

    if (!background) {
      background = document.createElement("div");
      background.className = BACKGROUND_CLASS;
      background.setAttribute("aria-hidden", "true");

      // Insert first so the decorative layer stays behind page content.
      document.body.prepend(background);
    }

    buildEffects();
  }

  // Rebuild only when the visitor changes their motion preference.
  function handleMotionChange() {
    buildEffects();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeBackground,
      { once: true }
    );
  } else {
    initializeBackground();
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", handleMotionChange);
  } else {
    // Compatibility with older browsers.
    motionQuery.addListener(handleMotionChange);
  }
})();
