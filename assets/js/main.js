const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const backToTop = document.querySelector(".back-to-top");
const siteHeader = document.querySelector(".site-header");
const currentYear = document.querySelector("#current-year");
const form = document.querySelector("[data-form-status]");
const galleryGrid = document.querySelector("#gallery-grid");
const galleryCount = document.querySelector("#gallery-count");
const loader = document.querySelector("#loader");
const lightbox = document.querySelector("#galleryModal");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

const numberedRange = (start, end, extension) =>
  Array.from({ length: end - start + 1 }, (_, index) => `${start + index}.${extension}`);

const galleryMedia = [
  ...numberedRange(1, 51, "jpg"),
  ...numberedRange(53, 116, "jpg"),
  ...numberedRange(1223, 1229, "jpeg"),
  ...numberedRange(1330, 1333, "jpeg"),
  ...numberedRange(3333, 3339, "jpeg"),
  ...numberedRange(33310, 33318, "jpeg")
].map((fileName, index) => ({
  thumb: `assets/images/gallery/thumbs/${fileName}`,
  src: `assets/images/gallery/${fileName}`,
  alt: `B.R. International School gallery image ${index + 1}`
}));

let activeGalleryIndex = 0;

const setMenuState = (isOpen) => {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle) return;
  const clickedInsideMenu = navMenu.contains(event.target) || navToggle.contains(event.target);
  if (!clickedInsideMenu) setMenuState(false);
});

const updateScrollState = () => {
  const scrolled = window.scrollY > 30;
  siteHeader?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("visible", window.scrollY > 400);
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

window.addEventListener("load", () => {
  if (loader) {
    loader.classList.add("is-hidden");
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      once: true
    });
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (form) {
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const guardian = data.get("guardian")?.toString().trim();
    const child = data.get("child")?.toString().trim();
    status.textContent = guardian && child
      ? `Thank you, ${guardian}. Your enquiry for ${child} has been noted.`
      : "Thank you. Your enquiry has been noted.";
    form.reset();
  });
}

document
  .querySelectorAll(".hero-copy, .hero-media, .story-card, .about-photo, .leader-card, .info-card, .facility-card, .showcase-item, .trust-card, .contact-card, .contact-copy")
  .forEach((element, index) => {
    element.setAttribute("data-aos", index % 3 === 0 ? "fade-up" : "zoom-in");
  });

const buildGalleryCard = (item, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-card";
  button.setAttribute("aria-label", `Open ${item.alt}`);
  button.setAttribute("data-aos", index % 4 === 0 ? "zoom-in" : "fade-up");
  button.innerHTML = `
    <figure>
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy" decoding="async">
      <figcaption>${item.alt}</figcaption>
    </figure>
  `;
  button.addEventListener("click", () => openLightbox(index));
  return button;
};

const renderGallery = () => {
  if (!galleryGrid) return;
  const fragment = document.createDocumentFragment();
  galleryMedia.forEach((item, index) => fragment.appendChild(buildGalleryCard(item, index)));
  galleryGrid.appendChild(fragment);
  if (galleryCount) galleryCount.textContent = String(galleryMedia.length);
};

const updateLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  const item = galleryMedia[activeGalleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.alt;
};

const openLightbox = (index) => {
  if (!lightbox) return;
  activeGalleryIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lightbox.style.display = "flex";
  document.body.classList.add("menu-open");
};

function closeModal() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.style.display = "none";
  document.body.classList.remove("menu-open");
}

const stepLightbox = (direction) => {
  activeGalleryIndex = (activeGalleryIndex + direction + galleryMedia.length) % galleryMedia.length;
  updateLightbox();
};

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close-btn");
  const modal = document.getElementById("galleryModal");

  closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeModal();
  });

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
});

lightbox?.querySelector(".lightbox-prev")?.addEventListener("click", (event) => {
  event.stopPropagation();
  stepLightbox(-1);
});

lightbox?.querySelector(".lightbox-next")?.addEventListener("click", (event) => {
  event.stopPropagation();
  stepLightbox(1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
  if (lightbox?.hidden === false && event.key === "ArrowLeft") stepLightbox(-1);
  if (lightbox?.hidden === false && event.key === "ArrowRight") stepLightbox(1);
});

renderGallery();

document.querySelectorAll("img[loading='lazy']").forEach((image) => {
  image.decoding = "async";
});
