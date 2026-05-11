/* =========================================================
   SELECT ELEMENTS
========================================================= */
const carousel =
  document.querySelector(".carousel");

const slides =
  document.querySelectorAll(".carousel .slide");

const prevBtn =
  document.querySelector(".carousel-nav.prev");

const nextBtn =
  document.querySelector(".carousel-nav.next");


/* =========================================================
   CAROUSEL SYSTEM
   Coverflow 5 tầng
========================================================= */

if (carousel && slides.length > 0) {

  /* =========================
     STATE
  ========================= */
  let carouselIndex = 0;

  let tilt = 0;
  let targetTilt = 0;

  let startX = 0;
  let lastX = 0;
  let velocity = 0;
  let isDragging = false;


  /* =========================
     HELPERS
  ========================= */
  function getMedia(slide) {
    return slide.querySelector(".slide-media");
  }


  function normalizeDiff(diff, total) {

    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff;
  }


  /* =========================
     SMOOTH TILT LOOP
  ========================= */
  function smoothTilt() {

    tilt += (targetTilt - tilt) * 0.08;

    requestAnimationFrame(smoothTilt);
  }

  smoothTilt();


  /* =========================
     UPDATE CAROUSEL
  ========================= */
  function updateCarousel() {

    const total = slides.length;

    slides.forEach((slide, i) => {

      /* reset class */
      slide.className = "slide";

      let diff =
        normalizeDiff(
          i - carouselIndex,
          total
        );

      const abs =
        Math.abs(diff);

      /* z-index */
      slide.style.zIndex =
        100 - abs;

      /* visible click range */
      slide.style.pointerEvents =
        abs <= 2 ? "auto" : "none";


      /* =========================
         POSITION CLASS
      ========================= */
      if (diff === 0) {

        slide.classList.add("is-main");

      }

      else if (diff === -1) {

        slide.classList.add("left");

      }

      else if (diff === 1) {

        slide.classList.add("right");

      }

      else if (diff === -2) {

        slide.classList.add("left-2");

      }

      else if (diff === 2) {

        slide.classList.add("right-2");

      }


      /* =========================
         TILT ONLY CENTER
      ========================= */
      const media =
        getMedia(slide);

      if (!media) return;

      if (diff === 0) {

        media.style.transform =
          `translateX(0)
           scale(1)
           rotateY(${tilt * 5}deg)`;

      }

      else {

        media.style.transform = "";

      }

    });

  }


  /* =========================
     RENDER LOOP
  ========================= */
  function render() {

    updateCarousel();

    requestAnimationFrame(render);
  }

  render();


  /* =========================
     NEXT / PREV
  ========================= */
  function nextSlide() {

    carouselIndex =
      (carouselIndex + 1)
      % slides.length;
  }

  function prevSlide() {

    carouselIndex =
      (carouselIndex - 1 + slides.length)
      % slides.length;
  }


  /* =========================
     AUTO SLIDE
  ========================= */
  let autoSlide =
    setInterval(nextSlide, 4000);


  function restartAuto() {

    clearInterval(autoSlide);

    autoSlide =
      setInterval(nextSlide, 4000);
  }


  /* =========================
     MAIN CLICK ONLY
  ========================= */
  slides.forEach(slide => {

    slide.addEventListener("click", e => {

      if (
        !slide.classList.contains("is-main")
      ) {
        e.preventDefault();
      }

    });

  });


  /* =========================
     BUTTONS
  ========================= */
  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      () => {

        prevSlide();
        restartAuto();

      }
    );

  }

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      () => {

        nextSlide();
        restartAuto();

      }
    );

  }


  /* =========================
     DRAG START
  ========================= */
  carousel.addEventListener(
    "mousedown",
    e => {

      isDragging = true;

      startX = e.clientX;
      lastX = e.clientX;
      velocity = 0;

      clearInterval(autoSlide);

      carousel.style.cursor =
        "grabbing";
    }
  );


  /* =========================
     DRAG MOVE
  ========================= */
  window.addEventListener(
    "mousemove",
    e => {

      if (!isDragging) return;

      velocity =
        e.clientX - lastX;

      lastX = e.clientX;
    }
  );


  /* =========================
     DRAG END
  ========================= */
  window.addEventListener(
    "mouseup",
    e => {

      if (!isDragging) return;

      isDragging = false;

      carousel.style.cursor =
        "grab";

      const diff =
        e.clientX - startX;

      if (Math.abs(velocity) > 5) {

        if (velocity < 0)
          nextSlide();
        else
          prevSlide();

      }

      else {

        if (diff < -80)
          nextSlide();

        else if (diff > 80)
          prevSlide();

      }

      restartAuto();

    }
  );


  /* =========================
     TOUCH START
  ========================= */
  carousel.addEventListener(
    "touchstart",
    e => {

      startX =
        e.touches[0].clientX;

      lastX = startX;
      velocity = 0;

      clearInterval(autoSlide);

    },
    { passive: true }
  );


  /* =========================
     TOUCH MOVE
  ========================= */
  carousel.addEventListener(
    "touchmove",
    e => {

      velocity =
        e.touches[0].clientX - lastX;

      lastX =
        e.touches[0].clientX;

    },
    { passive: true }
  );


  /* =========================
     TOUCH END
  ========================= */
  carousel.addEventListener(
    "touchend",
    e => {

      const diff =
        e.changedTouches[0].clientX
        - startX;

      if (Math.abs(velocity) > 5) {

        if (velocity < 0)
          nextSlide();
        else
          prevSlide();

      }

      else {

        if (diff < -80)
          nextSlide();

        else if (diff > 80)
          prevSlide();

      }

      restartAuto();

    }
  );


  /* =========================
     TILT
  ========================= */
  carousel.addEventListener(
    "mousemove",
    e => {

      const rect =
        carousel.getBoundingClientRect();

      const x =
        (e.clientX - rect.left)
        / rect.width - 0.5;

      targetTilt =
        x * 4;

    }
  );


  carousel.addEventListener(
    "mouseleave",
    () => {

      targetTilt = 0;

    }
  );


  /* =========================
     CURSOR
  ========================= */
  carousel.style.cursor =
    "grab";

}


/* =========================================================
   HERO SLIDER
========================================================= */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    const heroImages =
      document.querySelectorAll(".hero-bg");

    if (heroImages.length === 0) return;

    let heroIndex = 0;


    /* =========================
       SHOW HERO
    ========================= */
    function showHero(i) {

      heroImages.forEach(img => {

        img.classList.remove("active");

      });

      heroImages[i]
        .classList.add("active");
    }


    /* =========================
       NEXT HERO
    ========================= */
    function nextHero() {

      heroIndex =
        (heroIndex + 1)
        % heroImages.length;

      showHero(heroIndex);
    }


    /* init */
    showHero(0);

    setInterval(nextHero, 3000);

  }
);


/* =========================================================
   POSTS SYSTEM
   FILTER + PAGINATION
========================================================= */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =========================
       ELEMENTS
    ========================= */
    const postsContainer =
      document.getElementById(
        "postsList"
      );

    const pagination =
      document.getElementById(
        "postsPagination"
      );

    const filterButtons =
      document.querySelectorAll(
        ".tags span"
      );


    /* safety */
    if (
      !postsContainer ||
      !pagination
    ) return;


    /* =========================
       CONFIG
    ========================= */
    const POSTS_PER_PAGE = 4;


    /* =========================
       POSTS
    ========================= */
    const allPosts = Array.from(
      postsContainer.querySelectorAll(
        ".post-link"
      )
    );


    /* =========================
       STATE
    ========================= */
    let currentPage = 1;

    let currentFilter = "all";

    let filteredPosts =
      [...allPosts];


    /* =========================
       FILTER POSTS
    ========================= */
    function updateFilteredPosts() {

      if (
        currentFilter === "all"
      ) {

        filteredPosts =
          [...allPosts];

        return;
      }

      filteredPosts =
        allPosts.filter(post => {

          const tags =
            post.dataset.tags || "";

          return tags.includes(
            currentFilter
          );

        });

    }


    /* =========================
       RENDER POSTS
    ========================= */
    function renderPosts() {

      /* hide all */
      allPosts.forEach(post => {

        post.style.display =
          "none";

      });

      /* pagination range */
      const start =
        (currentPage - 1)
        * POSTS_PER_PAGE;

      const end =
        start + POSTS_PER_PAGE;

      /* render visible */
      filteredPosts
        .slice(start, end)
        .forEach(post => {

          post.style.display =
            "block";

        });

    }


    /* =========================
       RENDER PAGINATION
    ========================= */
    function renderPagination() {

      pagination.innerHTML = "";

      const totalPages =
        Math.ceil(
          filteredPosts.length
          / POSTS_PER_PAGE
        );

      /* no need */
      if (totalPages <= 1) return;


      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {

        const btn =
          document.createElement(
            "button"
          );

        btn.className =
          "page-btn";

        btn.textContent = i;

        /* active */
        if (i === currentPage) {

          btn.classList.add(
            "active"
          );

        }

        /* click */
        btn.addEventListener(
          "click",
          () => {

            currentPage = i;

            renderPosts();

            renderPagination();

          }
        );

        pagination.appendChild(btn);

      }

    }


    /* =========================
       MAIN RENDER
    ========================= */
    function renderAll() {

      updateFilteredPosts();

      renderPosts();

      renderPagination();

    }


    /* =========================
       FILTER BUTTONS
    ========================= */
    filterButtons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          /* remove active */
          filterButtons.forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });

          /* add active */
          button.classList.add(
            "active"
          );

          /* set filter */
          currentFilter =
            button.dataset.filter;

          /* reset page */
          currentPage = 1;

          /* render */
          renderAll();

        }
      );

    });


    /* =========================
       DEFAULT ACTIVE
    ========================= */
    const defaultButton =
      document.querySelector(
        '.tags span[data-filter="all"]'
      );

    if (defaultButton) {

      defaultButton.classList.add(
        "active"
      );

    }


    /* =========================
       INIT
    ========================= */
    renderAll();

  }
);

/* =========================================================
   SPOTLIGHT PRO SEARCH
   keyboard + recent + highlight
========================================================= */

const searchOverlay = document.getElementById("searchOverlay");
const openSearchBtn = document.getElementById("openSearch");
const searchInput   = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let activeIndex = -1;

/* =========================================================
   DATA
========================================================= */

const searchData = [
  { title:"The Scream", url:"/works/the-scream.html" },
  { title:"Truyện Kiều", url:"/works/truyen-kieu.html" },
  { title:"Nhạc Jazz", url:"/works/jazz.html" },
  { title:"Mona Lisa", url:"/works/mona-lisa.html" },
  { title:"Chí Phèo", url:"/works/chi-pheo.html" },
  { title:"Le Lac Des Cygnes", url:"/works/le-lac-des-cygnes.html" },
  { title:"Đời thừa", url:"/works/doi-thua.html" },
  { title:"Starry Night", url:"/works/starry-night.html" },
  { title:"Nocturne Chopin", url:"/works/nocturne-chopin.html" },
  { title:"The Last Supper", url:"/works/the-last-supper.html" },
  { title:"Dế Mèn phiêu lưu ký", url:"/works/de-men-phieu-luu-ky.html" },
  { title:"Beethoven Symphony No.9", url:"/works/beethoven-no9.html" },
  { title:"The Persistence of Memory", url:"/works/the-persistence-of-memory.html" },
  { title:"Nhật ký Đặng Thùy Trâm", url:"/works/nhat-ky-dang-thuy-tram.html" },
  { title:"Diễm Xưa - Trịnh Công Sơn", url:"/works/diem-xua.html" },
  { title:"The Girl With A Pearl Earring", url:"/works/the-girl-with-a-pearl-earring.html" },
  { title:"Lão Hạc", url:"/works/lao-hac.html" },
  { title:"Turkish March", url:"/works/turkish-march.html" },
  { title:"Số đỏ", url:"/works/so-do.html" },
  { title:"Opera Romeo And Juliet", url:"/works/opera-romeo-and-juliet.html" },
  { title:"Guernica", url:"/works/guernica.html" },
  { title:"Bolero Việt Nam", url:"/works/bolero-viet-nam.html" }
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(text){
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");
}

function saveRecent(item){
  let recents =
    JSON.parse(localStorage.getItem("recentSearches") || "[]");

  recents = recents.filter(x => x.url !== item.url);
  recents.unshift(item);

  if(recents.length > 6){
    recents = recents.slice(0,6);
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(recents)
  );
}

function getRecent(){
  return JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );
}

/* =========================================================
   HIGHLIGHT
========================================================= */

function highlightText(title, query){

  if(!query) return title;

  const raw = title;
  const lower = normalizeText(raw);
  const q = normalizeText(query);

  const index = lower.indexOf(q);

  if(index === -1) return raw;

  const before = raw.slice(0,index);
  const match  = raw.slice(index,index + query.length);
  const after  = raw.slice(index + query.length);

  return `
    ${before}
    <mark>${match}</mark>
    ${after}
  `;
}

/* =========================================================
   RENDER
========================================================= */

function renderResults(items, query = ""){

  activeIndex = -1;

  if(items.length === 0){

    searchResults.innerHTML = `
      <div class="search-item">
        <div class="search-title">🔍 No results found</div>
        <div class="search-url">Try another keyword</div>
      </div>
    `;
    return;
  }

  searchResults.innerHTML =
    items.map(item => `
      <a class="search-item" href="${item.url}">
        <div class="search-title">
          ${highlightText(item.title, query)}
        </div>
        <div class="search-url">${item.url}</div>
      </a>
    `).join("");

  bindClicks();
}

function renderRecent(){

  const recents = getRecent();

  if(recents.length === 0){
    renderResults(searchData.slice(0,8));
    return;
  }

  searchResults.innerHTML =
    recents.map(item => `
      <a class="search-item" href="${item.url}">
        <div class="search-title">🕘 ${item.title}</div>
        <div class="search-url">${item.url}</div>
      </a>
    `).join("");

  bindClicks();
}

/* =========================================================
   BIND CLICK SAVE RECENT
========================================================= */

function bindClicks(){

  const items =
    searchResults.querySelectorAll(".search-item");

  items.forEach(el => {

    el.addEventListener("click", e => {

      const href = el.getAttribute("href");

      const title =
        el.querySelector(".search-title")
          .textContent
          .replace("🕘","")
          .trim();

      saveRecent({
        title: title,
        url: href
      });

    });

  });
}

/* =========================================================
   OPEN / CLOSE
========================================================= */

function openSearch(){

  searchOverlay.classList.add("show");

  setTimeout(() => {
    searchInput.focus();
  },80);

  searchInput.value = "";

  renderRecent();
}

function closeSearch(){

  searchOverlay.classList.remove("show");
  searchInput.value = "";
  activeIndex = -1;
}

/* =========================================================
   SEARCH INPUT
========================================================= */

searchInput.addEventListener("input", () => {

  const q = searchInput.value.trim();

  if(!q){
    renderRecent();
    return;
  }

  const filtered =
    searchData.filter(item =>
      normalizeText(item.title)
      .includes(normalizeText(q))
    );

  renderResults(filtered, q);

});

/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

searchInput.addEventListener("keydown", e => {

  const items =
    searchResults.querySelectorAll(".search-item");

  if(!items.length) return;

  if(e.key === "ArrowDown"){

    e.preventDefault();

    activeIndex++;

    if(activeIndex >= items.length){
      activeIndex = 0;
    }

    updateActive(items);
  }

  if(e.key === "ArrowUp"){

    e.preventDefault();

    activeIndex--;

    if(activeIndex < 0){
      activeIndex = items.length - 1;
    }

    updateActive(items);
  }

  if(e.key === "Enter"){

    e.preventDefault();

    if(activeIndex >= 0){

      const target = items[activeIndex];

      const href =
        target.getAttribute("href");

      const title =
        target.querySelector(".search-title")
        .textContent
        .replace("🕘","")
        .trim();

      saveRecent({
        title:title,
        url:href
      });

      window.location.href = href;
    }

  }

});

function updateActive(items){

  items.forEach(el =>
    el.classList.remove("active")
  );

  if(activeIndex >= 0){

    items[activeIndex]
      .classList.add("active");

    items[activeIndex]
      .scrollIntoView({
        block:"nearest"
      });
  }
}

/* =========================================================
   OPEN BUTTON
========================================================= */

openSearchBtn.addEventListener(
  "click",
  openSearch
);

/* =========================================================
   CLICK OUTSIDE
========================================================= */

searchOverlay.addEventListener(
  "click",
  e => {
    if(e.target === searchOverlay){
      closeSearch();
    }
  }
);

/* =========================================================
   GLOBAL SHORTCUT
========================================================= */

window.addEventListener(
  "keydown",
  e => {

    if((e.ctrlKey || e.metaKey)
      && e.key.toLowerCase() === "k"){

      e.preventDefault();
      openSearch();
    }

    if(e.key === "Escape"){
      closeSearch();
    }

  }
);
