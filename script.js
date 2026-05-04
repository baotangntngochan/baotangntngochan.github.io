/* =========================
   CAROUSEL (LEFT - MAIN - RIGHT)
========================= */

/* Select slide elements (not images) */
const slides = document.querySelectorAll(".carousel .slide");

/* Current index state */
let index = 0;


/* =========================
   UPDATE CAROUSEL STATE
========================= */
function updateCarousel() {
  slides.forEach(slide => {
    slide.classList.remove("main", "left", "right");
  });

  const total = slides.length;

  const main = index;
  const left = (index - 1 + total) % total;
  const right = (index + 1) % total;

  slides[main].classList.add("main");
  slides[left].classList.add("left");
  slides[right].classList.add("right");
}


/* =========================
   AUTO SLIDE
========================= */
function nextSlide() {
  index = (index + 1) % slides.length;
  updateCarousel();
}


/* =========================
   CLICK HANDLER
========================= */
slides.forEach((slide, i) => {
  slide.addEventListener("click", () => {
    index = i;
    updateCarousel();

    openPostFromSlide(slide);
  });
});


/* =========================
   SCROLL TO MATCHED POST
========================= */
function openPostFromSlide(slide) {
  const title = slide.dataset.title;

  if (!title) return;

  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    const postTitle = post.querySelector("h2")?.innerText;

    if (postTitle === title) {
      post.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });
}


/* =========================
   INIT
========================= */
updateCarousel();
setInterval(nextSlide, 4000);
