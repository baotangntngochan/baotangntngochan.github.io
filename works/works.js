/* =========================
   COVER MOTION
========================= */

const cover =
  document.querySelector(".work-cover");

const coverImage =
  document.querySelector(".cover-image");


if(cover && coverImage){

  let frame = null;

  cover.addEventListener("mousemove", e => {

    if(frame) cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {

      const rect =
        cover.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) /
        rect.width - 0.5;

      const y =
        (e.clientY - rect.top) /
        rect.height - 0.5;

      coverImage.style.transform = `
        perspective(1800px)
        rotateY(${x * 10}deg)
        rotateX(${y * -8}deg)
        translateY(-8px)
      `;

    });

  });


  cover.addEventListener("mouseleave", () => {

    if(frame) cancelAnimationFrame(frame);

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

  const collapsedHeight = 220;

  let expanded = false;


  /* =========================
     INITIAL STATE
  ========================= */

  quote.style.height =
    collapsedHeight + "px";

  quote.classList.add("collapsed");


  /* =========================
     CLICK
  ========================= */

  btn.addEventListener("click", () => {

    expanded = !expanded;


    /* =========================
       EXPAND
    ========================= */

    if(expanded){

      const fullHeight =
        quote.scrollHeight;

      quote.style.height =
        fullHeight + "px";

      quote.classList.remove("collapsed");
      quote.classList.add("expanded");

      btn.textContent =
        "Thu gọn";

    }


    /* =========================
       COLLAPSE
    ========================= */

    else{

      quote.style.height =
        collapsedHeight + "px";

      quote.classList.remove("expanded");
      quote.classList.add("collapsed");

      btn.textContent =
        "Xem thêm";

    }

  });

}


/* =========================
   GLASS CARD DEPTH
========================= */

const cards =
  document.querySelectorAll(".glass-card");


cards.forEach(card => {

  let frame = null;

  card.addEventListener("mousemove", e => {

    if(frame) cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {

      const rect =
        card.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) /
        rect.width - 0.5;

      const y =
        (e.clientY - rect.top) /
        rect.height - 0.5;

      card.style.transform = `
        perspective(1400px)
        rotateY(${x * 3}deg)
        rotateX(${y * -3}deg)
        translateY(-6px)
      `;

    });

  });


  card.addEventListener("mouseleave", () => {

    if(frame) cancelAnimationFrame(frame);

    card.style.transform = `
      perspective(1400px)
      rotateY(0deg)
      rotateX(0deg)
      translateY(0px)
    `;

  });

});