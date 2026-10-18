
/* =========================================================
   TIONG SAN GLASS — VERSION 1
   Frontend interactions and demonstration data
   ========================================================= */

"use strict";

/* ---------------------------------------------------------
   1. MOBILE NAVIGATION
   --------------------------------------------------------- */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuToggle || !mainNav) return;

  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  document.body.classList.toggle("menu-open", isOpen);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (
      mainNav.classList.contains("open") &&
      !clickedInsideNav &&
      !clickedToggle
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

/* ---------------------------------------------------------
   2. ACTIVE NAVIGATION LINK
   --------------------------------------------------------- */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (!visibleSections.length) return;

      const activeId = visibleSections[0].target.id;

      navLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${activeId}`;

        link.classList.toggle("active", isActive);
      });
    },
    {
      rootMargin: "-18% 0px -60% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* ---------------------------------------------------------
   3. DEPARTMENT SEARCH AND FILTERING
   --------------------------------------------------------- */

const departmentSearch = document.getElementById("departmentSearch");
const departmentFilters = document.getElementById("departmentFilters");
const departmentGrid = document.getElementById("departmentGrid");
const departmentEmpty = document.getElementById("departmentEmpty");

let activeDepartmentFilter = "all";

function filterDepartments() {
  if (!departmentGrid) return;

  const query = (departmentSearch?.value || "")
    .trim()
    .toLowerCase();

  const cards = departmentGrid.querySelectorAll(".department-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category || "";
    const name = card.dataset.name || "";
    const title = card.querySelector("h3")?.textContent || "";
    const description =
      card.querySelector("p")?.textContent || "";

    const matchesFilter =
      activeDepartmentFilter === "all" ||
      category === activeDepartmentFilter;

    const searchableText =
      `${name} ${title} ${description}`.toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (departmentEmpty) {
    departmentEmpty.hidden = visibleCount !== 0;
  }
}

if (departmentSearch) {
  departmentSearch.addEventListener("input", filterDepartments);
}

if (departmentFilters) {
  departmentFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeDepartmentFilter = button.dataset.filter;

    departmentFilters.querySelectorAll("[data-filter]").forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    filterDepartments();
  });

  departmentFilters.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === "all")
    );
  });
}

/* Keyboard shortcut: "/" focuses department search. */

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping =
    target instanceof HTMLElement &&
    (
      target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    );

  if (
    event.key === "/" &&
    !isTyping &&
    departmentSearch
  ) {
    event.preventDefault();
    departmentSearch.focus();
  }
});

/* ---------------------------------------------------------
   4. SAMPLE BRAND DIRECTORY
   --------------------------------------------------------- */

/*
  These are demonstration entries, not a verified list of
  brands currently stocked by Tiong San.

  Replace or expand these records when the official brand
  directory has been confirmed.
*/

const brandData = [
  {
    name: "Sample Electronics",
    category: "Gadgets & Electronics",
    icon: "⌘"
  },
  {
    name: "Sample Mobile Devices",
    category: "Gadgets & Electronics",
    icon: "▣"
  },
  {
    name: "Sample Appliance Collection",
    category: "Home Appliances",
    icon: "⌂"
  },
  {
    name: "Sample Kitchen Essentials",
    category: "Home Appliances",
    icon: "◇"
  },
  {
    name: "Sample Grocery Selection",
    category: "Supermarket",
    icon: "✳"
  },
  {
    name: "Sample Everyday Foods",
    category: "Supermarket",
    icon: "❋"
  },
  {
    name: "Sample Clothing Collection",
    category: "Fashion",
    icon: "✧"
  },
  {
    name: "Sample Home Collection",
    category: "Home & Living",
    icon: "⌂"
  }
];

const brandSearch = document.getElementById("brandSearch");
const brandCategory = document.getElementById("brandCategory");
const brandList = document.getElementById("brandList");
const brandResultCount = document.getElementById("brandResultCount");
const brandEmpty = document.getElementById("brandEmpty");

function renderBrands() {
  if (!brandList) return;

  const query = (brandSearch?.value || "")
    .trim()
    .toLowerCase();

  const category = brandCategory?.value || "all";

  const filteredBrands = brandData.filter((brand) => {
    const matchesCategory =
      category === "all" || brand.category === category;

    const searchableText =
      `${brand.name} ${brand.category}`.toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  brandList.replaceChildren();

  filteredBrands.forEach((brand) => {
    const item = document.createElement("div");
    item.className = "brand-item";

    const icon = document.createElement("span");
    icon.className = "brand-item-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = brand.icon;

    const copy = document.createElement("div");
    copy.className = "brand-item-copy";

    const name = document.createElement("strong");
    name.textContent = brand.name;

    const categoryLabel = document.createElement("small");
    categoryLabel.textContent = brand.category;

    copy.append(name, categoryLabel);
    item.append(icon, copy);
    brandList.appendChild(item);
  });

  if (brandResultCount) {
    brandResultCount.textContent =
      `${filteredBrands.length} ${filteredBrands.length === 1 ? "entry" : "entries"}`;
  }

  if (brandEmpty) {
    brandEmpty.hidden = filteredBrands.length !== 0;
  }
}

if (brandSearch) {
  brandSearch.addEventListener("input", renderBrands);
}

if (brandCategory) {
  brandCategory.addEventListener("change", renderBrands);
}

renderBrands();

/* ---------------------------------------------------------
   5. PROMOTIONAL CAROUSEL
   --------------------------------------------------------- */

/*
  These are general promotional messages.
  They do not claim that an actual sale or discount exists.
*/

const promotions = [
  {
    title: "Everyday finds.<br>Made for you.",
    description:
      "Visit Tiong San and discover the departments and essentials waiting for you.",
    artTitle: "SHOP<br>YOUR WAY"
  },
  {
    title: "Discover more.<br>Every visit.",
    description:
      "Explore different departments and find useful ideas for everyday living.",
    artTitle: "EXPLORE<br>MORE"
  },
  {
    title: "Your community.<br>Your Tiong San.",
    description:
      "Find store information and plan your next neighborhood shopping visit.",
    artTitle: "CLOSER<br>TO HOME"
  }
];

const promoTitle = document.getElementById("promoTitle");
const promoDescription = document.getElementById("promoDescription");
const promoArtTitle = document.getElementById("promoArtTitle");
const promoCount = document.getElementById("promoCount");
const promoPrev = document.getElementById("promoPrev");
const promoNext = document.getElementById("promoNext");

let currentPromotion = 0;

function showPromotion(index) {
  if (!promotions.length) return;

  currentPromotion =
    (index + promotions.length) % promotions.length;

  const promotion = promotions[currentPromotion];

  if (promoTitle) {
    promoTitle.innerHTML = promotion.title;
  }

  if (promoDescription) {
    promoDescription.textContent = promotion.description;
  }

  if (promoArtTitle) {
    promoArtTitle.innerHTML = promotion.artTitle;
  }

  if (promoCount) {
    promoCount.textContent =
      `${String(currentPromotion + 1).padStart(2, "0")} / ${String(promotions.length).padStart(2, "0")}`;
  }
}

if (promoPrev) {
  promoPrev.addEventListener("click", () => {
    showPromotion(currentPromotion - 1);
  });
}

if (promoNext) {
  promoNext.addEventListener("click", () => {
    showPromotion(currentPromotion + 1);
  });
}

showPromotion(0);

/* ---------------------------------------------------------
   6. DEMO CONTACT FORM
   --------------------------------------------------------- */

const contactForm = document.getElementById("contactForm");
const formNotice = document.getElementById("formNotice");

if (contactForm && formNotice) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formNotice.textContent = "";
    formNotice.style.color = "";

    if (!contactForm.reportValidity()) {
      return;
    }

    formNotice.textContent =
      "Demo successful! Your form passed validation, but no message was sent or saved.";

    formNotice.style.color = "#256b43";

    /*
      No API request is made.
      No contact details are stored.
      A backend and suitable privacy controls are needed
      before this form can send real inquiries.
    */
  });

  contactForm.addEventListener("input", () => {
    formNotice.textContent = "";
  });
}

/* ---------------------------------------------------------
   7. CURRENT YEAR
   --------------------------------------------------------- */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   8. IMAGE FALLBACK
   --------------------------------------------------------- */

/*
  Images use external URLs. If an image fails to load,
  hide the broken image instead of showing a broken icon.
  The background color behind it remains visible.
*/

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.style.visibility = "hidden";
    image.setAttribute("data-image-error", "true");
  });
});
