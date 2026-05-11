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
   SEARCH SYSTEM V2
   rich result + image + desc + favorite + recent
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
  // --- HỘI HỌA THẾ GIỚI ---
  {
    title: "The Scream",
    url: "/works/the-scream.html",
    thumb: "/image/TheScream.jpg",
    desc: "Biểu tượng của nỗi lo âu hiện đại."
  },
  {
    title: "Mona Lisa",
    url: "/works/mona-lisa.html",
    thumb: "/image/MonaLisa.webp",
    desc: "Bức chân dung nổi tiếng nhất thế giới của Leonardo da Vinci."
  },
  {
    title: "Starry Night",
    url: "/works/starry-night.html",
    thumb: "/image/StarryNight.jpg",
    desc: "Đêm đầy chuyển động và cảm xúc của Vincent van Gogh."
  },
  {
    title: "Guernica",
    url: "/works/guernica.html",
    thumb: "/image/Guernica.webp",
    desc: "Tuyên ngôn phản chiến mạnh mẽ của Pablo Picasso."
  },
  {
    title: "The Girl With A Pearl Earring",
    url: "/works/girl-with-pearl-earring.html",
    thumb: "/image/TheGirlWithAPearlEarring.jpg",
    desc: "Thiếu nữ đeo hoa tai ngọc trai - Kiệt tác của Johannes Vermeer."
  },
  {
    title: "The Persistence Of Memory",
    url: "/works/persistence-of-memory.html",
    thumb: "/image/ThePersistenceOfMemory.jpg",
    desc: "Sự tan chảy của thời gian qua nét vẽ Salvador Dalí."
  },
  {
    title: "The Last Supper",
    url: "/works/the-last-supper.html",
    thumb: "/image/TheLastSupper.jpg",
    desc: "Bữa ăn tối cuối cùng - Bức họa tôn giáo kinh điển."
  },

  // --- VĂN HỌC & TÁC PHẨM VIỆT NAM ---
  {
    title: "Truyện Kiều",
    url: "/works/truyen-kieu.html",
    thumb: "/image/TruyenKieu.webp",
    desc: "Kiệt tác văn học trường tồn của đại thi hào Nguyễn Du."
  },
  {
    title: "Chí Phèo",
    url: "/works/chi-pheo.html",
    thumb: "/image/ChiPheo.jpg",
    desc: "Bi kịch bị cự tuyệt quyền làm người của Nam Cao."
  },
  {
    title: "Dế Mèn Phiêu Lưu Ký",
    url: "/works/de-men-phieu-luu-ky.html",
    thumb: "/image/DeMenPhuuLuuKy.webp",
    desc: "Hành trình trưởng thành đầy thú vị của Tô Hoài."
  },
  {
    title: "Đời Thừa",
    url: "/works/doi-thua.html",
    thumb: "/image/DoiThua.webp",
    desc: "Nỗi đau của người trí thức trong xã hội cũ."
  },
  {
    title: "Lão Hạc",
    url: "/works/lao-hac.html",
    thumb: "/image/LaoHac.jpg",
    desc: "Câu chuyện cảm động về lòng tự trọng của người nông dân."
  },
  {
    title: "Số Đỏ",
    url: "/works/so-do.html",
    thumb: "/image/SoDo.jpg",
    desc: "Tiểu thuyết trào phúng bậc nhất của Vũ Trọng Phụng."
  },
  {
    title: "Nhật Ký Đặng Thùy Trâm",
    url: "/works/nhat-ky-dang-thuy-tram.html",
    thumb: "/image/NhatKyDangThuyTram.jpg", // Có cả bản .png trong ảnh
    desc: "Những dòng tâm sự đầy lửa đạn và lý tưởng."
  },

  // --- ÂM NHẠC & NGHỆ THUẬT BIỂU DIỄN ---
  {
    title: "Beethoven Symphony No.9",
    url: "/works/beethoven-symphony-9.html",
    thumb: "/image/BeethovenSymphonyNo9.jpg",
    desc: "Bản giao hưởng số 9 huyền thoại với chương 'Ode to Joy'."
  },
  {
    title: "Turkish March",
    url: "/works/turkish-march.html",
    thumb: "/image/TurkishMarch.png",
    desc: "Hành khúc Thổ Nhĩ Kỳ vui tươi của Mozart."
  },
  {
    title: "Nocturne Chopin",
    url: "/works/nocturne-chopin.html",
    thumb: "/image/NocturneChopin.jpg",
    desc: "Những bản dạ khúc lãng mạn và sâu lắng."
  },
  {
    title: "Hồ Thiên Nga (Le Lac Des Cygnes)",
    url: "/works/swan-lake.html",
    thumb: "/image/LeLacDesCygnes(HoThienNga).gif",
    desc: "Vở vũ kịch kinh điển của Tchaikovsky."
  },
  {
    title: "Romeo and Juliet (Opera)",
    url: "/works/romeo-and-juliet.html",
    thumb: "/image/OperaRomeoAndJuliet.png",
    desc: "Vở nhạc kịch về câu chuyện tình yêu vĩnh cửu."
  },
  {
    title: "Diễm Xưa",
    url: "/works/diem-xua.html",
    thumb: "/image/DiemXua.jpg",
    desc: "Một trong những tình khúc nổi tiếng nhất của nhạc sĩ Trịnh Công Sơn."
  },
  {
    title: "Bolero Việt Nam",
    url: "/works/bolero-vietnam.html",
    thumb: "/image/BoleroVietnam.jpg",
    desc: "Giai điệu trữ tình mang đậm hơi thở đời sống."
  },
  {
    title: "Nhạc Jazz",
    url: "/works/nhac-jazz.html",
    thumb: "/image/NhacJazz.jpg",
    desc: "Thế giới của ngẫu hứng và những bản hòa âm phức tạp."
  }
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(text){
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"");
}

function getRecent(){
  return JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );
}

function saveRecent(item){

  let list = getRecent();

  list = list.filter(
    x => x.url !== item.url
  );

  list.unshift(item);

  if(list.length > 6){
    list = list.slice(0,6);
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(list)
  );
}

function clearRecent(){

  localStorage.removeItem(
    "recentSearches"
  );

  renderRecent();
}

/* FAVORITES */

function getFavorites(){
  return JSON.parse(
    localStorage.getItem("favoriteSearches") || "[]"
  );
}

function toggleFavorite(item){

  let fav = getFavorites();

  const exists =
    fav.some(x => x.url === item.url);

  if(exists){
    fav = fav.filter(
      x => x.url !== item.url
    );
  }else{
    fav.unshift(item);
  }

  localStorage.setItem(
    "favoriteSearches",
    JSON.stringify(fav)
  );
}

function isFavorite(url){

  return getFavorites()
    .some(x => x.url === url);
}

/* =========================================================
   HIGHLIGHT
========================================================= */

function highlightText(text, query){

  if(!query) return text;

  const lower =
    normalizeText(text);

  const q =
    normalizeText(query);

  const index =
    lower.indexOf(q);

  if(index === -1) return text;

  return `
    ${text.slice(0,index)}
    <mark>${text.slice(index,index+query.length)}</mark>
    ${text.slice(index+query.length)}
  `;
}

/* =========================================================
   ITEM TEMPLATE
========================================================= */

function itemTemplate(item, query = "") {

  return `
  <a class="search-item"
     href="${item.url}">

    <!-- Column 1 : Thumbnail -->
    <div class="search-thumb">
      <img
        src="${item.thumb}"
        alt="${item.title}">
    </div>

    <!-- Column 2 : Content -->
    <div class="search-meta">

      <div class="search-title">
        ${highlightText(item.title, query)}
      </div>

      <div class="search-desc">
        ${item.desc}
      </div>

    </div>

    <!-- Column 3 : Favorite -->
    <button
      class="fav-btn ${isFavorite(item.url) ? 'is-fav' : ''}"
      type="button"
      aria-label="Favorite">

      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.8L14.6 9.1L20.4 9.9L16.2 14L17.2 19.8L12 17L6.8 19.8L7.8 14L3.6 9.9L9.4 9.1L12 3.8Z"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"/>
      </svg>

    </button>

  </a>
  `;
}

/* =========================================================
   RENDER SEARCH RESULTS
========================================================= */

function renderResults(items, query=""){

  activeIndex = -1;

  if(!items.length){

    searchResults.innerHTML = `
      <div class="search-item">
        <div class="search-meta">
          <div class="search-title">
            No results found
          </div>
          <div class="search-desc">
            Try another keyword
          </div>
        </div>
      </div>
    `;

    return;
  }

  searchResults.innerHTML =
    items.map(item =>
      itemTemplate(item,query)
    ).join("");

  bindEvents();
}

/* =========================================================
   RENDER RECENT / FAVORITES
========================================================= */

function renderRecent(){

  const recents = getRecent();
  const favorites = getFavorites();

  let html = "";

  if(favorites.length){

    html += `
      <div class="search-group">
        <div class="search-group-head">
          <div class="search-group-title">
            Favorites
          </div>
        </div>

        ${favorites.map(item =>
          itemTemplate(item)
        ).join("")}

      </div>
    `;
  }

  html += `
    <div class="search-group">

      <div class="search-group-head">

        <div class="search-group-title">
          Recent
        </div>

        <button
          class="search-clear"
          id="clearHistoryBtn">

          Clear

        </button>

      </div>
  `;

  if(recents.length){

    html += recents.map(item =>
      itemTemplate(item)
    ).join("");

  }else{

    html += `
      <div class="search-item">
        <div class="search-meta">
          <div class="search-title">
            No recent search
          </div>
        </div>
      </div>
    `;
  }

  html += `</div>`;

  searchResults.innerHTML = html;

  bindEvents();
}

/* =========================================================
   EVENTS
========================================================= */

function bindEvents(){

  /* click item save recent */
  document
  .querySelectorAll(".search-item")
  .forEach(el => {

    el.addEventListener("click", () => {

      const href =
        el.getAttribute("href");

      const item =
        searchData.find(
          x => x.url === href
        );

      if(item){
        saveRecent(item);
      }

    });

  });

  /* favorite */
  document
  .querySelectorAll(".fav-btn")
  .forEach(btn => {

    btn.onclick = e => {

      e.preventDefault();
      e.stopPropagation();

      const card =
        btn.closest(".search-item");

      const url =
        card.getAttribute("href");

      const item =
        searchData.find(
          x => x.url === url
        );

      if(item){

        toggleFavorite(item);

        if(searchInput.value.trim()){
          triggerSearch();
        }else{
          renderRecent();
        }

      }

      e.preventDefault();
      e.stopPropagation();

    };

  });

  /* clear */
  const clear =
    document.getElementById(
      "clearHistoryBtn"
    );

  if(clear){
    clear.onclick = clearRecent;
  }
}

/* =========================================================
   SEARCH
========================================================= */

function triggerSearch(){

  const q =
    searchInput.value.trim();

  if(!q){
    renderRecent();
    return;
  }

  const filtered =
    searchData.filter(item =>
      normalizeText(item.title)
      .includes(
        normalizeText(q)
      )
    );

  renderResults(filtered,q);
}

/* =========================================================
   OPEN / CLOSE
========================================================= */

function openSearch(){

  searchOverlay.classList.add("show");

  searchInput.value = "";

  renderRecent();

  setTimeout(() => {
    searchInput.focus();
  },80);
}

function closeSearch(){

  searchOverlay.classList.remove("show");

  searchInput.value = "";

  activeIndex = -1;
}

/* =========================================================
   INPUT
========================================================= */

searchInput.addEventListener(
  "input",
  triggerSearch
);

/* =========================================================
   BUTTON
========================================================= */

openSearchBtn.addEventListener(
  "click",
  openSearch
);

/* =========================================================
   OVERLAY CLOSE
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
   SHORTCUTS
========================================================= */

window.addEventListener(
  "keydown",
  e => {

    if(
      (e.ctrlKey || e.metaKey)
      &&
      e.key.toLowerCase() === "k"
    ){
      e.preventDefault();
      openSearch();
    }

    if(e.key === "Escape"){
      closeSearch();
    }

  }
);

/* =========================
   MOBILE MENU
========================= */

const mobileToggle =
  document.getElementById("mobileToggle");

const nav =
  document.querySelector(".nav");

if(mobileToggle && nav){

  mobileToggle.addEventListener("click", ()=>{

    nav.classList.toggle("open");

    mobileToggle.classList.toggle("active");

  });

}