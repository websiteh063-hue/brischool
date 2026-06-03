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

const hiddenGalleryFiles = new Set([
  ...numberedRange(3, 9, "jpg"),
  "13.jpg",
  "19.jpg",
  "20.jpg",
  "26.jpg",
  "38.jpg",
  ...numberedRange(41, 44, "jpg"),
  "50.jpg"
]);

const oldMemoriesFiles = [
  ...numberedRange(1, 51, "jpg"),
  ...numberedRange(53, 116, "jpg"),
  ...numberedRange(1223, 1229, "jpeg"),
  ...numberedRange(1330, 1333, "jpeg"),
  ...numberedRange(3333, 3339, "jpeg"),
  ...numberedRange(33310, 33318, "jpeg")
].filter((fileName) => !hiddenGalleryFiles.has(fileName));

const galleryAlbums = [
  {
    name: "Earth Day Celebration",
    slug: "earth-day-celebration",
    cover: "assets/images/gallery/earth-day-celebration/earth-day-cover.jpeg",
    description: "Students learning, performing, and celebrating care for nature through Earth Day activities at school.",
    mediaType: "video",
    files: [
      "earth-day-celebration-1.mp4",
      "earth-day-celebration-2.mp4",
      "earth-day-celebration-3.mp4"
    ],
    basePath: "assets/images/gallery/earth-day-celebration"
  },
  {
    name: "Class 10 Result",
    slug: "class-10-result",
    cover: "assets/images/gallery/class-10-result/class-10-result-1.jpeg",
    description: "A proud celebration of our Class 10 students, their hard work, discipline, and result-day achievements.",
    files: [
      "class-10-result-1.jpeg",
      "class-10-result-2.jpeg",
      "class-10-result-3.jpeg"
    ],
    mediaType: "image",
    basePath: "assets/images/gallery/class-10-result",
    thumbPath: "assets/images/gallery/thumbs/class-10-result"
  },
  {
    name: "Old Memories",
    slug: "old-memories",
    cover: "assets/images/gallery/3333.jpeg",
    description: "A curated collection of school events, activities, celebrations, classroom moments, and campus memories.",
    files: oldMemoriesFiles,
    mediaType: "image",
    basePath: "assets/images/gallery",
    thumbPath: "assets/images/gallery/thumbs"
  }
];

const galleryMedia = galleryAlbums.flatMap((album) =>
  album.files.map((fileName, index) => ({
    thumb: album.thumbPath ? `${album.thumbPath}/${fileName}` : "",
    src: `${album.basePath}/${fileName}`,
    alt: `${album.name} ${album.mediaType === "video" ? "video" : "photo"} ${index + 1} at B.R. International School`,
    album: album.name,
    type: album.mediaType || "image"
  }))
);
const lightboxMedia = galleryMedia.filter((item) => item.type === "image");

let activeGalleryIndex = 0;
let activeAlbumSlug = "";

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
  if (item.type === "video") {
    return buildVideoCard(item, index);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-card";
  button.setAttribute("aria-label", `Open ${item.alt}`);
  button.setAttribute("data-aos", index % 4 === 0 ? "zoom-in" : "fade-up");
  button.innerHTML = `
    <figure>
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy" decoding="async">
      <figcaption><span>${item.album}</span>${item.alt}</figcaption>
    </figure>
  `;
  button.addEventListener("click", () => openLightbox(item));
  return button;
};

const buildVideoCard = (item, index) => {
  const article = document.createElement("article");
  article.className = "gallery-card video-gallery-card";
  article.setAttribute("data-aos", index % 4 === 0 ? "zoom-in" : "fade-up");
  article.innerHTML = `
    <figure>
      <video controls preload="metadata" playsinline>
        <source src="${item.src}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <figcaption><span>${item.album}</span>${item.alt}</figcaption>
    </figure>
  `;
  return article;
};

const getAlbumItems = (album) =>
  album.files
    .map((fileName) => galleryMedia.findIndex((item) => item.src === `${album.basePath}/${fileName}`))
    .filter((index) => index >= 0)
    .map((index) => ({ item: galleryMedia[index], index }));

const buildAlbumCard = (album, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "album-card";
  button.setAttribute("data-aos", index % 3 === 0 ? "zoom-in" : "fade-up");
  button.setAttribute("aria-label", `Open ${album.name} album`);
  button.innerHTML = `
    <figure>
      <div class="album-card-media">
        <img src="${album.cover}" alt="${album.name} album cover" loading="lazy" decoding="async">
        <span class="album-card-arrow" aria-hidden="true">&#8594;</span>
      </div>
      <figcaption>
        <span>${album.files.length} ${album.mediaType === "video" ? "videos" : "photos"}</span>
        <strong>${album.name}</strong>
      </figcaption>
    </figure>
  `;
  button.addEventListener("click", () => showAlbum(album.slug, true));
  return button;
};

const buildAlbumSection = (album) => {
  const section = document.createElement("section");
  section.className = "gallery-album-detail";
  section.id = `${album.slug}-album`;
  section.setAttribute("data-aos", "fade-up");

  const cards = getAlbumItems(album).map(({ item, index }) => buildGalleryCard(item, index));

  const grid = document.createElement("div");
  grid.className = "album-photo-grid";
  cards.forEach((card) => grid.appendChild(card));

  section.innerHTML = `
    <div class="album-section-heading">
      <div>
        <p class="eyebrow">Album</p>
        <h2>${album.name}</h2>
        <p>${album.description}</p>
      </div>
      <div class="album-heading-actions">
        <span>${album.files.length} ${album.mediaType === "video" ? "videos" : "photos"}</span>
        <button class="button button-secondary album-back" type="button">Back to Albums</button>
      </div>
    </div>
  `;
  section.querySelector(".album-back")?.addEventListener("click", showAlbumOverview);
  section.appendChild(grid);
  return section;
};

const showAlbumOverview = () => {
  activeAlbumSlug = "";
  if (!galleryGrid) return;
  galleryGrid.classList.remove("is-detail-view");
  galleryGrid.innerHTML = "";
  galleryAlbums.forEach((album, index) => {
    galleryGrid.appendChild(buildAlbumCard(album, index));
  });
  if (window.location.hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
};

const showAlbum = (slug, updateHash = false) => {
  const album = galleryAlbums.find((albumItem) => albumItem.slug === slug);
  if (!galleryGrid || !album) return;
  activeAlbumSlug = slug;
  galleryGrid.classList.add("is-detail-view");
  galleryGrid.innerHTML = "";
  galleryGrid.appendChild(buildAlbumSection(album));
  if (updateHash) history.pushState(null, "", `#${slug}`);
  galleryGrid.scrollIntoView({ behavior: "smooth", block: "start" });
};

const renderGallery = () => {
  if (!galleryGrid) return;
  const requestedAlbum = window.location.hash.replace("#", "");
  if (galleryAlbums.some((album) => album.slug === requestedAlbum)) {
    showAlbum(requestedAlbum);
  } else {
    showAlbumOverview();
  }
  if (galleryCount) galleryCount.textContent = String(galleryAlbums.length);
};

window.addEventListener("hashchange", renderGallery);

const updateLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  const item = lightboxMedia[activeGalleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.alt;
};

const openLightbox = (item) => {
  if (!lightbox) return;
  activeGalleryIndex = lightboxMedia.findIndex((mediaItem) => mediaItem.src === item.src);
  if (activeGalleryIndex < 0) return;
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
  activeGalleryIndex = (activeGalleryIndex + direction + lightboxMedia.length) % lightboxMedia.length;
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
