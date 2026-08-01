/* =========================================================
   GTB — Grande Theft Brodis
   audio.js — controla trilha da intro, trilha do menu,
   botão de som e o toast "tocando agora"
   ========================================================= */

const GTBAudio = (() => {
  let introMusic, menuMusic, soundBtn, nowPlaying, nowPlayingText;
  let soundOn = true;
  let introEnded = false;
  let toastTimeout = null;

  function init() {
    introMusic     = document.getElementById('introMusic');
    menuMusic      = document.getElementById('menuMusic');
    soundBtn       = document.getElementById('soundBtn');
    nowPlaying     = document.getElementById('nowPlaying');
    nowPlayingText = document.getElementById('nowPlayingText');

    soundBtn.addEventListener('click', toggleSound);
    playIntroTrack();
  }

  function showNowPlaying(label) {
    nowPlayingText.innerHTML = 'TOCANDO AGORA &middot; <b class="text-hood-green font-semibold">' + label + '</b>';
    nowPlaying.classList.remove('fade-out');
    nowPlaying.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      nowPlaying.classList.add('fade-out');
      setTimeout(() => nowPlaying.classList.remove('show'), 500);
    }, 4500);
  }

  function playIntroTrack() {
    introMusic.volume = 0.7;
    introMusic.play().catch(() => {
      soundOn = false;
      soundBtn.textContent = '🔇 Toque para Ativar Som';
    });
  }

  function switchToMenuTrack() {
    introEnded = true;
    introMusic.pause();
    introMusic.currentTime = 0;
    if (!soundOn) return;
    menuMusic.volume = 0.5;
    menuMusic.play().catch(() => {});
    showNowPlaying('Menu Theme');
  }

  function toggleSound() {
    if (soundOn) {
      introMusic.pause();
      menuMusic.pause();
      soundOn = false;
      soundBtn.textContent = '🔇 Som Desligado';
    } else {
      soundOn = true;
      soundBtn.textContent = '🔊 Som Ligado';
      if (introEnded) {
        menuMusic.play().catch(() => {});
        showNowPlaying('Menu Theme');
      } else {
        introMusic.play().catch(() => {});
      }
    }
  }

  function onIntroTrackEnded(callback) {
    introMusic.addEventListener('ended', callback);
  }

  return { init, switchToMenuTrack, onIntroTrackEnded };
})();