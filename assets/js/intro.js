/* =========================================================
   GTB — Grande Theft Brodis
   intro.js — slideshow de imagens da tela de intro
   ========================================================= */

const GTBIntro = (() => {
  let slides = [];
  let current = 0;
  let timer = null;

  function start() {
    slides = document.querySelectorAll('.intro-slide');
    if (slides.length <= 1) return;

    timer = setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 2600);
  }

  function stop() {
    if (timer) clearInterval(timer);
  }

  return { start, stop };
})();