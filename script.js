const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const hero = document.querySelector(".hero");
const reserveTab = document.querySelector(".reserve-tab");
const revealItems = document.querySelectorAll(".js-reveal");
const lanternMain = document.querySelector("[data-lantern-main]");
const lanternTitle = document.querySelector("[data-lantern-title]");
const lanternCatch = document.querySelector("[data-lantern-catch]");
const lanternText = document.querySelector("[data-lantern-text]");
const lanternThumbs = document.querySelectorAll("[data-lantern-thumb]");
const lanternDots = document.querySelectorAll("[data-lantern-dot]");
const lowerSlideCards = document.querySelectorAll(".lower-onsen .lower-feature-card, .lower-rooms .lower-feature-card");
const spSlideQuery = window.matchMedia("(max-width: 767px)");
const isTopPage = !document.body.classList.contains("lower-page");
const responsiveImages = document.querySelectorAll("img[data-sp-src]");
const lowerSlideControllers = [];
const reservationHash = "#reservation-links";
const reservationTarget = document.querySelector(reservationHash);

const scrollReservationLinksToCenter = (behavior = "smooth") => {
  if (!reservationTarget) return;

  const rect = reservationTarget.getBoundingClientRect();
  const headerHeight = header && getComputedStyle(header).position === "fixed" ? header.getBoundingClientRect().height : 0;
  const availableHeight = Math.max(1, window.innerHeight - headerHeight);
  const targetCenter = rect.top + window.scrollY + rect.height / 2;
  const nextTop = targetCenter - headerHeight - availableHeight / 2;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  window.scrollTo({
    top: Math.min(Math.max(0, nextTop), maxScroll),
    behavior,
  });
};

const syncReservationHashPosition = (behavior = "smooth") => {
  if (window.location.hash !== reservationHash) return;

  window.requestAnimationFrame(() => {
    scrollReservationLinksToCenter(behavior);
    window.setTimeout(() => scrollReservationLinksToCenter(behavior), 240);
    window.setTimeout(() => scrollReservationLinksToCenter(behavior), 720);
  });
};

responsiveImages.forEach((image) => {
  if (!image.dataset.pcSrc) image.dataset.pcSrc = image.getAttribute("src") || "";
});

const getResponsiveSrc = (image) => {
  if (!image) return "";
  return spSlideQuery.matches && image.dataset.spSrc ? image.dataset.spSrc : image.dataset.pcSrc || image.getAttribute("src") || "";
};

const syncResponsiveImages = () => {
  responsiveImages.forEach((image) => {
    const nextSrc = getResponsiveSrc(image);
    if (nextSrc && image.getAttribute("src") !== nextSrc) image.setAttribute("src", nextSrc);
  });
};

const updateLowerSlidePlayback = () => {
  if (lowerSlideControllers.length === 0) return;

  if (!spSlideQuery.matches) {
    lowerSlideControllers.forEach((controller) => controller.stop());
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportCenter = viewportHeight / 2;
  let activeController = null;
  let activeScore = -Infinity;

  lowerSlideControllers.forEach((controller) => {
    const rect = controller.card.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    if (visibleHeight <= 0) return;

    const cardCenter = rect.top + rect.height / 2;
    const visibleRatio = visibleHeight / Math.min(rect.height || 1, viewportHeight);
    const centerDistance = Math.abs(cardCenter - viewportCenter);
    const score = visibleRatio * 1000 - centerDistance;

    if (score > activeScore) {
      activeScore = score;
      activeController = controller;
    }
  });

  lowerSlideControllers.forEach((controller) => {
    if (controller === activeController) {
      controller.start();
    } else {
      controller.stop();
    }
  });
};

const updateHeader = () => {
  const showPoint = hero ? Math.max(240, hero.offsetHeight - 96) : 240;
  const shouldShow = window.scrollY > showPoint;
  if (isTopPage && spSlideQuery.matches) {
    header.classList.remove("is-scrolled");
  } else {
    header.classList.toggle("is-scrolled", shouldShow);
  }
  reserveTab.classList.toggle("is-visible", shouldShow);
};

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);
updateHeader();
syncResponsiveImages();
spSlideQuery.addEventListener("change", syncResponsiveImages);

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
});

if (isTopPage && reserveTab && reservationTarget) {
  reserveTab.addEventListener("click", (event) => {
    const url = new URL(reserveTab.getAttribute("href"), window.location.href);
    if (url.hash !== reservationHash || url.pathname !== window.location.pathname) return;

    event.preventDefault();
    if (window.location.hash !== reservationHash) {
      window.history.pushState(null, "", reservationHash);
    }
    syncReservationHashPosition("smooth");
  });

  window.addEventListener("hashchange", () => syncReservationHashPosition("smooth"));
  window.addEventListener("load", () => syncReservationHashPosition("auto"));
  syncReservationHashPosition("auto");
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

lanternThumbs.forEach((thumb, thumbIndex) => {
  thumb.addEventListener("click", () => {
    if (!lanternMain || !lanternTitle || !lanternCatch || !lanternText) return;

    lanternThumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
    lanternDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === thumbIndex);
    });

    lanternMain.classList.add("is-changing");

    window.setTimeout(() => {
      lanternMain.src = thumb.dataset.src;
      lanternMain.alt = thumb.dataset.alt || "";
      lanternTitle.textContent = thumb.dataset.title || "";
      lanternCatch.innerHTML = thumb.dataset.catch || "";
      lanternText.textContent = thumb.dataset.text || "";
      lanternMain.classList.remove("is-changing");
    }, 180);
  });
});

lanternDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    lanternThumbs[dotIndex]?.click();
  });
});

lowerSlideCards.forEach((card) => {
  const mainImage = card.querySelector(".lower-feature-main");
  const subImages = [...card.querySelectorAll(".lower-feature-subimgs img")];
  if (!mainImage || subImages.length === 0) return;

  const makeSlide = (image) => ({
    pcSrc: image.dataset.pcSrc || image.getAttribute("src"),
    spSrc: image.dataset.spSrc || image.dataset.pcSrc || image.getAttribute("src"),
    alt: image.getAttribute("alt") || mainImage.getAttribute("alt") || "",
  });

  const slides = [
    { ...makeSlide(mainImage), alt: mainImage.getAttribute("alt") || "" },
    ...subImages.map((image) => ({
      ...makeSlide(image),
    })),
  ].filter((slide) => slide.pcSrc || slide.spSrc);

  if (slides.length < 2) return;

  const dots = document.createElement("div");
  dots.className = "lower-sp-slider-dots";
  dots.setAttribute("aria-hidden", "true");
  const dotButtons = slides.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    if (index === 0) button.classList.add("is-active");
    dots.appendChild(button);
    return button;
  });
  mainImage.insertAdjacentElement("afterend", dots);

  let current = 0;
  let timerId = null;

  const showSlide = (next) => {
    current = next % slides.length;
    const slide = slides[current];
    mainImage.classList.add("is-slide-changing");

    window.setTimeout(() => {
      mainImage.src = spSlideQuery.matches ? slide.spSrc : slide.pcSrc;
      mainImage.alt = slide.alt;
      dotButtons.forEach((button, index) => {
        button.classList.toggle("is-active", index === current);
      });
      mainImage.classList.remove("is-slide-changing");
    }, 180);
  };

  const start = () => {
    if (!spSlideQuery.matches || timerId) return;
    timerId = window.setInterval(() => showSlide(current + 1), 3200);
  };

  const stop = () => {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  const syncMode = () => {
    if (spSlideQuery.matches) {
      updateLowerSlidePlayback();
    } else {
      stop();
      showSlide(0);
      syncResponsiveImages();
    }
  };

  dotButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showSlide(index);
      stop();
      updateLowerSlidePlayback();
    });
  });

  lowerSlideControllers.push({ card, start, stop });
  syncMode();
  spSlideQuery.addEventListener("change", syncMode);
});

window.addEventListener("scroll", updateLowerSlidePlayback, { passive: true });
window.addEventListener("resize", updateLowerSlidePlayback);
updateLowerSlidePlayback();
