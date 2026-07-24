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
  if (window.scrollY > 30) nav.style.background = "#0F345E";
  else nav.style.background = "#0F345E";
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

// ── Ingredients hover interaction ──
const ingredientItems = document.querySelectorAll(".ingredient-item");
const ingredientBgLayers = document.querySelectorAll(".ingredients-bg-layer, .ingredient-image");

function showIngredientImage(imageNum) {
  ingredientBgLayers.forEach((img) => {
    const isActive = img.dataset.image === imageNum;
    img.classList.toggle("active", isActive);
  });
}

ingredientItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const imageNum = item.dataset.image;
    showIngredientImage(imageNum);

    // Update active state on items
    ingredientItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});