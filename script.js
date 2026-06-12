(function () {
  "use strict";

  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;
  const navDots = document.querySelectorAll(".nav-dot");
  const mobileDots = document.querySelectorAll(".mobile-dots .nav-dot");
  const allDots = [...navDots, ...mobileDots];
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const progressFill = document.querySelector(".progress-bar__fill");
  const counterCurrent = document.querySelector(".slide-counter__current");
  const counterTotal = document.querySelector(".slide-counter__total");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  let currentIndex = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  const mobileQuery = window.matchMedia("(max-width: 900px)");

  function isMobileLayout() {
    return mobileQuery.matches;
  }

  counterTotal.textContent = String(totalSlides).padStart(2, "0");

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;

    slides[index].scrollIntoView({ behavior: "smooth", block: "start" });

    allDots.forEach((dot) => {
      const dotIndex = parseInt(dot.dataset.slide, 10);
      dot.classList.toggle("active", dotIndex === index);
    });

    const progress = ((index + 1) / totalSlides) * 100;
    progressFill.style.width = progress + "%";
    counterCurrent.textContent = String(index + 1).padStart(2, "0");

    btnPrev.disabled = index === 0;
    btnNext.disabled = index === totalSlides - 1;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  allDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(parseInt(dot.dataset.slide, 10));
    });
  });

  btnPrev.addEventListener("click", prevSlide);
  btnNext.addEventListener("click", nextSlide);

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("open")) {
      if (e.key === "Escape") closeLightbox();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      goToSlide(0);
    } else if (e.key === "End") {
      goToSlide(totalSlides - 1);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const idx = Array.from(slides).indexOf(entry.target);
          if (idx !== -1 && idx !== currentIndex) {
            currentIndex = idx;
            allDots.forEach((dot) => {
              const dotIndex = parseInt(dot.dataset.slide, 10);
              dot.classList.toggle("active", dotIndex === idx);
            });
            const progress = ((idx + 1) / totalSlides) * 100;
            progressFill.style.width = progress + "%";
            counterCurrent.textContent = String(idx + 1).padStart(2, "0");
            btnPrev.disabled = idx === 0;
            btnNext.disabled = idx === totalSlides - 1;
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  slides.forEach((slide) => observer.observe(slide));

  const slidesWrapper = document.querySelector(".slides-wrapper");

  slidesWrapper.addEventListener(
    "touchstart",
    (e) => {
      if (isMobileLayout()) return;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  slidesWrapper.addEventListener(
    "touchend",
    (e) => {
      if (isMobileLayout()) return;
      touchEndY = e.changedTouches[0].screenY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) nextSlide();
      else prevSlide();
    },
    { passive: true }
  );

  document.querySelectorAll(".screenshot-frame img, .media-frame img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  goToSlide(0);
})();
