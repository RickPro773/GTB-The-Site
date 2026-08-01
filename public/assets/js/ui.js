/* =========================================================
   GTB — Grande Theft Brodis
   ui.js — ponto de entrada: inicializa os módulos e controla
   a transição de saída da tela de intro
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const skipBtn = document.getElementById('skipBtn');

  GTBIntro.start();
  GTBAudio.init();

  function endIntro() {
    if (intro.classList.contains('hidden')) return;
    intro.classList.add('hidden');
    GTBIntro.stop();
    GTBAudio.switchToMenuTrack();
  }

  skipBtn.addEventListener('click', endIntro);
  GTBAudio.onIntroTrackEnded(endIntro);

  // termina a intro automaticamente quando a barra de load acaba (~5.6s)
  setTimeout(endIntro, 6200);
});