/* ═════════════════════════════════════════
   SPLYN New Design — Flavor Switching & Interactions
   ═════════════════════════════════════════ */

// ── Scroll reveal ──
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ── Stagger children of a reveal ──
document.querySelectorAll(".reveal").forEach((el, i) => {
  const delay = el.dataset.delay || 0;
  el.style.transitionDelay = `${(i % 4) * 60 + parseInt(delay)}ms`;
});

// ── Flavor switching ──
const flavorBtns = document.querySelectorAll(".flavor-btn");
const flavorCards = document.querySelectorAll(".flavor-card");
const flavorStage = document.querySelector(".flavor-stage");

function setFlavor(flavor) {
  // Update active buttons
  flavorBtns.forEach((b) =>
    b.classList.toggle("is-active", b.dataset.flavor === flavor)
  );
  
  // Update active cards with smooth transition
  flavorCards.forEach((c) => {
    const isActive = c.classList.contains(`flavor-card-${flavor}`);
    c.classList.toggle("is-active", isActive);
  });
  
  // Update flavor-stage background
  if (flavorStage) {
    flavorStage.setAttribute("data-theme", flavor);
  }
}

flavorBtns.forEach((btn) => {
  btn.addEventListener("click", () => setFlavor(btn.dataset.flavor));
});

// ── Parallax on hero cans ──
const heroVisual = document.querySelector(".hero-visual");
const cans = document.querySelectorAll(".bottle, .cap");
if (heroVisual) {
  heroVisual.addEventListener("mousemove", (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cans.forEach((c, i) => {
      const depth = i === 0 ? 14 : 22;
      c.style.setProperty("--px", `${x * depth}px`);
      c.style.setProperty("--py", `${y * depth}px`);
      c.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
  heroVisual.addEventListener("mouseleave", () => {
    cans.forEach((c) => (c.style.translate = "0 0"));
  });
}

// ── Subtle parallax on scroll for floating cans ──
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      document.querySelectorAll(".rotate-can, .bottle").forEach((el) => {
        el.style.setProperty("--scrollY", y + "px");
      });
      const orb = document.querySelector(".orb");
      if (orb) orb.style.transform = `translateY(${y * 0.05}px)`;
      ticking = false;
    });
    ticking = true;
  }
});

// ── Nav background intensify on scroll ──
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 30) nav.style.background = "#003561";
  else nav.style.background = "#003561";
});

// ── Sticky Bar ──
const stickyBar = document.getElementById("stickyBar");
const heroSection = document.querySelector(".hero");

if (stickyBar && heroSection) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyBar.classList.toggle("visible", !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  observer.observe(heroSection);
}

document.querySelectorAll(".sticky-variant").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sticky-variant").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const variantId = btn.getAttribute("data-variant-id");
    const variantPrice = btn.getAttribute("data-variant-price");
    const variantCompare = btn.getAttribute("data-variant-compare");
    const variantImage = btn.getAttribute("data-variant-image");

    if (variantId) {
      const hiddenInput = document.getElementById("sticky-selected-variant-id");
      if (hiddenInput) hiddenInput.value = variantId;
    }
    if (variantPrice) {
      const priceNow = document.getElementById("sticky-price-now");
      if (priceNow) priceNow.textContent = variantPrice;
    }
    if (variantCompare !== null) {
      const priceOld = document.getElementById("sticky-price-old");
      if (priceOld) priceOld.textContent = variantCompare;
    }
    if (variantImage) {
      const canImg = document.getElementById("sticky-can-img");
      if (canImg) canImg.src = variantImage;
    }
  });
});

// ── Community Image Slider ──
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".slider-dot");
let currentSlide = 0;
let sliderTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function startSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

if (slides.length) {
  document.querySelector(".slider-arrow.next")?.addEventListener("click", () => { goToSlide(currentSlide + 1); startSliderTimer(); });
  document.querySelector(".slider-arrow.prev")?.addEventListener("click", () => { goToSlide(currentSlide - 1); startSliderTimer(); });
  dots.forEach((dot) => dot.addEventListener("click", () => { goToSlide(parseInt(dot.dataset.index)); startSliderTimer(); }));
  startSliderTimer();
}

// ── Ingredients Auto-Slide & Hover Interaction ──
const ingredientItems = document.querySelectorAll(".ingredient-item");
const ingredientBgLayers = document.querySelectorAll(".ingredients-bg-layer, .ingredient-image");
const ingredientsSection = document.getElementById("ingredients");

let currentIngredientIndex = 0;
let ingredientAutoTimer = null;

function activateIngredient(index) {
  if (!ingredientItems.length) return;

  currentIngredientIndex = (index + ingredientItems.length) % ingredientItems.length;

  ingredientItems.forEach((item, i) => {
    const isActive = i === currentIngredientIndex;
    item.classList.toggle("active", isActive);
  });

  const activeImageNum = ingredientItems[currentIngredientIndex].dataset.image;
  ingredientBgLayers.forEach((img) => {
    const isActive = img.dataset.image === activeImageNum;
    img.classList.toggle("active", isActive);
  });
}

function startIngredientTimer() {
  stopIngredientTimer();
  ingredientAutoTimer = setInterval(() => {
    activateIngredient(currentIngredientIndex + 1);
  }, 3500);
}

function stopIngredientTimer() {
  if (ingredientAutoTimer) {
    clearInterval(ingredientAutoTimer);
    ingredientAutoTimer = null;
  }
}

if (ingredientItems.length) {
  // Initialize first slide and start auto timer
  activateIngredient(0);
  startIngredientTimer();

  ingredientItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      stopIngredientTimer();
      activateIngredient(index);
    });
  });

  if (ingredientsSection) {
    ingredientsSection.addEventListener("mouseleave", () => {
      startIngredientTimer();
    });
  }
}

// ── Compulsory Pack Variant Selection Handler ──
document.querySelectorAll(".variant-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const card = pill.closest(".flavor-card-item");
    if (!card) return;

    // Toggle active pill inside this card
    card.querySelectorAll(".variant-pill").forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");

    // Update label text
    const labelText = card.querySelector(".selected-pack-text");
    if (labelText) {
      labelText.textContent = `${pill.dataset.pack} (${pill.dataset.price})`;
      labelText.classList.add("has-selection");
    }

    // Clear error state
    const errorMsg = card.querySelector(".variant-error-msg");
    const pillsContainer = card.querySelector(".variant-pills");
    if (errorMsg) errorMsg.style.display = "none";
    if (pillsContainer) pillsContainer.classList.remove("has-error");

    // Update buy button text
    const buyBtn = card.querySelector(".flavor-buy-btn");
    if (buyBtn && buyBtn.dataset.flavor !== "mystery") {
      buyBtn.textContent = `Buy Now — ${pill.dataset.pack} (${pill.dataset.price})`;
    }
  });
});

document.querySelectorAll(".flavor-buy-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const flavor = btn.dataset.flavor;
    if (flavor === "mystery") {
      alert("Thanks for your interest! We'll notify you as soon as Drop 03 launches.");
      return;
    }

    const card = btn.closest(".flavor-card-item");
    if (!card) return;

    const activePill = card.querySelector(".variant-pill.is-active");
    if (!activePill) {
      e.preventDefault();
      const errorMsg = card.querySelector(".variant-error-msg");
      const pillsContainer = card.querySelector(".variant-pills");
      
      if (errorMsg) errorMsg.style.display = "block";
      if (pillsContainer) {
        pillsContainer.classList.remove("has-error");
        void pillsContainer.offsetWidth; // trigger reflow for animation
        pillsContainer.classList.add("has-error");
      }
    } else {
      const variantId = activePill.dataset.variantId;
      if (variantId && !variantId.startsWith("default")) {
        window.location.href = `/cart/${variantId}:1`;
      } else {
        window.location.href = "/checkout";
      }
    }
  });
});