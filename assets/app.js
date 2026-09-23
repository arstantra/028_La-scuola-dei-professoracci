/* ============================================================
   LA SCUOLA DEI PROFESSORACCI — app installabile e monitor di classe
   Script classico (no module): funziona anche da file://
   - registra il service worker (solo su https / localhost)
   - pulsante "Installa l'app" (#installa) quando Chrome lo permette
   - pulsante schermo intero (#fsbtn)
   - .wrap[data-adatta="selettori"]: ingrandisce la pagina finché
     gli elementi indicati stanno tutti nello schermo (monitor grandi);
     con data-largo, su schermi 16:9 passa al palco largo (html.largo)
   ============================================================ */
(function () {
'use strict';

/* base del sito: la cartella che contiene assets/ */
var base = (document.currentScript && document.currentScript.src || '').replace(/assets\/app\.js.*$/, '');

/* ---------- service worker ---------- */
if ('serviceWorker' in navigator && /^https:|^http:\/\/localhost/.test(location.href) && base) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () {});
  });
}

/* ---------- app installata? ---------- */
function standalone() {
  return (window.matchMedia && (matchMedia('(display-mode: standalone)').matches ||
    matchMedia('(display-mode: fullscreen)').matches)) || navigator.standalone === true;
}
document.documentElement.classList.toggle('app', standalone());

/* ---------- installa ---------- */
var richiesta = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault(); richiesta = e;
  var b = document.getElementById('installa'); if (b) b.hidden = false;
});
window.addEventListener('appinstalled', function () {
  var b = document.getElementById('installa'); if (b) b.hidden = true;
  richiesta = null;
});
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('#installa');
  if (!b || !richiesta) return;
  richiesta.prompt();
  richiesta.userChoice.then(function () { richiesta = null; b.hidden = true; });
});

/* ---------- schermo intero ---------- */
function aggiornaFs() { document.body.classList.toggle('standalone-fs', !!document.fullscreenElement); }
document.addEventListener('fullscreenchange', function () { aggiornaFs(); adattaSchermo(); });
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('#fsbtn');
  if (!b) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
});

/* ---------- adatta al monitor ---------- */
/* .wrap[data-adatta]: ingrandisce (o riduce fino a data-min) finché gli
   elementi indicati stanno nello schermo; data-larghezza = larghezza di progetto.
   [data-suolo]: dove comincia il pavimento → variabile CSS --suolo */
var MAX = 2.4;
function largo(w) {
  return w.hasAttribute('data-largo') && window.innerWidth >= 1100 && window.innerWidth / window.innerHeight >= 1.45;
}
function suolo() {
  var s = document.querySelector('[data-suolo]');
  if (!s || s.offsetParent === null) return;
  var y = s.getBoundingClientRect().top + window.scrollY - 8;
  document.documentElement.style.setProperty('--suolo', Math.round(y) + 'px');
}
function adattaSchermo() {
  var w = document.querySelector('.wrap[data-adatta]');
  if (!w) { suolo(); return; }
  var L = largo(w);
  document.documentElement.classList.toggle('largo', L);
  var LARGHEZZA = +w.dataset.larghezza || (L ? 1300 : 1160);
  var MIN = w.dataset.min ? +w.dataset.min : (L ? 0.8 : 1);
  w.style.zoom = 1;
  var fondo = 0;
  document.querySelectorAll(w.dataset.adatta).forEach(function (x) {
    if (x.offsetParent === null) return;              // nascosto
    fondo = Math.max(fondo, x.getBoundingClientRect().bottom + window.scrollY);
  });
  if (fondo) {
    var z = Math.min(window.innerWidth / LARGHEZZA, window.innerHeight / (fondo + 28));
    z = Math.max(MIN, Math.min(MAX, z));
    w.style.zoom = z.toFixed(3);
    document.documentElement.style.setProperty('--zoom', z.toFixed(3));
  }
  suolo();
}
var rafId = 0;
function pianifica() { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(adattaSchermo); }
window.addEventListener('resize', pianifica);
window.addEventListener('load', pianifica);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(pianifica);
/* la nuvoletta che cresce può spostare il pavimento: riallinea solo la riga del suolo */
if (window.ResizeObserver) {
  window.addEventListener('DOMContentLoaded', function () {
    var sc = document.querySelector('.scene');
    if (sc) new ResizeObserver(function () { suolo(); }).observe(sc);
  });
}
window.adattaSchermo = pianifica;
})();
