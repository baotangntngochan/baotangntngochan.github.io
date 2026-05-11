/* =========================
   COVER MOTION
========================= */

const cover = document.querySelector(".work-cover");
const coverImage = document.querySelector(".cover-image");

if(cover && coverImage){

  cover.addEventListener("mousemove", e => {

    const rect = cover.getBoundingClientRect();

    const x =
      (e.clientX - rect.left) / rect.width - 0.5;

    const y =
      (e.clientY - rect.top) / rect.height - 0.5;

    coverImage.style.transform = `
      perspective(1800px)
      rotateY(${x * 10}deg)
      rotateX(${y * -8}deg)
      translateY(-8px)
    `;

  });

  cover.addEventListener("mouseleave", () => {

    coverImage.style.transform = `
      perspective(1800px)
      rotateX(2deg)
      rotateY(0deg)
      translateY(0px)
    `;

  });

}


/* =========================
   QUOTE EXPAND / COLLAPSE
========================= */

const btn =
  document.getElementById("toggleBtn");

const quote =
  document.getElementById("quoteText");


if(btn && quote){

  /* =========================
     CONFIG
  ========================= */

  const collapsedHeight = 220;

  let expanded = false;


  /* =========================
     INITIAL STATE
  ========================= */

  quote.style.height =
    collapsedHeight + "px";


  /* =========================
     BUTTON CLICK
  ========================= */

  btn.addEventListener("click", () => {

    expanded = !expanded;


    /* =========================
       EXPAND
    ========================= */

    if(expanded){

      /*
        dùng scrollHeight thật
        để tránh grid + sticky bị hold
      */

      const fullHeight =
        quote.scrollHeight;

      quote.style.height =
        fullHeight + "px";

      btn.textContent =
        "Thu gọn";

    }


    /* =========================
       COLLAPSE
    ========================= */

    else{

      quote.style.height =
        collapsedHeight + "px";

      btn.textContent =
        "Xem thêm";

    }

  });

}

/* =========================
   GLASS HOVER DEPTH
========================= */

const cards = document.querySelectorAll(".glass-card");

cards.forEach(card => {

  card.addEventListener("mousemove", e => {

    const rect = card.getBoundingClientRect();

    const x =
      (e.clientX - rect.left) / rect.width - 0.5;

    const y =
      (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(1400px)
      rotateY(${x * 3}deg)
      rotateX(${y * -3}deg)
      translateY(-6px)
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.transform = `
      perspective(1400px)
      rotateY(0deg)
      rotateX(0deg)
      translateY(0px)
    `;

  });

});